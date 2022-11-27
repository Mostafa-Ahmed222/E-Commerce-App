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

export const addBrand = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    next(new Error("logo is required please upload it", { cause: 400 }));
  } else {
    const { name } = req.body;
    const brand = await findOne({
      model: brandModel,
      filter: { name },
      select: "name",
    });
    if (brand) {
      next(new Error("brand Name must be Unique", { cause: 409 }));
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
        next(new Error("fail to add brand", { cause: 400 }));
      } else {
        res.status(201).json({ message: "Done" });
      }
    }
  }
});
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
      res.status(200).json({ message: "Done" });
    } else {
      res.status(200).json({ message: "Done" });
    }
  } else {
    req.body.publicImageId
      ? await cloudinary.uploader.destroy(req.body.publicImageId)
      : "";
    next(new Error("in-valid brand id", { cause: 404 }));
  }
});
export const getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // const brand = await findById({model: brandModel,filter: id,populate: [
  //   {
  //     path: "createdBy",
  //     select: "userName email",
  //   },
  //   {
  //     path: "updatedBy",
  //     select: "userName email",
  //   },
  // ]});
  // brand
  //   ? res.status(200).json({ message: "Done", brand })
  //   : next(new Error("In-Valid brand id", { cause: 404 }));
  const cursor = brandModel
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
  const brandCursor = await cursor.next();
  if (brandCursor != null) {
    const brand = brandCursor.toObject();
    brand.products = await productModel
      .find({ brandId: id })
      .select("-brandId")
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
      ]);
    res.status(200).json({ message: "Done", brand });
  } else {
    next(new Error("In-Valid brand id", { cause: 404 }));
  }
});
export const getBrands = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.size);
  // const brands = await find({model : brandModel, populate: [
  //   {
  //     path: "createdBy",
  //     select: "userName email",
  //   },
  //   {
  //     path: "updatedBy",
  //     select: "userName email",
  //   },
  // ], limit, skip})
  // brands.length
  //   ? res.status(200).json({ message: "Done", brands })
  //   : next(new Error("Categories Not found", { cause: 404 }));
  const cursor = brandModel
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
  const brands = [];
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const brand = doc.toObject();
    brand.products = await productModel
      .find({ brandId: doc._id })
      .select("-brandId")
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
      ]);
    brands.push(brand);
  }
  brands.length
    ? res.status(200).json({ message: "Done", brands })
    : next(new Error("Brands Not found", { cause: 404 }));
});
