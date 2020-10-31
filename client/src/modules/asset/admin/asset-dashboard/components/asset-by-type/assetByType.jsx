import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AssetService } from '../../../asset-information/redux/services';
import { AssetTypeService } from '../../../asset-type/redux/services';

import AmountTree from './amount-of-asset/amountTree';
import DepreciationTree from './depreciation-of-asset/depreciationTree';
import ValueTree from './value-of-asset/valueTree';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';


class AssetByType extends Component {

    constructor(props) {
        super(props);

        this.INFO_SEARCH = {
            typeOfChart: ["Bar"]
        }
        this.EXPORT_DATA = {
            amountOfAsset: null,
            depreciationOfAsset: null,
            valueOfAsset: null
        }

        this.state = {
            listAssets: [],
            displayBy: this.INFO_SEARCH.displayBy,
            typeOfChart: this.INFO_SEARCH.typeOfChart
        }
    }

    componentDidMount() {
        AssetService.getAll({
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            page: 0,
            limit: 0
        }).then(res => {
            if (res.data.success) {
                this.setState({ listAssets: res.data.content.data });
            }
        }).catch(err => {
            console.log(err);
        });

        AssetTypeService.getAssetTypes().then(res => {
            if (res.data.success) {
                this.setState({ assetType: res.data.content.list })
            }
        }).catch(err => {
            console.log(err);
        });
    }

    handleSelectTypeOfDisplay = async (value) => {
        this.INFO_SEARCH.displayBy = value
    }

    handleSearchData = async () => {
        await this.setState(state => {
            return {
                ...state,
                displayBy: this.INFO_SEARCH.displayBy
            }
        })
    }

    setAmountOfAsset = (amountOfAsset) => {
        this.EXPORT_DATA.amountOfAsset = amountOfAsset;
        this.props.setAssetByTypeExportData(this.EXPORT_DATA.amountOfAsset, this.EXPORT_DATA.depreciationOfAsset, this.EXPORT_DATA.valueOfAsset)
    }

    setDepreciationOfAsset = (depreciationOfAsset) => {
        this.EXPORT_DATA.depreciationOfAsset = depreciationOfAsset;
        this.props.setAssetByTypeExportData(this.EXPORT_DATA.amountOfAsset, this.EXPORT_DATA.depreciationOfAsset, this.EXPORT_DATA.valueOfAsset)
    }

    setValueOfAsset = (valueOfAsset) => {
        this.EXPORT_DATA.valueOfAsset = valueOfAsset;
        this.props.setAssetByTypeExportData(this.EXPORT_DATA.amountOfAsset, this.EXPORT_DATA.depreciationOfAsset, this.EXPORT_DATA.valueOfAsset)
    }

    render() {
        const { translate } = this.props;
        const { listAssets, assetType } = this.state;
        
        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.amount_of_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <AmountTree
                                        listAssets={listAssets}
                                        assetType={assetType}
                                        setAmountOfAsset={this.setAmountOfAsset}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-6">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.value_of_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <ValueTree
                                        listAssets={listAssets}
                                        assetType={assetType}
                                        setValueOfAsset={this.setValueOfAsset}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.depreciation_of_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <DepreciationTree
                                        listAssets={listAssets}
                                        assetType={assetType}
                                        setDepreciationOfAsset={this.setDepreciationOfAsset}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        );
    }
}
function mapState(state) {
    const { listAssets } = state.assetsManager;
    const { assetType } = state;
    return { listAssets, assetType };
}

const AssetByTypeConnect = connect(mapState)(withTranslate(AssetByType));
export { AssetByTypeConnect as AssetByType };