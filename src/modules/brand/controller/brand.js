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
import productModel from "./../../../../DB/model/Product.model.js";
import sorting from "../../../services/sorting.js";

// add brand
export const addBrand = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("logo is required please upload it", { cause: 400 }));
  } else {
    const { name } = req.body;
    const brand = await findOne({
      model: brandModel,
      filter: { name },
      select: "name",
    });
    if (brand) {
      return next(new Error("brand Name must be Unique", { cause: 409 }));
    } else {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "ECommerce/brands",
        }
      );
      const result = await create({
        model: brandModel,
        data: {
          name,
          slug: slugify(name),
          image: secure_url,
          createdBy: req.authUser._id,
          publicImageId: public_id,
        },
      });
      if (!result) {
        await cloudinary.uploader.destroy(public_id);
        return next(new Error("fail to add brand", { cause: 400 }));
      } else {
        return res.status(201).json({ message: "Done" });
      }
    }
  }
});
// update brand by id
export const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "ECommerce/brands",
      }
    );
    req.body.image = secure_url;
    req.body.publicImageId = public_id;
  }
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  req.body.updatedBy = req.authUser._id;
  const brand = await findByIdAndUpdate({
    model: brandModel,
    filter: id,
    data: req.body,
  });
  if (brand) {
    if (req.body?.publicImageId) {
      await cloudinary.uploader.destroy(brand.publicImageId);
      return res.status(200).json({ message: "Done" });
    } else {
      return res.status(200).json({ message: "Done" });
    }
  } else {
    req.body.publicImageId
      ? await cloudinary.uploader.destroy(req.body.publicImageId)
      : "";
    return next(new Error("in-valid brand id", { cause: 404 }));
  }
});
// get brand by id
export const getBrandById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await findById({model: brandModel,filter: id,populate: [
    {
      path: "createdBy",
      select: "userName email",
    },
    {
      path: "updatedBy",
      select: "userName email",
    },
    {
      path: "products",
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
      ]
    }
  ]});
  if (!result) {
    return next(new Error("In-Valid brand id", { cause: 404 }));
  }
  const brand = result.toObject()
  if (brand.products.length) {
    for (const product of brand.products) {
      if (product.reviews.length) {
        let avgRate = 0
        for (const review of product.reviews) {
          avgRate += review.rating;
        }
        product.avgRate = +(avgRate/product.reviews.length).toFixed(2)
      }
    }
  }
  return res.status(200).json({ message: "Done", brand })
});
// get all brands
export const getBrands = asyncHandler(async (req, res, next) => {
  const {page, size, sortedField, orderedBy} = req.query
  const { skip, limit } = paginate({page, size});
  const sort= sorting({orderedBy, sortedField})
  const result = await find({model : brandModel, populate: [
    {
      path: "createdBy",
      select: "userName email",
    },
    {
      path: "updatedBy",
      select: "userName email",
    },
    {
      path: "products",
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
      ]
    }
  ], limit, skip, sort})
  if (!result.length) {
    return next(new Error("Brands Not found", { cause: 404 }));
  }
  const brands = []
  for (const brand of result) {
    const convBrand = brand.toObject()
    if (convBrand.products.length) {
      for (const product of convBrand.products) {
        if (product.reviews.length) {
          let avgRate = 0
          for (const review of product.reviews) {
            avgRate += review.rating;
          }
          product.avgRate = +(avgRate/product.reviews.length).toFixed(2)
        }
      }
    }
    brands.push(convBrand)
  }
  return res.status(200).json({ message: "Done", brands })
});
