import { Router } from "express";
import validation from './../../middleware/validation.js';
import * as validators from './auth.validation.js';
import * as registerController from "./controller/registration.js";
const router = Router()
//signup
router.post('/signup', validation(validators.signup),registerController.signup)
//confirm email
router.get('/confirmEmail/:token', validation(validators.confirmEmail),registerController.confirmEmail)
//reconfirm Email
router.get('/refreshEmail/:token', validation(validators.reConfirmEmail),registerController.reConfirmEmail)
//signin
router.post('/signin', validation(validators.signin),registerController.signin)
// forget Password with accessCode
router.post('/accessCode', validation(validators.accessCode), registerController.sendAccessCode)
router.post('/forgetPassword', validation(validators.forgetPassword), registerController.forgetPassword)

export default router