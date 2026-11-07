import {authorize,db,deny} from "../_auth.js";
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(!["GET","POST"].includes(req.method))return res.status(405).json({error:"Method not allowed"});
 try{
 const user=await authorize(req,["system_admin","hr_admin","payroll_staff"]);
 if(!user)return deny(res);
 const sql=db();
 if(req.method==="GET"){
 const rows=await sql`SELECT id,employee_number,full_name,department,position_title,employment_type,salary_grade,salary_step,source_url,verified_at FROM employees ORDER BY created_at DESC LIMIT 200`;
 return res.status(200).json({employees:rows});
 }
 if(!["system_admin","hr_admin"].includes(user.role))return res.status(403).json({error:"HR administration permission required"});
 const {employeeNumber,fullName,department,positionTitle,employmentType,salaryGrade,salaryStep,sourceUrl}=req.body||{};
 if(typeof employeeNumber!=="string"||!/^[-A-Za-z0-9]{2,40}$/.test(employeeNumber)||typeof fullName!=="string"||fullName.trim().length<3||fullName.length>180||[department,positionTitle,employmentType,sourceUrl].some(v=>v!==undefined&&(typeof v!=="string"||v.length>250))|| (salaryGrade!==undefined&&salaryGrade!==null&&(!Number.isInteger(salaryGrade)||salaryGrade<1||salaryGrade>40))||(salaryStep!==undefined&&salaryStep!==null&&(!Number.isInteger(salaryStep)||salaryStep<1||salaryStep>8)))return res.status(400).json({error:"Invalid employee record"});
 const rows=await sql`INSERT INTO employees(employee_number,full_name,department,position_title,employment_type,salary_grade,salary_step,source_url) VALUES (${employeeNumber},${fullName.trim()},${department||null},${positionTitle||null},${employmentType||null},${salaryGrade??null},${salaryStep??null},${sourceUrl||null}) ON CONFLICT(employee_number) DO NOTHING RETURNING id,employee_number,full_name`;
 if(!rows.length)return res.status(409).json({error:"Employee number already exists"});
 await sql`INSERT INTO payroll_audit_log(action,actor_identifier,details) VALUES ('employee_created',${user.id},${JSON.stringify({employeeId:rows[0].id})}::jsonb)`;
 return res.status(201).json({employee:rows[0]});
 }catch{return res.status(503).json({error:"Employee database unavailable"});}
}
