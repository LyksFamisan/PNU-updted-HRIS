import { createHash, randomBytes, scryptSync } from "node:crypto";
import { db } from "../_auth.js";
export default async function handler(req,res) {
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
 const {token,password}=req.body||{};
 if(typeof token!=="string"||!/^[a-f0-9]{64}$/.test(token)||typeof password!=="string"||password.length<14||password.length>128) return res.status(400).json({error:"Invalid or insufficient setup credentials"});
 try {
  const sql=db();
  const tokenHash=createHash("sha256").update(token).digest("hex");
  const result=await sql`UPDATE account_setup_tokens SET used_at=now() WHERE token_hash=${tokenHash} AND used_at IS NULL AND expires_at>now() RETURNING user_id`;
  if(result.length!==1) return res.status(400).json({error:"Setup link expired or invalid"});
  const salt=randomBytes(32).toString("hex");
  const digest=scryptSync(password,Buffer.from(salt,"hex"),64).toString("hex");
  const stored="scrypt:"+salt+":"+digest;
  await sql`UPDATE app_users SET password_hash=${stored},is_active=true WHERE id=${result[0].user_id} AND password_hash='pending:email-verification-required'`;
  return res.status(200).json({ok:true});
 }catch{return res.status(503).json({error:"Account setup unavailable"});}
}
