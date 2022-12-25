import asyncHandler from "./../../../services/handelError.js";
import {
  create,
  findByIdAndUpdate,
  findOne,
  findOneAndDelete,
  findOneAndUpdate,
  updateOne,
} from "./../../../../DB/DBMethods.js";
import reviewModel from "./../../../../DB/model/Review.model.js";
import orderModel from './../../../../DB/model/Order.model.js';

export const addReview = asyncHandler(async (req, res, next) => {
  const {productId} = req.params
  const { _id } = req.authUser;
  const { rating } = req.body;
  const review = await findOne({
    model: reviewModel,
    filter: { userId: _id, productId },
  });
  if (review) {
    return next(
      new Error(`userId ${_id} already rate this product`, { cause: 409 })
    );
  }
  const order = await findOne({
    model: orderModel,
    filter: {
      userId: _id,
      "products.productId": productId,
      status: "received",
    },
  });
  if (!order) {
    return next(
      new Error(`userId ${_id} not buy or not received the product yet`, { cause: 409 })
    );
  }
  req.body.userId = _id;
  req.body.productId = productId;
  req.body.rating = rating.toFixed(1);
  const newReview = await create({ model: reviewModel, data: req.body });
  if (!newReview) {
    return next(new Error(`fail to add review`, { cause: 400 }));
  }
  return res.status(201).json({ message: "Done" });
});

export const updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.authUser;
  const { rating } = req.body;
  if (rating) {
    req.body.rating = rating.toFixed(1);
  }
  const review = await findOneAndUpdate({
    model: reviewModel,
    filter: { _id: id, userId: _id },
    data: req.body,
    options: { new: true },
    populate: [
      {
        path: "productId",
        select: "name",
      },
    ],
  });
  if (!review) {
    return next(new Error(`review id not found`, { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", review });
});
export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.authUser;
  const review = await findOneAndDelete({
    model: reviewModel,
    filter: { _id: id, userId: _id },
    populate: [
      {
        path: "productId",
        select: "name",
      },
    ],
  });
  if (!review) {
    return next(new Error(`review id not found`, { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", review });
});

