import { CartDetailsModel } from "../03-models/cart-details-model";
import ErrorModel from "../03-models/error-model";
import { IOrderModel, OrderModel } from "../03-models/order-model";
import cartLogic from "./cart-logic";
import { existsSync } from "fs";
import fs from "fs/promises";


async function getAllOrders(): Promise<IOrderModel[]>{
    const orders = await OrderModel.find().populate(["carts", "users"]).exec()
    return orders
}

async function createOrder(order: IOrderModel): Promise<IOrderModel>{
    const shippingDate =  await countOrdersDate(order.shippingDate)
    if(shippingDate >= 3){
        throw new ErrorModel(400, "There are too many shippings to this date.")
    }
    await cartLogic.closeCart(order.cartId.toString())
    const addedOrder = await order.save()
    await createReceipt(order);
    return addedOrder
}

async function countOrdersDate(shippingDate: Date):Promise<number>{
    const orderDate = await OrderModel.find({shippingDate}).count().exec()
    return orderDate
}

async function createReceipt(order: IOrderModel):Promise<void>{
    const cartId = order.cartId;
    const cartDetails = await CartDetailsModel.find({ cartId }).populate("products").exec();
    let receiptText:string = '';
    cartDetails.forEach(c => {receiptText = receiptText + `${c.name}....${c.amount}x....${c.totalPrice}$\n`});
    const totalPrice = cartDetails.reduce((initial, c) => {
        return initial + c.totalPrice
    }, 0);
    receiptText = receiptText + `\n\nTotal price:${totalPrice}$`;
    if (!existsSync("./src/assets/receipts")){
        await fs.mkdir("./src/assets/receipts")
    };
    const path = `./src/assets/receipts/${cartId}.txt`;
    await fs.writeFile(path, receiptText);
}

async function lastOrder(userId:string):Promise<IOrderModel> {
    const order = await OrderModel.findOne({userId}).sort({orderDate:-1}).exec();
    return order;
}

export default{
    getAllOrders,
    createOrder,
    countOrdersDate,
    lastOrder
}