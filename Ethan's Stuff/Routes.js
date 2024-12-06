const express = require("express");
const router = express.Router();
const Controller = require("./Controllers");

// Route for adding a user
router.post("/login", Controller.login);
router.get("/inventory", Controller.inventory);
router.post("/add-item", Controller.addItem);
router.delete("/delete-item/:id", Controller.deleteItem);
router.patch("/update-item/:id", Controller.updateItem);
router.get("/users", Controller.users)
router.post("/add-user", Controller.addUser);
router.delete("/delete-user/:id", Controller.deleteUser);
router.patch("/update-role/:id", Controller.updateRole);

// Export the router
module.exports = router;
