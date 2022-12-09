import { Schema, model, Types } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "can not add cart without owner"],
      unique: true
    },
    products : [{
        productId: {
            type: Types.ObjectId,
            ref : 'Product',
            required: true,
            unique: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: [1, 'minimum quantity is 1'],
        }
    }]
  },
  {
    timestamps: true,
  }
);

const cartModel = model("Cart", cartSchema);
export default cartModel;
