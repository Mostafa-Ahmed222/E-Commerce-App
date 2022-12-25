import { roles } from "../../middleware/auth.js";


const endPoints = {
    addSubCategory : [roles.Admin],
    updateSubCategory: [roles.Admin],
    getSubCategory: [roles.Admin, roles.User],
    getSubCategories: [roles.Admin, roles.User]
}

export default endPoints