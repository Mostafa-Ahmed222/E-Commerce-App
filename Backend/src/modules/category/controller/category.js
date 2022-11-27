import categoryModel from "../../../../DB/model/Category.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import asyncHandler from "./../../../services/handelError.js";
import cloudinary from "./../../../services/cloudinary.js";
import slugify from "slugify";
import {
  create,
  findByIdAndUpdate,
  findOne,
} from "./../../../../DB/DBMethods.js";
import paginate from "../../../services/paginate.js";

export const addCategory = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    next(new Error("image is required please upload it", { cause: 400 }));
  } else {
    const { name } = req.body;
    const category = await findOne({
      model: categoryModel,
      filter: { name },
      select: "name",
    });
    if (category) {
      next(new Error("Category Name must be Unique", { cause: 409 }));
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
        next(new Error("fail to add category", { cause: 400 }));
      } else {
        res.status(201).json({ message: "Done" });
      }
    }
  }
});
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
    next(new Error("in-valid category id", { cause: 404 }));
  }
});
export const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // const category = await findById({model: categoryModel,filter: id,populate: [
  //   {
  //     path: "createdBy",
  //     select: "userName email",
  //   },
  // ]});
  const cursor = categoryModel
    .findById(id)
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
    .cursor();
  const categoryCursor = await cursor.next();
  if (categoryCursor != null) {
    const category = categoryCursor.toObject();
    category.subCategories = await subCategoryModel
      .find({ categoryId: id })
      .populate([
        {
          path: "createdBy",
          select: "userName email",
        },
        {
          path: "updatedBy",
          select: "userName email",
        },
      ]);
    res.status(200).json({ message: "Done", category });
  } else {
    next(new Error("In-Valid category id", { cause: 404 }));
  }
  // category
  //   ? res.status(200).json({ message: "Done", category })
  //   : next(new Error("In-Valid category id", { cause: 404 }));
});
export const getCategories = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.size);
  const cursor = categoryModel
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
  const categories = [];
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const category = doc.toObject();
    category.subCategories = await subCategoryModel
      .find({ categoryId: doc._id })
      .populate([
        {
          path: "createdBy",
          select: "userName email",
        },
        {
          path: "updatedBy",
          select: "userName email",
        },
      ]);
    categories.push(category);
  }
  categories.length
    ? res.status(200).json({ message: "Done", categories })
    : next(new Error("Categories Not found", { cause: 404 }));
});
