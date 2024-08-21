const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      incude: {
        post: true,
      },
    });
    console.log(users);
    res.send(users);
  } catch (error) {
    console.log(error);
  }
};

const getSingleUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    console.log(userId);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    res.send(user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getAllUsers, getSingleUser };
