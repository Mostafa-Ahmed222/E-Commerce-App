import { roles } from "../../middleware/auth.js";


const endPoints = {
    blockUser: [roles.Admin]
}

export default endPoints