import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import cloudinary from 'cloudinary'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path: path.join(__dirname, '../../config/.env')})

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret,
    secure: true
  });

  export default cloudinary.v2