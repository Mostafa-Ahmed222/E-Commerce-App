import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as reviewController  from './controller/reviews.js';
import endPoints from './reviews.endPoint.js';
import validation from './../../middleware/validation.js';
import * as validators from './reviews.validation.js';

const router = Router({mergeParams: true})



//addReview
router.post('/', validation(validators.addReview),auth(endPoints.add),reviewController.addReview)

// updateReview
router.put('/:id', validation(validators.updateReview),auth(endPoints.update),reviewController.updateReview)

// deleteReview
router.delete('/:id', validation(validators.deleteReview),auth(endPoints.delete),reviewController.deleteReview)



export default router