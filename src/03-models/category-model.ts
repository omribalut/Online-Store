import { Document, model, Schema } from "mongoose";

export interface ICategoryModel extends Document {
    categoryName : string;
}

const CategorySchema = new Schema<ICategoryModel>({
    categoryName: {
        type: String,
        required: [true, "Missing category"],
        trim: true,
        unique: true
    }
}, { 
    versionKey: false
});

export const CategoryModel = model<ICategoryModel>("CategoryModel", CategorySchema, "category");
