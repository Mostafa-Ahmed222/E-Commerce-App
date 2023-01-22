import mongoose from "mongoose";
// setup DB with mongoose
const connectDB = async()=>{
    return await mongoose.connect(process.env.DBURL).then(()=>{
        console.log(`connectDB on ${process.env.DBURL}`);
    })
    .catch((err)=>{
        console.log(`connectDB on ${process.env.DBURL} ${err}`)
    })
}
// to avoid deprecated mongoose
mongoose.set('strictQuery', false);
export default connectDB