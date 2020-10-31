const express = require("express");
const router = express.Router();
const SampleController = require('./_sample.controller');

router.get("/", SampleController.get);

router.post("/", SampleController.create);
router.get("/:id", SampleController.show);
router.patch("/:id", SampleController.edit);
router.delete("/:id", SampleController.delete);

module.exports = router;
