const { UnauthorizedError, BadRequestError } = require("../errors");
const User = require("../models/User");
const generateToken = require("../helpers/utils");
const Token = require("../models/Token");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const tranporter = nodemailer.createTransport({
  host: "smtp.elasticemail.com",
  port: 2525,
  auth: {
    user: process.env.ELASTIC_USER,
    pass: process.env.ELASTIC_API_KEY,
  },
});

const register = async (req, res) => {
  const { password, password2 } = req.body;

  if (password !== password2) {
    throw new BadRequestError("The two passwords must match");
  }

  delete req.body.password2;

  const user = await User.create({ ...req.body });

  // const token = await generateToken({ id: user._id, username: user.username });
  const verificationToken = await user.createVerificationToken();

  const verificationUrl = `${process.env.HOST}/api/auth/verify/${verificationToken}`;

  await tranporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: req.body.email,
    subject: "Verify Your Blog account",
    html: `Click <a href='${verificationUrl}'> Here </a> to confirm your email address`,
  });

  res.status(201).json({ msg: `Verification email sent to ${req.body.email}` });
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  await User.findOneAndUpdate(
    {
      _id: payload.id,
      username: payload.username,
    },
    { isActive: true }
  );

  res.status(200).json({ msg: "Account verified" });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError("You must enter username and password");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new UnauthorizedError("Username or Password incorrect");
  }

  const isMatch = await user.checkPassword(password);

  console.log(`from controller ${isMatch}, ${password}`);
  if (!isMatch) {
    throw new UnauthorizedError(" or password incorrect");
  }

  if (!user.isActive) {
    return res
      .status(401)
      .json({ msg: "Verify your account before you proceed" });
  }

  const token = await generateToken({
    id: user._id,
    username: user.username,
  });
  res.status(200).json({ token });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.id });

  res.status(204);
};

// For testing purposes
const deleteAllUsers = async (req, res) => {
  const del = await User.deleteMany({});

  res.status(200).json(del);
};

const deleteAllTokens = async (req, res) => {
  const del = await Token.deleteMany({});

  res.status(200).json(del);
};
module.exports = {
  login,
  register,
  verifyEmail,
  logout,
  deleteAllUsers,
  deleteAllTokens,
};
