const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 12;
const { SECRET_KEY } = process.env;

let hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(saltRounds);
  let hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

let hashCompare = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

let createToken = async ({ email, userId }) => {
  let token = await jwt.sign(
    {
      email,
      userId,
    },
    SECRET_KEY,
    { expiresIn: "8h" }
  );
  return token;
};

let validateToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    const tokenData = jwt.decode(token);

    if (!token) {
      return res.json({
        statusCode: 400,
        message: "Authentication Failed- No token found",
      });
    } else if (Math.round(+new Date() / 1000) > tokenData.exp) {
      return res.json({ statusCode: 400, message: "Token expired" });
    } else {
      // validate login token
      jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err)
          return res.json({
            statusCode: 400,
            message: "Authentication failed in session token",
          });
        // console.log(req.user);
        req.user = user;
        next();
      });
    }
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
};

module.exports = {
  hashPassword,
  hashCompare,
  createToken,
  validateToken,
};
