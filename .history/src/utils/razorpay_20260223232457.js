const Razorpay = require("razorpay"); // Make sure this line is at the VERY top!

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID || "rzp_test_dummyid", 
  key_secret: process.env.RAZORPAY_SECRET || "dummysecret",
});

module.exports = instance;