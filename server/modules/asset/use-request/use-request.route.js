const express = require("express");
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

const RecommendDistributeController = require("./use-request.controller");


router.get('/use-requests', auth, RecommendDistributeController.searchUseRequests);

router.post('/use-requests', auth, RecommendDistributeController.createUseRequest);
router.put('/use-requests/:id',auth, RecommendDistributeController.updateUseRequest);
router.delete('/use-requests/:id', auth, RecommendDistributeController.deleteUseRequest);



module.exports = router;