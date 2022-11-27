import { Router } from "express";
import { auth } from './../../middleware/auth.js';
import { myMulter, validationTypes } from './../../services/multer.js';
import * as brandController from './controller/brand.js';
import validation from './../../middleware/validation.js';
import * as validators from './brand.validation.js';
import endPoints from "./brand.endPoint.js";

const router = Router()

// add brand
router.post('/', auth(endPoints.addBrand), myMulter(validationTypes.image).single('image'),validation(validators.addBrand),  brandController.addBrand)
// update brand by id
router.put('/:id', auth(endPoints.updateBrand), myMulter(validationTypes.image).single('image'),validation(validators.updateBrand), brandController.updateBrand)
// get all brands
router.get('/', validation(validators.getBrands), auth(endPoints.getBrand),brandController.getBrands)
// get brand by id
router.get('/:id',validation(validators.getBrand), auth(endPoints.getBrands),brandController.getBrand)



export default router