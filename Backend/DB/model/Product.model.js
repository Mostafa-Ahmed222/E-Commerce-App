import { Schema, model, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "productName is required"],
      unique: [true, "productName is unique"],
      min: [2, "minimum length 2 char"],
      max: [20, "maximum length 20 char"],
      lowercase: true,
      trim: true
    },
    slug: {
      type : String,
      required: [true, "slug is required"],
      unique: [true, "slug is unique"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    startStock: {
      type: Number,
      default: 0,
      required: [true, "startStock is required"],
    },
    endStock: {
      type: Number,
      default: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
      required: [true, "price is required"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      default: 0,
      required: [true, "finalPrice is required"],
    },
    colors: [String],
    sizes: {
      type: [String],
      enum: ['sm', 'l', 'xl']
    },
    images: {
      type: [String],
      required: [true, "images is required"],
    },
    publicImageIds: {
      type: [String],
      required: [true, "publicImageIds is required"],
    },
    categoryId: {
      type: Types.ObjectId, 
      ref: 'Category',
      required: [true, "can not add product without Category"]
  },
    subCategoryId: {
      type: Types.ObjectId, 
      ref: 'SubCategory',
      required: [true, "can not add product without subCategory"]
  },
    brandId: {
      type: Types.ObjectId, 
      ref: 'Brand',
      required: [true, "can not add product without Brand"]
  },
    createdBy: { type: Types.ObjectId, ref: 'User', required: [true, "can not add product without owner"] },
    updatedBy: { type: Types.ObjectId, ref: 'User'} },
  {
    timestamps: true,
  }
);

const productModel = model("Product", productSchema);
export default productModel;
