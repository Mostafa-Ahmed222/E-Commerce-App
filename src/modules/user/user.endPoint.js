import { roles } from "../../middleware/auth.js";


const endPoints = {
    updatePassword : [roles.Admin, roles.User],
    softDelete : [roles.Admin, roles.User],
    getUser: [roles.Admin],
    blockUser: [roles.Admin]
}

export default endPoints