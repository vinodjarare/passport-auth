const User = require("../models/User");
const bcrypt = require("bcryptjs");
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json("all fields are compulsory");

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      provider: "local",
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
exports.login = async (req, res) => {};
