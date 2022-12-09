import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import validation from './../../middleware/validation.js';
import * as couponController from "./controller/coupon.js";
import endPoints from './coupon.endPoint.js';
import * as validators from './coupon.validation.js';
const router = Router()


router.post('/',validation(validators.createCoupon) ,auth(endPoints.createCoupon), couponController.createCoupon)
router.put('/:id',validation(validators.updateCoupon) ,auth(endPoints.updateCoupon), couponController.updateCoupon)
router.patch('/:id',validation(validators.deleteCoupon) ,auth(endPoints.deleteCoupon), couponController.deleteCoupon)
router.get('/',validation(validators.getCoupons) ,auth(endPoints.getCoupons), couponController.coupons)
router.get('/:name',validation(validators.getCoupon) ,auth(endPoints.getCoupon), couponController.coupon)




export default router