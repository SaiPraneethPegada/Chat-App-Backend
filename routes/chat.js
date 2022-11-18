var express = require("express");
var router = express.Router();
const {
  accessChat,
  fetchChats,
  sendMessage,
  getAllMessages,
} = require("../controllers/chatController");
const { validateToken } = require("../helpers/auth");

router.post("/", validateToken, accessChat);
router.get("/", validateToken, fetchChats);
router.post("/message", validateToken, sendMessage);
router.get("/messages/:chatId", validateToken, getAllMessages);

module.exports = router;
