import { SystemSettingConstants } from "./constants";

var findVersion = (arrayVersion, version) => {
    var result = -1;
    arrayVersion.forEach((value, index) => {
        if(value.version === version){
            result = index;
        }
    });
    return result;
}

const initState = {
    backup: {
        list: [],
        config: {}
    },
    isLoading: false
}

export function systemSetting(state = initState, action) {
    var index = -1;
    switch (action.type) {
        case SystemSettingConstants.GET_BACKUPS_REQUEST:
        case SystemSettingConstants.GET_CONFIG_BACKUP_REQUEST:
        case SystemSettingConstants.CREATE_BACKUP_REQUEST:
        case SystemSettingConstants.CONFIG_BACKUP_REQUEST:
        case SystemSettingConstants.DELETE_BACKUP_REQUEST:
        case SystemSettingConstants.RESTORE_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        
        case SystemSettingConstants.GET_BACKUPS_FAILE:        
        case SystemSettingConstants.GET_CONFIG_BACKUP_FAILE:
        case SystemSettingConstants.CONFIG_BACKUP_FAILE:
        case SystemSettingConstants.CREATE_BACKUP_FAILE:
        case SystemSettingConstants.DELETE_BACKUP_FAILE:
        case SystemSettingConstants.RESTORE_FAILE:
            return {
                ...state,
                isLoading: false
            }

        case SystemSettingConstants.GET_BACKUPS_SUCCESS:
            return {
                ...state,
                backup: {
                    ...state.backup,
                    list: action.payload
                },
                isLoading: false
            }

        case SystemSettingConstants.GET_CONFIG_BACKUP_SUCCESS:

            state.backup.config = action.payload;
            return {
                ...state,
                isLoading: false
            }

        case SystemSettingConstants.CREATE_BACKUP_SUCCESS:
            return {
                ...state,
                backup: {
                    ...state.backup,
                    list: [
                        action.payload,
                        ...state.backup.list
                    ]
                },
                isLoading: false
            }

        case SystemSettingConstants.CONFIG_BACKUP_SUCCESS:
            return {
                ...state,
                isLoading: false
            }

        case SystemSettingConstants.DELETE_BACKUP_SUCCESS:
            index = findVersion(state.backup.list, action.payload);
            if(index !== -1){
                state.backup.list.splice(index, 1);
            }
            return {
                ...state,
                backup: {
                    ...state.backup
                },
                isLoading: false
            }

        default:
            return state;
    }
}