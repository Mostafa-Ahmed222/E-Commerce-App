import { Schema, model, Types } from "mongoose";

const couponSchema = new Schema(
  {
    name: {
      required: [true, "coupon is required"],
      type: String,
      unique: [true, "couponName is unique"],
      min: [2, "minimum length 2 char"],
      max: [20, "maximum length 20 char"],
      lowercase: true,
      trim: [true]
    },
    amount: {
        type: Number,
        default: 0,
        min: [1, "minimum discount 0%"], 
        max: [100, "maximum discount 100%"],
        required : true 
      },
      expireDate : {
        type: Date,
        required: true
      },
      deletedAt: {
        type: Boolean,
        default: false
      },
      usedBy : [{type : Types.ObjectId, ref: 'User'}],
    createdBy: { type: Types.ObjectId, ref: 'User', required: [true, "can not add coupon without owner"] },
    updatedBy: { type: Types.ObjectId, ref: 'User'},
    deletedBy: { type: Types.ObjectId, ref: 'User'},
  },
  {
    timestamps: true,
  }
);

const couponModel = model("Coupon", couponSchema);
export default couponModel;
