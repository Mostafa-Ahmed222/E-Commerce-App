import moment from "moment";
import {
  create,
  find,
  findByIdAndUpdate,
  findOne,
  findOneAndUpdate,
} from "../../../../DB/DBMethods.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import asyncHandler from "../../../services/handelError.js";
import paginate from "./../../../services/paginate.js";

export const createCoupon = asyncHandler(async (req, res, next) => {
  const {expireDate} = req.body
  req.body.createdBy = req.authUser._id;
  req.body.expireDate = moment(`${expireDate}`, "DD/MM/YYYY h:mm:ss").format()
  const coupon = await create({ model: couponModel, data: req.body });
  if (coupon) {
    return res.status(201).json({ message: "Done" })
  }
  return next(new Error("fail to create coupon", { cause: 400 }));
});
export const updateCoupon = asyncHandler(async (req, res, next) => {
  req.body.updatedBy = req.authUser._id;
  if (req.body?.expireDate) {
    req.body.expireDate = moment(`${req.body.expireDate}`, "DD/MM/YYYY h:mm:ss").format()
  }
  const coupon = await findByIdAndUpdate({
    model: couponModel,
    filter: req.params.id,
    data: req.body,
  });
  if (coupon) {
    return res.status(200).json({ message: "Done" })
    
  }
  return next(new Error("in-valid coupon Id", { cause: 404 }));
});
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await findOneAndUpdate({
    model: couponModel,
    filter: {_id : req.params.id, deletedAt: false},
    data: { deletedAt: true, deletedBy: req.authUser._id },
  });
  if (coupon) {
    return res.status(200).json({ message: "Done" })
  }
  return next(new Error("in-valid coupon id or may be deleted", { cause: 400 }));
});
export const coupons = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate({
    page: req.query.page,
    size: req.query.size,
  });
  const coupons = await find({ model: couponModel, filter: {deletedAt: false},skip, limit });
  if (coupons.length) {
    return res.status(200).json({ message: "Done", coupons })
  }
  return next(new Error("coupons not found", { cause: 404 }));
});
export const coupon = asyncHandler(async (req, res, next) => {
  const coupon = await findOne({
    model: couponModel,
    filter: { name: req.params.name, deletedAt: false },
  });
  if (coupon) {
    return res.status(200).json({ message: "Done", coupon })
  }
  return next(new Error("coupons not found", { cause: 404 }));
});
