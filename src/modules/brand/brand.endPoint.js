import { roles } from "../../middleware/auth.js";


const endPoints = {
    addBrand : [roles.SuperAdmin, roles.Admin],
    updateBrand: [roles.SuperAdmin, roles.Admin],
    getBrand: [ roles.SuperAdmin, roles.Admin, roles.SubAdmin, roles.User],
    getBrands: [ roles.SuperAdmin, roles.Admin, roles.SubAdmin, roles.User]
}

export default endPoints