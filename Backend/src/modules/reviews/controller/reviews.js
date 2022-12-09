import asyncHandler from "./../../../services/handelError.js";
import {
  create,
  findByIdAndUpdate,
  findOne,
  updateOne,
} from "./../../../../DB/DBMethods.js";
import reviewModel from "./../../../../DB/Review.model.js";
import productModel from "./../../../../DB/model/Product.model.js";
import orderModel from './../../../../DB/model/Order.model.js';

export const addReview = asyncHandler(async (req, res, next) => {
  const { productId, rating } = req.body;
  const { _id } = req.authUser;
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
    populate: [
      {
        path: "products.productId",
        select: "ratings avgRate",
      },
    ],
  });
  if (!order) {
    return next(
      new Error(`userId ${_id} not buy the product yet`, { cause: 409 })
    );
  }
  const allRating = [];
  let avgRate = 0;
  for (const product of order.products) {
    if (productId === product.productId._id.toString()) {
      allRating.push(...product.productId.ratings, {
        userId: req.authUser._id,
        rating,
      });
      for (let i = 0; i < allRating.length; i++) {
        avgRate += allRating[i].rating;
      }
      avgRate = (avgRate / allRating.length).toFixed(2);
      break;
    }
  }
  req.body.userId = _id;
  const newReview = await create({ model: reviewModel, data: req.body });
  if (!newReview) {
    return next(new Error(`fail to add review`, { cause: 400 }));
  }
  await updateOne({
    model: productModel,
    filter: { _id: productId },
    data: { avgRate, ratings: allRating },
  });
  return res.status(200).json({ message: "Done" });
});
export const updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { rating } = req.body;
  const { _id } = req.authUser;
  const review = await findOne({
    model: reviewModel,
    filter: { _id: id, userId: _id },
    populate: [
      {
        path: "productId",
        select: "ratings avgRate",
      },
    ],
  });
  if (!review) {
    return next(new Error(`review id not found`, { cause: 404 }));
  }
  const updatedReview = await findByIdAndUpdate({
    model: reviewModel,
    filter: id,
    data: req.body,
    options: { new: true },
    populate: [
      {
        path: "productId",
        select: "ratings avgRate",
      },
    ],
  });
  if (!updatedReview) {
    return next(new Error(`fail to update review`, { cause: 400 }));
  }
  if (rating) {
    let avgRate = 0;
    const allRating = [];
    for (let i = 0; i < updatedReview.productId.ratings.length; i++) {
      if (_id.toString() !== updatedReview.productId.ratings[i].userId.toString()) {
        avgRate += updatedReview.productId.ratings[i].rating
        allRating.push(updatedReview.productId.ratings[i])
      }
    }
    avgRate = ((rating + avgRate)/updatedReview.productId.ratings.length).toFixed(2)
    allRating.push({userId: _id, rating})
    await updateOne({
      model: productModel,
      filter: {_id: updatedReview.productId._id},
      data: { ratings: allRating, avgRate },
    });
  }
  return res.status(200).json({ message: "Done", updatedReview });
});
