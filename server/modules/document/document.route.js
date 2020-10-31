const express = require("express");
const router = express.Router();
const DocumentController = require('./document.controller');
const { auth, uploadFile } = require(`${SERVER_MIDDLEWARE_DIR}`);

const data = [
    {
        name: 'file',
        path: '/files'
    },
    {
        name: 'fileScan',
        path: '/files'
    }
];
router.get("/documents/:id/download-file", auth, DocumentController.downloadDocumentFile);
router.get("/documents/:id/download-file-scan", auth, DocumentController.downloadDocumentFileScan);
router.patch("/documents/:id/increase-number-view", auth, DocumentController.increaseNumberView);
router.get("/documents/permission-view", auth, DocumentController.getDocumentsThatRoleCanView);
router.get("/documents/user-statistical", auth, DocumentController.getDocumentsUserStatistical);

// Danh mục văn bản - domain
router.get("/document-domains", auth, DocumentController.getDocumentDomains);
router.post("/document-domains", auth, DocumentController.createDocumentDomain);
router.post("/document-domains/delete-many", auth, DocumentController.deleteManyDocumentDomain);
router.patch("/document-domains/:id", auth, DocumentController.editDocumentDomain);
router.delete("/document-domains/:id", auth, DocumentController.deleteDocumentDomain);
router.post("/document-domains/import-file", auth, DocumentController.importDocumentDomain)

// Loại văn bản - category
router.get("/document-categories", auth, DocumentController.getDocumentCategories);
router.get("/document-categories/:id", auth, DocumentController.showDocumentCategory);
router.post("/document-categories", auth, DocumentController.createDocumentCategory);
router.patch("/document-categories/:id", auth, DocumentController.editDocumentCategory);
router.delete("/document-categories/:id", auth, DocumentController.deleteDocumentCategory);
router.post("/document-categories/import-file", auth, DocumentController.importDocumentCategory);

// Văn bản tài liệu
router.get("/documents", auth, DocumentController.getDocuments);
router.get("/documents/:id", auth, DocumentController.showDocument);
router.post("/documents", auth, uploadFile(data, 'fields'), DocumentController.createDocument);
router.patch("/documents/:id", auth, uploadFile(data, 'fields'), DocumentController.editDocument);
router.delete("/documents/:id", auth, DocumentController.deleteDocument);
router.post("/documents/import-file", auth, DocumentController.importDocument);

// Thư mục lưu trữ
router.get('/document-archives', auth, DocumentController.getDocumnetArchive);
router.post('/document-archives', auth, DocumentController.createDocumentArchive);
router.post('/document-archives/delete-many', auth, DocumentController.deleteManyDocumentArchive);
router.patch('/document-archives/:id', auth, DocumentController.editDocumentArchive);
router.delete('/document-archives/:id', auth, DocumentController.deleteDocumentArchive);
router.post("/document-archives/import-file", auth, DocumentController.importDocumentArchive)

module.exports = router;
