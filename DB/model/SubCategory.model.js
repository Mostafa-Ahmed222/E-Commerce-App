import { Schema, model, Types } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "categoryName is required"],
      unique: [true, "categoryName is unique"],
      min: [2, "minimum length 2 char"],
      max: [20, "maximum length 20 char"],
      lowercase: true,
      trim: [true]
    },
    slug: {
      type : String,
      required: [true, "slug is required"],
      unique: [true, "slug is unique"],
      lowercase: true,
      trim: true
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    publicImageId: {
      type: String,
      required: [true, "publicImageId is required"],
    },
    categoryId: {
        type: Types.ObjectId, 
        ref: 'Category',
        required: [true, "can not add subCategory without Category"]
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: [true, "can not add subCategory without owner"] },
    updatedBy: { type: Types.ObjectId, ref: 'User'},
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }
);
subCategorySchema.virtual("products", {
  localField: "_id",
  ref: "Product",
  foreignField: "subCategoryId"
})
const subCategoryModel = model("SubCategory", subCategorySchema);
export default subCategoryModel;
