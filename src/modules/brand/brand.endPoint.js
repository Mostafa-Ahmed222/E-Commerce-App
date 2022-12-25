import { roles } from "../../middleware/auth.js";


const endPoints = {
    addBrand : [roles.Admin],
    updateBrand: [roles.Admin],
    getBrand: [roles.Admin, roles.User],
    getBrands: [roles.Admin, roles.User]
}

export default endPoints