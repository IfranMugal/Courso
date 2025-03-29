import { Order } from "../Schema/orderSchema.js";
import { Purchase } from "../Schema/purchase.js";

export async function orderData(req,res){
    const order = req.body;
    try {
        const orderinfo = await Order.create(order)
        console.log(orderinfo)
        const userId = order.userId;
        const courseId = order.courseId;
        if(orderinfo){
            await Purchase.create({userId,courseId});
        }
        res.status(201).json({message : "order created successfully : ",orderinfo})
    } catch (error) {
        console.log("error in order : ",error)
        res.status(400).json(error)
    }

}