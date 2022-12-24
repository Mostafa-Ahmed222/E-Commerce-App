import express from "express";
import morgan from "morgan";
import { globalError } from "../services/handelError.js";
import connectDB from "../../DB/connection.js";
import cors from 'cors'
import fires from "../middleware/Admin.js";
import authRouter from "./auth/auth.router.js";
import categoryRouter from "./category/category.router.js";
import subcategoryRouter from "./subcategory/subcategory.router.js";
import userRouter from "./user/user.router.js";
import brandRouter from "./brand/brand.router.js";
import productRouter from "./product/product.router.js";
import couponRouter from './coupon/coupon.router.js';
import cartRouter from './cart/cart.router.js';
import orderRouter from './order/order.router.js';
import reviewsRouter from './reviews/reviews.router.js';

export const appRouter = (app) => {
  // setup with baseUrl
  const baseUrl = process.env.baseUrl;
  // convert buffer data
  app.use(express.json());
  app.use(express.urlencoded({extended: false}))
  //cors
  app.use(cors());
  // setup morgans mode
  if (process.env.MOOD === "DEV") {
    app.use(morgan("dev"));
  }
  // setup api routing
  app.get('/', (req, res)=>{
    res.send('<h1>Home Page</h1>')
  })
  app.use(`${baseUrl}/auth`, authRouter);
  app.use(`${baseUrl}/user`, fires(), userRouter);
  app.use(`${baseUrl}/category`, fires(), categoryRouter);
  app.use(`${baseUrl}/subCategory`, fires(), subcategoryRouter);
  app.use(`${baseUrl}/brand`, fires(), brandRouter);
  app.use(`${baseUrl}/product`, fires(), productRouter);
  app.use(`${baseUrl}/coupon`, fires(), couponRouter)
  app.use(`${baseUrl}/cart`, fires(), cartRouter)
  app.use(`${baseUrl}/order`, fires(), orderRouter)
  app.use(`${baseUrl}/review`, fires(), reviewsRouter)

  app.use("*", (req, res) => {
    res.status(404).send("In-valid Routing");
  });

  // global Handeling error
  app.use(globalError);
  // connect with server and DB
  connectDB();
};
