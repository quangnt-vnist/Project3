import { sendRequest } from '../../../helpers/requestHelper';

export const planServices = {
    getPlans,
    deletePlan,
    createPlan,
    editPlan,
    getDetailPlan
}

function getPlans(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/plans`,
            method: "GET",
            params: {
                code: queryData !== undefined ? queryData.code : "",
                planName: queryData !== undefined ? queryData.planName : "",
                page: queryData !== undefined ? queryData.page : null,
                limit: queryData !== undefined ? queryData.limit : null
            }
        },
        false,
        true,
        "manage_plan"
    );
}

function deletePlan(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/plans/${id}`,
            method: "DELETE"
        },
        true,
        true,
        "manage_plan"
    )
}

function createPlan(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/plans`,
            method: "POST",
            data: {
                code: data.code,
                planName: data.planName,
                description: data.description
            }
        },
        true,
        true,
        "manage_plan"
    )
}

function editPlan(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/plans/${id}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_plan"
    )
}

function getDetailPlan(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/plans/${id}`,
            method: "GET"
        },
        false,
        true,
        "manage_plan"
    )
}