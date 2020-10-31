import { UserServices } from "./services";
import { UserConstants } from "./constants";

export const UserActions = {
    get,
    getRoleSameDepartment,
    getAllUserOfCompany,
    getAllUserOfDepartment,
    getAllUserSameDepartment,
    getDepartmentOfUser,
    getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany,
    getAllEmployeeOfUnitByRole,
    getAllEmployeeOfUnitByIds,
    getAllUsersWithRole,
    edit,
    create,
    destroy,
};

/**
 * Lấy danh sách tất cả user trong 1 công ty
 */
function get(data) {
    if (data) {
        return dispatch => {
            dispatch({
                type: UserConstants.GET_USERS_PAGINATE_REQUEST
            });
            UserServices.get(data)
                .then(res => {
                    dispatch({
                        type: UserConstants.GET_USERS_PAGINATE_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({
                        type: UserConstants.GET_USERS_PAGINATE_FAILE
                    });
                })
        }
    }

    return dispatch => {
        dispatch({
            type: UserConstants.GET_USERS_REQUEST
        });
        UserServices.get()
            .then(res => {
                dispatch({
                    type: UserConstants.GET_USERS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: UserConstants.GET_USERS_FAILE
                });

            })
    }
}
/**
 * Lấy tất cả nhân viên của đơn vị theo role
 * @param {*} role 
 */
function getAllEmployeeOfUnitByRole(role) {
    return dispatch => {
        dispatch({
            type: UserConstants.GET_ALL_EMPLOYEE_OF_UNIT_BY_ROLE_REQUEST
        });

        UserServices.getAllEmployeeOfUnitByRole(role)
            .then(res => {
                dispatch({
                    type: UserConstants.GET_ALL_EMPLOYEE_OF_UNIT_BY_ROLE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: UserConstants.GET_ALL_EMPLOYEE_OF_UNIT_BY_ROLE_FAILURE,
                    payload: error
                })
            })
    };
}
/**
 * Lấy tất cả nhân viên của đơn vị theo mảng id đơn vị
 * @param {*} ids 
 */
function getAllEmployeeOfUnitByIds(ids) {
    return dispatch => {
        dispatch({
            type: UserConstants.GET_ALL_EMPLOYEE_OF_UNIT_BY_ID_REQUEST
        });

        UserServices.getAllEmployeeOfUnitByIds(ids)
            .then(res => {
                dispatch({
                    type: UserConstants.GET_ALL_EMPLOYEE_OF_UNIT_BY_ID_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: UserConstants.GET_ALL_EMPLOYEE_OF_UNIT_BY_ID_FAILURE,
                    payload: error
                })
            })
    };
}

export const getRoles = () => {
    return dispatch => {
        dispatch({
            type: UserConstants.GET_USER_ROLES_REQUEST
        });
        UserServices.getRoles()
            .then(res => {
                let roles = [];
                res.data.content.forEach(data => {
                    roles.push({
                        id: data.id_role._id,
                        name: data.id_role.name
                    })
                });
                dispatch({
                    type: UserConstants.GET_USER_ROLES_SUCCESS,
                    payload: roles
                })
            })
            .catch(err => {
                dispatch({
                    type: UserConstants.GET_USER_ROLES_FAILE
                });

            })
    }
}


export const getLinkOfRole = () => {
    return dispatch => {
        dispatch({
            type: UserConstants.GET_LINK_OF_ROLE_REQUEST
        });
        UserServices.getLinkOfRole()
            .then(res => {
                dispatch({
                    type: UserConstants.GET_LINK_OF_ROLE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: UserConstants.GET_LINK_OF_ROLE_FAILE
                });

            })
    }
}

/**
 * Lấy tất cả các vai trò cùng phòng ban với người dùng
 * @currentRole {*} Role hiện tại cuả người dùng 
 */
function getRoleSameDepartment(currentRole) {
    return dispatch => {
        dispatch({
            type: UserConstants.GETROLE_SAMEDEPARTMENT_REQUEST
        });
        UserServices.getRoleSameDepartmentOfUser(currentRole)
            .then(res => {
                dispatch({
                    type: UserConstants.GETROLE_SAMEDEPARTMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: UserConstants.GETROLE_SAMEDEPARTMENT_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Lấy danh sách tất cả user trong 1 công ty
 */
function getAllUserOfCompany() {
    return dispatch => {
        UserServices.getAllUserOfCompany()
            .then(res => {
                dispatch({
                    type: UserConstants.GETALLUSER_OFCOMPANY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: UserConstants.GETALLUSER_OFCOMPANY_FAILURE,
                    error: err
                });
            })
    };
}

/** Lấy tất cả nhân viên của một phòng ban hoặc 1 mảng phòng ban kèm theo vai trò của họ */
function getAllUserOfDepartment(id) {
    return dispatch => {
        dispatch({
            type: UserConstants.GETALLUSER_OFDEPARTMENT_REQUEST
        });
        UserServices.getAllUserOfDepartment(id)
            .then(res => {
                dispatch({
                    type: UserConstants.GETALLUSER_OFDEPARTMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: UserConstants.GETALLUSER_OFDEPARTMENT_FAILURE,
                    error: err
                });
            })
    };
}

/** Lấy tất cả nhân viên của một phòng ban hoặc 1 mảng phòng ban kèm theo vai trò của họ */
function getAllUserSameDepartment(currentRole) {
    return dispatch => {
        dispatch({
            type: UserConstants.GETALLUSER_SAMEDEPARTMENT_REQUEST
        });
        UserServices.getAllUserSameDepartment(currentRole)
            .then(res => {
                dispatch({
                    type: UserConstants.GETALLUSER_SAMEDEPARTMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: UserConstants.GETALLUSER_SAMEDEPARTMENT_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Lấy tất cả các đơn vị tổ chức một user thuộc về
 */
function getDepartmentOfUser(data = undefined) {
    return dispatch => {
        dispatch({
            type: UserConstants.GETDEPARTMENT_OFUSER_REQUEST
        });
        UserServices.getDepartmentOfUser(data)
            .then(res => {
                dispatch({
                    type: UserConstants.GETDEPARTMENT_OFUSER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: UserConstants.GETDEPARTMENT_OFUSER_FAILURE,
                    error: err
                });
            })
    };
}

/**
 * Lấy người dùng các đơn vị con của một đơn vị và trong đơn vị đó
 */
function getChildrenOfOrganizationalUnitsAsTree(unitId) {
    return dispatch => {
        dispatch({
            type: UserConstants.GET_ALL_USERS_OF_UNIT_AND_ITS_SUB_UNITS_REQUEST
        });
        UserServices.getChildrenOfOrganizationalUnitsAsTree(unitId)
            .then(res => {
                dispatch({
                    type: UserConstants.GET_ALL_USERS_OF_UNIT_AND_ITS_SUB_UNITS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: UserConstants.GET_ALL_USERS_OF_UNIT_AND_ITS_SUB_UNITS_FAILURE,
                    payload: error
                })
            })
    };
}

/**
 * Lấy người dùng trong các đơn vị của 1 công ty
 */
function getAllUserInAllUnitsOfCompany() {
    return dispatch => {
        dispatch({
            type: UserConstants.GET_ALL_USERS_IN_UNITS_OF_COMPANY_REQUEST
        });

        UserServices.getAllUserInAllUnitsOfCompany()
            .then(res => {
                dispatch({
                    type: UserConstants.GET_ALL_USERS_IN_UNITS_OF_COMPANY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: UserConstants.GET_ALL_USERS_IN_UNITS_OF_COMPANY_FAILURE,
                    payload: error
                })
            })
    };
}

/**
 * Chỉnh sửa thông tin tài khoản người dùng
 * @id id tài khoản
 * @data dữ liệu chỉnh sửa
 */
function edit(id, data) {
    return dispatch => {
        dispatch({
            type: UserConstants.EDIT_USER_REQUEST
        });
        UserServices.edit(id, data)
            .then(res => {
                dispatch({
                    type: UserConstants.EDIT_USER_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: UserConstants.EDIT_USER_FAILE
                });
            })
    }
}

/**
 * Tạo tài khoản cho user
 * @data dữ liệu về user
 */
function create(data) {
    return dispatch => {
        dispatch({
            type: UserConstants.CREATE_USER_REQUEST
        });
        UserServices.create(data)
            .then(res => {
                dispatch({
                    type: UserConstants.CREATE_USER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: UserConstants.CREATE_USER_FAILE
                });
            })
    }
}

/**
 * Xóa tài khoản người dùng
 * @id id tài khoản người dùng
 */
function destroy(id) {
    return dispatch => {
        dispatch({
            type: UserConstants.DELETE_USER_REQUEST
        });
        UserServices.destroy(id)
            .then(res => {
                dispatch({
                    type: UserConstants.DELETE_USER_SUCCESS,
                    payload: id
                })
            })
            .catch(err => {
                dispatch({
                    type: UserConstants.DELETE_USER_FAILE
                });
            })
    }
}

function getAllUsersWithRole() {
    return dispatch => {
        dispatch({
            type: UserConstants.GET_ALL_USERS_WITH_ROLE_REQUEST
        });
        UserServices.getAllUsersWithRole()
            .then(
                payload => {
                    dispatch({ type: UserConstants.GET_ALL_USERS_WITH_ROLE_SUCCESS, payload });
                },
                error => {
                    dispatch({ type: UserConstants.GET_ALL_USERS_WITH_ROLE_FAIL, error });
                }
            );
    }
}