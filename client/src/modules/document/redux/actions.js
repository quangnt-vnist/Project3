import { DocumentServices } from "./services";
import { DocumentConstants } from "./constants";
const FileDownload = require('js-file-download');

export const DocumentActions = {

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
    importDocumentDomain,

    getDocumentsUserCanView,
    getUserDocumentStatistics,

    getDocumentArchive,
    createDocumentArchive,
    editDocumentArchive,
    deleteDocumentArchive,
    importDocumentArchive,

};

function getDocuments(data) {
    // if (data.type === "paginate") {
    //     return dispatch => {
    //         dispatch({ type: DocumentConstants.PAGINATE_DOCUMENTS_REQUEST });
    //         DocumentServices.getDocuments(data)
    //             .then(res => {
    //                 dispatch({
    //                     type: DocumentConstants.PAGINATE_DOCUMENTS_SUCCESS,
    //                     payload: res.data.content
    //                 })
    //             })
    //             .catch(err => {
    //                 dispatch({ type: DocumentConstants.PAGINATE_DOCUMENTS_FAILE });

    //             })
    //     }
    // }
    return dispatch => {
        dispatch({
            type: DocumentConstants.GET_DOCUMENTS_REQUEST,
            calledId: data.calledId
        });
        DocumentServices.getDocuments(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.GET_DOCUMENTS_SUCCESS,
                    payload: res.data.content,
                    calledId: data.calledId
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.GET_DOCUMENTS_FAILE });

            })
    }
}

function createDocument(data) {
    return dispatch => {
        dispatch({ type: DocumentConstants.CREATE_DOCUMENT_REQUEST });
        DocumentServices.createDocument(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.CREATE_DOCUMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.CREATE_DOCUMENT_FAILE });
            })
    }
}

function increaseNumberView(id) {
    return dispatch => {
        dispatch({ type: DocumentConstants.INCREASE_NUMBER_VIEW_DOCUMENT_REQUEST });
        DocumentServices.increaseNumberView(id)
            .then(res => {
                dispatch({
                    type: DocumentConstants.INCREASE_NUMBER_VIEW_DOCUMENT_SUCCESS,
                    payload: id
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.INCREASE_NUMBER_VIEW_DOCUMENT_FAILE });
            })
    }
}

function editDocument(id, data, option = undefined) {
    return dispatch => {
        dispatch({ type: DocumentConstants.EDIT_DOCUMENT_REQUEST });
        switch (option) {
            case 'ADD_VERSION':
                DocumentServices.editDocument(id, data, option)
                    .then(res => {
                        dispatch({
                            type: DocumentConstants.ADD_VERSION_DOCUMENT_SUCCESS,
                            payload: res.data.content
                        })
                    })
                    .catch(err => {
                        dispatch({ type: DocumentConstants.ADD_VERSION_DOCUMENT_FAILE });
                    });
                break;
            case 'EDIT_VERSION':
                DocumentServices.editDocument(id, data, option)
                    .then(res => {
                        dispatch({
                            type: DocumentConstants.EDIT_VERSION_DOCUMENT_SUCCESS,
                            payload: res.data.content
                        })
                    })
                    .catch(err => {
                        dispatch({ type: DocumentConstants.EDIT_VERSION_DOCUMENT_FAILE });
                    });
                break;
            case 'DELETE_VERSION':
                DocumentServices.editDocument(id, data, option)
                    .then(res => {
                        dispatch({
                            type: DocumentConstants.DELETE_VERSION_DOCUMENT_SUCCESS,
                            payload: res.data.content
                        })
                    })
                    .catch(err => {
                        dispatch({ type: DocumentConstants.DELETE_VERSION_DOCUMENT_FAILE });
                    });
                break;



            default:
                DocumentServices.editDocument(id, data)
                    .then(res => {
                        dispatch({
                            type: DocumentConstants.EDIT_DOCUMENT_SUCCESS,
                            payload: res.data.content
                        })
                    })
                    .catch(err => {
                        dispatch({ type: DocumentConstants.EDIT_DOCUMENT_FAILE });
                    });
        }
    }
}

function deleteDocument(id) {
    return dispatch => {
        dispatch({ type: DocumentConstants.DELETE_DOCUMENT_REQUEST });
        DocumentServices.deleteDocument(id)
            .then(res => {
                dispatch({
                    type: DocumentConstants.DELETE_DOCUMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.DELETE_DOCUMENT_FAILE });
            });
    }
}

function importDocument(data) {
    return dispatch => {
        dispatch({ type: DocumentConstants.IMPORT_DOCUMENT_REQUEST });
        DocumentServices.importDocument(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.IMPORT_DOCUMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.IMPORT_DOCUMENT_FAILE });
            })
    }
}
function downloadDocumentFile(id, fileName, numberVersion) {
    return dispatch => {
        dispatch({ type: DocumentConstants.DOWNLOAD_DOCUMENT_FILE_REQUEST });
        DocumentServices.downloadDocumentFile(id, numberVersion)
            .then(res => {
                dispatch({ type: DocumentConstants.DOWNLOAD_DOCUMENT_FILE_SUCCESS });
                const content = res.headers['content-type'];
                FileDownload(res.data, fileName, content)
            })
            .catch(err => { dispatch({ type: DocumentConstants.DOWNLOAD_DOCUMENT_FILE_FAILE }) })
    }
}

function downloadDocumentFileScan(id, fileName, numberVersion) {
    return dispatch => {
        dispatch({ type: DocumentConstants.DOWNLOAD_DOCUMENT_FILE_SCAN_REQUEST });
        DocumentServices.downloadDocumentFileScan(id, numberVersion)
            .then(res => {
                dispatch({ type: DocumentConstants.DOWNLOAD_DOCUMENT_FILE_SCAN_SUCCESS });
                const content = res.headers['content-type'];
                FileDownload(res.data, fileName, content)
            })
            .catch(err => { dispatch({ type: DocumentConstants.DOWNLOAD_DOCUMENT_FILE_SCAN_FAILE }) })
    }
}

function getDocumentCategories(data) {
    if (data !== undefined) {
        return dispatch => {
            dispatch({ type: DocumentConstants.PAGINATE_DOCUMENT_CATEGORIES_REQUEST });
            DocumentServices.getDocumentCategories(data)
                .then(res => {
                    dispatch({
                        type: DocumentConstants.PAGINATE_DOCUMENT_CATEGORIES_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({ type: DocumentConstants.PAGINATE_DOCUMENT_CATEGORIES_FAILE });
                })
        }
    }
    return dispatch => {
        dispatch({ type: DocumentConstants.GET_DOCUMENT_CATEGORIES_REQUEST });
        DocumentServices.getDocumentCategories()
            .then(res => {
                dispatch({
                    type: DocumentConstants.GET_DOCUMENT_CATEGORIES_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.GET_DOCUMENT_CATEGORIES_FAILE });

            })
    }
}

function createDocumentCategory(data) {
    return dispatch => {
        dispatch({ type: DocumentConstants.CREATE_DOCUMENT_CATEGORY_REQUEST });
        DocumentServices.createDocumentCategory(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.CREATE_DOCUMENT_CATEGORY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.CREATE_DOCUMENT_CATEGORY_FAILE });
            })
    }
}

function editDocumentCategory(id, data) {
    return dispatch => {
        dispatch({ type: DocumentConstants.EDIT_DOCUMENT_CATEGORY_REQUEST });
        DocumentServices.editDocumentCategory(id, data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.EDIT_DOCUMENT_CATEGORY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.EDIT_DOCUMENT_CATEGORY_FAILE });
            })
    }
}


function deleteDocumentCategory(id) {
    return dispatch => {
        dispatch({ type: DocumentConstants.DELETE_DOCUMENT_CATEGORY_REQUEST });
        DocumentServices.deleteDocumentCategory(id)
            .then(res => {
                dispatch({
                    type: DocumentConstants.DELETE_DOCUMENT_CATEGORY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.DELETE_DOCUMENT_CATEGORY_FAILE });
            })
    }
}
function importDocumentCategory(data) {
    return dispatch => {
        dispatch({ type: DocumentConstants.IMPORT_DOCUMENT_CATEGORY_REQUEST });
        DocumentServices.importDocumentCategory(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.IMPORT_DOCUMENT_CATEGORY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.IMPORT_DOCUMENT_CATEGORY_FAILE });
            })
    }
}

function getDocumentDomains() {
    return dispatch => {
        dispatch({ type: DocumentConstants.GET_DOCUMENT_DOMAINS_REQUEST });
        DocumentServices.getDocumentDomains()
            .then(res => {
                dispatch({
                    type: DocumentConstants.GET_DOCUMENT_DOMAINS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.GET_DOCUMENT_DOMAINS_FAILE });

            })
    }
}

function createDocumentDomain(data) {
    return dispatch => {
        dispatch({ type: DocumentConstants.CREATE_DOCUMENT_DOMAIN_REQUEST });
        DocumentServices.createDocumentDomain(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.CREATE_DOCUMENT_DOMAIN_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.CREATE_DOCUMENT_DOMAIN_FAILE });
            })
    }
}

function editDocumentDomain(id, data) {
    return dispatch => {
        dispatch({ type: DocumentConstants.EDIT_DOCUMENT_DOMAIN_REQUEST });
        DocumentServices.editDocumentDomain(id, data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.EDIT_DOCUMENT_DOMAIN_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.EDIT_DOCUMENT_DOMAIN_FAILE });
            })
    }
}

function deleteDocumentDomain(data, type = "single") {
    return dispatch => {
        dispatch({ type: DocumentConstants.DELETE_DOCUMENT_DOMAIN_REQUEST });
        if (type !== 'single') {
            DocumentServices.deleteManyDocumentDomain(data)
                .then(res => {
                    dispatch({
                        type: DocumentConstants.DELETE_DOCUMENT_DOMAIN_SUCCESS,
                        payload: {
                            list: res.data.content.list,
                            tree: res.data.content.tree
                        }
                    })
                })
                .catch(err => {
                    dispatch({ type: DocumentConstants.DELETE_DOCUMENT_DOMAIN_FAILE });
                })
        } else {
            DocumentServices.deleteDocumentDomain(data)
                .then(res => {
                    dispatch({
                        type: DocumentConstants.DELETE_DOCUMENT_DOMAIN_SUCCESS,
                        payload: {
                            list: res.data.content.list,
                            tree: res.data.content.tree
                        }
                    })
                })
                .catch(err => {
                    dispatch({ type: DocumentConstants.DELETE_DOCUMENT_DOMAIN_FAILE });
                })
        }
    }
}

function importDocumentDomain(data) {
    return dispatch => {
        dispatch({ type: DocumentConstants.IMPORT_DOCUMENT_DOMAIN_REQUEST });
        DocumentServices.importDocumentDomain(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.IMPORT_DOCUMENT_DOMAIN_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.IMPORT_DOCUMENT_DOMAIN_FAILE });
            })
    }
}

function getDocumentsUserCanView(roleId, data = undefined) {
    if (data !== undefined) {
        return dispatch => {
            dispatch({ type: DocumentConstants.PAGINATE_DOCUMENTS_USER_CAN_VIEW_REQUEST });
            DocumentServices.getDocumentsUserCanView(roleId, data)
                .then(res => {
                    dispatch({
                        type: DocumentConstants.PAGINATE_DOCUMENTS_USER_CAN_VIEW_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({ type: DocumentConstants.PAGINATE_DOCUMENTS_USER_CAN_VIEW_FAILE });
                })
        }
    }
    return dispatch => {
        dispatch({ type: DocumentConstants.GET_DOCUMENTS_USER_CAN_VIEW_REQUEST });
        DocumentServices.getDocumentsUserCanView(roleId)
            .then(res => {
                dispatch({
                    type: DocumentConstants.GET_DOCUMENTS_USER_CAN_VIEW_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.GET_DOCUMENTS_USER_CAN_VIEW_FAILE });
            })
    }
}

function getUserDocumentStatistics(option, data) {
    switch (option) {
        case 'downloaded':
            return dispatch => {
                dispatch({ type: DocumentConstants.GET_DOCUMENT_STATISTICS_DOWNLOADED_REQUEST });
                DocumentServices.getUserDocumentStatistics({ option }, data)
                    .then(res => {
                        dispatch({
                            type: DocumentConstants.GET_DOCUMENT_STATISTICS_DOWNLOADED_SUCCESS,
                            payload: res.data.content
                        })
                    })
                    .catch(err => {
                        dispatch({ type: DocumentConstants.GET_DOCUMENT_STATISTICS_DOWNLOADED_FAILE });

                    })
            }
        case 'common':
            return dispatch => {
                dispatch({ type: DocumentConstants.GET_DOCUMENT_STATISTICS_COMMON_REQUEST });
                DocumentServices.getUserDocumentStatistics({ option }, data)
                    .then(res => {
                        dispatch({
                            type: DocumentConstants.GET_DOCUMENT_STATISTICS_COMMON_SUCCESS,
                            payload: res.data.content
                        })
                    })
                    .catch(err => {
                        dispatch({ type: DocumentConstants.GET_DOCUMENT_STATISTICS_COMMON_FAILE });

                    })
            }
        case 'latest':
            return dispatch => {
                dispatch({ type: DocumentConstants.GET_DOCUMENT_STATISTICS_LATEST_REQUEST });
                DocumentServices.getUserDocumentStatistics({ option }, data)
                    .then(res => {
                        dispatch({
                            type: DocumentConstants.GET_DOCUMENT_STATISTICS_LATEST_SUCCESS,
                            payload: res.data.content
                        })
                    })
                    .catch(err => {
                        dispatch({ type: DocumentConstants.GET_DOCUMENT_STATISTICS_LATEST_FAILE });

                    })
            }
    }

};

function getDocumentArchive() {
    return dispatch => {
        dispatch({ type: DocumentConstants.GET_DOCUMENT_ARCHIVE_REQUEST });
        DocumentServices.getDocumentArchives()
            .then(res => {
                dispatch({
                    type: DocumentConstants.GET_DOCUMENT_ARCHIVE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.GET_DOCUMENT_ARCHIVE_FAILE });
            })
    }
};

function createDocumentArchive(data) {

    return dispatch => {
        dispatch({ type: DocumentConstants.GET_DOCUMENT_ARCHIVE_REQUEST });
        DocumentServices.createDocumentArchives(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.CREATE_DOCUMENT_ARCHIVE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.CREATE_DOCUMENT_ARCHIVE_FAILE });
            })
    }
};

function editDocumentArchive(id, data) {

    return dispatch => {
        dispatch({ type: DocumentConstants.EDIT_DOCUMENT_ARCHIVE_REQUEST });
        DocumentServices.editDocumentArchives(id, data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.EDIT_DOCUMENT_ARCHIVE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.EDIT_DOCUMENT_CATEGORY_FAILE })
            })
    }
};

function deleteDocumentArchive(data, type = "single") {
    console.log('dataaa', data, type);
    return dispatch => {
        dispatch({ type: DocumentConstants.DELETE_DOCUMENT_ARCHIVE_REQUEST });
        if (type !== 'single') {
            DocumentServices.deleteManyDocumentArchives(data)
                .then(res => {
                    dispatch({
                        type: DocumentConstants.DELETE_DOCUMENT_ARCHIVE_SUCCESS,
                        payload: {
                            list: res.data.content.list,
                            tree: res.data.content.tree
                        }
                    })
                })
                .catch(err => {
                    dispatch({ type: DocumentConstants.DELETE_DOCUMENT_ARCHIVE_FAILE });
                })
        } else {
            DocumentServices.deleteDocumentArchives(data)
                .then(res => {
                    dispatch({
                        type: DocumentConstants.DELETE_DOCUMENT_ARCHIVE_SUCCESS,
                        payload: {
                            list: res.data.content.list,
                            tree: res.data.content.tree
                        }
                    })
                })
                .catch(err => {
                    dispatch({
                        type: DocumentConstants.DELETE_DOCUMENT_ARCHIVE_FAILE,
                    })
                })
        }
    }
}

function importDocumentArchive(data) {
    return dispatch => {
        dispatch({ type: DocumentConstants.IMPORT_DOCUMENT_DOMAIN_REQUEST });
        DocumentServices.importDocumentArchive(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.IMPORT_DOCUMENT_DOMAIN_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.IMPORT_DOCUMENT_DOMAIN_FAILE });
            })
    }
}

