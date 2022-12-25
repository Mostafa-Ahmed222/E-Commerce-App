import { roles } from "../../middleware/auth.js";


const endPoints = {
    add : [roles.Admin, roles.User],
    update : [roles.Admin, roles.User],
    delete: [roles.Admin, roles.User],
}

export default endPoints