import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AssetService } from '../../../asset-information/redux/services';

import AssetIncidentChart from './assetIncidentChart';
import AssetMaintenanceChart from './assetMaintenanceChart';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';

class IncidentAndMaintenance extends Component {

    constructor(props) {
        super(props);

        // this.EXPORT_DATA = {
        //     purchaseData: null,
        //     disposalData: null
        // }

        this.state = {
            listAssets: [],
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

    // getPurchaseData = (purchaseData) => {
    //     this.EXPORT_DATA.purchaseData = purchaseData;

    //     this.props.setPurchaseAndDisposalExportData(this.EXPORT_DATA.purchaseData, this.EXPORT_DATA.disposalData)
    // }

    // getDisposalData = (disposalData) => {
    //     this.EXPORT_DATA.disposalData = disposalData;

    //     this.props.setPurchaseAndDisposalExportData(this.EXPORT_DATA.purchaseData, this.EXPORT_DATA.disposalData)
    // }

    render() {
        const { translate } = this.props;
        const { listAssets, assetType } = this.state;

        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="row">

                        {/* Biểu đồ sự cố */}
                        <div className="col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.incident_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    < AssetIncidentChart
                                        listAssets={listAssets}
                                    // getPurchaseData={this.getPurchaseData}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Biểu đồ thanh lý tài sản */}
                        <div className="col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.maintenance_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <AssetMaintenanceChart
                                        listAssets={listAssets}
                                    // getDisposalData={this.getDisposalData}
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

const IncidentAndMaintenanceConnect = connect(mapState)(withTranslate(IncidentAndMaintenance));
export { IncidentAndMaintenanceConnect as IncidentAndMaintenance };