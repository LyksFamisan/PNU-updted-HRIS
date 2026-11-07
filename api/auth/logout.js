import {authorize,db,deny} from "../_auth.js";
import {createHash} from "node:crypto";
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 try{
 const user=await authorize(req);if(!user)return deny(res);
 const cookie=String(req.headers.cookie||"").split(";").map(s=>s.trim()).find(s=>s.startsWith("pnu_session="));
 const token=cookie?.slice(12);
 if(token){const sql=db();const hash=createHash("sha256").update(token).digest("hex");await sql`UPDATE auth_sessions SET revoked_at=now() WHERE token_hash=${hash}`;}
 res.setHeader("Set-Cookie","pnu_session=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0");
 return res.status(200).json({ok:true});
 }catch{return res.status(503).json({error:"Logout unavailable"});}
}
