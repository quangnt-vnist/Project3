const express = require("express");
const router = express.Router();
const RoleController = require('./role.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get("/roles", auth, RoleController.getRoles);


router.post("/roles", auth, RoleController.createRole);
router.get("/roles/:id", auth, RoleController.getRole);
router.patch("/roles/:id", auth, RoleController.editRole);
router.delete("/roles/:id", auth, RoleController.deleteRole);

module.exports = router;
