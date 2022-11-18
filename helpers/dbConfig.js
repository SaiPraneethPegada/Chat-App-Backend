const mongoose = require("mongoose");

const { DB_URL } = process.env;

const dbConnect = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("MongoDB connection successful");
  } catch (error) {
    console.log(error, "MongoDB connection error");
  }
};

module.exports = dbConnect;
