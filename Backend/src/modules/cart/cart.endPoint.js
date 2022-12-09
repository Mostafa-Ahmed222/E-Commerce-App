import { roles } from "../../middleware/auth.js";


const endPoints = {
    create : [roles.Admin, roles.User],
    remove: [roles.Admin, roles.User],
    get: [roles.Admin, roles.User],
}

export default endPoints