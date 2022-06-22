const { login, register } = require("../controllers/auth");
const express = require("express");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
