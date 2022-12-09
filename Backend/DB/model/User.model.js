import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "maximum length 20 char"]
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email must be unique value"],
    },
    password: { type: String, required: [true, "password is required"] },
    phone: String,
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    active: {
      typeof: Boolean,
      default: false,
    },
    confirmEmail: { type: Boolean, default: false },
    Blocked: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    image: String,
    publicImageId : String,
    DOB: String,
    code : String,
    wishlist : [{type : Types.ObjectId, ref : 'Product'}]
  },
  {
    timestamps: true,
  }
);

const userModel = model("User", userSchema);
export default userModel;
