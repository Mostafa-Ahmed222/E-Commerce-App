import { roles } from "../../middleware/auth.js";


const endPoints = {
    createCoupon : [roles.Admin],
    updateCoupon: [roles.Admin],
    deleteCoupon: [roles.Admin],
    getCoupon: [roles.Admin],
    getCoupons: [roles.Admin]
}

export default endPoints