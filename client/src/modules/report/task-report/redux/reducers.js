import { TaskReportConstants } from './constants';
const initState = {
    listTaskReport: [],
    listTaskReportById: null,
    isLoading: false,
    totalList: 0,
}
export function reports(state = initState, action) {

    switch (action.type) {
        case TaskReportConstants.GET_TASK_REPORT_REQUEST:
        case TaskReportConstants.DELETE_TASK_REPORT_REQUEST:
        case TaskReportConstants.CREATE_TASK_REPORT_REQUEST:
        case TaskReportConstants.GET_TASK_REPORT_BY_ID_REQUEST:
        case TaskReportConstants.EDIT_TASK_REPORT_REQUEST:
            return {
                ...state,
                loading: true,
                isLoading: true
            };


        case TaskReportConstants.GET_TASK_REPORT_FAILURE:
        case TaskReportConstants.DELETE_TASK_REPORT_FAILURE:
        case TaskReportConstants.CREATE_TASK_REPORT_FAILURE:
        case TaskReportConstants.GET_TASK_REPORT_BY_ID_FAILURE:
        case TaskReportConstants.EDIT_TASK_REPORT_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };


        case TaskReportConstants.GET_TASK_REPORT_SUCCESS:
            return {
                ...state,
                listTaskReport: action.payload.listTaskReport,
                totalList: action.payload.totalList,
                isLoading: false,
            };


        case TaskReportConstants.DELETE_TASK_REPORT_SUCCESS:
            return {
                ...state,
                listTaskReport: state.listTaskReport.filter(report => (report._id !== action.payload._id)),
                isLoading: false,
            };


        case TaskReportConstants.CREATE_TASK_REPORT_SUCCESS:
            return {
                ...state,
                listTaskReport: [
                    ...state.listTaskReport,
                    action.payload,
                ],
                isLoading: false
            };


        case TaskReportConstants.GET_TASK_REPORT_BY_ID_SUCCESS:
            return {
                ...state,
                listTaskReportById: action.payload,
                // totalList: action.payload.totalList,
                isLoading: false,
            };


        case TaskReportConstants.EDIT_TASK_REPORT_SUCCESS:
            return {
                ...state,
                listTaskReport: state.listTaskReport.map(report => ((report._id === action.payload._id) ? action.payload : report)
                ),
                listTaskReportById: action.payload,
                isLoading: false,
            };

        default:
            return state;
    }
}