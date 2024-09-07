require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword".hashPassword);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashPassword,
      },
    });
    console.log("user", user);
    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      JWT_SECRET,
      {
        expiresIn: "60m",
      }
    );
    console.log("token", token);
    res
      .status(201)
      .send({ user, token, message: "Account successfully created" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "There was an issue registering an account" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(401).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatched " + isMatch);

    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      JWT_SECRET,
      {
        expiresIn: "60m",
      }
    );

    res.status(200).send({ token, user, message: "Successfully logged in." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "There was an issue logging in" });
  }
};

module.exports = { register, login };
