const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to DB:", conn.connection.name);
    console.log("Connection Host:", conn.connection.host);

  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;