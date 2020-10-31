import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { AssetService } from '../../../asset-information/redux/services';

import { StautsChart } from './stautsChart';
import { CostChart } from './costChart';

class AssetStatistics extends Component {

    constructor(props) {
        super(props);

        this.EXPORT_DATA = {
            assetStatusData: null,
            assetCostData: null
        }
        this.state = {
            listAssets: null,
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
    }

    getAssetStatusData = (assetStatusData) => {
        this.EXPORT_DATA.assetStatusData = assetStatusData;

        this.props.setAssetStatisticsExportData(this.EXPORT_DATA.assetStatusData, this.EXPORT_DATA.assetCostData)
    }

    getAssetCostData = (assetCostData) => {
        this.EXPORT_DATA.assetCostData = assetCostData;

        this.props.setAssetStatisticsExportData(this.EXPORT_DATA.assetStatusData, this.EXPORT_DATA.assetCostData)
    }

    render() {
        const { translate } = this.props;
        const { listAssets } = this.state;

        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="row">
                        {/* Biểu thống kê tài sản theo trạng thái */}
                        <div className="col-6 col-xs-6">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.status_chart')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <StautsChart
                                        listAssets={listAssets}
                                        getAssetStatusData={this.getAssetStatusData}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Biểu thống kê tài sản theo giá trị */}
                        <div className="col-6 col-xs-6">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.cost_chart')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <CostChart
                                        listAssets={listAssets}
                                        getAssetCostData={this.getAssetCostData}
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
}

const AssetStatisticsConnect = connect(mapState)(withTranslate(AssetStatistics));
export { AssetStatisticsConnect as AssetStatistics };