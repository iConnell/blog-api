const { UnauthorizedError, BadRequestError } = require("../errors");
const User = require("../models/User");

const register = async (req, res) => {
  const { password, password2 } = req.body;

  if (password !== password2) {
    throw new BadRequestError("The two passwords must match");
  }

  delete req.body.password2;

  const user = await User.create({ ...req.body });

  const token = await user.createToken();

  const response = {
    id: user._id,
    name: user.firstName + " " + user.lastName,
    username: user.username,
    email: user.email,
    token,
  };
  res.status(201).json(response);
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
  if (!isMatch) {
    throw new UnauthorizedError("Username or password incorrect");
  }
  const token = await user.createToken();
  res.status(200).json({ token });
};

module.exports = {
  login,
  register,
};
