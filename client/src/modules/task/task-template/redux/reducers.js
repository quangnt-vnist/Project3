import { taskTemplateConstants } from "../redux/constants";

export function tasktemplates(state = {}, action) {
    switch (action.type) {

        case taskTemplateConstants.GETALL_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case taskTemplateConstants.GETALL_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: action.payload.content.templates,
                isLoading: false
            };

        case taskTemplateConstants.GETALL_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case taskTemplateConstants.GETTEMPLATE_BYROLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case taskTemplateConstants.GETTEMPLATE_BYROLE_SUCCESS:
            return {
                ...state,
                items: action.payload.content.tasktemplates,
                isLoading: false
            };

        case taskTemplateConstants.GETTEMPLATE_BYROLE_FAILURE:
            return {
                ...state,
                isLoading: false
            };


        case taskTemplateConstants.GETTEMPLATE_BYUSER_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case taskTemplateConstants.GETTEMPLATE_BYUSER_SUCCESS:
            return {
                ...state,
                items: action.payload.docs,
                pageTotal: action.payload.totalPages,
                isLoading: false
            };

        case taskTemplateConstants.GETTEMPLATE_BYUSER_FAILURE:
            return {
                ...state,
                isLoading: false
            };


        case taskTemplateConstants.GETTEMPLATE_BYID_REQUEST:
            return {
                ...state,
                taskTemplate: {},
                isLoading: true
            };

        case taskTemplateConstants.GETTEMPLATE_BYID_SUCCESS:
            return {
                ...state,
                taskTemplate: action.payload.content,
                isLoading: false
            };

        case taskTemplateConstants.GETTEMPLATE_BYID_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case taskTemplateConstants.ADDNEW_TEMPLATE_REQUEST:
            return {
                ...state,
                adding: true,
                isLoading: false
            };

        case taskTemplateConstants.ADDNEW_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: [
                    ...state.items,
                    action.payload.content
                ],
                isLoading: false
            };

        case taskTemplateConstants.ADDNEW_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case taskTemplateConstants.EDIT_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: false
            };

        case taskTemplateConstants.EDIT_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: state.items.map(template =>
                    template._id === action.payload.content._id
                        ? action.payload.content
                        : template
                ),
                taskTemplate: action.payload.content,
                isLoading: false
            };

        case taskTemplateConstants.EDIT_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case taskTemplateConstants.DELETE_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: false
            };

        case taskTemplateConstants.DELETE_TEMPLATE_SUCCESS:
            return {
                ...state,
                items: state.items.filter(template => template._id !== action.payload.id),
                isLoading: false
            };

        case taskTemplateConstants.DELETE_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case taskTemplateConstants.IMPORT_TEMPLATE_REQUEST:
            return{
                ...state,
                isLoading: true
            };
        case taskTemplateConstants.IMPORT_TEMPLATE_SUCCESS:
            let item = [...state.items];
            for (let i in action.payload.content) {
                item = [...item, action.payload.content[i]];
            }
            return{
                ...state,
                isLoading: false,
                items: item,
            };

        case taskTemplateConstants.IMPORT_TEMPLATE_FAILURE:
            return{
                ...state,
                isLoading:false
            }

        default:
            return state;
    }
}