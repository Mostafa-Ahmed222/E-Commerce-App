import { Schema, model, Types } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "categoryName is required"],
      unique: [true, "categoryName is unique"],
      min: [2, "minimum length 2 char"],
      max: [20, "maximum length 20 char"],
      lowercase: true
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: [true, "can not add category without owner"] },
  },
  {
    timestamps: true,
  }
);

const categoryModel = model("Category", categorySchema);
export default categoryModel;
