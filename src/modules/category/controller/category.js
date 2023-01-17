import categoryModel from "../../../../DB/model/Category.model.js";
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

// add category
export const addCategory = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(
      new Error("image is required please upload it", { cause: 400 })
    );
  } else {
    const { name } = req.body;
    const category = await findOne({
      model: categoryModel,
      filter: { name },
      select: "name",
    });
    if (category) {
      return next(new Error("Category Name must be Unique", { cause: 409 }));
    } else {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "ECommerce/categories",
        }
      );
      const result = await create({
        model: categoryModel,
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
        return next(new Error("fail to add category", { cause: 400 }));
      } else {
        res.status(201).json({ message: "Done" });
      }
    }
  }
});
// update category by id
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "ECommerce/categories",
      }
    );
    req.body.image = secure_url;
    req.body.publicImageId = public_id;
  }
  if (req.body?.name) {
    req.body.slug = slugify(req.body.name);
  }
  req.body.updatedBy = req.authUser._id;
  const category = await findByIdAndUpdate({
    model: categoryModel,
    filter: id,
    data: req.body,
  });
  if (category) {
    if (req.body.publicImageId) {
      await cloudinary.uploader.destroy(category.publicImageId);
      res.status(200).json({ message: "Done" });
    } else {
      res.status(200).json({ message: "Done" });
    }
  } else {
    req.body.publicImageId
      ? await cloudinary.uploader.destroy(req.body.publicImageId)
      : "";
    return next(new Error("in-valid category id", { cause: 404 }));
  }
});
// get category by id
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await findById({
    model: categoryModel,
    filter: id,
    populate: [
      {
        path: "createdBy",
        select: "userName email",
      },
      {
        path: "subCategories",
        populate: [
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
                path: "reviews",
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
        ],
      },
    ],
  });
  if (!result) {
    return next(new Error("In-Valid category id", { cause: 404 }));
  }
  const category = result.toObject();
  if (category.subCategories.length) {
    for (const subCategory of category.subCategories) {
      if (subCategory.products.length) {
        for (const product of subCategory.products) {
          if (product.reviews.length) {
            let avgRate = 0;
            for (const review of product.reviews) {
              avgRate += review.rating;
            }
            product.avgRate = +(avgRate / product.reviews.length).toFixed(2);
          }
        }
      }
    }
  }
  return res.status(200).json({ message: "Done", category });
});
// get all categories
export const getCategories = asyncHandler(async (req, res, next) => {
  const { page, size, sortedField, orderedBy } = req.query;
  const { skip, limit } = paginate({ page, size });
  const sort = sorting({ orderedBy, sortedField });
  const result = await find({
    model: categoryModel,
    populate: [
      {
        path: "createdBy",
        select: "userName email",
      },
      {
        path: "subCategories",
        populate: [
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
                path: "reviews",
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
        ],
      },
    ],
    skip,
    limit,
    sort,
  });
  if (!result.length) {
    return next(new Error("Categories Not found", { cause: 404 }));
  }
  const categories = []
  for (const category of result) {
    const convCategory = category.toObject()
    if (convCategory.subCategories.length) {
      for (const subCategory of convCategory.subCategories) {
        if (subCategory.products.length) {
          for (const product of subCategory.products) {
            if (product.reviews.length) {
              let avgRate = 0;
              for (const review of product.reviews) {
                avgRate += review.rating;
              }
              product.avgRate = +(avgRate / product.reviews.length).toFixed(2);
            }
          }
        }
      }
    }
    categories.push(convCategory)
  }
  return res.status(200).json({ message: "Done", categories });
});