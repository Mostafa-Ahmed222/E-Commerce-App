import { roles } from "../../middleware/auth.js";


const endPoints = {
    addProduct : [roles.Admin],
    updateProduct: [roles.Admin],
    getProduct: [roles.Admin, roles.User],
    getProducts: [roles.Admin, roles.User]
}

export default endPoints