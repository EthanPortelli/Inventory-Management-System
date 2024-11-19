const express = require("express");
const router = express.Router();
const userController = require("./Controllers");

// Route for adding a user
router.post("/add-user", userController.addUser);

// Export the router
module.exports = router;