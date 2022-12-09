import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import * as wishlistController from "./controller/wishlist.js";
import endPoints from './wishlist.endPoint.js';
import * as validators from "./wishlist.validation.js";
const router = Router({mergeParams : true})




router.patch('/add', validation(validators.add),auth(endPoints.add), wishlistController.add)
router.patch('/remove', validation(validators.remove),auth(endPoints.remove), wishlistController.remove)




export default router