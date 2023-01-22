import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import * as validators from "./admin.validation.js"
import endPoints from './admin.endPoint.js';
import * as adminController from './controller/admin.js';

const router = Router()

//  block account
router.patch('/block/:id', validation(validators.blockUser),auth(endPoints.blockUser), adminController.blockUser)
//  unblock account
router.patch('/unblock/:id', validation(validators.unblockUser),auth(endPoints.unblockUser), adminController.unBlockUser)
// user Promotion
router.patch('/promotion/:id', validation(validators.userPromotion), auth(endPoints.userPromotion),adminController.userPromotion)

export default router