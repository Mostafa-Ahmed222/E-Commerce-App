import productModel from "./../../../../DB/model/Product.model.js";
import subCategoryModel from "./../../../../DB/model/SubCategory.model.js";
import brandModel from "./../../../../DB/model/Brand.model.js";
import asyncHandler from "./../../../services/handelError.js";
import cloudinary from "./../../../services/cloudinary.js";
import slugify from "slugify";
import {
  create,
  find,
  findById,
  findByIdAndUpdate,
  findOne,
} from "./../../../../DB/DBMethods.js";
import paginate from "../../../services/paginate.js";
import sorting from "../../../services/sorting.js";

// add product
export const addProduct = asyncHandler(async (req, res, next) => {
  const { price, discount } = req.body;
  if (!req.files?.length) {
    return next(
      new Error("images is required please upload it", { cause: 400 })
    );
  }
  const product = await findOne({
    model: productModel,
    filter: { name: req.body.name },
    select: "name",
  });
  if (product) {
    return next(
      new Error("name is exist product name must be unique", { cause: 409 })
    );
  }
  const subCategory = await findOne({
    model: subCategoryModel,
    filter: {
      _id: req.body.subCategoryId,
      categoryId: req.body.categoryId,
    },
  });
  if (!subCategory) {
    return next(
      new Error("In-Valid Category or Sub category Id", { cause: 404 })
    );
  }
  const brand = await findById({
    model: brandModel,
    filter: req.body.brandId,
  });
  if (!brand) {
    return next(new Error("In-Valid Brand Id", { cause: 404 }));
  }
  req.body.slug = slugify(req.body.name);
  req.body.stock = req.body.amount;
  req.body.createdBy = req.authUser._id;
  !discount
    ? (req.body.finalPrice = price)
    : (req.body.finalPrice = price - ((price * discount) / 100));
  const images = [];
  const publicImageIds = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `ECommerce/products/${req.body.name}`,
      }
    );
    images.push(secure_url);
    publicImageIds.push(public_id);
  }
  req.body.images = images;
  req.body.publicImageIds = publicImageIds;
  const newProduct = await create({
    model: productModel,
    data: req.body,
  });
  if (!newProduct) {
    if (req.body.publicImageIds) {
      await cloudinary.api.delete_resources(req.body.publicImageIds);
    }
    return next(new Error("fail to add product", { cause: 400 }));
  } else {
    return res.status(201).json({ message: "Done" });
  }
});
// update product by id
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {price, discount, categoryId, subCategoryId, brandId, name, publicImageIds} = req.body
  const product = await findById({ model: productModel, filter: id });
  if (!product) {
    return next(new Error("In-Valid Product Id", { cause: 404 }));
  }
  if (name) {
    const newProduct = await findOne({
      model: productModel,
      filter: { name: name, _id: { $nin: product._id } },
      select: "name",
    });
    if (newProduct) {
      return next(
        new Error("name is exist, product name must be unique", { cause: 409 })
      );
    }
    req.body.slug = slugify(name);
  }
  if (publicImageIds) {
    await cloudinary.api.delete_resources(publicImageIds)
  }
  if (price && discount) {
    req.body.finalPrice = price - ((price * discount) / 100)
  } else if (price) {
    req.body.finalPrice = price - ((price * product.discount) / 100)
  } else if (discount) {
    req.body.finalPrice = product.price - ((product.price * discount) / 100)
  }
  if (req.body?.amount) {
    const calcStock = req.body.amount - product.soldCount
    calcStock >= 0 ? req.body.stock = calcStock : req.body.stock = 0
  }
  if (categoryId && subCategoryId) {
    const subCategory = await findOne({
      model: subCategoryModel,
      filter: {
        _id: subCategoryId,
        categoryId: categoryId,
      },
    });
    if (!subCategory) {
      return next(
        new Error("In-Valid Category or Sub category Id", { cause: 404 })
      );
    }
  }
  if (brandId) {
    const brand = await findById({
      model: brandModel,
      filter: req.body.brandId,
    });
    if (!brand) {
      return next(new Error("In-Valid Brand Id", { cause: 404 }));
    }
  }
  req.body.updatedBy = req.authUser._id;
  if (req.files?.length) {
    const images = [];
    const publicImageIds = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `ECommerce/products/${name || product.name}`,
        }
      );
      images.push(secure_url);
      publicImageIds.push(public_id);
    }
    req.body.images = images;
    req.body.publicImageIds = publicImageIds;
  }
  const updateProduct = await findByIdAndUpdate({
    model: productModel,
    filter: id,
    data: req.body,
  });
  if (!updateProduct) {
    if (req.body?.publicImageIds) {
      await cloudinary.api.delete_resources(req.body.publicImageIds);
    }
    return next(new Error("fail to update product", { cause: 400 }));
  } else {
    if (req.body?.publicImageIds) {
      await cloudinary.api.delete_resources(updateProduct.publicImageIds);
    }
      return res.status(200).json({ message: "Done", updateProduct });
  }
});
// get all products
export const getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await findById({
    model: productModel,
    filter: id,
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
        path: 'reviews'
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
  });
  if (!result) {
    return next(new Error("In-Valid product id", { cause: 404 }));
  }
  const product = result.toObject()
  if (result.reviews.length) {
    let avgRate = 0
    for (const review of result.reviews) {
      avgRate += review.rating;
    }
    product.avgRate = +(avgRate/result.reviews.length).toFixed(2)  
  }
  return res.status(200).json({ message: "Done", product })
});
// get product by id
export const getProducts = asyncHandler(async (req, res, next) => {
  const {page, size, sortedField, orderedBy} = req.query
  const { skip, limit } = paginate({page, size});
  const sort= sorting({orderedBy, sortedField})
  const result = await find({
    model: productModel,
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
        path: 'reviews'
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
    limit,
    skip,
    sort,
  });
  if (!result.length) {
    return next(new Error("products Not found", { cause: 404 }));
  }
  const products = []
  for (const product of result) {
    const convProduct = product.toObject()
    if (product.reviews.length) {
      let avgRate = 0
      for (const review of product.reviews) {
        avgRate += review.rating;
      }
      convProduct.avgRate = +(avgRate/product.reviews.length).toFixed(2)
    }
    products.push(convProduct)
  }
  return res.status(200).json({ message: "Done", products })
});