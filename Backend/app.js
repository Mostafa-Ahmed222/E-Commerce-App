import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import express from 'express'
import connectDB from './DB/connection.js';
import morgan from 'morgan'
import * as indexRouter from './src/modules/index.router.js'
import { globalError } from './src/services/handelError.js'
import fires from './src/middleware/Admin.js';
//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path: path.join(__dirname, './config/.env')})

const app = express()
// connect with Port and baseurl
const port = process.env.PORT || 5000
const baseurl = process.env.BASEURL
// convert buffer data
app.use(express.json())
// setup morgans mode
if (process.env.MOOD === 'DEV') {
    app.use(morgan('dev'))
}
// setup api routing
app.use(`${baseurl}/auth`, indexRouter.authRouter)
app.use(`${baseurl}/user`, fires(), indexRouter.userRouter)
app.use(`${baseurl}/category`, fires(), indexRouter.categoryRouter)
app.use(`${baseurl}/subCategory`, fires(), indexRouter.subcategoryRouter)
app.use(`${baseurl}/brand`, fires(), indexRouter.brandRouter)
app.use(`${baseurl}/product`, fires(), indexRouter.productRouter)
app.use('*', (req, res)=>{
    res.status(404).send('In-valid Routing')
})

// global Handeling error
app.use(globalError)
// connect with server and DB
connectDB()
app.listen(port, () => console.log(`server is running....... at port ${port}!`))