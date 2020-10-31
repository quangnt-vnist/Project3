import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AssetService } from '../../../asset-information/redux/services';

import AssetPurchaseChart from './assetPurchaseChart';
import AssetDisposalChart from './assetDisposalChart';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';

class PurchaseAndDisposal extends Component {

    constructor(props) {
        super(props);

        this.EXPORT_DATA = {
            purchaseData: null,
            disposalData: null
        }

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

    getPurchaseData = (purchaseData) => {
        this.EXPORT_DATA.purchaseData = purchaseData;

        this.props.setPurchaseAndDisposalExportData(this.EXPORT_DATA.purchaseData, this.EXPORT_DATA.disposalData)
    }

    getDisposalData = (disposalData) => {
        this.EXPORT_DATA.disposalData = disposalData;

        this.props.setPurchaseAndDisposalExportData(this.EXPORT_DATA.purchaseData, this.EXPORT_DATA.disposalData)
    }

    render() {
        const { translate } = this.props;
        const { listAssets, assetType } = this.state;

        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="row">

                        {/* Biểu đồ nhập tài sản */}
                        <div className="col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.purchase_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    < AssetPurchaseChart
                                        listAssets={listAssets}
                                        getPurchaseData={this.getPurchaseData}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Biểu đồ thanh lý tài sản */}
                        <div className="col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.disposal_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <AssetDisposalChart
                                        listAssets={listAssets}
                                        getDisposalData={this.getDisposalData}
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

const PurchaseAndDisposalConnect = connect(mapState)(withTranslate(PurchaseAndDisposal));
export { PurchaseAndDisposalConnect as PurchaseAndDisposal };