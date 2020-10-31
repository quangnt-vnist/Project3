import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AssetService } from "../../asset-information/redux/services";
import { RecommendProcureService } from "../../../user/purchase-request/redux/services";
import { RecommendDistributeService } from "../../use-request/redux/services";

import { LazyLoadComponent, forceCheckOrVisible, ExportExcel } from '../../../../../common-components';

import { AssetByGroup } from './asset-by-group/assetByGroup';
import { AssetStatistics } from './asset-statistics-chart/index';
import { AssetIsExpired } from './asset-is-expired/assetIsExpired';
import { AssetByType } from './asset-by-type/assetByType';
import { translate } from 'react-redux-multilingual/lib/utils';
import { PurchaseAndDisposal } from './asset-purchase-disposal/purchaseAndDisposal';
import { IncidentAndMaintenance } from './asset-incident-maintenance/incidentAndMaintenance';

class DashBoardAssets extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listAssets: [],
            recommendProcure: [],
            recommendDistribute: [],

            currentTab: "assetByGroup",

            exportData: {
                assetByGroup: null,
                assetByType: null,
                assetStatistics: null,
                purchaseDisposal: null,
                assetIsExpired: null
            }
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

        RecommendDistributeService.searchRecommendDistributes({
            recommendNumber: "",
            month: "",
            status: null,
            page: 0,
            limit: 0,
        }).then(res => {
            if (res.data.success) {
                this.setState({ recommendDistribute: res.data.content.listRecommendDistributes });
            }
        }).catch(err => {
            console.log(err);
        });

        RecommendProcureService.searchRecommendProcures({
            recommendNumber: "",
            month: "",
            status: null,
            page: 0,
            limit: 0,
        }).then(res => {
            if (res.data.success) {
                this.setState({ recommendProcure: res.data.content.listRecommendProcures });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    returnCountNumber = (array, status) => array.filter(item => item.status === status).length;

    handleNavTabs = (tab) => {
        this.setState(state => {
            return {
                ...state,
                currentTab: tab
            }
        })

        forceCheckOrVisible(true, false);

        window.dispatchEvent(new Event('resize')); // Fix lỗi chart bị resize khi đổi tab
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    setAssetByGroupExportData = (amountOfAsset, depreciationOfAsset, valueOfAsset) => {
        let data, assetByGroup;

        if (valueOfAsset && valueOfAsset.length !== 0 && depreciationOfAsset && amountOfAsset) {
            data = valueOfAsset.map((item, index) => {
                return {
                    STT: index + 1,
                    name: valueOfAsset[index][0],
                    valueOfAsset: valueOfAsset[index][1],
                    depreciationOfAsset: depreciationOfAsset[index][1],
                    amountOfAsset: amountOfAsset[index][1]
                }
            })
        }

        assetByGroup = {
            fileName: "Thống kê các nhóm tài sản",
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    tables: [
                        {
                            tableName: "Thống kê các nhóm tài sản",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên nhóm" },
                                { key: "valueOfAsset", value: "Giá trị tài sản" },
                                { key: "depreciationOfAsset", value: "Giá trị khấu hao" },
                                { key: "amountOfAsset", value: "Số lượng" }
                            ],
                            data: data
                        },
                    ]
                },
            ]
        }

        this.setState(state => {
            return {
                ...state,
                exportData: {
                    ...state.exportData,
                    assetByGroup: assetByGroup
                }
            }
        })
    }

    setAssetByTypeExportData = (amountOfAsset, depreciationOfAsset, valueOfAsset) => {
        let data, assetByType;

        if (valueOfAsset && valueOfAsset.type && valueOfAsset.count && valueOfAsset.type.length !== 0
            && depreciationOfAsset && depreciationOfAsset.count
            && amountOfAsset && amountOfAsset.count
        ) {
            data = valueOfAsset.type.map((item, index) => {
                return {
                    STT: index + 1,
                    name: valueOfAsset.type[index],
                    valueOfAsset: valueOfAsset.count[index],
                    depreciationOfAsset: depreciationOfAsset.count[index],
                    amountOfAsset: amountOfAsset.count[index]
                }
            })
        }

        assetByType = {
            fileName: "Thống kê các loại tài sản",
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    tables: [
                        {
                            tableName: "Thống kê các loại tài sản",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên loại" },
                                { key: "valueOfAsset", value: "Giá trị tài sản" },
                                { key: "depreciationOfAsset", value: "Giá trị hao mòn" },
                                { key: "amountOfAsset", value: "Số lượng" }
                            ],
                            data: data
                        },
                    ]
                },
            ]
        }

        this.setState(state => {
            return {
                ...state,
                exportData: {
                    ...state.exportData,
                    assetByType: assetByType
                }
            }
        })
    }

    setAssetIsExpiredExportData = (data, assetTypeList, userList, dayAvailable) => {
        let exportData, assetIsExpired;

        if (data && data.length !== 0 && assetTypeList && userList) {
            exportData = data.map((item, index) => {
                let asset = item.asset;
                if (asset) {
                    return {
                        STT: index + 1,
                        code: asset.code,
                        name: asset.assetName,
                        type: assetTypeList.find(item => item._id === asset.assetType) ? assetTypeList.find(item => item._id === asset.assetType).typeName : 'Asset is deleted',
                        purchaseDate: this.formatDate(asset.purchaseDate),
                        manager: userList.find(item => item._id === asset.managedBy) ? userList.find(item => item._id === asset.managedBy).name : 'User is deleted',
                        user: asset.assignedToUser ? (userList.length !== 0 && userList.find(item => item._id === asset.assignedToUser) ? userList.find(item => item._id === asset.assignedToUser).name : 'User is deleted') : '',
                        organizationalUnit: asset.assignedToOrganizationalUnit ? asset.assignedToOrganizationalUnit : '',
                        status: asset.status,
                        dayAvailable: item.day + (dayAvailable ? " ngày" : "")
                    }
                }

            })
        }

        assetIsExpired = {
            fileName: "Thống kê hạn sử dụng tài sản",
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    tables: [
                        {
                            tableName: "Thống kê hạn sử dụng tài sản",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "code", value: "Mã tài sản" },
                                { key: "name", value: "Tên tài sản" },
                                { key: "type", value: "Loại tài sản" },
                                { key: "purchaseDate", value: "Ngày nhập" },
                                { key: "manager", value: "Người quản lý" },
                                { key: "user", value: "Người sử dụng" },
                                { key: "organizaitonalUnit", value: "Đơn vị sử dụng" },
                                { key: "status", value: "Trạng thái" },
                                { key: "dayAvailable", value: "Thời gian còn lại" }
                            ],
                            data: exportData
                        },
                    ]
                },
            ]
        }

        this.setState(state => {
            return {
                ...state,
                exportData: {
                    ...state.exportData,
                    assetIsExpired: assetIsExpired
                }
            }
        })
    }

    setPurchaseAndDisposalExportData = (purchaseData, disposalData) => {
        let purchaseExportData, disposalExportData, purchaseDisposal;

        if (purchaseData && purchaseData.category && purchaseData.category.length !== 0
            && purchaseData.count && purchaseData.count.length !== 0
            && purchaseData.value && purchaseData.value.length !== 0
        ) {
            purchaseExportData = purchaseData.category.map((purchase, index) => {
                if (index !== 0) {
                    return {
                        month: purchase,
                        value: purchaseData.value[index],
                        amount: purchaseData.count[index]
                    }
                } else {
                    return purchase;
                }
            })
        }


        if (disposalData && disposalData.category && disposalData.category.length !== 0
            && disposalData.count && disposalData.count.length !== 0
            && disposalData.value && disposalData.value.length !== 0
        ) {
            disposalExportData = disposalData.category.map((disposal, index) => {
                if (index !== 0) {
                    return {
                        month: disposal,
                        value: disposalData.value[index],
                        amount: disposalData.count[index]
                    }
                } else {
                    return disposal;
                }
            })
        }

        if (purchaseExportData) {
            purchaseExportData.shift();
        }
        if (disposalExportData) {
            disposalExportData.shift();
        }

        purchaseDisposal = {
            fileName: "Thống kê mua-bán tài sản",
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    tables: [
                        {
                            tableName: "Thống kê mua sắm tài sản",
                            rowHeader: 1,
                            columns: [
                                { key: "month", value: "Tháng" },
                                { key: "value", value: "Giá trị" },
                                { key: "amount", value: "Số lượng" }
                            ],
                            data: purchaseExportData
                        },
                        {
                            tableName: "Thống kê thanh lý tài sản",
                            rowHeader: 1,
                            columns: [
                                { key: "month", value: "Tháng" },
                                { key: "value", value: "Giá trị" },
                                { key: "amount", value: "Số lượng" }
                            ],
                            data: disposalExportData
                        },
                    ]
                },
            ]
        }

        this.setState(state => {
            return {
                ...state,
                exportData: {
                    ...state.exportData,
                    purchaseDisposal: purchaseDisposal
                }
            }
        })
    }

    setAssetStatisticsExportData = (assetStatusData, assetCostData) => {
        let assetStatusExportData, assetCostExportData, assetStatistics;

        if (assetStatusData && assetStatusData.length !== 0) {
            assetStatusExportData = assetStatusData.map((status, index) => {
                return {
                    STT: index + 1,
                    status: status[0],
                    amount: status[1]
                }
            })
        }


        if (assetCostData && assetCostData.length !== 0) {
            assetCostExportData = assetCostData.map((cost, index) => {
                return {
                    STT: index + 1,
                    cost: cost[0],
                    amount: cost[1]
                }
            })
        }

        assetStatistics = {
            fileName: "Thống kê tài sản",
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    tables: [
                        {
                            tableName: "Thống kê tài sản theo trạng thái",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "status", value: "Trạng thái" },
                                { key: "amount", value: "Số lượng" }
                            ],
                            data: assetStatusExportData
                        },
                        {
                            tableName: "Thống kê tài sản theo giá trị",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "cost", value: "Giá trị" },
                                { key: "amount", value: "Số lượng" }
                            ],
                            data: assetCostExportData
                        },
                    ]
                },
            ]
        }

        this.setState(state => {
            return {
                ...state,
                exportData: {
                    ...state.exportData,
                    assetStatistics: assetStatistics
                }
            }
        })
    }

    render() {
        const { translate } = this.props;
        const { listAssets, recommendProcure, recommendDistribute, exportData, currentTab } = this.state;

        return (
            <div className="qlcv">
                <div className="row" style={{ marginTop: 10 }}>

                    {/* ready_to_use */}
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-check"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">{translate('asset.general_information.ready_use')}</span>
                                <span className="info-box-number">{listAssets.length ? this.returnCountNumber(listAssets, 'ready_to_use') : 0}</span>
                                <a href="/manage-info-asset">{translate('asset.general_information.view_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>

                    {/* in_use */}
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-play"></i></span>
                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">{translate('asset.general_information.using')}</span>
                                <span className="info-box-number">{listAssets.length ? this.returnCountNumber(listAssets, 'in_use') : 0}</span>
                                <a href="/manage-info-asset">{translate('asset.general_information.view_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>

                    {/* broken */}
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-warning"></i></span>
                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">{translate('asset.general_information.damaged')}</span>
                                <span className="info-box-number">{listAssets.length ? this.returnCountNumber(listAssets, 'broken') : 0}</span>
                                <a href="/manage-info-asset">{translate('asset.general_information.view_more')} <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>

                    {/* Thanh lý */}
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-calendar-times-o"></i></span>
                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">{translate('asset.general_information.disposal')}</span>
                                <span className="info-box-number">{listAssets.length ? this.returnCountNumber(listAssets, 'disposed') : 0}</span>
                                <a href="/manage-info-asset">{translate('asset.general_information.view_more')} <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="nav-tabs-custom">
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#administration-asset-by-group" data-toggle="tab" onClick={() => this.handleNavTabs("assetByGroup")}>{translate('asset.dashboard.asset_by_group')}</a></li>
                        <li><a href="#administration-asset-by-type" data-toggle="tab" onClick={() => this.handleNavTabs("assetByType")}>{translate('asset.dashboard.asset_by_type')}</a></li>
                        <li><a href="#administration-asset-statistics" data-toggle="tab" onClick={() => this.handleNavTabs("assetStatistics")}>Thống kê theo trạng thái và giá trị</a></li>
                        <li><a href="#administration-purchase-disposal" data-toggle="tab" onClick={() => this.handleNavTabs("purchaseDisposal")}>{translate('asset.dashboard.asset_purchase_and_dispose')}</a></li>
                        <li><a href="#administration-incident-maintenance" data-toggle="tab" onClick={() => this.handleNavTabs("incidentMaintenance")}>{translate('asset.dashboard.asset_incident_and_maintenance')}</a></li>
                        <li><a href="#administration-asset-is-expired" data-toggle="tab" onClick={() => this.handleNavTabs("assetIsExpired")}>Hạn sử dụng tài sản</a> </li>
                        {exportData && currentTab && exportData[currentTab] && <ExportExcel type="link" style={{ padding: "15px" }} id="export-asset-dashboard" exportData={exportData[currentTab]} />}
                    </ul>
                    <div className="tab-content">

                        {/**Tài sản theo nhóm*/}
                        <div className="tab-pane active" id="administration-asset-by-group">
                            <LazyLoadComponent
                                key="AdministrationAssetByGroup"
                            >
                                <AssetByGroup
                                    setAssetByGroupExportData={this.setAssetByGroupExportData}
                                />
                            </LazyLoadComponent>
                        </div>

                        {/**Tài sản theo loại*/}
                        <div className="tab-pane" id="administration-asset-by-type">
                            <LazyLoadComponent
                                key="AdministrationAssetByType"
                            >
                                <AssetByType
                                    setAssetByTypeExportData={this.setAssetByTypeExportData}
                                />
                            </LazyLoadComponent>
                        </div>

                        {/* Thống kê mua bán tài sản*/}
                        <div className="tab-pane" id="administration-purchase-disposal">
                            <LazyLoadComponent
                                key="AdministrationPurchaseAndDisposal"
                            >
                                <PurchaseAndDisposal
                                    setPurchaseAndDisposalExportData={this.setPurchaseAndDisposalExportData}
                                />
                            </LazyLoadComponent>
                        </div>

                        {/* Thống kê mua bán tài sản*/}
                        <div className="tab-pane" id="administration-incident-maintenance">
                            <LazyLoadComponent
                                key="AdministrationIncidentAndMaintenance"
                            >
                                <IncidentAndMaintenance
                                // setPurchaseAndDisposalExportData={this.setPurchaseAndDisposalExportData}
                                />
                            </LazyLoadComponent>
                        </div>

                        {/** Biểu đồ thống kê tài sản */}
                        <div className="tab-pane" id="administration-asset-statistics">
                            <LazyLoadComponent
                                key="AdministrationAssetStatistics"
                            >
                                <AssetStatistics
                                    setAssetStatisticsExportData={this.setAssetStatisticsExportData}
                                />
                            </LazyLoadComponent>
                        </div>

                        {/* Danh sách các tài sản sắp hết hạn */}
                        <div className="tab-pane" id="administration-asset-is-expired">
                            <LazyLoadComponent
                                key="AdministrationAssetExpired"
                            >
                                <AssetIsExpired
                                    setAssetIsExpiredExportData={this.setAssetIsExpiredExportData}
                                />
                            </LazyLoadComponent>
                        </div>
                    </div>
                </div>
            </div>
        );

        // return (
        //     <div className="qlcv">
        //         <section className="form-inline" style={{ textAlign: "right" }}>
        //             <div className="form-group">
        //                 <label>Phan loai theo</label>

        //                 <SelectBox
        //                     id={`select-type-display-in-asset-dashboard`}
        //                     className="form-control select2"
        //                     style={{ width: "100%" }}
        //                     items={[{ text: "Group", value: "Group" }, { text: "Type", value: "Type" }]}
        //                     multiple={false}
        //                     onChange={this.handleSelectTypeOfDisplay}
        //                     value={"Group"}
        //                 />
        //             </div>
        //         </section>


        //             {/* Biểu đồ yêu cầu mua sắm tài sản */}
        //             {/* <div className="col-md-6 col-sm-6 col-xs-6">
        //                 <CanvasJSChart options={options} />
        //             </div> */}

        //             {/* Biểu đồ yêu cầu sử dụng tài sản */}
        //             {/* <div className="col-md-6 col-sm-6 col-xs-6">
        //                 <CanvasJSChart options={options2} />
        //             </div> */}

        //         </div>
        //         <div className="row">
        //             {/* Biểu đồ số lượng tài sản */}
        //             <div className="col-xs-6">
        //                 <div className="box box-primary">
        //                     <div className="box-header with-border">
        //                         <div className="box-title">Biểu đồ số lượng tài sản</div>
        //                     </div>
        //                     <div className="box-body qlcv">
        //                         <AmountOfAssetChart
        //                             listAssets={listAssets}
        //                             displayBy={displayBy}
        //                             assetType={assetType}
        //                         />
        //                     </div>
        //                 </div>
        //             </div>

        //             {/* Biểu đồ giá trị tài sản */}
        //             <div className="col-xs-6">
        //                 <div className="box box-primary">
        //                     <div className="box-header with-border">
        //                         <div className="box-title">Biểu đồ giá trị tài sản</div>
        //                     </div>
        //                     <div className="box-body qlcv">
        //                         <ValueOfAssetChart
        //                             listAssets={listAssets}
        //                             displayBy={displayBy}
        //                             assetType={assetType}
        //                         />
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="row">
        //             {/* Biểu đồ khấu hao tài sản */}
        //             <div className="col-xs-6">
        //                 <div className="box box-primary">
        //                     <div className="box-header with-border">
        //                         <div className="box-title">Biểu đồ khấu hao tài sản</div>
        //                     </div>
        //                     <div className="box-body qlcv">
        //                         <DepreciationOfAssetChart
        //                             listAssets={listAssets}
        //                             displayBy={displayBy}
        //                             assetType={assetType}
        //                         />
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // );
    }
};

function mapState(state) {
    const { listAssets } = state.assetsManager;
    const { assetType } = state;
    return { listAssets, assetType };
}

const DashBoard = connect(mapState)(withTranslate(DashBoardAssets));
export { DashBoard as DashBoardAssets };
