const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    })
    .populate("participants", "firstName lastName photoUrl") // Crucial for header names
    .populate("messages.senderId", "firstName lastName photoUrl");

    if (!chat) {
      return res.json({ messages: [], participants: [] });
    }
    
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

chatRouter.post("/chat/send", userAuth, async (req, res) => {
  try {
    const { targetUserId, text } = req.body;
    const userId = req.user._id;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
    }

    chat.messages.push({ senderId: userId, text });
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Delivery failed" });
  }
});

module.exports = chatRouter;