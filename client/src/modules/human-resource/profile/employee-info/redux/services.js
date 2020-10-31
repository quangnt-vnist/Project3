import {
    getStorage
} from '../../../../../config';
import {
    sendRequest
} from '../../../../../helpers/requestHelper';

export const EmployeeService = {
    getEmployeeProfile,
    updatePersonalInformation,
}

/**
 * Lấy thông tin cá nhân
 */
async function getEmployeeProfile(data) {
    let id = getStorage("userId");
    if (!data.callAPIByUser) {
        id = data.id
    };
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/employee/employees/${id}`,
        method: 'GET',
        params: {
            callAPIByUser: data.callAPIByUser
        }
    }, false, true, 'human_resource.profile.employee_info');
}

/**
 * Cập nhật thông tin cá nhân
 * @data : dữ liệu cập nhật thông tin cá nhân
 */
async function updatePersonalInformation(data) {
    var userId = getStorage("userId");
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/employee/employees/${userId}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'human_resource.profile.employee_info');
}