const express = require("express");
const router = express.Router();
const UserController = require('./user.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get("/users", auth, UserController.getUsers);


router.post("/users", auth, UserController.createUser);
router.get("/users/:id", auth, UserController.getUser);
router.patch("/users/:id", auth, UserController.editUser);
router.delete("/users/:id", auth, UserController.deleteUser);
router.get('/users/roles/abc',auth,UserController.getAllUsersWithRole)

module.exports = router;
