import {authorize,db,deny} from "../_auth.js";
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 try{
 const user=await authorize(req,["system_admin","hr_admin","payroll_staff"]);
 if(!user)return deny(res);
 const sql=db();
 const periods=await sql`SELECT id,period_label,period_start,period_end,pay_date,status FROM payroll_periods ORDER BY period_start DESC LIMIT 100`;
 return res.status(200).json({periods});
 }catch{return res.status(503).json({error:"Payroll database unavailable"});}
}
