import { Router } from "express";
import { auth } from './../../middleware/auth.js';
import { myMulter, validationTypes } from './../../services/multer.js';
import * as subCategoryController from './controller/subcategory.js';
import validation from './../../middleware/validation.js';
import * as validators from './subcategory.validation.js';
import endPoints from "./subcategory.endPoint.js";
const router = Router({mergeParams: true})

// add subCategory
router.post('/', auth(endPoints.addSubCategory), myMulter(validationTypes.image).single('image'),validation(validators.addSubCategory), subCategoryController.addSubCategory)
// update subCategory by id
router.put('/:subCategoryId',auth(endPoints.updateSubCategory), myMulter(validationTypes.image).single('image'),validation(validators.updateSubCategory), subCategoryController.updateSubCategory)
// get subCategory by id
router.get('/', validation(validators.getCategories), auth(endPoints.getSubCategories),subCategoryController.getCategories)
// get all subCategories
router.get('/:subCategoryId',validation(validators.getSubCategory), auth(endPoints.getSubCategory),subCategoryController.getSubCategory)




export default router