import { findById, updateOne } from "../../../../DB/DBMethods.js";
import productModel from "../../../../DB/model/Product.model.js";
import userModel from "../../../../DB/model/User.model.js";
import asyncHandler from "../../../services/handelError.js";

export const add = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await findById({ model: productModel, filter: productId });
  if (!product) {
    return next(new Error("in-valid product Id", { cause: 404 }));
  }
  await updateOne({
    model: userModel,
    filter: { _id: req.authUser._id },
    data: { $addToSet: { wishlist: productId } },
  });
  return res.status(200).json({message : 'Done'})
});
export const remove = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await findById({ model: productModel, filter: productId });
  if (!product) {
    return next(new Error("in-valid product Id", { cause: 404 }));
  }
  await updateOne({
    model: userModel,
    filter: { _id: req.authUser._id },
    data: { $pull: { wishlist: productId } },
  });
  return res.status(200).json({message : 'Done'})
});
