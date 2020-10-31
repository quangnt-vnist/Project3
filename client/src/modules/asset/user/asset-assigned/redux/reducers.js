import { AssetCrashConstants } from './constants';
const initState = {
    isLoading: false,
    listAssetCrashs: [],
    totalList: "",
    error:"",
}
export function assetCrash(state =initState, action) {
    switch (action.type) {
        case AssetCrashConstants.GET_ASSET_CRASH_REQUEST:
        case AssetCrashConstants.CREATE_ASSET_CRASH_REQUEST:
        case AssetCrashConstants.DELETE_ASSET_CRASH_REQUEST:
        case AssetCrashConstants.UPDATE_ASSET_CRASH_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        
        case AssetCrashConstants.GET_ASSET_CRASH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAssetCrashs: action.payload.listAssetCrashs,
                totalList: action.payload.totalList,
            };
        
        case AssetCrashConstants.CREATE_ASSET_CRASH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAssetCrashs: [...state.listAssetCrashs, action.payload],
            };
        
        case AssetCrashConstants.DELETE_ASSET_CRASH_SUCCESS:

            return {
                ...state,
                isLoading: false,
                listAssetCrashs: state.listAssetCrashs.filter(assetCrash => (assetCrash._id !== action.payload._id)),
            };
        
        case AssetCrashConstants.UPDATE_ASSET_CRASH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAssetCrashs: state.listAssetCrashs.map(assetCrash =>assetCrash._id === action.payload._id ?action.payload : assetCrash),
            };
        
        case AssetCrashConstants.GET_ASSET_CRASH_FAILURE:
        case AssetCrashConstants.CREATE_ASSET_CRASH_FAILURE:
        case AssetCrashConstants.DELETE_ASSET_CRASH_FAILURE:
        case AssetCrashConstants.UPDATE_ASSET_CRASH_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        
        default:
            return state
    }
}
