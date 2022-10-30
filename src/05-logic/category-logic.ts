import { CategoryModel, ICategoryModel } from "../03-models/category-model";
import ErrorModel from "../03-models/error-model";

async function getAllCategories(): Promise<ICategoryModel[]>{
    const categories = await CategoryModel.find().exec()
    return categories
}

export default {
    getAllCategories
}