import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { PaginateBar, DataTableSetting, SelectMulti, TreeSelect } from '../../../../../common-components';

import { AssetManagerActions } from "../../../admin/asset-information/redux/actions";
import { AssetTypeActions } from "../../../admin/asset-type/redux/actions";
import { UserActions } from "../../../../super-admin/user/redux/actions";

import { UseRequestCreateForm } from './UseRequestCreateForm';
import { AssetDetailForm } from '../../../admin/asset-information/components/assetDetailForm';

class ListAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            assetType: null,
            status: "",
            typeRegisterForUse: [2, 3],
            page: 0,
            limit: 5,
            currentRole: localStorage.getItem('currentRole'),
        }
    }

    componentDidMount() {
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        this.props.getAllAsset({
            code: "",
            assetName: "",
            assetType: null,
            status: "",
            page: 0,
            limit: 5,
            typeRegisterForUse: [2, 3],
            currentRole: localStorage.getItem('currentRole'),
        });
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

    // Bắt sự kiện click đăng ký cấp phát tài sản
    handleCreateRecommend = async (value, asset) => {
        value.asset = asset;
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$(`#modal-create-recommenddistribute-${value._id}`).modal('show');
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

    // Bắt sự kiện thay đổi nhóm tài sản
    handleGroupChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            group: value
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

    // Function lưu giá trị status vào state khi thay đổi
    handleTypeRegisterForUseChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            typeRegisterForUse: value
        })
    }
    // Function bắt sự kiện tìm kiếm
    handleSubmitSearch = async () => {
        this.setState({
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

    convertGroupAsset = (group) => {
        if (group === 'building') {
            return 'Mặt bằng';
        } else if (group === 'vehicle') {
            return 'Xe cộ'
        } else if (group === 'machine') {
            return 'Máy móc'
        } else {
            return 'Khác'
        }
    }
    convertStatusAsset = (status) => {
        const { translate } = this.props;
        if (status === 'ready_to_use') {
            return translate('asset.general_information.ready_use');
        }
        else if (status === 'in_use') {
            return translate('asset.general_information.using');
        }
        else if (status === 'broken') {
            return translate('asset.general_information.damaged');
        }
        else if (status === 'lost') {
            return translate('asset.general_information.lost');
        }
        else {
            return translate('asset.general_information.disposal')
        }
    }

    render() {
        const { translate, assetsManager, assetType, user, auth } = this.props;
        const { page, limit, currentRowView, currentRow } = this.state;

        var lists = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
        let assetTypeName = this.state.assetType ? this.state.assetType : [];

        if (assetsManager.isLoading === false) {
            lists = assetsManager.listAssets;
        }

        var pageTotal = ((assetsManager.totalList % limit) === 0) ?
            parseInt(assetsManager.totalList / limit) :
            parseInt((assetsManager.totalList / limit) + 1);

        var currentPage = parseInt((page / limit) + 1);
        let typeArr = this.getAssetTypes();

        return (
            <div id="listasset" className="tab-pane active" >
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
                        {/* Quyền đăng ký sử dụng */}
                        <div className="form-group">
                            <label>Quyền đăng ký</label>
                            <SelectMulti
                                id={`typeRegisterForUseInManagement`}
                                className="form-control select2"
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn quyền sử dụng", allSelectedText: "Chọn tất cả" }}
                                style={{ width: "100%" }}
                                items={[
                                    { value: 1, text: 'Không được đăng ký sử dụng' },
                                    { value: 2, text: 'Đăng ký sử dụng theo giờ' },
                                    { value: 3, text: 'Đăng ký sử dụng lâu dài' },
                                ]}
                                onChange={this.handleTypeRegisterForUseChange}
                            />
                        </div>

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
                            <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={this.handleSubmitSearch}>{translate('asset.general_information.search')}</button>
                        </div>
                    </div>

                    {/* Bảng đăng kí sử dụng thiết bị */}
                    <table id="asset-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>{translate('asset.general_information.asset_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_group')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_type')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.user')}</th>
                                <th style={{ width: "20%" }}>{translate('asset.general_information.handover_from_date')}</th>
                                <th style={{ width: "20%" }}>{translate('asset.general_information.handover_to_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('asset.general_information.action')}
                                    <DataTableSetting
                                        tableId="asset-table"
                                        columnArr={[
                                            translate('asset.general_information.asset_code'),
                                            translate('asset.general_information.asset_name'),
                                            translate('asset.general_information.asset_group'),
                                            translate('asset.general_information.asset_type'),
                                            translate('asset.general_information.user'),
                                            translate('asset.general_information.handover_from_date'),
                                            translate('asset.general_information.handover_to_date'),
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
                                lists.filter(item => item.typeRegisterForUse !== 1).map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.code}</td>
                                        <td>{x.assetName}</td>
                                        <td>{this.convertGroupAsset(x.group)}</td>
                                        <td>{x.assetType && x.assetType.length ? x.assetType.map((item, index) => { let suffix = index < x.assetType.length - 1 ? ", " : ""; return item.typeName + suffix }) : 'Asset is deleted'}</td>
                                        <td>{x.assignedToUser ? (userlist.length && userlist.filter(item => item._id === x.assignedToUser).pop() ? userlist.filter(item => item._id === x.assignedToUser).pop().name : 'User is deleted') : ''}</td>
                                        <td>{x.handoverFromDate ? this.formatDate2(x.handoverFromDate) : ''}</td>
                                        <td>{x.handoverToDate ? this.formatDate2(x.handoverToDate) : ''}</td>
                                        <td>{this.convertStatusAsset(x.status)}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('asset.general_information.view')}><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleCreateRecommend(x)} className="post_add" style={{ width: '5px' }} title={translate('menu.recommend_distribute_asset')}><i className="material-icons">post_add</i></a>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {assetsManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>

                {/* Form xem chi tiết thông tin tài sản */}
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
                        handoverFromDate={currentRowView.handoverFromDate}
                        handoverToDate={currentRowView.handoverToDate}
                        location={currentRowView.location}
                        description={currentRowView.description}
                        status={currentRowView.status}
                        typeRegisterForUse={currentRowView.typeRegisterForUse}
                        detailInfo={currentRowView.detailInfo}

                        cost={currentRowView.cost}
                        residualValue={currentRowView.residualValue}
                        startDepreciation={currentRowView.startDepreciation}
                        usefulLife={currentRowView.usefulLife}
                        depreciationType={currentRowView.depreciationType}

                        maintainanceLogs={currentRowView.maintainanceLogs}
                        usageLogs={currentRowView.usageLogs}
                        incidentLogs={currentRowView.incidentLogs}

                        residualValue={currentRowView.residualValue}
                        startDepreciation={currentRowView.startDepreciation}
                        usefulLife={currentRowView.usefulLife}
                        depreciationType={currentRowView.depreciationType}

                        archivedRecordNumber={currentRowView.archivedRecordNumber}
                        files={currentRowView.files}
                    />
                }

                {/* Form thêm mới phiếu đăng ký sử dụng thiết bị */}
                {
                    currentRow &&
                    <UseRequestCreateForm
                        _id={currentRow._id}
                        asset={currentRow._id}
                        typeRegisterForUse={currentRow.typeRegisterForUse}
                        managedBy={currentRow.managedBy}
                    />
                }
            </div >
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

const connectedListAsset = connect(mapState, actionCreators)(withTranslate(ListAsset));
export { connectedListAsset as ListAsset };
