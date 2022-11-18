const { hashPassword, hashCompare, createToken } = require("../helpers/auth");
const { userModel } = require("../models/user");

const userController = {
  signup: async (req, res) => {
    try {
      let users = await userModel.find({ email: req.body.email });
      if (users.length > 0) {
        res.send({
          statusCode: 400,
          message: "User already exists",
        });
      } else {
        if (req.body.pic === "") {
          req.body.pic =
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
        }
        let hashedPassword = await hashPassword(req.body.password);
        req.body.password = hashedPassword;
        let user = await userModel.create(req.body);
        res.send({
          statusCode: 200,
          message: "Signup successful!!",
          user,
        });
      }
    } catch (error) {
      res.send({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      let user = await userModel.findOne({ email: req.body.email });
      if (user) {
        let validPw = await hashCompare(req.body.password, user.password);
        if (validPw) {
          let token = await createToken({
            email: user.email,
            userId: user._id,
          });
          res.send({
            statusCode: 200,
            message: "Login Successful",
            userInfo: {
              userId: user._id,
              userName: user.userName,
              email: user.email,
              pic: user.pic,
              token,
            },
          });
        } else {
          res.send({
            statusCode: 401,
            message: "Incorrect Password",
          });
        }
      } else {
        res.send({
          statusCode: 400,
          message: "User does not exists",
        });
      }
    } catch (error) {
      res.send({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.errors.message,
      });
    }
  },

  searchUser: async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { userName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await userModel
      .find(keyword)
      .find({ _id: { $ne: req.user.userId } });

    res.send(users);
  },
};

module.exports = userController;
