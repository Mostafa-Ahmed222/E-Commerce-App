import userModel from "../../../../DB/model/User.model.js";
import asyncHandler from "../../../services/handelError.js";
import {
  findById,
  findOneAndUpdate,
  updateOne,
} from "../../../../DB/DBMethods.js";
import paginate from "../../../services/paginate.js";

const roles = ["User", "SubAdmin", "Admin", "SuperAdmin"];
// block account
export const blockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (id == req.authUser._id.toString()) {
    return next(new Error("can not block yourself", { cause: 409 }));
  }
  const user = await findById({
    model: userModel,
    filter: id,
    select: "-password",
  });
  if (!user) {
    return next(new Error("user Not found", { cause: 404 }));
  }
  if (user.Blocked) {
    return next(new Error("user already blocked", { cause: 409 }));
  }
  if (user.isDeleted) {
    return next(new Error("user is deleted", { cause: 409 }));
  }
  if (roles.indexOf(user.role) >= roles.indexOf(req.authUser.role)) {
    return next(
      new Error(
        `Operation is not allowed ${req.authUser.role} can not block ${user.role}`,
        { cause: 409 }
      )
    );
  }
  await updateOne({
    model: userModel,
    filter: { _id: id },
    data: { Blocked: true },
  });
  return res.status(200).json({ message: "Done" });
});
// unblock account
export const unBlockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (id == req.authUser._id.toString()) {
    return next(new Error("can not unblock yourself", { cause: 409 }));
  }
  const user = await findById({
    model: userModel,
    filter: id,
    select: "-password",
  });
  if (!user) {
    return next(new Error("user Not found", { cause: 404 }));
  }
  if (!user.Blocked) {
    return next(new Error("user already unblocked", { cause: 409 }));
  }
  if (user.isDeleted) {
    return next(new Error("user is deleted", { cause: 409 }));
  }
  if (roles.indexOf(user.role) >= roles.indexOf(req.authUser.role)) {
    return next(
      new Error(
        `Operation is not allowed ${req.authUser.role} can not unblocked ${user.role}`,
        { cause: 409 }
      )
    );
  }
  await updateOne({
    model: userModel,
    filter: { _id: id },
    data: { Blocked: false },
  });
  return res.status(200).json({ message: "Done" });
});
// user Promotion
export const userPromotion = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  const { id } = req.params;
  if (!roles.includes(role)) {
    return next(
      new Error("in-valid role or Operation is not allowed", { cause: 409 })
    );
  }
  if (roles.indexOf(role) > roles.indexOf(req.authUser.role)) {
    return next(
      new Error("Operation is not allowed please check role", { cause: 409 })
    );
  }
  req.body.promotedBy = req.authUser._id;
  const user = await findOneAndUpdate({
    model: userModel,
    filter: { _id: id, role: { $ne: role } },
    data: req.body,
  });
  if (!user) {
    return next(
      new Error("in-valid user id or no change in role ", { cause: 404 })
    );
  }
  return res.status(200).json({ message: "Done" });
});
