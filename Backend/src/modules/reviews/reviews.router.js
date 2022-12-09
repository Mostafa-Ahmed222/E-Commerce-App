import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as reviewController  from './controller/reviews.js';
import endPoints from './reviews.endPoint.js';
const router = Router()




router.post('/', auth(endPoints.add),reviewController.addReview)
router.put('/:id', auth(endPoints.update),reviewController.updateReview)




export default router