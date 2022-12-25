import {
  create,
  find,
  findById,
  findByIdAndDelete,
  findOne,
  findOneAndUpdate,
} from "../../../../DB/DBMethods.js";
import orderModel from "../../../../DB/model/Order.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import asyncHandler from "../../../services/handelError.js";
import couponModel from "./../../../../DB/model/Coupon.model.js";
import moment from "moment";

export const createOrder = asyncHandler(async (req, res, next) => {
  const { products, couponId } = req.body;
  const finalProducts = [];
  let sumTotalPrice = 0;
  for (const product of products) {
    const checkedProduct = await findOne({
      model: productModel,
      filter: { _id: product.productId, stock: { $gte: product.quantity } },
    });
    if (!checkedProduct) {
      return next(
        new Error(`fail to place this item to the order ${product.productId}`, {
          cause: 400,
        })
      );
    }
    product.totalPrice = product.quantity * checkedProduct.finalPrice;
    sumTotalPrice += product.totalPrice;
    finalProducts.push(product);
  }
  req.body.userId = req.authUser._id;
  req.body.products = finalProducts;
  req.body.totalPrice = sumTotalPrice;
  req.body.finalPrice = sumTotalPrice;
  if (couponId) {
    const coupon = await findById({ model: couponModel, filter: couponId });
    if (!coupon) {
      return next(new Error("in-valid coupon id", { cause: 404 }));
    }
    const date = moment(`${coupon.expireDate.toString()}`, "LLLL").fromNow();
    if (date.endsWith("ago")) {
      return next(new Error("coupon was expired", { cause: 404 }));
    }
    req.body.finalPrice = sumTotalPrice - (sumTotalPrice * coupon.amount) / 100;
  }
  const order = await create({ model: orderModel, data: req.body });
  if (!order) {
    return next(new Error("fail to create", { cause: 400 }));
  }
  return res.status(201).json({ message: "Done" });
});
export const updateOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { products, couponId } = req.body;
  const order = await findOne({
    model: orderModel,
    filter: { _id: id, userId: req.authUser._id },
  });
  if (!order) {
    return new next(Error(`in-valid order id`, { cause: 404 }));
  }
  if (products) {
    const finalProducts = [];
    let sumTotalPrice = 0;
    for (const product of products) {
      const checkedProduct = await findOne({
        model: productModel,
        filter: { _id: product.productId, stock: { $gte: product.quantity } },
      });
      if (!checkedProduct) {
        return next(
          new Error(
            `fail to place this item to the order ${product.productId}`,
            {
              cause: 400,
            }
          )
        );
      }
      product.totalPrice = product.quantity * checkedProduct.finalPrice;
      sumTotalPrice += product.totalPrice;
      finalProducts.push(product);
    }
    req.body.products = finalProducts;
    req.body.totalPrice = sumTotalPrice;
    req.body.finalPrice = sumTotalPrice;
  }
  if (couponId) {
    if (!products) {
      req.body.totalPrice = order.totalPrice;
    }
    const coupon = await findById({ model: couponModel, filter: couponId });
    if (!coupon) {
      return next(new Error("in-valid coupon id", { cause: 404 }));
    }
    const date = moment(`${coupon.expireDate.toString()}`, "LLLL").fromNow();
    if (date.endsWith("ago")) {
      return next(new Error("coupon was expired", { cause: 404 }));
    }
    req.body.finalPrice =
      req.body.totalPrice - (req.body.totalPrice * coupon.amount) / 100;
  } else if (!couponId && products && order.couponId) {
    const coupon = await findById({ model: couponModel, filter: order.couponId });
    if (!coupon) {
      return next(new Error("in-valid coupon id", { cause: 404 }));
    }
    const date = moment(`${coupon.expireDate.toString()}`, "LLLL").fromNow();
    if (date.endsWith("ago")) {
      return next(new Error("coupon was expired", { cause: 404 }));
    }
    req.body.finalPrice =
      req.body.totalPrice - (req.body.totalPrice * coupon.amount) / 100;
  }
  const updatedOrder = await findOneAndUpdate({
    model: orderModel,
    filter: { _id: id, userId: req.authUser._id },
    data: req.body,
    options: { new: true },
  });
  if (!updatedOrder) {
    return next(new Error("fail to update", { cause: 400 }));
  }
  return res.status(201).json({ message: "Done", updatedOrder });
});
export const deleteOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await findByIdAndDelete({
    model: orderModel,
    filter: { _id: id, userId: req.authUser._id },
  });
  if (!order) {
    return new next(Error(`in-valid order id`, { cause: 404 }));
  }
  return res.status(200).json({message: 'Done'})
});
export const getOrder = asyncHandler(async (req, res, next) => {
  const order = await find({
    model: orderModel,
    filter: {  userId: req.authUser._id },
    populate: [
      {
        path: "products.productId",
        populate: [
          {
            path: "categoryId",
            populate: [
              {
                path: "createdBy",
                select: "userName email",
              },
              {
                path: "updatedBy",
                select: "userName email",
              },
            ],
          },
          {
            path: "subCategoryId",
            select: "-categoryId",
            populate: [
              {
                path: "createdBy",
                select: "userName email",
              },
              {
                path: "updatedBy",
                select: "userName email",
              },
            ],
          },
          {
            path: "brandId",
            populate: [
              {
                path: "createdBy",
                select: "userName email",
              },
              {
                path: "updatedBy",
                select: "userName email",
              },
            ],
          },
          {
            path: "createdBy",
            select: "userName email",
          },
          {
            path: "updatedBy",
            select: "userName email",
          },
        ],
      },
    ]
  });
  if (!order.length) {
    return new next(Error(`in-valid order`, { cause: 404 }));
  }
  return res.status(200).json({message: 'Done', order})
});


