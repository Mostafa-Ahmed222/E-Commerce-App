import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import validation from './../../middleware/validation.js';
import * as cartController from "./controller/cart.js";
import endPoints from './cart.endPoint.js';
import * as validators from './cart.validation.js';
const router = Router()

router.post('/',validation(validators.addToCart) ,auth(endPoints.create), cartController.addToCart)
router.patch('/:id',validation(validators.removeFromCart) ,auth(endPoints.remove), cartController.removeFromCart)
router.get('/',validation(validators.getCart) ,auth(endPoints.get), cartController.getCart)



export default router