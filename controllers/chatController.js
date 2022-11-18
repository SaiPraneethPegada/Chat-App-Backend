const { chatModel } = require("../models/chat");
const { messageModel } = require("../models/messages");
const { userModel } = require("../models/user");

const chatController = {
  accessChat: async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      res.send({
        statusCode: 400,
        message: "UserId Not found in the request",
      });
    } else {
      var isChat = await chatModel
        .find({
          isGroupChat: false,
          $and: [
            { users: { $elemMatch: { $eq: userId } } },
            {
              users: {
                $elemMatch: { $eq: req.user.userId },
              },
            },
          ],
        })
        .populate("users", "-password")
        .populate("latestMessage");

      isChat = await userModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "userName pic email",
      });

      if (isChat.length > 0) {
        res.send(isChat[0]);
      } else {
        var chatData = {
          chatName: "sender",
          isGroupChat: false,
          users: [req.user.userId, userId],
        };

        try {
          const createdChat = await chatModel.create(chatData);
          const fullChat = await chatModel
            .findOne({ _id: createdChat._id })
            .populate("users", "-password");
          res.send(fullChat);
        } catch (error) {
          res.send({
            statusCode: 500,
            error: error.message,
          });
        }
      }
    }
  },

  fetchChats: async (req, res) => {
    try {
      chatModel
        .find({ users: { $elemMatch: { $eq: req.user.userId } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await userModel.populate(results, {
            path: "latestMessage.sender",
            select: "userName email pic",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.send({
        statusCode: 500,
        error: error.message,
      });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { content, chatId } = req.body;

      if (!content || !chatId) {
        res.send({
          statusCode: 400,
          message: "Check the data sent through the request",
        });
      }

      let message = await messageModel.create({
        sender: req.user.userId,
        content,
        chat: chatId,
      });

      message = await message.populate("sender", "userName pic");
      message = await message.populate("chat");
      message = await userModel.populate(message, {
        path: "chat.users",
        select: "userName email pic",
      });

      await chatModel.findByIdAndUpdate(chatId, { latestMessage: message });

      res.send(message);
    } catch (error) {
      res.send({
        statusCode: 500,
        error: error.message,
      });
    }
  },

  getAllMessages: async (req, res) => {
    try {
      const messages = await messageModel
        .find({ chat: req.params.chatId })
        .populate("sender", "userName email pic")
        .populate("chat");
      res.send(messages);
    } catch (error) {
      res.send({
        statusCode: 500,
        error: error.message,
      });
    }
  },
};

module.exports = chatController;
