import { roles } from "../../middleware/auth.js";


const endPoints = {
    addCategory : [roles.Admin],
    updateCategory: [roles.Admin],
    getCategory: [roles.Admin, roles.User],
    getCategories: [roles.Admin, roles.User]
}

export default endPoints