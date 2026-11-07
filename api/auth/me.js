import {authorize,deny} from "../_auth.js";
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 try{const user=await authorize(req);if(!user)return deny(res);return res.status(200).json({email:user.email,role:user.role});}
 catch{return res.status(503).json({error:"Authentication unavailable"});}
}
