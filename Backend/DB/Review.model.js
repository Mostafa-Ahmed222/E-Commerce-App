import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "can not add review without owner"],
    },
    message: {
      type: String,
      required: [true, "text is required"],
    },
    productId: {
      type: Types.ObjectId,
      ref : 'Product',
      required: [true, "can not make review without product id"]
  },
    rating: {
        type: Number,
        min: [1,'minimum rate is 1'],
        max: [5,'maximum rate is 5'],
        required: [true, "can not add review without rating"],
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel = model("Review", reviewSchema);
export default reviewModel;
