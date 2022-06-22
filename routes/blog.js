const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/blog");

const router = express.Router();

router.route("/").post(createPost).get(getPosts);
router.route("/:id").get(getPost).patch(updatePost).delete(deletePost);

module.exports = router;
