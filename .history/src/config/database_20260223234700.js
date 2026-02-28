const mongoose = require("mongoose");

const connectDB = async () => {
console.log(process.env.MONGO_CONNECTION_STRING); // Updated to match .env
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
};

module.exports = connectDB;
