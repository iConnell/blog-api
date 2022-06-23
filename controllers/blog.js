const Post = require("../models/Blog");
const { NotFoundError } = require("../errors");

const createPost = async (req, res) => {
  req.body.author = req.user.id;

  const post = await Post.create(req.body);

  res.status(201).json(post);
};

const getPosts = async (req, res) => {
  const posts = await Post.find({ author: req.user.id });

  res.status(200).json({ posts, count: posts.length });
};

const getPost = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findOne({ user: req.user.id, _id: postId });

  res.status(200).json(post);
};

const updatePost = async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { author: req.user.id, _id: req.params.id },
    req.body,
    { runValidators: true, new: true }
  );

  res.status(200).json(post);
};

const deletePost = async (req, res) => {
  const post = await Post.findOneAndDelete({
    author: req.user.id,
    _id: req.params.id,
  });

  if (!post) {
    throw new NotFoundError(`Post with id ${req.params.id} not found`);
  }

  res.status(204).json({ data: "Post deleted" });
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
