const express = require("express");
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

const RecommendProcureController = require("./purchase-request.controller");


router.get('/purchase-request',auth, RecommendProcureController.searchPurchaseRequests);


router.post('/purchase-request', auth, RecommendProcureController.createPurchaseRequest);
router.put('/purchase-request/:id',auth, RecommendProcureController.updatePurchaseRequest);
router.delete('/purchase-request/:id',auth, RecommendProcureController.deletePurchaseRequest);



module.exports = router;