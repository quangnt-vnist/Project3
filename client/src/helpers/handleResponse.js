export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}

export function handleResponseShowAlert(response, error) {
    console.log("RES: ", response, error)
    // return response.text().then(text => {
    //     const data = text && JSON.parse(text);
    //     if (!response.ok) {
    //         const error = (data && data.message) || response.statusText;
    //         console.log("ERROR RESPONSE: ", error);
    //         return Promise.reject(error);
    //     }
    //     console.log("SUCCESS RESPONSE: ", data);
    //     return data;
    // });
}

export const string2literal = (value) => {
    let maps = {
        "NaN": NaN,
        "null": null,
        "undefined": undefined,
        "Infinity": Infinity,
        "-Infinity": -Infinity
    };
    return ((value in maps) ? maps[value] : value);
};
