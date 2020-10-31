import { DocumentConstants } from "./constants";

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initState = {
    value: {},
    isLoading: false,
    administration: {
        categories: {
            list: [], paginate: [],
            totalDocs: 0,
            limit: 0,
            totalPages: 0,
            page: 0,
            pagingCounter: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: 0,
            nextPage: 0,
        },

        domains: {
            list: [],
            tree: []
        },
        archives: {
            list: [],
            tree: []
        },

        data: {
            list: [], paginate: [],
            totalDocs: 0,
            limit: 0,
            totalPages: 0,
            page: 0,
            pagingCounter: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: 0,
            nextPage: 0,

            user_manage: []
        },
        relationshipDocs: {
            paginate: [],
            totalDocs: 0,
            limit: 0,
            totalPages: 0,
            page: 0,
            pagingCounter: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: 0,
            nextPage: 0,

            user_manage: []
        },
    },
    user: {
        data: {
            list: [], paginate: [],
            totalDocs: 0,
            limit: 0,
            totalPages: 0,
            page: 0,
            pagingCounter: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: 0,
            nextPage: 0,

            user_manage: []
        },
        downloaded: [],
        common: [],
        latest: []
    }
}

export function documents(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {
        case DocumentConstants.GET_DOCUMENTS_REQUEST:
        case DocumentConstants.PAGINATE_DOCUMENTS_REQUEST:
        case DocumentConstants.CREATE_DOCUMENT_REQUEST:
        case DocumentConstants.GET_DOCUMENT_CATEGORIES_REQUEST:
        case DocumentConstants.PAGINATE_DOCUMENT_CATEGORIES_REQUEST:
        case DocumentConstants.CREATE_DOCUMENT_CATEGORY_REQUEST:
        case DocumentConstants.GET_DOCUMENT_DOMAINS_REQUEST:
        case DocumentConstants.CREATE_DOCUMENT_DOMAIN_REQUEST:
        case DocumentConstants.EDIT_DOCUMENT_REQUEST:
        case DocumentConstants.DOWNLOAD_DOCUMENT_FILE_REQUEST:
        case DocumentConstants.DOWNLOAD_DOCUMENT_FILE_SCAN_REQUEST:
        case DocumentConstants.INCREASE_NUMBER_VIEW_DOCUMENT_REQUEST:
        case DocumentConstants.DELETE_DOCUMENT_REQUEST:
        case DocumentConstants.EDIT_DOCUMENT_CATEGORY_REQUEST:
        case DocumentConstants.DELETE_DOCUMENT_CATEGORY_REQUEST:
        case DocumentConstants.DELETE_DOCUMENT_DOMAIN_REQUEST:
        case DocumentConstants.GET_DOCUMENTS_USER_CAN_VIEW_REQUEST:
        case DocumentConstants.PAGINATE_DOCUMENTS_USER_CAN_VIEW_REQUEST:
        case DocumentConstants.GET_DOCUMENT_STATISTICS_DOWNLOADED_REQUEST:
        case DocumentConstants.GET_DOCUMENT_STATISTICS_COMMON_REQUEST:
        case DocumentConstants.GET_DOCUMENT_STATISTICS_LATEST_REQUEST:
        case DocumentConstants.GET_DOCUMENT_ARCHIVE_REQUEST:
        case DocumentConstants.CREATE_DOCUMENT_ARCHIVE_REQUEST:
        case DocumentConstants.IMPORT_DOCUMENT_DOMAIN_REQUEST:
        case DocumentConstants.IMPORT_DOCUMENT_ARCHIVE_REQUEST:
        case DocumentConstants.IMPORT_DOCUMENT_CATEGORY_REQUEST:
        case DocumentConstants.IMPORT_DOCUMENT_REQUEST:
            return {
                ...state,
                isLoading: true,
            }

        case DocumentConstants.GET_DOCUMENTS_FAILE:
        case DocumentConstants.PAGINATE_DOCUMENTS_FAILE:
        case DocumentConstants.CREATE_DOCUMENT_FAILE:
        case DocumentConstants.EDIT_DOCUMENT_FAILE:
        case DocumentConstants.GET_DOCUMENT_CATEGORIES_FAILE:
        case DocumentConstants.CREATE_DOCUMENT_CATEGORY_FAILE:
        case DocumentConstants.GET_DOCUMENT_DOMAINS_FAILE:
        case DocumentConstants.CREATE_DOCUMENT_DOMAIN_FAILE:
        case DocumentConstants.DOWNLOAD_DOCUMENT_FILE_FAILE:
        case DocumentConstants.DOWNLOAD_DOCUMENT_FILE_SCAN_FAILE:
        case DocumentConstants.INCREASE_NUMBER_VIEW_DOCUMENT_FAILE:
        case DocumentConstants.ADD_VERSION_DOCUMENT_FAILE:
        case DocumentConstants.DELETE_DOCUMENT_FAILE:
        case DocumentConstants.DELETE_DOCUMENT_CATEGORY_FAILE:
        case DocumentConstants.DELETE_DOCUMENT_DOMAIN_FAILE:
        case DocumentConstants.EDIT_DOCUMENT_CATEGORY_FAILE:
        case DocumentConstants.PAGINATE_DOCUMENT_CATEGORIES_FAILE:
        case DocumentConstants.GET_DOCUMENTS_USER_CAN_VIEW_FAILE:
        case DocumentConstants.PAGINATE_DOCUMENTS_USER_CAN_VIEW_FAILE:
        case DocumentConstants.GET_DOCUMENT_STATISTICS_DOWNLOADED_FAILE:
        case DocumentConstants.GET_DOCUMENT_STATISTICS_COMMON_FAILE:
        case DocumentConstants.GET_DOCUMENT_STATISTICS_LATEST_FAILE:
        case DocumentConstants.GET_DOCUMENT_ARCHIVE_FAILE:
        case DocumentConstants.CREATE_DOCUMENT_ARCHIVE_FAILE:
        case DocumentConstants.IMPORT_DOCUMENT_DOMAIN_FAILE:
        case DocumentConstants.IMPORT_DOCUMENT_ARCHIVE_FAILE:
        case DocumentConstants.IMPORT_DOCUMENT_CATEGORY_FAILE:
        case DocumentConstants.IMPORT_DOCUMENT_FAILE:
        case DocumentConstants.EDIT_VERSION_DOCUMENT_FAILE:
        case DocumentConstants.DELETE_VERSION_DOCUMENT_FAILE:
            return {
                ...state,
                isLoading: false,
            }

        case DocumentConstants.DOWNLOAD_DOCUMENT_FILE_SUCCESS:
        case DocumentConstants.DOWNLOAD_DOCUMENT_FILE_SCANSUCCESS:
            return {
                ...state,
                isLoading: false
            };

        case DocumentConstants.GET_DOCUMENT_STATISTICS_DOWNLOADED_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: {
                    ...state.user,
                    downloaded: {
                        ...state.user.data,
                        paginate: action.payload.docs,
                        totalDocs: action.payload.totalDocs,
                        limit: action.payload.limit,
                        totalPages: action.payload.totalPages,
                        page: action.payload.page,
                        pagingCounter: action.payload.pagingCounter,
                        hasPrevPage: action.payload.hasPrevPage,
                        hasNextPage: action.payload.hasNextPage,
                        prevPage: action.payload.prevPage,
                        nextPage: action.payload.nextPage,
                    }
                }
            };

        case DocumentConstants.GET_DOCUMENT_STATISTICS_COMMON_SUCCESS:

            return {
                ...state,
                isLoading: false,
                user: {
                    ...state.user,
                    common: {
                        ...state.user.data,
                        paginate: action.payload.docs,
                        totalDocs: action.payload.totalDocs,
                        limit: action.payload.limit,
                        totalPages: action.payload.totalPages,
                        page: action.payload.page,
                        pagingCounter: action.payload.pagingCounter,
                        hasPrevPage: action.payload.hasPrevPage,
                        hasNextPage: action.payload.hasNextPage,
                        prevPage: action.payload.prevPage,
                        nextPage: action.payload.nextPage,
                    }
                }
            };
        case DocumentConstants.GET_DOCUMENT_STATISTICS_LATEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: {
                    ...state.user,
                    latest: {
                        ...state.user.data,
                        paginate: action.payload.docs,
                        totalDocs: action.payload.totalDocs,
                        limit: action.payload.limit,
                        totalPages: action.payload.totalPages,
                        page: action.payload.page,
                        pagingCounter: action.payload.pagingCounter,
                        hasPrevPage: action.payload.hasPrevPage,
                        hasNextPage: action.payload.hasNextPage,
                        prevPage: action.payload.prevPage,
                        nextPage: action.payload.nextPage,
                    }
                }
            };
        case DocumentConstants.INCREASE_NUMBER_VIEW_DOCUMENT_SUCCESS:
            indexPaginate = findIndex(state.administration.data.paginate, action.payload);
            if (indexPaginate !== -1) state.administration.data.paginate[indexPaginate].numberOfView += 1;
            return {
                ...state,
                isLoading: false
            };

        case DocumentConstants.GET_DOCUMENTS_SUCCESS:

            if (action.calledId === "all") {
                return {
                    ...state,
                    isLoading: false,
                    administration: {
                        ...state.administration,
                        data: {
                            ...state.administration.data,
                            list: action.payload
                        }
                    }
                };
            }
            else if (action.calledId === "relationshipDocs") {
                return {
                    ...state,
                    isLoading: false,
                    administration: {
                        ...state.administration,
                        relationshipDocs: {
                            ...state.administration.relationshipDocs,
                            paginate: action.payload.docs,
                            totalDocs: action.payload.totalDocs,
                            limit: action.payload.limit,
                            totalPages: action.payload.totalPages,
                            page: action.payload.page,
                            pagingCounter: action.payload.pagingCounter,
                            hasPrevPage: action.payload.hasPrevPage,
                            hasNextPage: action.payload.hasNextPage,
                            prevPage: action.payload.prevPage,
                            nextPage: action.payload.nextPage,
                        }
                    }
                };
            }
            else {
                return {
                    ...state,
                    isLoading: false,
                    administration: {
                        ...state.administration,
                        data: {
                            ...state.administration.data,
                            paginate: action.payload.docs,
                            totalDocs: action.payload.totalDocs,
                            limit: action.payload.limit,
                            totalPages: action.payload.totalPages,
                            page: action.payload.page,
                            pagingCounter: action.payload.pagingCounter,
                            hasPrevPage: action.payload.hasPrevPage,
                            hasNextPage: action.payload.hasNextPage,
                            prevPage: action.payload.prevPage,
                            nextPage: action.payload.nextPage,
                        }
                    }
                };
            }

        case DocumentConstants.IMPORT_DOCUMENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    data: {
                        ...state.administration.data,
                        list: action.payload
                    }
                }
            };

        case DocumentConstants.GET_DOCUMENTS_USER_CAN_VIEW_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: {
                    ...state.user,
                    data: {
                        ...state.user.data,
                        list: action.payload
                    }
                }
            };

        case DocumentConstants.PAGINATE_DOCUMENTS_USER_CAN_VIEW_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: {
                    ...state.user,
                    data: {
                        ...state.user.data,
                        paginate: action.payload.docs,
                        totalDocs: action.payload.totalDocs,
                        limit: action.payload.limit,
                        totalPages: action.payload.totalPages,
                        page: action.payload.page,
                        pagingCounter: action.payload.pagingCounter,
                        hasPrevPage: action.payload.hasPrevPage,
                        hasNextPage: action.payload.hasNextPage,
                        prevPage: action.payload.prevPage,
                        nextPage: action.payload.nextPage,
                    }
                }
            };

        case DocumentConstants.PAGINATE_DOCUMENTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    data: {
                        ...state.administration.data,
                        paginate: action.payload.docs,
                        totalDocs: action.payload.totalDocs,
                        limit: action.payload.limit,
                        totalPages: action.payload.totalPages,
                        page: action.payload.page,
                        pagingCounter: action.payload.pagingCounter,
                        hasPrevPage: action.payload.hasPrevPage,
                        hasNextPage: action.payload.hasNextPage,
                        prevPage: action.payload.prevPage,
                        nextPage: action.payload.nextPage,
                    }
                }
            };


        case DocumentConstants.PAGINATE_DOCUMENT_CATEGORIES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    categories: {
                        ...state.administration.categories,
                        paginate: action.payload.docs,
                        totalDocs: action.payload.totalDocs,
                        limit: action.payload.limit,
                        totalPages: action.payload.totalPages,
                        page: action.payload.page,
                        pagingCounter: action.payload.pagingCounter,
                        hasPrevPage: action.payload.hasPrevPage,
                        hasNextPage: action.payload.hasNextPage,
                        prevPage: action.payload.prevPage,
                        nextPage: action.payload.nextPage,
                    }
                }
            };

        case DocumentConstants.CREATE_DOCUMENT_SUCCESS:


            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    data: {
                        ...state.administration.data,
                        list: [
                            action.payload,
                            ...state.administration.data.list
                        ],
                        paginate: [
                            ...state.administration.data.paginate,
                            action.payload
                        ]
                    }
                }
            };

        case DocumentConstants.EDIT_DOCUMENT_SUCCESS:
        case DocumentConstants.ADD_VERSION_DOCUMENT_SUCCESS:
        case DocumentConstants.EDIT_VERSION_DOCUMENT_SUCCESS:
        case DocumentConstants.DELETE_VERSION_DOCUMENT_SUCCESS:
            index = findIndex(state.administration.data.list, action.payload._id);
            if (index !== -1) state.administration.data.list[index] = action.payload;
            indexPaginate = findIndex(state.administration.data.paginate, action.payload._id);
            if (indexPaginate !== -1) state.administration.data.paginate[indexPaginate] = action.payload;
            return {
                ...state,
                isLoading: false
            };

        case DocumentConstants.DELETE_DOCUMENT_SUCCESS:
            index = findIndex(state.administration.data.list, action.payload._id);
            if (index !== -1) state.administration.data.list.splice(index, 1);
            indexPaginate = findIndex(state.administration.data.paginate, action.payload._id);
            if (indexPaginate !== -1) state.administration.data.paginate.splice(indexPaginate, 1);
            return {
                ...state,
                isLoading: false
            };

        case DocumentConstants.GET_DOCUMENT_CATEGORIES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    categories: {
                        ...state.administration.categories,
                        list: action.payload
                    }
                }
            };

        case DocumentConstants.CREATE_DOCUMENT_CATEGORY_SUCCESS:
        case DocumentConstants.IMPORT_DOCUMENT_CATEGORY_SUCCESS:


            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    categories: {
                        ...state.administration.categories,
                        list: [
                            action.payload,
                            ...state.administration.categories.list
                        ],
                        paginate: [
                            action.payload,
                            ...state.administration.categories.paginate
                        ]
                    }
                }
            };

        case DocumentConstants.EDIT_DOCUMENT_CATEGORY_SUCCESS:
            index = findIndex(state.administration.categories.list, action.payload._id);
            if (index !== -1) state.administration.categories.list[index] = action.payload;
            indexPaginate = findIndex(state.administration.categories.paginate, action.payload._id);
            if (indexPaginate !== -1) state.administration.categories.paginate[indexPaginate] = action.payload;
            return {
                ...state,
                isLoading: false
            };

        case DocumentConstants.EDIT_DOCUMENT_DOMAIN_SUCCESS:
            index = findIndex(state.administration.domains.list, action.payload._id);
            if (index !== -1) state.administration.domains.list[index] = action.payload;
            indexPaginate = findIndex(state.administration.domains.paginate, action.payload._id);
            if (indexPaginate !== -1) state.administration.domains.paginate[indexPaginate] = action.payload;
            return {
                ...state,
                isLoading: false
            };

        case DocumentConstants.DELETE_DOCUMENT_CATEGORY_SUCCESS:
            index = findIndex(state.administration.categories.list, action.payload);
            if (index !== -1) state.administration.categories.list.splice(index, 1);
            indexPaginate = findIndex(state.administration.categories.paginate, action.payload);
            if (indexPaginate !== -1) state.administration.categories.paginate.splice(indexPaginate, 1);
            return {
                ...state,
                isLoading: false
            };

        case DocumentConstants.DELETE_DOCUMENT_DOMAIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    domains: action.payload
                }
            };

        case DocumentConstants.GET_DOCUMENT_DOMAINS_SUCCESS:
        case DocumentConstants.CREATE_DOCUMENT_DOMAIN_SUCCESS:
        case DocumentConstants.IMPORT_DOCUMENT_DOMAIN_SUCCESS:
        case DocumentConstants.IMPORT_DOCUMENT_ARCHIVE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    domains: action.payload
                }
            };
        case DocumentConstants.GET_DOCUMENT_ARCHIVE_SUCCESS:
        case DocumentConstants.CREATE_DOCUMENT_ARCHIVE_SUCCESS:
        case DocumentConstants.EDIT_DOCUMENT_ARCHIVE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    archives: action.payload
                }
            };


        // index = findIndex(state.administration.archives.list, action.payload._id);
        // if (index !== -1) state.administration.archives.list[index] = action.payload;
        // indexPaginate = findIndex(state.administration.archives.paginate, action.payload._id);
        // if (indexPaginate !== -1) state.administration.archives.paginate[indexPaginate] = action.payload;
        // return {
        //     ...state,
        //     isLoading: false
        // };
        case DocumentConstants.DELETE_DOCUMENT_ARCHIVE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    archives: action.payload
                }
            };

        default:
            return state;
    }
}