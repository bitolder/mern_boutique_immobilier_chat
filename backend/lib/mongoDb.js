import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    const connec = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`connected to MongoDB ${connec.connection.host}`);
  } catch (error) {
    console.log("Couldn't connect to Mongo", error);
  }
};
