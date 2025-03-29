import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    email : String,
    userId : String,
    courseId : String,
    paymentid : String,
    amount : Number,
    status : String
})
const Order = mongoose.model('Order',orderSchema)
export {Order}