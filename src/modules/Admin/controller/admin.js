import userModel from "../../../../DB/model/User.model.js";
import asyncHandler from "../../../services/handelError.js";
import { find, findById, updateOne } from "../../../../DB/DBMethods.js";
import paginate from "../../../services/paginate.js";


// block account
export const blockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await findById({
    model: userModel,
    filter: id,
    select: "-password",
  });
  if (!user) {
    return next(new Error("user Not found", { cause: 404 }));
  } else {
    if (user.Blocked) {
      return next(new Error("user already blocked", { cause: 409 }));
    } else {
      await updateOne({
        model: userModel,
        filter: { _id: id },
        data: { Blocked: true },
      });
      return res.status(200).json({ message: "Done" });
    }
  }
});
