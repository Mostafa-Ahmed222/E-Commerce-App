import { roles } from "../../middleware/auth.js";


const endPoints = {
    addSubCategory : [roles.SuperAdmin, roles.Admin],
    updateSubCategory: [roles.SuperAdmin, roles.Admin],
    getSubCategoryById: [ roles.SuperAdmin, roles.Admin, roles.SubAdmin, roles.User],
    getSubCategories: [ roles.SuperAdmin, roles.Admin, roles.SubAdmin, roles.User]
}

export default endPoints