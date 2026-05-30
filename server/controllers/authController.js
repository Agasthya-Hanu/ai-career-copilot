const bcrypt = require("bcryptjs");

const signup = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    res.json({
      message: "Signup successful",
      user: {
        name,
        email,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }

};

module.exports = {
  signup,
};