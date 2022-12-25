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
import productModel from "./../../../../DB/model/Product.model.js";

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
export const getSubCategory = asyncHandler(async (req, res, next) => {
  const { subCategoryId } = req.params;
  // const subCategory = await findById({model: subCategoryModel,filter: subCategoryId, populate: [
  //   {
  //     path: "categoryId",
  //     populate: [{
  //       path: "createdBy",
  //       select: "userName email",
  //     }],
  //   },
  //   {
  //     path: "createdBy",
  //     select: "userName email",
  //   },
  //   {
  //     path: "updatedBy",
  //     select: "userName email",
  //   },
  // ]});
  // subCategory
  //   ? res.status(200).json({ message: "Done", subCategory })
  //   : return next(new Error("In-Valid SubCategory id", { cause: 404 }));
  const cursor = subCategoryModel
    .findById(subCategoryId)
    .populate([
      {
        path: "categoryId",
        populate: [
          {
            path: "createdBy",
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
    ])
    .cursor();
  const subCategoryCursor = await cursor.next();
  if (subCategoryCursor != null) {
    const subCategory = subCategoryCursor.toObject();
    subCategory.products = await productModel
      .find({ subCategoryId: subCategoryId })
      .select("-subCategoryId -categoryId")
      .populate([
        {
          path: "createdBy",
          select: "userName email",
        },
        {
          path: "updatedBy",
          select: "userName email",
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
      ]);
    return res.status(200).json({ message: "Done", subCategory });
  } else {
    return next(new Error("In-Valid sub category id", { cause: 404 }));
  }
});
export const getSubCategories = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.size);
  // const SubCategories = await find({
  //   model: subCategoryModel,
  //   populate: [
  //     {
  //       path: "categoryId",
  //       populate: [{
  //         path: "createdBy",
  //         select: "userName email",
  //       }],
  //     },
  //     {
  //       path: "createdBy",
  //       select: "userName email",
  //     },
  //     {
  //       path: "updatedBy",
  //       select: "userName email",
  //     },
  //   ],
  //   skip,
  //   limit
  // });
  // SubCategories.length
  //   ? res.status(200).json({ message: "Done", SubCategories })
  //   : return next(new Error("SubCategories Not found", { cause: 404 }));
  const cursor = subCategoryModel
    .find({})
    .populate([
      {
        path: "createdBy",
        select: "userName email",
      },
      {
        path: "updatedBy",
        select: "userName email",
      },
    ])
    .limit(limit)
    .skip(skip)
    .cursor();
  const subCategories = [];
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const subCategory = doc.toObject();
    subCategory.products = await productModel
      .find({ subCategoryId: doc._id })
      .select("-subCategoryId -categoryId")
      .populate([
        {
          path: "createdBy",
          select: "userName email",
        },
        {
          path: "updatedBy",
          select: "userName email",
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
      ]);
    subCategories.push(subCategory);
  }
  if (subCategories.length) {
    return res.status(200).json({ message: "Done", subCategories })
  }
  return next(new Error("subCategories Not found", { cause: 404 }));
});
