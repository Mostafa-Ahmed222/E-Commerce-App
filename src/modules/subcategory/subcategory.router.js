import { Router } from "express";
import { auth } from './../../middleware/auth.js';
import { myMulter, validationTypes } from './../../services/multer.js';
import * as subCategoryController from './controller/subcategory.js';
import validation from './../../middleware/validation.js';
import * as validators from './subcategory.validation.js';
import endPoints from "./subcategory.endPoint.js";
const router = Router({mergeParams: true})

// add subCategory
router.post('/', myMulter(validationTypes.image).single('image'),validation(validators.addSubCategory), auth(endPoints.addSubCategory), subCategoryController.addSubCategory)
// update subCategory by id
router.put('/:subCategoryId', myMulter(validationTypes.image).single('image'),validation(validators.updateSubCategory), auth(endPoints.updateSubCategory), subCategoryController.updateSubCategory)
// get all subCategories
router.get('/', validation(validators.getCategories), subCategoryController.getSubCategories)
// get subCategory by id
router.get('/:subCategoryId',validation(validators.getSubCategoryById), subCategoryController.getSubCategoryById)



export default router