import userModel from "../../../../DB/model/User.model.js";
import asyncHandler from "../../../services/handelError.js";
import { find, findById, updateOne } from "../../../../DB/DBMethods.js";
import bcrypt from "bcryptjs";
import paginate from "../../../services/paginate.js";
import sorting from './../../../services/sorting.js';



// update Password
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await findById({ model: userModel, filter: req.authUser._id });
  const match = bcrypt.compareSync(oldPassword, user.password);
  if (!match) {
    return next(
      new Error("old password not match with current password", { cause: 409 })
    );
  } else {
    const hash = bcrypt.hashSync(newPassword, +process.env.SALTROUND);
    await updateOne({
      model: userModel,
      filter: { _id: req.authUser._id },
      data: { password: hash },
    });
    return res.status(200).json({ message: "Done" });
  }
});

// softDelete
export const softDelete = asyncHandler(async (req, res, next) => {
  await updateOne({
    model: userModel,
    filter: { _id: req.authUser._id, isDeleted: false },
    data: {
      isDeleted: true,
    },
  });
  return res.status(200).json({ message: "Done" });
});

// get all users
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const {page, size, sortedField, orderedBy} = req.query
  const { skip, limit } = paginate({page, size});
  const sort= sorting({orderedBy, sortedField})
  const users = await find({
    model: userModel,
    filter: { _id: { $ne: req.authUser._id }},select: "-password", skip, limit, sort
  });
  if (!users.length) {
    return next(new Error("Users no found yet", { cause: 404 }));
  }
  return res.json({ message: "Done", users });
});

//  get user by id
export const getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await findById({
    model: userModel,
    filter: id,
    select: "-password",
  });
  if (user) {
    return res.status(200).json({ message: "Done", user });
  }
  return next(new Error("user Not found", { cause: 404 }));
});
