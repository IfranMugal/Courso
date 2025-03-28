import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : false
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        min : 8
    }
})

const Admin = mongoose.model('Admin',adminSchema)
export {Admin}