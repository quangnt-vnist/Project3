const express = require('express');
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);
const GoodController = require('./good.controller');

router.get('/', auth, GoodController.getGoodsByType);
router.get('/all-goods', auth, GoodController.getAllGoods);
router.get('/by-type', auth, GoodController.getAllGoodsByType);
router.post('/', auth, GoodController.createGoodByType);
router.patch('/:id', auth, GoodController.editGood);
router.get('/:id', auth, GoodController.getGoodDetail);
router.get('/by-category/:id', auth, GoodController.getAllGoodsByCategory);
router.delete('/:id', auth, GoodController.deleteGood);


module.exports = router;