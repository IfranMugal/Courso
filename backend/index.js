import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import cors from "cors"

import courseRoute from "./Routes/courseRoute.js"
import adminRoute from "./Routes/adminRoute.js"
import userRoute from "./Routes/userRoute.js"
import orderRoute from "./Routes/orderRoute.js"

import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();


app.use(cors({
    origin: process.env.FRONTEND,
    credentials: true, // to access cookies
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

// to use the functionality of file upload in our server
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// cloudinary configurtion code 
cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret
});

try{
   await mongoose.connect(process.env.MONGO_URL);
    console.log("db connected");
}catch(e){
    console.log(e);
}

app.use("/api/v1/course",courseRoute); 
app.use("/api/v1/user",userRoute);
app.use("/api/v1/admin",adminRoute);
app.use("/api/v1/order",orderRoute)


app.listen(process.env.PORT || 3000, () => {console.log(`running on ${process.env.PORT}`)});