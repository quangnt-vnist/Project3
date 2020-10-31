import { managerKPIConstants } from "./constants";
import { managerKPIPerService } from "./services";
export const managerKpiActions = {
    // getAllKPIPersonalByMember,
    // getAllKPIPersonalOfResponsible,
    // getAllKPIPersonalByUserID,
    getAllKpiSetsOrganizationalUnitByMonth,
    copyEmployeeKPI
};


// Lấy tất cả KPI cá nhân 
// function getAllKPIPersonalByMember() {
//     return dispatch => {
//         dispatch({type: managerKPIConstants.GETALL_KPIPERSONAL_REQUEST});//member

//         managerKPIPerService.getAllKPIPersonalByMember()
//             .then(res =>{
//                 dispatch({
//                     type: managerKPIConstants.GETALL_KPIPERSONAL_SUCCESS,
//                     payload: res.data.content
//                 })
//             })
//             .catch(error =>{
//                 dispatch({
//                     type:  managerKPIConstants.GETALL_KPIPERSONAL_FAILURE,
//                     payload:error,
//                 })
//             })
//     }
// }

// Lấy tất cả KPI cá nhân
// function getAllKPIPersonalByUserID(member) {
//     return dispatch => {
//         dispatch({type: managerKPIConstants.GETALL_KPIPERSONAL_REQUEST});

//         managerKPIPerService.getAllKPIPersonalByUserID(member)
//             .then(res =>{
//                 dispatch({
//                     type: managerKPIConstants.GETALL_KPIPERSONAL_SUCCESS,
//                     payload: res.data.content
//                 })
//             })
//             .catch(error =>{
//                 dispatch({
//                     type: managerKPIConstants.GETALL_KPIPERSONAL_FAILURE,
//                     payload: error
//                 })
//             })
//     };

// }

// Lấy tất cả KPI cá nhân
// function getAllKPIPersonalOfResponsible(member) {
//     return dispatch => {
//         dispatch({ type: managerKPIConstants.GETALL_KPIPERSONAL_OFTASK_REQUEST});

//         managerKPIPerService.getAllKPIPersonalOfTask(member)
//             .then(res=>{
//                 dispatch({
//                     type: managerKPIConstants.GETALL_KPIPERSONAL_OFTASK_SUCCESS,
//                     payload: res.data.content
//                 })
//             })
//             .catch(error =>{
//                 dispatch({
//                     type: managerKPIConstants.GETALL_KPIPERSONAL_OFTASK_FAILURE,
//                     payload: error
//                 })
//             })
//     };

// }
/**
 * 
 * @param {*} 
 */
function getAllKpiSetsOrganizationalUnitByMonth(user, department, date) {
    return dispatch => {
        dispatch({ type: managerKPIConstants.GETALL_KPIPERSONAL_IN_ORGANIZATION_BY_MONTH_REQUEST});

        managerKPIPerService.getAllKpiSetsOrganizationalUnitByMonth(user, department, date)
            .then(res=>{
                dispatch({
                    type: managerKPIConstants.GETALL_KPIPERSONAL_IN_ORGANIZATION_BY_MONTH_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error =>{
                dispatch({
                    type: managerKPIConstants.GETALL_KPIPERSONAL_IN_ORGANIZATION_BY_MONTH_FAILURE,
                    payload: error
                })
            })
    };
}

function copyEmployeeKPI(id, idunit, olddate, newdate) {
    return dispatch => {
        dispatch({ type: managerKPIConstants.COPY_KPIPERSONALS_REQUEST});

        managerKPIPerService.copyEmployeeKPI(id, idunit, olddate, newdate)
            .then(res=>{
                dispatch({
                    type: managerKPIConstants.COPY_KPIPERSONALS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error =>{
                dispatch({
                    type: managerKPIConstants.COPY_KPIPERSONALS_FAILURE,
                    payload: error
                })
            })
    };
}
