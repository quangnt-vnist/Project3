const express = require("express");
const router = express.Router();
const LinkController = require('./link.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get("/links", auth, LinkController.getLinks);

router.post("/links", auth, LinkController.createLink);
router.get("/links/:id", auth, LinkController.getLink);
router.patch("/links/:id", auth, LinkController.editLink);
router.delete("/links/:id", auth, LinkController.deleteLink);

router.patch("/links/company/update", auth, LinkController.updateCompanyLinks);

module.exports = router;
