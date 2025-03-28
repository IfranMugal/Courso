import mongoose from "mongoose"


const purchaseSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    courseId : {
        type : mongoose.Types.ObjectId,
        ref : "Course"
    }
    
})

const Purchase = mongoose.model("Purchase",purchaseSchema);
export {Purchase}