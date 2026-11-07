import { neon } from "@neondatabase/serverless";

// Public health endpoint. Deliberately exposes no employee, payroll or account records.
// All future payroll mutations require verified server-side authentication and authorization.
export default async function handler(req,res) {
  res.setHeader("Cache-Control","no-store");
  if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
  if(!process.env.DATABASE_URL) return res.status(503).json({connected:false,message:"Database not configured"});
  try {
    const sql=neon(process.env.DATABASE_URL);
    const rows=await sql`SELECT to_regclass('public.employees') IS NOT NULL AS employees, to_regclass('public.payroll_periods') IS NOT NULL AS payroll_periods, to_regclass('public.payroll_entries') IS NOT NULL AS payroll_entries, to_regclass('public.payroll_audit_log') IS NOT NULL AS audit_log`;
    const tables=rows[0]||{};
    return res.status(200).json({connected:true,schemaReady:Object.values(tables).every(Boolean),tables,mode:"prototype",employeeData:"Not imported",payrollWritesEnabled:false,checkedAt:new Date().toISOString()});
  } catch {
    return res.status(503).json({connected:false,message:"Database connection failed"});
  }
}
