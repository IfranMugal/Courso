import { User } from "../Schema/userSchema.js";
import { z } from "zod";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { jwtKey } from "../config.js";
import { Purchase } from "../Schema/purchase.js";
import { Course } from "../Schema/courseSchema.js";

const userZod = z.object({
    firstName: z.string().min(2, "Firstname must be at least 2 characters"),
    lastName: z.string().min(2, "Lastname must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export async function userSignup(req, res) {

    const { firstName, lastName, email, password } = req.body;

    // Validate request body using Zod
    const validation = userZod.safeParse({ firstName, lastName, email, password });
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
        const isAlreadyPresent = await User.findOne({ email });
        if (isAlreadyPresent) {
            return res.status(201).json(
                 "User with this email already exists"
            );
        }

        // Create new user
        await User.create({ firstName, lastName, email, password:hashedpassword });

        return res.status(201).json({
            msg: "User created successfully"
        });

    } catch (e) {
        return res.status(500).json({
            error: e.message || "Internal Server Error"
        });
    }
}

export async function userLogin(req,res){
    const {email,password} = req.body;

    try {
        const user = await User.findOne({email : email})
        if(!user){
            return res.status(400).json({
                msg : "No user found"
            })
        }
        const ispasscorrect = await bcrypt.compare(password,user.password);
        if(!ispasscorrect){
            return res.status(400).json({
                msg : "password is incorrect"
            })
        }

        // jwt code
        const token = jwt.sign({userId : user._id},jwtKey,{expiresIn:"1d"})
        

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
            user,
            token
        })
        
        
    } catch (e) {
        return res.status(400).json({
            error : e.message
        })
    }
}

export async function userLogout(req, res) {

    try {
        // Check if JWT cookie exists
        console.log("the value of req.cookies.jwt is : ",req.cookies.jwt)
        if (!req.cookies.jwt) {
            return res.json({
                msg: "Already logged out"
            });
        }

        console.log("JWT before clearing:", req.cookies.jwt); // Log the existing JWT

        // Clear the cookie
        res.clearCookie("jwt");

        return res.json({
            message: "Logout successfull"
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}

export async function userPurchases(req,res){
    const {userId} = req;

    try {
        // Fetch all purchases for the user
        const purchases = await Purchase.find({ userId });
        console.log("purchases :",purchases )
    
        // Extract all courseIds from the purchases
        const purchasedCourseIds = purchases.map(purchase => purchase.courseId);
        console.log("purchasedCourseIds :",purchasedCourseIds )
    
        // Fetch course details in a single query
        const courseData = await Course.find({ _id: { $in: purchasedCourseIds } });
        console.log("courseData :",courseData )
    
        res.json({
            purchases: purchases,
            courseData: courseData
        });
    
    } catch (error) {
        res.status(500).json({
            msg: "Error fetching purchases and courses",
            error: error.message
        });
    }
    
}
