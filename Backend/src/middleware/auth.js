import jwt from "jsonwebtoken";
import userModel from "./../../DB/model/User.model.js";
import { findById } from "./../../DB/DBMethods.js";
import asyncHandler from './../services/handelError.js';
export const roles = {
  Admin: "Admin",
  User: "User",
};
export const auth = (accessRoles = [roles.User]) => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization.startsWith(process.env.BearerKey)) {
      next(new Error("In-valid token or In-valid bearer key", { cause: 400 }));
    } else {
      const token = authorization.split(process.env.BearerKey)[1];
      const decoded = jwt.verify(token, process.env.TOKENSIGNATURE);
      if (!decoded?.id || !decoded?.isLoggedIn) {
        next(new Error("in-valid payload", { cause: 400 }));
      } else {
        const user = await findById(
          userModel,
          decoded.id,
          "userName Blocked role isDeleted"
        );
        if (!user) {
          next(new Error("Not register user", { cause: 401 }));
        } else {
          if (!accessRoles.includes(user.role)) {
            next(new Error("Un-authorized user", { cause: 403 }));
          } else {
            if (user.Blocked) {
              next(new Error("Blocked User", { cause: 409 }));
            } else {
              if (user.isDeleted) {
                next(new Error("Deleted User", { cause: 409 }));
              } else {
                req.authUser = user;
                next();
              }
            }
          }
        }
      }
    }
  });
};
