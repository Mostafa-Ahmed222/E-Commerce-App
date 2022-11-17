import { Router } from "express";
import { auth } from './../../middleware/auth.js';
import { HME, myMulter, validationTypes } from './../../services/multer.js';
import * as subCategoryController from './controller/subcategory.js';
import validation from './../../middleware/validation.js';
import * as validators from './subcategory.validation.js';
import endPoints from "./subcategory.endPoint.js";
const router = Router()

// add subCategory
router.post('/:id',validation(validators.idAndToken), auth(endPoints.addSubCategory), myMulter(validationTypes.image).single('image'), HME, subCategoryController.addSubCategory)
// update subCategory by id
router.put('/:id',validation(validators.idAndToken),auth(endPoints.updateSubCategory), myMulter(validationTypes.image).single('image'), HME, subCategoryController.updateSubCategory)
// // get subCategory by id
router.get('/', validation(validators.authToken), auth(endPoints.getSubCategories),subCategoryController.getCategories)
// // get all subCategories
router.get('/:id',validation(validators.idAndToken), auth(endPoints.getSubCategory),subCategoryController.getSubCategory)




export default router