import { IncidentConstants } from './constants';

const initState = {
    isLoading: false,

    incidentList: null,

    error: '',
}

export function incidentManager(state = initState, action) {
    switch (action.type) {
        case IncidentConstants.GET_INCIDENT_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case IncidentConstants.GET_INCIDENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                incidentList: action.payload.incidentList,
                incidentLength: action.payload.incidentLength,
            }

        case IncidentConstants.GET_INCIDENT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };

        default:
            return state
    }
}