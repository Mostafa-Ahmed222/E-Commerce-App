import { Router } from "express";
import { auth } from './../../middleware/auth.js';
import { myMulter, validationTypes } from './../../services/multer.js';
import * as categoryController from './controller/category.js';
import validation from './../../middleware/validation.js';
import * as validators from './category.validation.js';
import endPoints from "./category.endPoint.js";
import subCategoryRouter from '../subcategory/subcategory.router.js';
const router = Router()

// routing
router.use('/:categoryId/subCategory', subCategoryRouter)
// add category
router.post('/', auth(endPoints.addCategory), myMulter(validationTypes.image).single('image'),validation(validators.addCategory),  categoryController.addCategory)
// update category by id
router.put('/:id', auth(endPoints.updateCategory), myMulter(validationTypes.image).single('image'),validation(validators.updateCategory), categoryController.updateCategory)
// get all categories
router.get('/', validation(validators.getCategories), auth(endPoints.getCategory),categoryController.getCategories)
// get category by id
router.get('/:id',validation(validators.getCategory), auth(endPoints.getCategories),categoryController.getCategory)




export default router