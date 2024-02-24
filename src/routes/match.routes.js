const express = require("express");
const router = express.Router();
const { updateOrderedProfiles } = require("../controllers/match.controller");

router.post("/match", updateOrderedProfiles);

module.exports = router;
