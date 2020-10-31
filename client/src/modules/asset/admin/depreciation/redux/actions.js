import { DepreciationService } from './services';
import { DepreciationConstants } from './constants';
import { AssetManagerActions } from '../../asset-information/redux/actions';

export const DepreciationActions = {
    updateDepreciation,
}

function updateDepreciation(id, data) {
    return dispatch => {
        dispatch({
            type: DepreciationConstants.UPDATE_DEPRECIATION_REQUEST
        });

        DepreciationService.updateDepreciation(id, data)
            .then(res => {
                dispatch({
                    type: DepreciationConstants.UPDATE_DEPRECIATION_SUCCESS,
                    payload: res.data.content
                })
                dispatch(AssetManagerActions.getAllAsset({
                    code: "",
                    assetName: "",
                    assetType: null,
                    month: null,
                    status: "",
                    page: 0,
                    limit: 5,
                }))
            })
            .catch(err => {
                dispatch({
                    type: DepreciationConstants.UPDATE_DEPRECIATION_FAILURE,
                    error: err
                });
            })
    };
}
