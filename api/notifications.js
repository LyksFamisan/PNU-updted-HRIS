import {authorize,db,deny} from "../_auth.js";
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(!["GET","PATCH"].includes(req.method))return res.status(405).json({error:"Method not allowed"});
 try{
 const user=await authorize(req);if(!user)return deny(res);
 const sql=db();
 if(req.method==="GET"){
 const notifications=await sql`SELECT id,title,body,kind,read_at,created_at FROM app_notifications WHERE recipient_user_id=${user.id} ORDER BY created_at DESC LIMIT 100`;
 return res.status(200).json({notifications,unread:notifications.filter(n=>!n.read_at).length});
 }
 const {id,all}=req.body||{};
 if(all===true){await sql`UPDATE app_notifications SET read_at=now() WHERE recipient_user_id=${user.id} AND read_at IS NULL`;}
 else if(typeof id==="string"&&/^[0-9a-f-]{36}$/.test(id)){await sql`UPDATE app_notifications SET read_at=now() WHERE id=${id} AND recipient_user_id=${user.id} AND read_at IS NULL`;}
 else return res.status(400).json({error:"Invalid notification"});
 return res.status(200).json({ok:true});
 }catch{return res.status(503).json({error:"Notification service unavailable"});}
}
