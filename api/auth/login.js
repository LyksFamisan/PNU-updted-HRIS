import { randomBytes,createHash,scryptSync,timingSafeEqual } from "node:crypto";
import { db } from "../_auth.js";
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 const {email,password}=req.body||{};
 if(typeof email!=="string"||typeof password!=="string"||email.length>254||password.length>1024)return res.status(400).json({error:"Invalid credentials"});
 try{
 const sql=db();
 const rows=await sql`SELECT id,email,role,password_hash FROM app_users WHERE lower(email)=lower(${email.trim()}) AND is_active=true LIMIT 1`;
 const u=rows[0];let valid=false;
 if(u&&u.password_hash.startsWith("scrypt:")){
  const parts=u.password_hash.split(":");
  if(parts.length===3&&/^[a-f0-9]{32,128}$/.test(parts[1])&&/^[a-f0-9]{128}$/.test(parts[2])){
   const actual=scryptSync(password,Buffer.from(parts[1],"hex"),64);
   valid=timingSafeEqual(actual,Buffer.from(parts[2],"hex"));
  }
 }
 if(!valid)return res.status(401).json({error:"Invalid credentials"});
 const token=randomBytes(32).toString("hex");
 const hash=createHash("sha256").update(token).digest("hex");
 await sql`INSERT INTO auth_sessions(user_id,token_hash,expires_at) VALUES (${u.id},${hash},now()+interval '8 hours')`;
 res.setHeader("Set-Cookie",`pnu_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=28800`);
 return res.status(200).json({email:u.email,role:u.role});
 }catch{return res.status(503).json({error:"Authentication unavailable"});}
}
