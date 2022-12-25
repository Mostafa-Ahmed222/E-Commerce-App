import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import validation from './../../middleware/validation.js';
import * as orderController from "./controller/order.js";
import endPoints from './order.endPoint.js';
import * as validators from './order.validation.js';
const router = Router()

router.post('/', validation(validators.createOrder),auth(endPoints.create), orderController.createOrder)
router.put('/:id', validation(validators.updateOrder),auth(endPoints.update), orderController.updateOrder)
router.patch('/:id', validation(validators.deleteOrder),auth(endPoints.delete), orderController.deleteOrder)
router.get('/', validation(validators.getOrder),auth(endPoints.get), orderController.getOrder)



export default router