const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // This will print "undefined" in your Render logs if the variable isn't set correctly
    console.log("Checking URI:", process.env.MONGO_URI ? "URI detected" : "URI is UNDEFINED");

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB:", conn.connection.name);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;