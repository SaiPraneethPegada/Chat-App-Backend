const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    content: { type: String, maxLength: 250 },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "chats" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  },
  { timestamps: true }
);

const messageModel = mongoose.model("messages", messageSchema);

module.exports = { messageModel };
