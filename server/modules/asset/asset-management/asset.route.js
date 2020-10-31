const express = require("express");
const router = express.Router();
const {
    auth,
    uploadFile
} = require(`${SERVER_MIDDLEWARE_DIR}`);
const AssetController = require("./asset.controller");
const data = [{
    name: 'fileAvatar',
    path: '/asset/pictures'
}, {
    name: 'file',
    path: '/asset/files'
}]

/* Tài sản */
router.get('/assets', auth, AssetController.searchAssetProfiles);

router.post('/assets', auth, uploadFile(data, 'fields'), AssetController.createAsset);
router.patch('/assets/:id', auth, uploadFile(data, 'fields'), AssetController.updateAssetInformation);
router.delete('/assets/:id', auth, AssetController.deleteAsset);



/* Tab khấu hao */
router.patch('/assets/:id/depreciations', auth, AssetController.updateDepreciation);



/* Tab thông tin sử dụng */
router.post('/assets/:id/usage-logs', auth, AssetController.createUsage);
router.patch('/assets/:id/usage-logs', auth, AssetController.updateUsage);
router.delete('/assets/:id/usage-logs', auth, AssetController.deleteUsage);



/* Tab bảo trì */
router.get('/assets/maintainance-logs', auth, AssetController.getMaintainances);
router.post('/assets/:id/maintainance-logs', auth, AssetController.createMaintainance);
router.patch('/assets/:id/maintainance-logs', auth, AssetController.updateMaintainance);
router.delete('/assets/:id/maintainance-logs', auth, AssetController.deleteMaintainance);



/* Tab sự cố */
router.get('/assets/incident-logs', auth, AssetController.getIncidents);
router.post('/assets/:id/incident-logs', auth, AssetController.createIncident);
router.patch('/assets/:id/incident-logs', auth, AssetController.updateIncident);
router.delete('/assets/:id/incident-logs', auth, AssetController.deleteIncident);

module.exports = router;