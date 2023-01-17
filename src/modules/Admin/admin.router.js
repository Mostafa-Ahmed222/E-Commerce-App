import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import * as validators from "../../modules/admin/admin.validation.js"
import endPoints from './admin.endPoint.js';
import * as adminController from './controller/admin.js';

const router = Router()

//  block account
router.patch('/:id', validation(validators.idAndToken),auth(endPoints.blockUser), adminController.blockUser)


export default router