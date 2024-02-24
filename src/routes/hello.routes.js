const express = require("express");
const router = express.Router();

const { helloController } = require("../controllers/hello.controller");

router.get("/", helloController);

module.exports = router;
