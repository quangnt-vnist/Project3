import {
    AnnualLeaveConstants
} from './constants';
const initState = {
    isLoading: false,
    numberAnnulLeave: 0,
    listAnnualLeavesOfOneYear: [],

    listAnnualLeaves: [],
    totalList: 0,

    totalListAnnualLeavesOfYear: 0,
    arrMonth: [],
    listAnnualLeaveOfNumberMonth: [],
    error: "",
}
export function annualLeave(state = initState, action) {
    switch (action.type) {
        case AnnualLeaveConstants.GET_ANNUAL_LEAVE_REQUEST:
        case AnnualLeaveConstants.CREATE_ANNUAL_LEAVE_REQUEST:
        case AnnualLeaveConstants.DELETE_ANNUAL_LEAVE_REQUEST:
        case AnnualLeaveConstants.UPDATE_ANNUAL_LEAVE_REQUEST:
            return {
                ...state,
                isLoading: true,
                    arrMonth: [],
            };
        case AnnualLeaveConstants.GET_ANNUAL_LEAVE_SUCCESS:
            if (action.payload.numberAnnulLeave !== undefined) {
                return {
                    ...state,
                    isLoading: false,
                    numberAnnulLeave: action.payload.numberAnnulLeave,
                    listAnnualLeavesOfOneYear: action.payload.listAnnualLeavesOfOneYear
                }
            } else if (action.payload.arrMonth) {
                return {
                    ...state,
                    isLoading: false,
                    arrMonth: action.payload.arrMonth,
                    listAnnualLeaveOfNumberMonth: action.payload.listAnnualLeaveOfNumberMonth,
                }
            } else {
                return {
                    ...state,
                    isLoading: false,
                    listAnnualLeaves: action.payload.listAnnualLeaves !== undefined ? action.payload.listAnnualLeaves : [],
                    totalList: action.payload.totalList,
                    totalListAnnualLeavesOfYear: action.payload.totalListOfYear ? action.payload.totalListOfYear : 0
                };
            };

        case AnnualLeaveConstants.CREATE_ANNUAL_LEAVE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listAnnualLeaves: [...state.listAnnualLeaves, action.payload],
            };
        case AnnualLeaveConstants.DELETE_ANNUAL_LEAVE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listAnnualLeaves: state.listAnnualLeaves.filter(sabbatical => (sabbatical._id !== action.payload._id)),
            };
        case AnnualLeaveConstants.UPDATE_ANNUAL_LEAVE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listAnnualLeaves: state.listAnnualLeaves.map(sabbatical => sabbatical._id === action.payload._id ? action.payload : sabbatical),
            };
        case AnnualLeaveConstants.GET_ANNUAL_LEAVE_FAILURE:
        case AnnualLeaveConstants.CREATE_ANNUAL_LEAVE_FAILURE:
        case AnnualLeaveConstants.DELETE_ANNUAL_LEAVE_FAILURE:
        case AnnualLeaveConstants.UPDATE_ANNUAL_LEAVE_FAILURE:
            return {
                ...state,
                isLoading: false,
                    error: action.error
            };
        default:
            return state
    }
}