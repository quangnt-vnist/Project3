const express = require('express');
const router = express.Router();
const BinLocationControllers = require('./binLocation.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

router.get('/', auth, BinLocationControllers.getBinLocations);
router.get('/get-child', auth, BinLocationControllers.getChildBinLocations);
router.post('/', auth, BinLocationControllers.createBinLocation);
router.post('/delete-many', auth, BinLocationControllers.deleteManyBinLocations);
router.get('/get-detail/:id', auth, BinLocationControllers.getDetailBinLocation);
router.patch('/:id', auth, BinLocationControllers.editBinLocation);
router.delete('/:id', auth, BinLocationControllers.deleteBinLocation);

module.exports = router;