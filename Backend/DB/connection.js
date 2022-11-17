import mongoose from "mongoose";
// setup DB with mongoose
const connectDB = async()=>{
    return await mongoose.connect(process.env.DBURL).then(()=>{
        console.log(`connectDB on ${process.env.DBURL}`);
    })
}
export default connectDB