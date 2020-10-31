import { sendRequest } from '../../../helpers/requestHelper';

export const DocumentServices = {
    getDocuments,
    createDocument,
    editDocument,
    downloadDocumentFile,
    downloadDocumentFileScan,
    increaseNumberView,
    deleteDocument,
    importDocument,

    getDocumentCategories,
    createDocumentCategory,
    editDocumentCategory,
    deleteDocumentCategory,
    importDocumentCategory,

    getDocumentDomains,
    createDocumentDomain,
    editDocumentDomain,
    deleteDocumentDomain,
    deleteManyDocumentDomain,
    importDocumentDomain,

    getDocumentsUserCanView,
    getUserDocumentStatistics,

    getDocumentArchives,
    createDocumentArchives,
    editDocumentArchives,
    deleteDocumentArchives,
    deleteManyDocumentArchives,
    importDocumentArchive,

};

function getDocuments(params = undefined) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/documents`,
        method: 'GET',
        params,
    }, false, true, 'document');
}

function createDocument(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/documents`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function deleteDocument(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/documents/${id}`,
        method: 'DELETE'
    }, true, true, 'document');
}

function increaseNumberView(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/documents/${id}/increase-number-view`,
        method: 'PATCH',
    }, false, false, 'document');
}

function editDocument(id, data, option = undefined) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/documents/${id}`,
        method: 'PATCH',
        data,
        params: { option },
    }, true, true, 'document');
}

function downloadDocumentFile(id, numberVersion) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/documents/${id}/download-file`,
        method: 'GET',
        responseType: 'blob',
        params: {
            numberVersion: numberVersion
        }
    }, false, true, 'document');
}

function importDocument(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/documents/import-file`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function downloadDocumentFileScan(id, numberVersion) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/documents/${id}/download-file-scan`,
        method: 'GET',
        responseType: 'blob',
        params: {
            numberVersion: numberVersion
        }
    }, false, true, 'document');
}

function getDocumentCategories(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-categories`,
        method: 'GET',
        params
    }, false, true, 'document');
}

function createDocumentCategory(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-categories`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function editDocumentCategory(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-categories/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'document');
}

function deleteDocumentCategory(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-categories/${id}`,
        method: 'DELETE'
    }, true, true, 'document');
}

// Danh mục văn bản - domain
function getDocumentDomains() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-domains`,
        method: 'GET',
    }, false, true, 'document');
}

function createDocumentDomain(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-domains`,
        method: 'POST',
        data,
    }, true, true, 'document');
}
function importDocumentCategory(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-categories/import-file`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function editDocumentDomain(id, data) {

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-domains/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'document');
}

function deleteDocumentDomain(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-domains/${id}`,
        method: 'DELETE',
    }, true, true, 'document');
}

function deleteManyDocumentDomain(array) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-domains/delete-many`,
        method: 'POST',
        data: { array }
    }, true, true, 'document');
}

function importDocumentDomain(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-domains/import-file`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function getDocumentsUserCanView(roleId, params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/documents/permission-view`,
        method: 'GET',
        params: {
            ...params,
            roleId: roleId,
        },
    }, false, true, 'document');
}

function getUserDocumentStatistics(params, data) {
    let x;
    x = {
        ...data,
        option: params.option
    }
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/documents/user-statistical`,
        method: 'GET',
        params: x
    }, false, true, 'document');
}

// Lưu trữ
function getDocumentArchives() {

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-archives`,
        method: 'GET',
    }, false, false, 'document')
};

function createDocumentArchives(data) {

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-archives`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function editDocumentArchives(id, data) {

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-archives/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'document');
}

function deleteDocumentArchives(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-archives/${id}`,
        method: 'DELETE',
    }, true, true, 'document');
}

function deleteManyDocumentArchives(array) {

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-archives/delete-many`,
        method: 'POST',
        data: { array }
    }, true, true, 'document');
}

function importDocumentArchive(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/documents/document-archives/import-file`,
        method: 'POST',
        data,
    }, true, true, 'document');
}