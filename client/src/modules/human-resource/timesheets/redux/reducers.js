import {
    TimesheetsConstants
} from './constants';

const initState = {
    isLoading: false,
    listTimesheets: [],
    totalList: 0,
    arrMonth: [],
    listOvertimeOfUnitsByStartDateAndEndDate: [],
    arrMonthById: [],
    listTimesheetsByEmployeeIdAndTime: [],

    importTimesheets: [],
    importStatus: false,
    error: "",
}

export function timesheets(state = initState, action) {
    switch (action.type) {
        case TimesheetsConstants.GET_TIMESHEETS_REQUEST:
        case TimesheetsConstants.CREATE_TIMESHEETS_REQUEST:
        case TimesheetsConstants.UPDATE_TIMESHEETS_REQUEST:
        case TimesheetsConstants.DELETE_TIMESHEETS_REQUEST:
        case TimesheetsConstants.IMPORT_TIMESHEETS_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case TimesheetsConstants.GET_TIMESHEETS_SUCCESS:
            if(action.callApiByEmployeeId){
                return {
                    ...state,
                    isLoading: false,
                    arrMonthById: action.payload.arrMonth,
                    listTimesheetsByEmployeeIdAndTime: action.payload.listTimesheetsByEmployeeIdAndTime,
                }

            } else if (action.payload.arrMonth) {
                return {
                    ...state,
                    isLoading: false,
                    arrMonth: action.payload.arrMonth,
                    listOvertimeOfUnitsByStartDateAndEndDate: action.payload.listOvertimeOfUnitsByStartDateAndEndDate,
                }
            } else {
                return {
                    ...state,
                    isLoading: false,
                    listTimesheets: action.payload.listTimesheets,
                    totalList: action.payload.totalList,
                };
            };
        case TimesheetsConstants.CREATE_TIMESHEETS_SUCCESS:
            let listTimesheets;
            if (state.listTimesheets[0].month === action.payload.month) {
                listTimesheets = [...state.listTimesheets,
                    action.payload
                ]
            } else {
                listTimesheets = state.listTimesheets;
            }
            return {
                ...state,
                isLoading: false,
                    listTimesheets: listTimesheets
            };
        case TimesheetsConstants.UPDATE_TIMESHEETS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listTimesheets: state.listTimesheets.map(timesheets => timesheets._id === action.payload._id ? action.payload : timesheets)
            };
        case TimesheetsConstants.DELETE_TIMESHEETS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listTimesheets: state.listTimesheets.filter(timesheets => (timesheets._id !== action.payload._id)),
            };
        case TimesheetsConstants.IMPORT_TIMESHEETS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    importStatus: true,
                    importTimesheets: action.payload.content,
                    error: ""
            };
        case TimesheetsConstants.GET_TIMESHEETS_FAILURE:
        case TimesheetsConstants.CREATE_TIMESHEETS_FAILURE:
        case TimesheetsConstants.UPDATE_TIMESHEETS_FAILURE:
        case TimesheetsConstants.DELETE_TIMESHEETS_FAILURE:
        case TimesheetsConstants.IMPORT_TIMESHEETS_FAILURE:
            return {
                ...state,
                isLoading: false,
                    error: action.error
            };

        default:
            return state
    }
}