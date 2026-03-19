import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://minhdat2727_db_user:Dat%40123@mindx-cluster.zumnyox.mongodb.net/?appName=mindx-cluster"
    );

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;