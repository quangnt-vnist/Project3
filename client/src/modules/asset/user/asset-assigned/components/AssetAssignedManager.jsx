import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, PaginateBar, SelectMulti, TreeSelect } from '../../../../../common-components';

import { AssetManagerActions } from '../../../admin/asset-information/redux/actions';
import { AssetTypeActions } from "../../../admin/asset-type/redux/actions";
import { UserActions } from "../../../../super-admin/user/redux/actions";

import { IncidentCreateForm } from "./incidentCreateForm";
import { AssetDetailForm } from '../../../admin/asset-information/components/assetDetailForm';

class AssetAssignedManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            page: 0,
            limit: 100,
        }
    }

    componentDidMount() {
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        this.props.getAllAsset(this.state);
        this.props.getUser();
    }

    // Bắt sự kiện click xem thông tin tài sản
    handleView = async (value) => {
        await this.setState(state => {
            return {
                currentRowView: value
            }
        });
        window.$('#modal-view-asset').modal('show');
    }

    // Bắt sự kiện click báo cáo sự cố tài sản
    handleReport = async (value, asset) => {
        value.asset = asset;
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-create-assetcrash').modal('show');
    }

    // Function format dữ liệu Date thành string
    formatDate2(date, monthYear = false) {
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

    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate(date) {
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

        return [month, year].join('-');
    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    handleCodeChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    // Function lưu giá trị tên tài sản vào state khi thay đổi
    handleAssetNameChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    // Function lưu giá trị loại tài sản vào state khi thay đổi
    handleAssetTypeChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            assetType: value
        })
    }

    // Function lưu giá trị status vào state khi thay đổi
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            status: value
        })
    }
    // Function lưu nhóm tài sản vào state khi thay đổi
    handleGroupChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            group: value
        })
    }
    // Function lưu giá trị người sử dụng vào state khi thay đổi
    handleHandoverUserChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            handoverUser: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    handleSubmitSearch = async () => {
        await this.setState({
            ...this.state,
            page: 0
        })
        this.props.getAllAsset(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getAllAsset(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.getAllAsset(this.state);
    }
    getAssetTypes = () => {
        let { assetType } = this.props;
        let assetTypeName = assetType && assetType.listAssetTypes;
        let typeArr = [];
        assetTypeName.map(item => {
            typeArr.push({
                _id: item._id,
                id: item._id,
                name: item.typeName,
                parent: item.parent ? item.parent._id : null
            })
        })
        return typeArr;
    }

    getUserAndDepartment = () => {
        let { user } = this.props;
        let listUser = user && user.list;
        let data = {
            userArr: [],
        };

        listUser && listUser.map(x => {
            data.userArr.push({
                value: x._id,
                text: x.name
            })
        })

        return data
    }
    formatStatus = (status) => {
        const { translate } = this.props;

        if (status === 'ready_to_use') {
            return translate('asset.general_information.ready_use')
        }
        else if (status === 'in_use') {
            return translate('asset.general_information.using')
        }
        else if (status === 'broken') {
            return translate('asset.general_information.damaged')
        }
        else if (status === 'lost') {
            return translate('asset.general_information.lost')
        }
        else if (status === 'disposed') {
            return translate('asset.general_information.disposal')
        }
        else {
            return 'Deleted';
        }
    }
    render() {
        const { id, translate, assetsManager, assetType, user, auth } = this.props;
        const { page, limit, currentRowView, currentRow } = this.state;

        var lists = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
        let assetTypeName = this.state.assetType ? this.state.assetType : [];

        var formater = new Intl.NumberFormat();
        if (assetsManager.isLoading === false) {
            lists = assetsManager.listAssets;
        }

        var pageTotal = ((assetsManager.totalList % limit) === 0) ?
            parseInt(assetsManager.totalList / limit) :
            parseInt((assetsManager.totalList / limit) + 1);

        var currentPage = parseInt((page / limit) + 1);
        let typeArr = this.getAssetTypes();
        let dataSelectBox = this.getUserAndDepartment();

        return (
            <div id="assetassigned" className="tab-pane active">
                <div className="box-body qlcv">

                    {/* Thanh tìm kiếm */}
                    <div className="form-inline">

                        {/* Mã tài sản */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.asset_code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder={translate('asset.general_information.asset_code')} autoComplete="off" />
                        </div>

                        {/* Tên tài sản */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.asset_name')}</label>
                            <input type="text" className="form-control" name="assetName" onChange={this.handleAssetNameChange} placeholder={translate('asset.general_information.asset_name')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">

                        {/* Nhóm tài sản */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.asset_group')}</label>
                            <SelectMulti id={`multiSelectGroupInManagement`} multiple="multiple"
                                options={{ nonSelectedText: translate('asset.asset_info.select_group'), allSelectedText: translate('asset.general_information.select_all_group') }}
                                onChange={this.handleGroupChange}
                                items={[
                                    { value: "building", text: translate('asset.dashboard.building') },
                                    { value: "vehicle", text: translate('asset.dashboard.vehicle') },
                                    { value: "machine", text: translate('asset.dashboard.machine') },
                                    { value: "other", text: translate('asset.dashboard.other') },
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Loại tài sản */}
                        <div className="form-group">
                            <label>{translate('asset.general_information.asset_type')}</label>
                            <TreeSelect
                                data={typeArr}
                                value={assetTypeName}
                                handleChange={this.handleAssetTypeChange}
                                mode="hierarchical"
                            />
                        </div>
                    </div>

                    <div className="form-inline" style={{ marginBottom: 10 }}>

                        {/* Trạng thái */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus1`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('asset.general_information.select_all_status') }}
                                onChange={this.handleStatusChange}
                                items={[
                                    { value: "ready_to_use", text: translate('asset.general_information.ready_use') },
                                    { value: "in_use", text: translate('asset.general_information.using') },
                                    { value: "broken", text: translate('asset.general_information.damaged') },
                                    { value: "lost", text: translate('asset.general_information.lost') },
                                    { value: "disposed", text: translate('asset.general_information.disposal') }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label htmlFor=""></label>
                            <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={() => this.handleSubmitSearch()}>{translate('asset.general_information.search')}</button>
                        </div>
                    </div>

                    {/* Bảng thông tin thiết bị bàn giao */}
                    <table id="assetassigned-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>{translate('asset.general_information.asset_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_type')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_value')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="assetassigned-table"
                                        columnArr={[
                                            translate('asset.general_information.asset_code'),
                                            translate('asset.general_information.asset_name'),
                                            translate('asset.general_information.asset_type'),
                                            translate('asset.general_information.asset_value'),
                                            translate('asset.general_information.status')
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length !== 0) &&
                                lists.filter(item => item.assignedToUser === auth.user._id).map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.code}</td>
                                        <td>{x.assetName}</td>
                                        <td>{x.assetType && x.assetType.length ? x.assetType.map((item, index) => { let suffix = index < x.assetType.length - 1 ? ", " : ""; return item.typeName + suffix }) : 'Asset is deleted'}</td>
                                        <td>{formater.format(parseInt(x.cost))} VNĐ</td>
                                        <td>{this.formatStatus(x.status)}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('asset.general_information.view')}><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleReport(x, x)} className="edit text-red" style={{ width: '5px' }} title={translate('asset.incident.report_incident')}><i
                                                className="material-icons">notification_important</i></a>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {assetsManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>

                {/* Form xem chi tiết tài sản */}
                {
                    currentRowView &&
                    <AssetDetailForm
                        _id={currentRowView._id}
                        avatar={currentRowView.avatar}
                        code={currentRowView.code}
                        assetName={currentRowView.assetName}
                        serial={currentRowView.serial}
                        assetType={currentRowView.assetType}
                        purchaseDate={currentRowView.purchaseDate}
                        warrantyExpirationDate={currentRowView.warrantyExpirationDate}
                        managedBy={currentRowView.managedBy}
                        assignedToUser={currentRowView.assignedToUser}
                        assignedToOrganizationalUnit={currentRowView.assignedToOrganizationalUnit}
                        typeRegisterForUse={currentRowView.typeRegisterForUse}
                        location={currentRowView.location}
                        description={currentRowView.description}
                        status={currentRowView.status}
                        detailInfo={currentRowView.detailInfo}
                        cost={currentRowView.cost}
                        residualValue={currentRowView.residualValue}
                        startDepreciation={currentRowView.startDepreciation}
                        usefulLife={currentRowView.usefulLife}
                        depreciationType={currentRowView.depreciationType}

                        maintainanceLogs={currentRowView.maintainanceLogs}
                        usageLogs={currentRowView.usageLogs}
                        incidentLogs={currentRowView.incidentLogs}

                        disposalDate={currentRowView.disposalDate}
                        disposalType={currentRowView.disposalType}
                        disposalCost={currentRowView.disposalCost}
                        disposalDesc={currentRowView.disposalDesc}

                        archivedRecordNumber={currentRowView.archivedRecordNumber}
                        files={currentRowView.files}
                    />
                }

                {/* Form thêm thông tin sự cố */}
                {
                    currentRow &&
                    <IncidentCreateForm
                        _id={currentRow._id}
                        asset={currentRow.asset}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { assetsManager, assetType, user, auth } = state;
    return { assetsManager, assetType, user, auth };
};

const actionCreators = {
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getAllAsset: AssetManagerActions.getAllAsset,
    getUser: UserActions.get,
};

const connectedListAssetAssigned = connect(mapState, actionCreators)(withTranslate(AssetAssignedManager));
export { connectedListAssetAssigned as AssetAssignedManager };
