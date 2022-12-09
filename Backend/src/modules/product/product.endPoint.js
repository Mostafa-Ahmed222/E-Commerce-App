import { roles } from "../../middleware/auth.js";


const endPoints = {
    addProduct : [roles.Admin],
    updateProduct: [roles.Admin],
}

export default endPoints