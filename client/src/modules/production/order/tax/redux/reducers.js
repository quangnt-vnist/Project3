import { TaxConstants } from './constants';

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
    isLoading: false,
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    listTaxs: [],
    availabledTaxCode: false,
    listTaxsByCode: []
}

export function taxs(state = initState, action) {
    let index = -1;
    switch (action.type) {
        case TaxConstants.GET_ALL_TAXS_REQUEST:
            case TaxConstants.CREATE_TAX_REQUEST:
            case TaxConstants.GET_DETAIL_TAX_REQUEST:
            case TaxConstants.UPDATE_TAX_REQUEST:
            case TaxConstants.DISABLE_TAX_REQUEST:
            case TaxConstants.CHECK_TAX_CODE_REQUEST:
            case TaxConstants.GET_TAX_BY_CODE_REQUEST:
                return {
                    ...state,
                    isLoading: false
                }
            case TaxConstants.GET_ALL_TAXS_FAILURE:
                case TaxConstants.CREATE_TAX_FAILURE:
                case TaxConstants.GET_DETAIL_TAX_FAILURE:
                case TaxConstants.UPDATE_TAX_FAILURE:
                case TaxConstants.DISABLE_TAX_FAILURE:
                case TaxConstants.CHECK_TAX_CODE_FAILURE:
                case TaxConstants.GET_TAX_BY_CODE_FAILURE:
                return {
                    ...state,
                    isLoading: false,
                    error: action.error
                }
            case TaxConstants.GET_ALL_TAXS_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    listTaxs: action.payload.allTaxs.docs,
                    totalDocs: action.payload.allTaxs.totalDocs,
                    limit: action.payload.allTaxs.limit,
                    totalPages: action.payload.allTaxs.totalPages,
                    page: action.payload.allTaxs.page,
                    pagingCounter: action.payload.allTaxs.pagingCounter,
                    hasPrevPage: action.payload.allTaxs.hasPrevPage,
                    hasNextPage: action.payload.allTaxs.hasNextPage,
                    prevPage: action.payload.allTaxs.prevPage,
                    nextPage: action.payload.allTaxs.nextPage
                }
            case TaxConstants.CREATE_TAX_SUCCESS:
                console.log("PAYLOAD: ", action.payload.tax);
                return {
                    ...state,
                    listTaxs: [
                        ...state.listTaxs,
                        action.payload.tax
                    ],
                    isLoading: false
                }
            case TaxConstants.GET_DETAIL_TAX_SUCCESS:
                return {
                    ...state,
                    currentTax: action.payload.tax,
                    isLoading: false
                }
            case TaxConstants.UPDATE_TAX_SUCCESS:
                index = findIndex(state.listTaxs, action.payload.tax.code);
                if (index !== -1) {
                    state.listTaxs[index] = action.payload.tax
                }
                return {
                    ...state,
                    isLoading: false
                }
            case TaxConstants.DISABLE_TAX_SUCCESS:
                index = findIndex(state.listTaxs, action.payload);

                if(index !== -1){
                    state.listTaxs.splice(index, 1);
                }
                return {
                    ...state,
                    isLoading: false
                }
            case TaxConstants.CHECK_TAX_CODE_SUCCESS:
                return {
                    ...state,
                    availabledTaxCode: action.payload.checked,
                    isLoading: false
                }
            case TaxConstants.GET_TAX_BY_CODE_SUCCESS:
                return {
                    ...state,
                    listTaxsByCode: action.payload.taxs,
                    isLoading: false
                }
            default:
                return state
    }
}