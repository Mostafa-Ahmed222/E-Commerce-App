import { Router } from "express";
import { auth } from './../../middleware/auth.js';
import { myMulter, validationTypes } from './../../services/multer.js';
import * as productController from './controller/product.js';
import validation from './../../middleware/validation.js';
import * as validators from './product.validation.js';
import endPoints from "./product.endPoint.js";
import wishlistRouter from '../wishlist/wishlist.router.js'

const router = Router()
// routing
router.use('/:productId/wishlist', wishlistRouter)
// add product
router.post('/', myMulter(validationTypes.image).array('image'),validation(validators.addProduct), auth(endPoints.addProduct), productController.addProduct)
// update product by id
router.put('/:id', myMulter(validationTypes.image).array('image'),validation(validators.updateProduct), auth(endPoints.updateProduct), productController.updateProduct)
// get all products
router.get('/', productController.getProducts)
// get product by id
router.get('/:id',productController.getProduct)



export default router