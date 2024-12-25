import mongoose from "mongoose";

export const dbConnect = async (req, res) => {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("db conneccted"))
  .catch((error) => console.log(error))
}