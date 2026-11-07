import {authorize,db,deny} from "../_auth.js";
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(!["GET","POST"].includes(req.method))return res.status(405).json({error:"Method not allowed"});
 try{
 const user=await authorize(req,["system_admin","hr_admin","payroll_staff"]);
 if(!user)return deny(res);
 const sql=db();
 if(req.method==="GET"){
 const periods=await sql`SELECT id,period_label,period_start,period_end,pay_date,status FROM payroll_periods ORDER BY period_start DESC LIMIT 100`;
 return res.status(200).json({periods});
 }
 if(!["system_admin","payroll_staff"].includes(user.role))return res.status(403).json({error:"Insufficient permissions"});
 const {label,start,end,payDate}=req.body||{};
 if(typeof label!=="string"||label.trim().length<3||label.length>120||!/^\d{4}-\d{2}-\d{2}$/.test(start||"")||!/^\d{4}-\d{2}-\d{2}$/.test(end||"")||start>end|| (payDate&&!/^\d{4}-\d{2}-\d{2}$/.test(payDate)))return res.status(400).json({error:"Invalid payroll period"});
 const rows=await sql`INSERT INTO payroll_periods(period_label,period_start,period_end,pay_date) VALUES (${label.trim()},${start},${end},${payDate||null}) ON CONFLICT (period_start,period_end) DO NOTHING RETURNING id,period_label,status`;
 if(!rows.length)return res.status(409).json({error:"Payroll period already exists"});
 await sql`INSERT INTO payroll_audit_log(period_id,action,actor_identifier) VALUES (${rows[0].id},'created',${user.id})`;
 return res.status(201).json({period:rows[0]});
 }catch{return res.status(503).json({error:"Payroll database unavailable or invalid input"});}
}
