import mongoose from "mongoose";

async function connectDb(){
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/googledocs');
        console.log("Connected to DB")
      } catch (error) {
        handleError(error);
      }
}
export default connectDb

