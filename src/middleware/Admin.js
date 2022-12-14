import userModel from "./../../DB/model/User.model.js";
import { create, findOne } from "./../../DB/DBMethods.js";
import { sendEmail } from "../services/nodemailerEmail.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import asyncHandler from "../services/handelError.js";
const fires = () => {
  return asyncHandler(async (req, res, next) => {
      const admin = await findOne({model: userModel, filter: {
        email: process.env.webSiteAdminEmail,
        role: "Admin",
      }});
      if (admin) {
        if (admin.confirmEmail) {
          return next();
        } else {
        return next(new Error('Admin please check your email to confirm it', {cause: 401}))
        }
      } else {
        const hashPassword =  bcrypt.hashSync(
          process.env.webSiteAdminPassword,
          parseInt(process.env.SALTROUND)
        );
        const newAdmin = await create({model : userModel, data: {
          userName: "Mostafa",
          email: process.env.webSiteAdminEmail,
          password: hashPassword,
          phone: "01124284915",
          role: 'Admin'
        }});
        const token = jwt.sign(
          { id: newAdmin._id },
          process.env.confirmEmailToken,
          { expiresIn: 60 * 5 }
        );
        const refToken = jwt.sign(
          { id: newAdmin._id },
          process.env.confirmEmailToken
        );
        const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
        const link2 = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/requestEmailToken/${refToken}`;
        const message = `
      <a href='${link}'> follow link to confirm admin account</a>
      <br>
      <br>
      <a href='${link2}'> follow link to Reconfirm admin account</a>
      `;
        await sendEmail(newAdmin.email,'confirm admin email',message);
        return res.status(201).json({
          message: "for Admin please check your email to confirm it",
        });
        
      }
  });
};

export default fires;
