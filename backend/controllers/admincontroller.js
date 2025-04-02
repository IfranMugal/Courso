import { z } from "zod";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_ADMIN_SECRETKEY } from "../config.js";
import { Admin } from "../Schema/adminSchema.js";



const adminZod = z.object({
    firstName: z.string().min(2, "Firstname must be at least 2 characters"),
    lastName: z.string().min(2, "Lastname must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export async function adminSignup(req, res) {

    const { firstName, lastName, email, password } = req.body;

    // Validate request body using Zod
    const validation = adminZod.safeParse({ firstName, lastName, email, password });
    console.log(validation);

    if (!validation.success) {
        return res.status(400).json({
            msg: "Invalid details for signup",
            errors: validation.error.errors[0].message
        });
    }
    // console.log(validation.data);
    // console.log("hello");

    const hashedpassword = await bcrypt.hash(password,10);

    try {
        // Check if user already exists
        const isAlreadyPresent = await Admin.findOne({ email });
        if (isAlreadyPresent) {
            return res.status(400).json({
                msg: "Admin with this email already exists"
            });
        } 

        // Create new user
        await Admin.create({ firstName, lastName, email, password:hashedpassword });

        return res.status(201).json({
            msg: "Admin created successfully"
        });

    } catch (e) {
        return res.status(500).json({
            error: e.message || "Internal Server Error"
        });
    }
}

export async function adminLogin(req,res){
    const {email,password} = req.body;

    try {
        const admin = await Admin.findOne({email : email})
        if(!admin){
            return res.status(400).json({
                msg : "No admin found"
            })
        }
        const ispasscorrect = await bcrypt.compare(password,admin.password);
        if(!ispasscorrect){
            return res.status(400).json({
                msg : "password is incorrect"
            })
        }

        // jwt code
        const token = jwt.sign({userId : admin._id},JWT_ADMIN_SECRETKEY,{expiresIn:"1d"})
        

        const cookieOption = {
            expires : new Date(Date.now() + 24*60*60*1000), // expires in 1 day
            httpOnly : true, // can't be accessed via javascript directly
            secure : process.env.NODE_ENV === "production", // true only for https
            sameSite : "Strict" // protects from CSRF attack
        }

        // stroring token in the cookie section so that we can easily access it fron any endpoint and 
        // limit user functionality accordingly
        res.cookie("jwt",token,cookieOption)
        
        // console.log( "Login successfull",
        // admin,
        // token)
        return res.json({
            message : "Login successfull",
            admin,
            token
        })
        
        
    } catch (e) {
        return res.status(400).json({
            error : e.message
        })
    }
}

export async function adminLogout(req, res) {
    try {
        // Check if JWT cookie exists
        if (!req.cookies.jwt) {
            return res.json({
                msg: "Already logged out"
            });
        }

        console.log("JWT before clearing:", req.cookies.jwt); // Log the existing JWT

        // Clear the cookie
        res.clearCookie("jwt");

        return res.json({
            message: "Admin Logout successful"
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}


