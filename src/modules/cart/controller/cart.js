import {
  create,
  find,
  findOne,
  findOneAndUpdate,
} from "../../../../DB/DBMethods.js";
import cartModel from "../../../../DB/model/Cart.model.js";
import asyncHandler from "../../../services/handelError.js";
import paginate from './../../../services/paginate.js';

export const addToCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.authUser;
  const { products } = req.body;
  const cart = await findOne({ model: cartModel, filter: { userId: _id } });
  if (!cart) {
    const createCart = await create({
      model: cartModel,
      data: { userId: _id, products },
    });
    return res.status(201).json({ message: "Done", createCart });
  }
  for (const product of products) {
    let match = true;
    for (let i = 0; i < cart.products.length; i++) {
      if (product.productId == cart.products[i].productId.toString()) {
        cart.products[i] = product;
        match = false;
        break;
      }
    }
    if (match) {
      cart.products.push(product);
    }
  }
  const result = await findOneAndUpdate({
    model: cartModel,
    filter: { _id: cart._id, userId: _id },
    data: { products: cart.products },
    options: { new: true },
  });
  if (result) {
    return res.status(200).json({ message: "Done", result });
  }
});
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const cart = await findOneAndUpdate({
    model: cartModel,
    filter: { userId: req.authUser._id, "products.productId": id },
    data: { $pull: { products: { productId: id } } },
    options: { new: true },
  });
  if (!cart) {
    return next(new Error("product not found", { cause: 404 }));
  }
  res.status(200).json({ message: "Done" });
});
export const getCart = asyncHandler(async (req, res, next) => {
  const {skip, limit} = paginate({page: req.query.page, size: req.query.size})
  const cart = await find({
    model: cartModel,
    filter: { userId: req.authUser._id },
    skip,
    limit,
    populate: [
      {
        path: "userId",
        select: "userName email",
      },
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
  if (!cart.length) {
    return next(new Error('cart is empty', {cause: 404}))
  }
  return res.status(200).json({message: 'Done', cart})
});
