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

export const addProduct = asyncHandler(async (req, res, next) => {
  if (!req.files?.length) {
    next(new Error("images is required please upload it", { cause: 400 }));
  } else {
    const subCategory = await findOne({
      model: subCategoryModel,
      filter: { _id: req.body.subCategoryId, categoryId: req.body.categoryId },
    });
    if (!subCategory) {
      next(new Error("In-Valid Category or Sub category Id", { cause: 404 }));
    }
    const brand = await findById({
      model: brandModel,
      filter: req.body.brandId,
    });
    if (!brand) {
      next(new Error("In-Valid Brand Id", { cause: 404 }));
    }
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
    req.body.slug = slugify(req.body.name);
    req.body.endStock = req.body.startStock;
    req.body.createdBy = req.authUser._id;
    if (!req.body.discount) {
      req.body.finalPrice = req.body.price;
    } else {
      if (req.body.price <= req.body.discount) {
        req.body.finalPrice = 1;
      } else {
        req.body.finalPrice = Math.abs(req.body.price - req.body.discount);
      }
    }
    const product = await create({ model: productModel, data: req.body });
    if (!product) {
      for (const publicImageId of publicImageIds) {
        await cloudinary.uploader.destroy(publicImageId);
      }
      next(new Error("fail to add product", { cause: 400 }));
    } else {
      res.status(201).json({ message: "Done", product });
    }
  }
});
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await findById({ model: productModel, filter: id });
  if (!product) {
    next(new Error("In-Valid Product Id", { cause: 404 }));
  } else {
    if (req.body?.publicImageIds) {
      for (const publicImageId of req.body.publicImageIds) {
        await cloudinary.uploader.destroy(publicImageId);
      }
    }
    if (req.files?.length) {
      const images = [];
      const publicImageIds = [];
      for (const file of req.files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          {
            folder: `ECommerce/products/${req.body.name || product.name}`,
          }
        );
        images.push(secure_url);
        publicImageIds.push(public_id);
      }
      req.body.images = images;
      req.body.publicImageIds = publicImageIds;
    }
    if (req.body?.name) {
      req.body.slug = slugify(req.body.name);
    }
    if (req.body.price) {
      if (!req.body.discount) {
        if (req.body.price <= product.discount) {
          req.body.finalPrice = 1;
        } else {
          req.body.finalPrice = Math.abs(req.body.price - product.discount);
        }
      } else {
        if (req.body.price <= req.body.discount) {
          req.body.finalPrice = 1;
        } else {
          req.body.finalPrice = Math.abs(req.body.price - req.body.discount);
        }
      }
    } else {
      if (req.body?.discount) {
        if (product.price <= req.body.discount) {
          req.body.finalPrice = 1;
        } else {
          req.body.finalPrice = Math.abs(product.price - req.body.discount);
        }
      }
    }
    if (req.body?.startStock) {
      if (req.body.startStock <= product.soldCount) {
        req.body.endStock = 0;
      } else {
        req.body.endStock = Math.abs(req.body.startStock - product.soldCount);
      }
    }
    req.body.updatedBy = req.authUser._id;

    const updateProduct = await findByIdAndUpdate({
      model: productModel,
      filter: id,
      data: req.body,
    });
    if (!updateProduct) {
      next(new Error("fail to update product", { cause: 400 }));
    } else {
      if (req.body?.publicImageIds) {
        for (const publicImageId of updateProduct.publicImageIds) {
          await cloudinary.uploader.destroy(publicImageId);
        }
        res.status(200).json({ message: "Done", updateProduct });
      } else {
        res.status(200).json({ message: "Done", updateProduct });
      }
    }
  }
});
export const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await findById({
    model: productModel,
    filter: id,
    populate: [
      {
        path: "categoryId",
        select: "-subCategoryId",
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
  });
  product
    ? res.status(200).json({ message: "Done", product })
    : next(new Error("In-Valid product id", { cause: 404 }));
});
export const getProducts = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.size);
  const products = await find({
    model: productModel,
    populate: [
      {
        path: "categoryId",
        select: "-subCategoryId",
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
    limit,
    skip,
  });
  products.length
    ? res.status(200).json({ message: "Done", products })
    : next(new Error("Categories Not found", { cause: 404 }));
});
