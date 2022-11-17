import categoryModel from "../../../../DB/model/Category.model.js";
import asyncHandler from "./../../../services/handelError.js";
import cloudinary from "./../../../services/cloudinary.js";
import {
  create,
  find,
  findById,
  findOne,
  updateOne,
} from "./../../../../DB/DBMethods.js";
import paginate from "../../../services/paginate.js";

export const addCategory = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    next(new Error("image is required please upload it", { cause: 400 }));
  } else {
    const { name } = req.body;
    if (!name) {
      next(new Error("name is required please insert it", { cause: 404 }));}
       else {
         const category = await findOne(categoryModel, { name }, "name");
         if (category) {
           next(new Error("Category Name must be Unique", { cause: 409 }));
         } else {
           const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
             folder: "category",
           });
           await create(categoryModel, {
             name,
             image: secure_url,
             createdBy: req.authUser._id,
           });
           res.status(201).json({ message: "Done" });
         }
    }
  }
});
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      folder: "category",
    });
    req.body.image = secure_url;
  }
  const category = await updateOne(
    categoryModel,
    { _id: id, createdBy: req.authUser._id },
    req.body
  );
  category.modifiedCount
    ? res.status(200).json({ message: "Done" })
    : next(
        new Error("in-valid category id or may be you not authorized", {
          cause: 409,
        })
      );
});
export const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await findById(categoryModel, id, "", [
    {
      path: "createdBy",
      select: "userName email",
    },
  ]);
  category
    ? res.status(200).json({ message: "Done", category })
    : next(new Error("In-Valid category id", { cause: 404 }));
});
export const getCategories = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.size);
  const categories = await find(
    categoryModel,
    {},
    "",
    [
      {
        path: "createdBy",
        select: "userName email",
      },
    ],
    skip,
    limit
  );
  categories.length
    ? res.status(200).json({ message: "Done", categories })
    : next(new Error("Categories Not found", { cause: 404 }));
});
