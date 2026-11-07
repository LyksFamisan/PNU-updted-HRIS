import { neon } from "@neondatabase/serverless";
import { createHash, timingSafeEqual } from "node:crypto";
export function db(){if(!process.env.DATABASE_URL) throw new Error("Database unavailable");return neon(process.env.DATABASE_URL);}
export async function authorize(req,allowedRoles=[]){
 const cookie=String(req.headers.cookie||"").split(";").map(s=>s.trim()).find(s=>s.startsWith("pnu_session="));
 const token=cookie?.slice("pnu_session=".length);
 if(!token||!/^[a-f0-9]{64}$/.test(token)) return null;
 const hash=createHash("sha256").update(token).digest("hex");
 const sql=db();
 const rows=await sql`SELECT u.id,u.email,u.role FROM auth_sessions s JOIN app_users u ON u.id=s.user_id WHERE s.token_hash=${hash} AND s.revoked_at IS NULL AND s.expires_at>now() AND u.is_active=true LIMIT 1`;
 const user=rows[0];
 return user&&(!allowedRoles.length||allowedRoles.includes(user.role))?user:null;
}
export function deny(res){res.setHeader("Cache-Control","no-store");return res.status(401).json({error:"Authenticated authorized staff access required"});}
