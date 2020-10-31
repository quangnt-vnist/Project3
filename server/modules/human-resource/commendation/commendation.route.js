const express = require("express");
const router = express.Router();

const CommendationController = require("./commendation.controller");
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get('/commendations', auth, CommendationController.searchCommendations);


router.post('/commendations', auth, CommendationController.createCommendation);

router.patch('/commendations/:id', auth, CommendationController.updateCommendation);
router.delete('/commendations/:id', auth, CommendationController.deleteCommendation);

module.exports = router;