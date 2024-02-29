const express = require("express");
const router = express.Router();
const { updateSettings } = require("../controllers/settings.controller");

router.patch("/settings/:id", updateSettings);

module.exports = router;
