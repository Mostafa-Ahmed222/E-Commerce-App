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
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";

export const addSubCategory = asyncHandler(async (req, res, next) => {
  const {id} = req.params
  if (!req.file) {
    next(new Error("image is required please upload it", { cause: 404 }));
  } else {
    const { name } = req.body;
    if (!name) {
      next(new Error("name is required please insert it", { cause: 404 }));
    } else {
      const category = await findOne(subCategoryModel, { name }, "name");
      if (category) {
        next(new Error("Category Name must be Unique", { cause: 409 }));
      } else {
        const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
          folder: "subCategory",
        });
        await create(subCategoryModel, {
          name,
          image: secure_url,
          categoryId : id,
          createdBy: req.authUser._id,
        });
        res.status(201).json({ message: "Done" });
      }
    }
  }
});
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      folder: "subCategory",
    });
    req.body.image = secure_url;
  }
  const subCategory = await updateOne(
    subCategoryModel,
    { _id: id, createdBy: req.authUser._id },
    req.body
  );
  subCategory.modifiedCount
    ? res.status(200).json({ message: "Done" })
    : next(
        new Error("in-valid SubCategory id or may be you not authorized", {
          cause: 409,
        })
      );
});
export const getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await findById(subCategoryModel, id, "", [
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
  ]);
  subCategory
    ? res.status(200).json({ message: "Done", subCategory })
    : next(new Error("In-Valid SubCategory id", { cause: 404 }));
});
export const getCategories = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.size);
  const SubCategories = await find(
    subCategoryModel,
    {},
    "",
    [
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
    ],
    skip,
    limit
  );
  SubCategories.length
    ? res.status(200).json({ message: "Done", SubCategories })
    : next(new Error("SubCategories Not found", { cause: 404 }));
});
