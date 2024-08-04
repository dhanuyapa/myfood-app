const express = require("express");
const router = express.Router();
const contactUsController = require("../controller/contactUsController");

router.post("/add", contactUsController.addContactUs);
router.get("/all", contactUsController.getAllContactUs);

module.exports = router;
