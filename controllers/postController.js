const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching posts" });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the post" });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const newPost = await prisma.post.create({
      data: { title, content },
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the post" });
  }
};

const editPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;

    const data = { ...(title && { title }), ...(content && { content }) };

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the post" });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    await prisma.post.delete({
      where: { id: postId },
    });
    res.status(200).json({ message: "Post successfully deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the post" });
  }
};

module.exports = {
  getAllPosts,
  getSinglePost,
  createPost,
  editPost,
  deletePost,
};
