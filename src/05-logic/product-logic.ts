import ErrorModel from "../03-models/error-model";
import { IProductModel, ProductModel } from "../03-models/product-model";
import {v4 as uuid} from "uuid";
import path from 'path';
import  fs  from 'fs';

async function getAllProducts(): Promise<IProductModel[]>{
    const products = await ProductModel.find().populate("category").exec()
    return products
}

async function getProductsByCategory(categoryId: string): Promise<IProductModel[]>{
    const products = await ProductModel.find({categoryId}).populate("category").exec()
    return products
}

async function getOneProduct(_id: string): Promise<IProductModel>{
    const product = await ProductModel.findById({_id}).populate("category").exec()
    return product
}

async function addProduct(product: IProductModel): Promise<IProductModel>{
    const errors = product.validateSync();
    if (errors) throw new ErrorModel(400, errors.message);
    if(product.image){
        const extension =  product.image.name.substring(product.image.name.lastIndexOf('.'));
        product.imageName = uuid() + extension;
        await product.image.mv('./src/assets/images/' + product.imageName);
        delete product.image;
    }


    const addedProduct = await product.save()
    return addedProduct
}


async function updateProduct(product: IProductModel): Promise<IProductModel>{
    const errors = product.validateSync();
    if (errors) throw new ErrorModel(400, errors.message);
    const oldProduct = await getOneProduct(product._id);
    const imageInData = oldProduct.imageName;

    if(imageInData && product.image){
        const absolutePath = path.join(__dirname, "..", "assets", "images", imageInData);
        fs.unlinkSync(absolutePath);
    }


    if(product.image){
        const extension =  product.image.name.substring(product.image.name.lastIndexOf('.'));
        product.imageName = uuid() + extension;
        await product.image.mv('./src/assets/images/' + product.imageName);
        delete product.image;
       }
    const updatedProduct = await ProductModel.findByIdAndUpdate(product._id,product ,{returnOriginal: false}).exec()
    return updatedProduct
}

async function deleteProduct(_id: string): Promise<void>{
    const oldProduct = await getOneProduct(_id);
    const imageInData = oldProduct.imageName;
    const absolutePath = path.join(__dirname, "..", "assets", "images", imageInData);
    fs.unlinkSync(absolutePath);

    await ProductModel.findByIdAndDelete(_id).exec()
}

export default {
    getAllProducts,
    getProductsByCategory,
    getOneProduct,
    addProduct,
    updateProduct,
    deleteProduct
};

