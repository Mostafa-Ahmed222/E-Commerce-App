import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import express from 'express'
import { appRouter } from './src/modules/index.router.js'
//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path: path.join(__dirname, './config/.env')})

const app = express()
// setup with Port
const port = process.env.PORT
// setup baseurl, convertBufferData, morgan, ApiRouting , Handeling error and connect with server and DB

appRouter(app)
app.listen(port, () => console.log(`server is running....... at port ${port}!`))