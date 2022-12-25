import { Router } from "express";
import fires from "../../middleware/Admin.js";
import validation from './../../middleware/validation.js';
import * as validators from './auth.validation.js';
import * as registerController from "./controller/registration.js";
const router = Router()
//signup
router.post('/signup', fires(), validation(validators.signup),registerController.signup)
//confirm email
router.get('/confirmEmail/:token', validation(validators.confirmEmail),registerController.confirmEmail)
//reconfirm Email
router.get('/requestEmailToken/:token', validation(validators.reConfirmEmail),registerController.reConfirmEmail)
//signin
router.post('/signin', fires(), validation(validators.signin),registerController.signin)
// forget Password with accessCode
router.post('/accessCode', fires(), validation(validators.accessCode), registerController.sendAccessCode)
router.post('/forgetPassword', fires(), validation(validators.forgetPassword), registerController.forgetPassword)

export default router