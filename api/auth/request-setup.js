import {randomBytes,createHash} from "node:crypto";
import {db} from "../_auth.js";
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 const email=typeof req.body?.email==="string"?req.body.email.trim().toLowerCase():"";
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)||email.length>254)return res.status(400).json({error:"Valid email required"});
 const ok={message:"If this account is eligible, a setup link will be emailed."};
 try{
 if(!process.env.RESEND_API_KEY||!process.env.SETUP_EMAIL_FROM)return res.status(503).json({error:"Email verification provider not configured"});
 const sql=db();
 const rows=await sql`SELECT id FROM app_users WHERE lower(email)=${email} AND password_hash='pending:email-verification-required' LIMIT 1`;
 if(!rows.length)return res.status(200).json(ok);
 const token=randomBytes(32).toString("hex"),hash=createHash("sha256").update(token).digest("hex");
 const id=rows[0].id;
 await sql`UPDATE account_setup_tokens SET used_at=now() WHERE user_id=${id} AND used_at IS NULL`;
 await sql`INSERT INTO account_setup_tokens(user_id,token_hash,expires_at) VALUES (${id},${hash},now()+interval '30 minutes')`;
 const origin=process.env.APP_PUBLIC_URL||"https://pnu-updted-hris-8ofw.vercel.app";
 const url=origin+"/secure-payroll?setup="+token;
 const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+process.env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.SETUP_EMAIL_FROM,to:[email],subject:"PNU HRIS administrator account setup",text:"Your one-time account setup link (expires in 30 minutes): "+url})});
 if(!response.ok){await sql`UPDATE account_setup_tokens SET used_at=now() WHERE token_hash=${hash}`;return res.status(503).json({error:"Verification email could not be sent"});}
 return res.status(200).json(ok);
 }catch{return res.status(503).json({error:"Setup request temporarily unavailable"});}
}
