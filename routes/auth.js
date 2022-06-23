const {
  login,
  register,
  deleteAllUsers,
  deleteAllTokens,
  verifyEmail,
} = require("../controllers/auth");
const express = require("express");

const router = express.Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/delu", deleteAllUsers);
router.post("/delt", deleteAllTokens);

module.exports = router;
