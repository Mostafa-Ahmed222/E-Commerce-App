import { roles } from "../../middleware/auth.js";


const endPoints = {
    addCategory : [roles.SuperAdmin, roles.Admin],
    updateCategory: [roles.SuperAdmin, roles.Admin],
    getCategoryById: [ roles.SuperAdmin, roles.Admin, roles.SubAdmin, roles.User],
    getCategories: [ roles.SuperAdmin, roles.Admin, roles.SubAdmin, roles.User]
}

export default endPoints