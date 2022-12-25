import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import * as validators from "../../modules/user/user.validation.js"
import endPoints from './user.endPoint.js';
import * as userController from './controller/user.js';

const router = Router()

// update Password
router.post('/updatePassword', validation(validators.updatePassword), auth(endPoints.updatePassword), userController.updatePassword)
// softDelete
router.patch('/softDelete', validation(validators.token), auth(endPoints.softDelete), userController.softDelete)
//  get user by id
router.get('/:id', validation(validators.idAndToken),auth(endPoints.getUser), userController.getUserById)
//  block account
router.patch('/:id', validation(validators.idAndToken),auth(endPoints.blockUser), userController.blockUser)


export default router