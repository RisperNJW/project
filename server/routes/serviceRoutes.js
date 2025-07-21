const express = require("express");
const router = express.Router();
const { createService, getAllServices } = require("../controllers/serviceController");

router.get("/", getAllServices);
router.post("/", createService);

module.exports = router;
