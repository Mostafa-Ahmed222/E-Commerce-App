import { Router } from "express";
import { auth } from './../../middleware/auth.js';
import { HME, myMulter, validationTypes } from './../../services/multer.js';
import * as categoryController from './controller/category.js';
import validation from './../../middleware/validation.js';
import * as validators from './category.validation.js';
import endPoints from "./category.endPoint.js";
const router = Router()

// add category
router.post('/',validation(validators.authToken), auth(endPoints.addCategory), myMulter(validationTypes.image).single('image'), HME, categoryController.addCategory)
// update category by id
router.put('/:id',validation(validators.idAndToken),auth(endPoints.updateCategory), myMulter(validationTypes.image).single('image'), HME, categoryController.updateCategory)
// get category by id
router.get('/', validation(validators.authToken), auth(endPoints.getCategory),categoryController.getCategories)
// get all categories
router.get('/:id',validation(validators.idAndToken), auth(endPoints.getCategories),categoryController.getCategory)




export default router