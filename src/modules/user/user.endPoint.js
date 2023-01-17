import { roles } from "../../middleware/auth.js";


const endPoints = {
    updatePassword : [ roles.SuperAdmin, roles.Admin, roles.SubAdmin, roles.User],
    softDelete : [ roles.SuperAdmin, roles.Admin, roles.SubAdmin, roles.User],
    getUsers: [roles.SuperAdmin, roles.Admin, roles.SubAdmin],
    getUser: [roles.SuperAdmin, roles.Admin, roles.SubAdmin]
}

export default endPoints