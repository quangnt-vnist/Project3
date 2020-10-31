import {
    EmployeeConstants
} from "./constants";
import {
    EmployeeService
} from "./services";
export const EmployeeManagerActions = {
    getAllEmployee,
    addNewEmployee,
    updateInformationEmployee,
    deleteEmployee,
    importEmployees
};

/**
 * Lấy danh sách nhân viên
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getAllEmployee(data) {
    return dispatch => {
        dispatch({
            type: EmployeeConstants.GETALL_REQUEST
        });
        EmployeeService.getAll(data)
            .then(res => {
                dispatch({
                    type: EmployeeConstants.GETALL_SUCCESS,
                    payload: res.data.content,
                    exportData: data ? data.exportData : data
                })
            })
            .catch(err => {
                dispatch({
                    type: EmployeeConstants.GETALL_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Thêm mới thông tin nhân viên
 * @param {*} data : dữ liệu thông tin nhân viên cần tạo
 */
function addNewEmployee(employee) {
    return dispatch => {
        dispatch({
            type: EmployeeConstants.ADDEMPLOYEE_REQUEST
        });

        EmployeeService.addNewEmployee(employee)
            .then(res => {
                dispatch({
                    type: EmployeeConstants.ADDEMPLOYEE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: EmployeeConstants.ADDEMPLOYEE_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Cập nhật thông tin nhân viên theo id
 * @param {*} id 
 * @param {*} data 
 */
function updateInformationEmployee(id, data) {
    return dispatch => {
        dispatch({
            type: EmployeeConstants.UPDATE_INFOR_EMPLOYEE_REQUEST
        });

        EmployeeService.updateInformationEmployee(id, data)
            .then(res => {
                dispatch({
                    type: EmployeeConstants.UPDATE_INFOR_EMPLOYEE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: EmployeeConstants.UPDATE_INFOR_EMPLOYEE_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Xoá thông tin nhân viên
 * @id : id thông tin nhân viên cần xoá
 */
function deleteEmployee(id) {
    return dispatch => {
        dispatch({
            type: EmployeeConstants.DELETE_EMPLOYEE_REQUEST
        });

        EmployeeService.deleteEmployee(id)
            .then(res => {
                dispatch({
                    type: EmployeeConstants.DELETE_EMPLOYEE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: EmployeeConstants.DELETE_EMPLOYEE_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Import thông tin nhân viên
 * @id : id thông tin nhân viên cần xoá
 */
function importEmployees(data) {
    return dispatch => {
        dispatch({
            type: EmployeeConstants.IMPORT_EMPLOYEE_REQUEST
        });

        EmployeeService.importEmployees(data)
            .then(res => {
                dispatch({
                    type: EmployeeConstants.IMPORT_EMPLOYEE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: EmployeeConstants.IMPORT_EMPLOYEE_FAILURE,
                    error: err.response.data.content
                });
            })
    }
}