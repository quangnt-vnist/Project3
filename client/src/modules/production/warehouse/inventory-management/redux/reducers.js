import { LotConstants } from './constants';

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
    listLots: [],
    lotDetail: "",
}

export function lots(state = initState, action){
    var index = -1;
    var indexPaginate = -1;

    switch(action.type){

        case LotConstants.GET_LOT_REQUEST:
        case LotConstants.GET_LOT_DETAIL_REQUEST:
        case LotConstants.EDIT_LOT_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case LotConstants.GET_LOT_SUCCESS:
            return {
                ...state,
                listLots: action.payload,
                isLoading: false
            }

        case LotConstants.GET_LOT_DETAIL_SUCCESS:
            return {
                ...state,
                lotDetail: action.payload,
                isLoading: false
            }
        
        case LotConstants.EDIT_LOT_SUCCESS:
            index = findIndex(state.listLots, action.payload._id);

            if(index !== -1){
                state.listLots[index] = action.payload
            }

            return {
                ...state,
                isLoading: false
            }

        case LotConstants.GET_LOT_FAILURE:
        case LotConstants.GET_LOT_DETAIL_FAILURE:
        case LotConstants.GET_LOT_DETAIL_FAILURE:
            return {
                ...state,
                isLoading: false
            }

        default:
            return state;
    }
}