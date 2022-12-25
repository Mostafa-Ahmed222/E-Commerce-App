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
      return next(new Error("In-valid token or In-valid bearer key", { cause: 400 }));
    } else {
      const token = authorization.split(process.env.BearerKey)[1];
      const decoded = jwt.verify(token, process.env.TOKENSIGNATURE);
      if (!decoded?.id || !decoded?.isLoggedIn) {
        return next(new Error("in-valid payload", { cause: 400 }));
      } else {
        const user = await findById({
          model: userModel,
          filter:  decoded.id,
          select: "userName Blocked role isDeleted"
        });
        if (!user) {
          return next(new Error("Not register user", { cause: 401 }));
        } else {
          if (!accessRoles.includes(user.role)) {
            return next(new Error("Un-authorized user", { cause: 403 }));
          } else {
            if (user.Blocked) {
              return next(new Error("Blocked User", { cause: 409 }));
            } else {
              if (user.isDeleted) {
                return next(new Error("Deleted User", { cause: 409 }));
              } else {
                req.authUser = user;
                return next();
              }
            }
          }
        }
      }
    }
  });
};
