import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const ConfigurationServices = {
    getConfiguration,
    editConfiguration
};

function getConfiguration() {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/configuration/configurations`,
        method: 'GET',
    }, false, true, 'module_configuration');
};

function editConfiguration(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/configuration/configurations`,
        method: 'PATCH',
        data: data
    }, true, true, 'module_configuration');
};