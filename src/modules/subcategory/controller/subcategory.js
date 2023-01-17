import asyncHandler from "./../../../services/handelError.js";
import cloudinary from "./../../../services/cloudinary.js";
import {
  create,
  find,
  findById,
  findByIdAndUpdate,
} from "./../../../../DB/DBMethods.js";
import paginate from "../../../services/paginate.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import slugify from "slugify";
import categoryModel from "../../../../DB/model/Category.model.js";
import sorting from "../../../services/sorting.js";

// add subCategory
export const addSubCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  if (!req.file) {
    return next(new Error("image is required please upload it", { cause: 404 }));
  } else {
    const { name } = req.body;
    const category = await findById({
      model: categoryModel,
      filter: categoryId,
      select: "_id",
    });
    if (!category) {
      return next(new Error("in-valid Category id", { cause: 404 }));
    } else {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `ECommerce/categories/${categoryId}/subCategories`,
        }
      );
      const result = await create({
        model: subCategoryModel,
        data: {
          name,
          slug: slugify(name),
          image: secure_url,
          publicImageId: public_id,
          categoryId,
          createdBy: req.authUser._id,
        },
      });
      if (!result) {
        await cloudinary.uploader.destroy(public_id);
        return next(new Error("fail to add subCategory", { cause: 400 }));
      } else {
        return res.status(201).json({ message: "Done" });
      }
    }
  }
});
// update subCategory by id
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { categoryId, subCategoryId } = req.params;
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `ECommerce/categories/${categoryId}/subCategories`,
      }
    );
    req.body.image = secure_url;
    req.body.publicImageId = public_id;
  }
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  req.body.updatedBy = req.authUser._id;
  const subCategory = await findByIdAndUpdate({
    model: subCategoryModel,
    filter: subCategoryId,
    data: req.body,
  });
  if (!subCategory) {
    return next(new Error("in-valid SubCategory id"), { cause: 404 });
  } else {
    if (req.body.publicImageId) {
      await cloudinary.uploader.destroy(subCategory.publicImageId);
      res.status(200).json({ message: "Done" });
    } else {
      return res.status(200).json({ message: "Done" });
    }
  }
});
// get subCategory by id
export const getSubCategoryById = asyncHandler(async (req, res, next) => {
  const { subCategoryId } = req.params;
  const result = await findById({model: subCategoryModel,filter: subCategoryId, populate: [
    {
      path: "categoryId",
      populate: [{
        path: "createdBy",
        select: "userName email",
      }],
    },
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
    },
  ]});
  if (!result) {
    return next(new Error("In-Valid SubCategory id", { cause: 404 }));
  }
  const subCategory = result.toObject()
  if (subCategory.products.length) {
    for (const product of subCategory.products) {
      if (product.reviews.length) {
        let avgRate = 0
        for (const review of product.reviews) {
          avgRate += review.rating;
        }
        product.avgRate = +(avgRate/product.reviews.length).toFixed(2)
      }
    }
  }
  res.status(200).json({ message: "Done", subCategory }) 

});
// get all subCategories
export const getSubCategories = asyncHandler(async (req, res, next) => {
  const {page, size, sortedField, orderedBy} = req.query
  const { skip, limit } = paginate({page, size});
  const sort= sorting({orderedBy, sortedField})
  const result = await find({
    model: subCategoryModel,
    populate: [
      {
        path: "categoryId",
        populate: [{
          path: "createdBy",
          select: "userName email",
        }],
      },
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
      },
    ],
    skip,
    limit,
    sort
  });
  if (!result.length) {
    return next(new Error("SubCategories Not found", { cause: 404 }));
  }
  const SubCategories = []
  for (const SubCategory of result) {
    const convSubCategory = SubCategory.toObject()
    if (convSubCategory.products.length) {
      for (const product of convSubCategory.products) {
        if (product.reviews.length) {
          let avgRate = 0
          for (const review of product.reviews) {
            avgRate += review.rating;
          }
          product.avgRate = +(avgRate/product.reviews.length).toFixed(2)
        }
      }
    }
    SubCategories.push(convSubCategory)
  }
  res.status(200).json({ message: "Done", SubCategories })
});