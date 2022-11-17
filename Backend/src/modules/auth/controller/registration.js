import userModel from "../../../../DB/model/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../services/nodemailerEmail.js";
import asyncHandler from "../../../services/handelError.js";
import { updateOne, findById, findOne } from './../../../../DB/DBMethods.js';
import { nanoid } from "nanoid";
export const signup = asyncHandler( async (req, res, next) => {
  const { userName, email, password, phone, DOB } = req.body;
    const user = await findOne(userModel,{ email },"email")
    if (user) {
      next(new Error("Email Exist", {cause: 409}))
    } else {
      const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
      const newUser = new userModel({
        userName,
        email,
        password: hash,
        phone,
        DOB,
      });
      const token = jwt.sign(
        { id: newUser._id },
        process.env.confirmEmailToken,
        { expiresIn: "1h" }
      );
      const link = `
      ${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}
      `;
      const reftoken = jwt.sign(
        { id: newUser._id },
        process.env.confirmEmailToken
      );
      const reflink = `
      ${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refreshEmail/${reftoken}
      `;
      const message = `
      <a href='${link}'>follow link to confirm your email</a>
      <br>
      <br>
      <a href='${reflink}'>follow link to Reconfirm your email</a>
      `;
      const emailResult = await sendEmail(email, "Confirm Email", message);
      if (emailResult.accepted.length) {
        await newUser.save();
        res
          .status(201)
          .json({ message: "Done check your email to confirm it" });
      } else {
        next(new Error("please provide real email", {cause: 400}))
      }
    }
})
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
    const decoded = jwt.verify(token, process.env.confirmEmailToken);
    if (!decoded?.id) {
      next(new Error("in-valid payload", {cause: 400}))
    } else {
      await updateOne(userModel,{ _id: decoded.id, confirmEmail: false },{ confirmEmail: true })
      res.redirect(process.env.FEURL);
    }
});
export const reConfirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
    const decoded = jwt.verify(token, process.env.confirmEmailToken);
    if (!decoded?.id) {
      next(new Error("in-valid payload", {cause: 400}))
    } else {
      const user = await findById(userModel,decoded.id, "email confirmEmail")
      if (!user) {
        next(new Error("In-valid User Id", {cause: 404}))
      } else {
        if (user.confirmEmail) {
        next(new Error("email already confirmed", {cause: 400}))
        } else {
          const token = jwt.sign(
            { id: user._id },
            process.env.confirmEmailToken,
            { expiresIn: "1h" }
          );
          const link = `
                  ${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}
                  `;
          const message = `
                  <a href='${link}'>follow link to confirm your email</a>
                  `;
          await sendEmail(user.email, "Confirm Email", message);
          res
            .status(201)
            .json({ message: "Done check your email to confirm it" });
        }
      }
    }
});
export const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
    const user = await findOne(userModel, { email })
    if (!user) {
      next(new Error("In-Valid Account", {cause: 404}))
    } else {
      if (!user.confirmEmail) {
        next(new Error("Confirm your email first", {cause: 400}))
      } else {
        if (user.Blocked) {
          next(new Error("Blocked User", {cause: 400}))
        } else {
          if (user.isDeleted) {
            next(new Error("Deleted User", {cause: 400}))
          } else {
            const match = bcrypt.compareSync(password, user.password);
          if (!match) {
            next(new Error("In-Valid Account", {cause: 404}))
          } else {
            const token = jwt.sign(
              { id: user._id, isLoggedIn: true },
              process.env.TOKENSIGNATURE,
              { expiresIn: 60 * 60 * 24 }
            );
            res.status(200).json({ message: "Done", token });
          }
          }
        }
      }
    }
});
export const sendAccessCode = asyncHandler( async (req, res, next)=>{
  const {email} = req.body
  const user = await findOne(userModel, { email }, 'email')
    if (!user) {
      next(new Error("In-Valid Account", {cause: 404}))
    } else {
      const accessCode = nanoid()
      await updateOne(userModel, {email}, {code : accessCode})
      await sendEmail(user.email, 'Reset Password', `<h1>${accessCode}</h1>`)
      res.status(200).json({message: 'Done Check your Email'})
    }
})
export const forgetPassword = asyncHandler(async (req, res, next)=>{
  const {email, newPassword, code} = req.body
  const user = await findOne(userModel, { email , code}, 'email')
  console.log(user);
    if (!user) {
      next(new Error("In-Valid Account Data or code is wrong", {cause: 404}))
    } else {
      const hash = bcrypt.hashSync(newPassword, parseInt(process.env.SALTROUND))
      await updateOne(userModel, {email, code}, {password: hash, code : ''})
      res.redirect(process.env.FEURL);
    }
})

