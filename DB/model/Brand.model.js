import { Schema, model, Types } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      required: [true, "brandName is required"],
      type: String,
      unique: [true, "brandName is unique"],
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
      required: [true, "logo is required"],
    },
    publicImageId: {
      type: String,
      required: [true, "publicImageId is required"],
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: [true, "can not add brand without owner"] },
    updatedBy: { type: Types.ObjectId, ref: 'User'},
  },
  {
    timestamps: true,
  }
);

const brandModel = model("Brand", brandSchema);
export default brandModel;
