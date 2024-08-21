const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    if (!posts) {
      return res.status(404).send("No posts found");
    }
    res.send(posts);
  } catch (error) {
    console.log(error);
  }
};

const getSinglePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.send(post);
  } catch (error) {
    console.log(error);
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = await prisma.product.create({
      data: {
        title,
        content,
      },
    });
    res.status(201).send(newPost);
  } catch (error) {
    console.log(error);
  }
};

const editPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    console.log(req.body);
    const { title, content } = req.body;
    const data = {};
    if (title) {
      data.title = title;
    }
    if (content) {
      data.content = content;
    }

    console.log(data);
    const editPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data,
    });
    res.status(200).send(editPost, { message: "Post successfully updated" });
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    res.status(200).send("Post successfully deleted");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllPosts,
  getSinglePost,
  createPost,
  editPost,
  deletePost,
};
