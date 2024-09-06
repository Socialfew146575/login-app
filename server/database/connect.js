import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";
import ENV from "../config.js";

const connect = async () => {
  const mongodb = await MongoMemoryServer.create();
  const getUrl = mongodb.getUri();

  mongoose.set("strictQuery", true);

  // const db=await mongoose.connect(getUrl);
  const db = await mongoose.connect(ENV.MONGO_URI);

  console.log("Database Connected");
};

export default connect;
