import { roles } from "../../middleware/auth.js";


const endPoints = {
    add : [roles.Admin, roles.User],
    update : [roles.Admin, roles.User],
    remove: [roles.Admin, roles.User],
    get: [roles.Admin, roles.User],
}

export default endPoints