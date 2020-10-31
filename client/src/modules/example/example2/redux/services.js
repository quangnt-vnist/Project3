import { sendRequest } from '../../../../helpers/requestHelper';

export const exampleServices = {
    getOnlyExampleName,
    deleteExample,
    createExample,
    editExample,
    getExampleDetail
}

function getOnlyExampleName(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/examples/getOnlyExampleName`,
            method: "GET",
            params: {
                exampleName: queryData !== undefined ? queryData.exampleName : "",
                page: queryData !== undefined ? queryData.page : null,
                limit: queryData !== undefined ? queryData.limit : null
            }
        },
        false,
        true,
        "manage_example"
    );
}

function deleteExample(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/examples/${id}`,
            method: "DELETE"
        },
        true,
        true,
        "manage_example"
    )
}

function createExample(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/examples`,
            method: "POST",
            data: {
                exampleName: data.exampleName,
                description: data.description
            }
        },
        true,
        true,
        "manage_example"
    )
}

function editExample(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/examples/${id}`,
            method: "PATCH",
            data: data
        },
        true,
        true,
        "manage_example"
    )
}

function getExampleDetail(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/examples/${id}`,
        method: "GET"
    },
        false,
        true,
        "manage_example"
    )
}