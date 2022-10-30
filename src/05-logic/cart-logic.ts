import {CartDetailsModel, ICartDetailsModel,} from "../03-models/cart-details-model";
import { CartModel, ICartModel } from "../03-models/cart-model";
import ErrorModel from "../03-models/error-model";
import { IProductModel, ProductModel } from "../03-models/product-model";

// Get cart by user id:
async function getCart(userId: string, isClosed: boolean): Promise<ICartModel> {
  const cart = await CartModel.findOne({ userId , isClosed }).populate('users').exec();
  return cart;
}

// Create or get cart:
async function createCartOrGet(userId: string): Promise<ICartModel> {
  const existingCart = await getCart(userId , false);
  if (existingCart) return existingCart;
  let date = new Date();
  const newCart = new CartModel({ userId, date });
  const createdCart = await newCart.save();
  return createdCart;
}

// Get cart products by cart-id:
async function getCartDetails(cartId: string): Promise<ICartDetailsModel[]> {
  const cartDetails = await CartDetailsModel.find({ cartId }).populate("products").exec();
  if (!cartDetails) throw new ErrorModel(404, "Cart-items not found");
  return cartDetails;
}

// Get cart products by product_id:
async function getCartDetailsByProduct(productId: any, cartId: any): Promise<ICartDetailsModel[]> {
  const cartDetails = await CartDetailsModel.find({ productId: productId, cartId: cartId }).exec();
  return cartDetails;
}

// add product to cart
async function addProductToCart(cartProduct: ICartDetailsModel): Promise<ICartDetailsModel> {
  const currProductCart = await getCartDetailsByProduct(cartProduct.productId, cartProduct.cartId);
  if(!currProductCart[0]?._id){
    const addedProduct = cartProduct.save();
    return addedProduct;
  }
  else{
    cartProduct._id = currProductCart[0]._id
    const addedProduct = await updatedCartProduct(cartProduct);
    return addedProduct;
  }
  
  
}

async function updatedCartProduct(cartProduct: ICartDetailsModel): Promise<ICartDetailsModel> {
  const updatedCartProduct = await CartDetailsModel.findByIdAndUpdate( cartProduct._id,cartProduct,{ returnOriginal: false }).exec();
  if (!updatedCartProduct) throw new ErrorModel(404, "Cart Product not found");
  return updatedCartProduct;
}

// delete product from cart
async function deleteProductFromCart(cartId :string, productId: string): Promise<void> {
  let deletedCartItem = await CartDetailsModel.find({ productId: productId, cartId: cartId }).exec();
  deletedCartItem = await CartDetailsModel.findByIdAndDelete(deletedCartItem[0]._id)
  if (!deletedCartItem) throw new ErrorModel(404, "Cart item not found");
}

// delete all products from cart
async function deleteAllCartProducts(cartId: string): Promise<void> {
  const deletedCartProducts = await CartDetailsModel.deleteMany({ cartId: cartId}).exec();
  if (!deletedCartProducts)
    throw new ErrorModel(404, "Cart Products not found");
}

async function calcTotalPrice(_Id: string, amount: number): Promise<number> {
    const product = await ProductModel.findById(_Id).exec();
    const price = product.price;
    const totalPrice = price * amount
    return totalPrice;
  }

  async function closeCart(_id: string):Promise<ICartModel> {
      await CartModel.updateOne({ _id }, { $set: { isClosed: true } }).exec()
      const cart = await CartModel.findOne({ _id}).exec()
      return cart;
  }

  async function getCartPerUser(UserId: any): Promise<ICartModel[]> {
    const cartsPerUser = await CartModel.find({userId : UserId}).exec();
    return cartsPerUser;
  }


export default {
  getCart,
  createCartOrGet,
  getCartDetails,
  deleteProductFromCart,
  addProductToCart,
  updatedCartProduct,
  deleteAllCartProducts,
  calcTotalPrice,
  closeCart,
  getCartPerUser
};
