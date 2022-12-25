import { Schema, model, Types } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "can not add order without owner"],
    },
    products : [{
        productId: {
            type: Types.ObjectId,
            ref : 'Product',
            required: [true, "can not make order without product"],
        },
        quantity: {
            type: Number,
            default: 1,
            min: [1, 'minimum quantity is 1'],
        },
        totalPrice: {
            type: Number,
            required: true,
            min: [1, 'minimum quantity is 1'],
        },
    }],
    address: {
        type: String,
        required: [true, "can not send order without address"]
    },
    phone: {
        type: String,
        required: [true, "can not send order without phone number"]
    },
    totalPrice: {
        type: Number,
        required: true
    },
    finalPrice: {
        type: Number,
        required: true
    },
    couponId: {
        type: Types.ObjectId,
        ref: 'Coupon'
    },
    status: {
      type: String,
      enum: ['placed', 'received', 'rejected', 'preparing', 'onWay'],
      default: 'placed'
    },
    payment: {
      type: String,
      enum: ['cash', 'visa'],
      default: 'cash'
  },
  },
  {
    timestamps: true,
  }
);

const orderModel = model("Order", orderSchema);
export default orderModel;
