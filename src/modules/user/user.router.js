import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import * as validators from "../../modules/user/user.validation.js"
import endPoints from './user.endPoint.js';
import * as userController from './controller/user.js';
import adminRouter from './../Admin/admin.router.js';
const router = Router()

// routing
router.use('/admin', adminRouter)
// update Password
router.post('/updatePassword', validation(validators.updatePassword), auth(endPoints.updatePassword), userController.updatePassword)
// softDelete
router.patch('/softDelete', validation(validators.softDelete), auth(endPoints.softDelete), userController.softDelete)
// get all users
router.get('/', validation(validators.getAllUsers),auth(endPoints.getUsers), userController.getAllUsers)
//  get user by id
router.get('/:id', validation(validators.idAndToken),auth(endPoints.getUser), userController.getUserById)


export default router