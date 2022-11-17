import { Schema, model, Types } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "subCategoryName is required"],
      unique: [true, "subCategoryName is unique"],
      min: [2, "minimum length 2 char"],
      max: [20, "maximum length 20 char"],
      lowercase: true
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    categoryId: {
        type: Types.ObjectId, 
        ref: 'Category',
        required: [true, "can not add subCategory without Category"]
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: [true, "can not add subCategory without owner"] },
  },
  {
    timestamps: true,
  }
);

const subCategoryModel = model("SubCategory", subCategorySchema);
export default subCategoryModel;
