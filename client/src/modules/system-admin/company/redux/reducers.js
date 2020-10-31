import { CompanyConstants } from "./constants";

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
    list: [],
    listPaginate: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    error: null,
    isLoading: true,
    item: {
        links: {
            isLoading: true,
            list: [],
            listPaginate: [],
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
        components: {
            isLoading: true,
            list: [],
            listPaginate: [],
            totalDocs: 0,
            limit: 0,
            totalPages: 0,
            page: 0,
            pagingCounter: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: 0,
            nextPage: 0,
        }
    },
    importConfiguration:{},
}

export function company(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    var indexLink = -1;
    var indexLinkPaginate = -1;

    switch (action.type) {
        case CompanyConstants.GET_COMPANIES_REQUEST:
        case CompanyConstants.GET_COMPANIES_PAGINATE_REQUEST:
        case CompanyConstants.CREATE_COMPANY_REQUEST:
        case CompanyConstants.EDIT_COMPANY_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        // component,link request of company (4)
        case CompanyConstants.GET_LINKS_LIST_OF_COMPANY_REQUEST:
        case CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_REQUEST:
        case CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_REQUEST:
        case CompanyConstants.DELETE_LINK_FOR_COMPANY_REQUEST:
            return {
                ...state,
                item: {
                    ...state.item,
                    links: {
                        ...state.item.links,
                        isLoading: true
                    }
                }
            }

        case CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_REQUEST:
        case CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_REQUEST:
        case CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_REQUEST:
        case CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_REQUEST:
            return {
                ...state,
                item: {
                    ...state.item,
                    components: {
                        ...state.item.components,
                        isLoading: true
                    }
                }
            }

        // component, link faile company (4)
        case CompanyConstants.GET_LINKS_LIST_OF_COMPANY_FAILE:
        case CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_FAILE:
        case CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_FAILE:
        case CompanyConstants.DELETE_LINK_FOR_COMPANY_FAILE:
            return {
                ...state,
                item: {
                    ...state.item,
                    links: {
                        ...state.item.links,
                        isLoading: false
                    }
                }
            }

        case CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_FAILE:
        case CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_FAILE:
        case CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_FAILE:
        case CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_FAILE:
            return {
                ...state,
                item: {
                    ...state.item,
                    components: {
                        ...state.item.components,
                        isLoading: false
                    }
                }
            }

        // component, link success company (4)
        case CompanyConstants.GET_LINKS_LIST_OF_COMPANY_SUCCESS:
            return {
                ...state,
                item: {
                    ...state.item,
                    links: {
                        ...state.item.links,
                        list: action.payload,
                        isLoading: false
                    }
                }
            };
        
        case CompanyConstants.GET_LINKS_PAGINATE_OF_COMPANY_SUCCESS:
            return {
                ...state,
                item: {
                    ...state.item,
                    links: {
                        ...state.item.links,
                        listPaginate: action.payload.docs,
                        totalDocs: action.payload.totalDocs,
                        limit: action.payload.limit,
                        totalPages: action.payload.totalPages,
                        page: action.payload.page,
                        pagingCounter: action.payload.pagingCounter,
                        hasPrevPage: action.payload.hasPrevPage,
                        hasNextPage: action.payload.hasNextPage,
                        prevPage: action.payload.prevPage,
                        nextPage: action.payload.nextPage,
                        isLoading: false
                    }
                }
            };
        
        case CompanyConstants.GET_COMPONENTS_LIST_OF_COMPANY_SUCCESS:
            return {
                ...state,
                item: {
                    ...state.item,
                    components: {
                        ...state.item.components,
                        list: action.payload,
                        isLoading: false
                    }
                }
            };
        
        case CompanyConstants.GET_COMPONENTS_PAGINATE_OF_COMPANY_SUCCESS:
            return {
                ...state,
                item: {
                    ...state.item,
                    components: {
                        ...state.item.components,
                        isLoading: false,
                        listPaginate: action.payload.docs,
                        totalDocs: action.payload.totalDocs,
                        limit: action.payload.limit,
                        totalPages: action.payload.totalPages,
                        page: action.payload.page,
                        pagingCounter: action.payload.pagingCounter,
                        hasPrevPage: action.payload.hasPrevPage,
                        hasNextPage: action.payload.hasNextPage,
                        prevPage: action.payload.prevPage,
                        nextPage: action.payload.nextPage
                    }
                }
            };

        case CompanyConstants.GET_COMPANIES_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };
        
        case CompanyConstants.GET_COMPANIES_PAGINATE_SUCCESS:
            return {
                ...state,
                listPaginate: action.payload.docs,
                totalDocs: action.payload.totalDocs,
                limit: action.payload.limit,
                totalPages: action.payload.totalPages,
                page: action.payload.page,
                pagingCounter: action.payload.pagingCounter,
                hasPrevPage: action.payload.hasPrevPage,
                hasNextPage: action.payload.hasNextPage,
                prevPage: action.payload.prevPage,
                nextPage: action.payload.nextPage,
                isLoading: false
            };

        case CompanyConstants.CREATE_COMPANY_SUCCESS:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload
                ],
                listPaginate: [
                    ...state.listPaginate,
                    action.payload
                ],
                isLoading: false
            };

        case CompanyConstants.EDIT_COMPANY_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            indexPaginate = findIndex(state.listPaginate, action.payload._id);
            if(index !== -1){
                state.list[index] = action.payload;
            }
            if(indexPaginate !== -1){
                state.listPaginate[indexPaginate] = action.payload;
            }
            return {
                ...state,
                isLoading: false
            };
        
        case CompanyConstants.ADD_NEW_LINK_FOR_COMPANY_SUCCESS:
            return {
                ...state,
                item: {
                    ...state.item,
                    links: {
                        ...state.item.links,
                        list: [
                            action.payload,
                            ...state.item.links.list
                        ],
                        listPaginate: [
                            action.payload,
                            ...state.item.links.listPaginate
                        ],
                        isLoading: false
                    }
                }
            }

        case CompanyConstants.ADD_NEW_COMPONENT_FOR_COMPANY_SUCCESS:
            return {
                ...state,
                item: {
                    ...state.item,
                    components: {
                        ...state.item.components,
                        list: [
                            action.payload,
                            ...state.item.components.list
                        ],
                        listPaginate: [
                            action.payload,
                            ...state.item.components.listPaginate
                        ],
                        isLoading: false
                    }
                }
            }

        case CompanyConstants.DELETE_LINK_FOR_COMPANY_SUCCESS:
            // Tìm index của link đó
            index = findIndex(state.item.links.list, action.payload); 
            indexPaginate = findIndex(state.item.links.listPaginate, action.payload);

            //Xóa link đó khỏi list các link của công ty
            state.item.links.list.splice(index, 1);
            state.item.links.listPaginate.splice(indexPaginate, 1);
            state.item.links.isLoading = false;
            return {...state};

        case CompanyConstants.DELETE_COMPONENT_FOR_COMPANY_SUCCESS:
            // Tìm index của component đó
            index = findIndex(state.item.components.list, action.payload); 
            indexPaginate = findIndex(state.item.components.listPaginate, action.payload);

            //Xóa component đó khỏi list các component của công ty
            state.item.components.list.splice(index, 1);
            state.item.components.listPaginate.splice(indexPaginate, 1);
            state.item.components.isLoading = false;
            return {...state};

        case CompanyConstants.GET_COMPANIES_FAILE:
        case CompanyConstants.GET_COMPANIES_PAGINATE_FAILE:
        case CompanyConstants.EDIT_COMPANY_FAILE:
        case CompanyConstants.CREATE_COMPANY_FAILE:
            return {
                ...state,
                isLoading: false
            };
        
        // reducers phần import File
        case CompanyConstants.GET_IMPORT_CONFIGURATION_REQUEST:
        case CompanyConstants.ADD_IMPORT_CONFIGURATION_REQUEST:
        case CompanyConstants.EDIT_IMPORT_CONFIGURATION_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case CompanyConstants.GET_IMPORT_CONFIGURATION_SUCCESS:
            return {
                ...state,
                importConfiguration:action.payload,
                isLoading: false
            };
        case CompanyConstants.ADD_IMPORT_CONFIGURATION_SUCCESS:
            return {
                ...state,
                importConfiguration:action.payload,
                isLoading: false
            };
        case CompanyConstants.EDIT_IMPORT_CONFIGURATION_SUCCESS:
            return {
                ...state,
                importConfiguration:action.payload,
                isLoading: false
            };
        case CompanyConstants.GET_IMPORT_CONFIGURATION_FAILE:
        case CompanyConstants.ADD_IMPORT_CONFIGURATION_FAILE:
        case CompanyConstants.EDIT_IMPORT_CONFIGURATION_FAILE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
        default:
            return state;
    }
}