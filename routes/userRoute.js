const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getAllUsers, getSingleUser } = require("../controllers/userController");
const { JWT_SECRET } = process.env;

router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
