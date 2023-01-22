import { roles } from "../../middleware/auth.js";


const endPoints = {
    blockUser: [roles.SuperAdmin, roles.Admin, roles.SubAdmin],
    unblockUser: [roles.SuperAdmin, roles.Admin, roles.SubAdmin],
    userPromotion: [roles.SuperAdmin, roles.Admin, roles.SubAdmin]
}

export default endPoints