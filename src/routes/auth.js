const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: true,
      sameSite: "none", 
    });

    res.send(user);
    res.send(user);

    res.send(user);

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      // THIS IS THE CRITICAL FIX
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
        secure: true,      // Must be true for Render's HTTPS
        sameSite: "none",  // Must be "none" for cross-site (localhost to render)
      });
      
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  // Clear cookie with same security settings
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.send("Logout Successful!!");
});
module.exports = authRouter;
