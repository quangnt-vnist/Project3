import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const DisciplineService = {
    getListDiscipline,
    createNewDiscipline,
    deleteDiscipline,
    updateDiscipline,

    getListPraise,
    createNewPraise,
    deletePraise,
    updatePraise,
}
/**************************
 * Start
 * Quản lý kỷ luật
 **************************/

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListDiscipline(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/discipline/disciplines`,
        method: 'GET',
        params: {
            organizationalUnits: data.organizationalUnits,
            type: data.type,
            employeeNumber: data.employeeNumber,
            decisionNumber: data.decisionNumber,
            month: data.month,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Thêm mới kỷ luật của nhân viên
 * @data : Dữ liệu kỷ luật cần thêm 
 */
function createNewDiscipline(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/discipline/disciplines`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Xoá thông tin kỷ luật của nhân viên
 * @id : Id kỷ luật cần xoá 
 */
function deleteDiscipline(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/discipline/disciplines/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Cập nhật thông tin kỷ luật của nhân viên
 * @id : Id kỷ luật cần cập nhật 
 * @data  : Dữ liệu cập nhật
 */
function updateDiscipline(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/discipline/disciplines/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'human_resource.commendation_discipline.discipline');
}
/**************************
 * End
 * Quản lý kỷ luật
 **************************/





/**************************
 * Start
 * Quản lý khen thưởng
 **************************/

/**
 * Lấy danh sách khen thưởng
 * @data : Dữ liệu key tìm kiếm 
 */
function getListPraise(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/commendation/commendations`,
        method: 'GET',
        params: {
            organizationalUnits: data.organizationalUnits,
            type: data.type,
            employeeNumber: data.employeeNumber,
            decisionNumber: data.decisionNumber,
            month: data.month,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.commendation_discipline.commendation');
}

/**
 * Thêm mới thông tin khen thưởng
 * @data : Dữ liệu khen thưởng thêm mới
 */
function createNewPraise(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/commendation/commendations`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.commendation_discipline.commendation');
}

/**
 * Xoá thông tin khen thưởng
 * @id : Id khen thương cần xoá 
 */
function deletePraise(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/commendation/commendations/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.commendation_discipline.commendation');
}
/**
 * Cập nhật thông tin khen thưởng
 * @id : id khen thưởng cần cập nhật
 * @data  : Dữ liệu cập nhật khen thưởng
 */
function updatePraise(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/commendation/commendations/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'human_resource.commendation_discipline.commendation');
}
/**************************
 * End
 * Quản lý khen thưởng
 **************************/