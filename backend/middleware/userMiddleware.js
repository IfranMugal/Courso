import jwt from "jsonwebtoken"
import { jwtKey } from "../config.js";

export function userMiddleware(req,res,next){
    const authHeaders = req.headers.authorization;

    if(!authHeaders || !authHeaders.startsWith("Bearer ")){
        return res.status(400).json({
            msg : "Invalid token"
        })
    }

    const token = authHeaders.split(" ")[1]

    try {
        const decode = jwt.verify(token,jwtKey);
        if(!decode){
            return res.status(400).json({
                msg : "decoding of token failed"
            })
        }
        req.userId = decode.userId;
        // now for all the routes that use this middleare will have access of userId by :
        // const {userId} = req;
        console.log("toke decodod and userId stored ",req.userId);

        next();
    } catch (e) {
        res.status(400).json({
            error : e
        })
    }

}