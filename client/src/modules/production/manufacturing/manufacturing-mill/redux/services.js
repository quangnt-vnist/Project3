import { sendRequest } from "../../../../../helpers/requestHelper"

export const millServices = {
    getAllManufacturingMills,
    createManufacturingMill,
    editManufacturingMill,
    getDetailManufacturingMill
}


function getAllManufacturingMills(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-mill`,
            method: "GET",
            params: query
        },
        false,
        true,
        "manufacturing.manufacturing_mill"
    )
}

function createManufacturingMill(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-mill`,
            method: "POST",
            data
        },
        true,
        true,
        "manufacturing.manufacturing_mill"
    )
}

function editManufacturingMill(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-mill/${id}`,
            method: "PATCH",
            data
        },
        true,
        true,
        "manufacturing.manufacturing_mill"
    )
}

function getDetailManufacturingMill(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/manufacturing-mill/${id}`,
            method: "GET"
        },
        false,
        true,
        "manufacturing.manufacturing_mill"
    )
}
