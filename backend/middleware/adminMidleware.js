import jwt from "jsonwebtoken"
import { JWT_ADMIN_SECRETKEY } from "../config.js";

export function adminMiddleware(req,res,next){
    const authHeaders = req.headers.authorization;

    if(!authHeaders || !authHeaders.startsWith("Bearer ")){
        return res.status(400).json({
            msg : "Invalid token"
        })
    }

    const token = authHeaders.split(" ")[1]

    try {
        const decode = jwt.verify(token,JWT_ADMIN_SECRETKEY);
        if(!decode){
            return res.status(400).json({
                msg : "decoding of token failed"
            })
        }
        req.adminId = decode.userId;
        // now for all the routes that use this middleare will have access of userId by :
        // const {userId} = req;
        console.log("toke decodod and userId stored ",req.adminId);

        next();
    } catch (e) {
        res.status(400).json({
            error : e,
            msg : "error in middleware"
        })
    }

}