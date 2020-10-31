import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti } from '../../../../../common-components';

import { IncidentEditForm } from './incidentEditForm';

import { IncidentActions } from '../redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { AssetManagerActions } from '../../../admin/asset-information/redux/actions';
import { AssetTypeActions } from "../../../admin/asset-type/redux/actions";

class AssetCrashManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            page: 0,
        }
    }

    componentDidMount() {
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        this.props.getUser();
        this.props.getAllAsset({
            code: "",
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            page: 0,
        });
    }

    // Bắt sự kiện click chỉnh sửa thông tin sự cố
    handleEdit = async (value, asset) => {
        value.asset = asset;
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-incident').modal('show');
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

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    handleAssetNameChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        this.setState({
            ...this.state,
            month: value
        });
    }

    // Function lưu giá trị loại phiếu vào state khi thay đổi
    handleTypeChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            type: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    handleSubmitSearch = async () => {
        await this.setState({
            ...this.state,

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

    deleteIncident = (assetId, incidentId) => {
        this.props.deleteIncident(assetId, incidentId).then(({ response }) => {
            if (response.data.success) {
                this.props.getAllAsset({
                    code: "",
                    assetName: "",
                    month: null,
                    status: "",
                    page: 0,
                    limit: 5,
                });
            }
        });
    }

    convertIncidentType = (type) => {
        const { translate } = this.props;
        if (type == 1) {
            return translate('asset.general_information.damaged');
        } else if (type == 2) {
            return translate('asset.general_information.lost')
        } else {
            return 'Type is deleted'
        }
    }

    render() {
        const { translate, assetsManager, assetType, user, auth } = this.props;
        const { page, limit, currentRow } = this.state;

        var lists = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
        var formater = new Intl.NumberFormat();
        if (assetsManager.isLoading === false) {
            lists = assetsManager.listAssets;
        }

        var pageTotal = ((assetsManager.totalList % limit) === 0) ?
            parseInt(assetsManager.totalList / limit) :
            parseInt((assetsManager.totalList / limit) + 1);

        var currentPage = parseInt((page / limit) + 1);

        return (
            <div id="assetcrash" className="tab-pane">
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
                            <input type="text" className="form-control" name="assetName" onChange={this.handleRepairNumberChange} placeholder={translate('asset.general_information.asset_name')} autoComplete="off" />
                        </div>
                    </div>

                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* Phân loại */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.type')}</label>
                            <SelectMulti id={`multiSelectType1`} multiple="multiple"
                                options={{ nonSelectedText: translate('asset.general_information.select_incident_type'), allSelectedText: translate('asset.general_information.select_all_incident_type') }}
                                onChange={this.handleTypeChange}
                                items={[
                                    { value: "broken", text: translate('asset.general_information.damaged') },
                                    { value: "lost", text: translate('asset.general_information.lost') }
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Tháng */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate(Date.now())}
                                onChange={this.handleMonthChange}
                            />
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={() => this.handleSubmitSearch()}>{translate('asset.general_information.search')}</button>
                        </div>
                    </div>

                    {/* Bảng thông tin sự cố */}
                    <table id="incident-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.incident_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.incident_type')}</th>
                                <th style={{ width: "8%" }}>{translate('asset.general_information.reported_by')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.date_incident')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.content')}</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="incident-table"
                                        columnArr={[
                                            translate('asset.general_information.asset_code'),
                                            translate('asset.general_information.asset_name'),
                                            translate('asset.general_information.incident_code'),
                                            translate('asset.general_information.incident_type'),
                                            translate('asset.general_information.reported_by'),
                                            translate('asset.general_information.date_incident'),
                                            translate('asset.general_information.content'),
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length) &&
                                lists.filter(item => item.assignedToUser === auth.user._id).map(asset => {
                                    return asset.incidentLogs.filter(item => item.reportedBy === auth.user._id).map((x, index) => (
                                        <tr key={index}>
                                            <td>{asset.code}</td>
                                            <td>{asset.assetName}</td>
                                            <td>{x.incidentCode}</td>
                                            <td>{this.convertIncidentType(x.type)}</td>
                                            <td>{x.reportedBy && userlist.length && userlist.filter(item => item._id === x.reportedBy).pop() ? userlist.filter(item => item._id === x.reportedBy).pop().name : 'User is deleted'}</td>
                                            <td>{this.formatDate2(x.dateOfIncident)}</td>
                                            <td>{x.description}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a onClick={() => this.handleEdit(x, asset)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.asset_info.edit_incident_info')}><i
                                                    className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content={translate('asset.asset_info.delete_incident_info')}
                                                    data={{
                                                        id: x._id,
                                                        info: asset.code + " - " + x.incidentCode
                                                    }}
                                                    func={() => this.deleteIncident(asset._id, x._id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                })

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

                {/* Form chỉnh sửa thông tin sự cố */}
                {
                    currentRow &&
                    <IncidentEditForm
                        _id={currentRow._id}
                        asset={currentRow.asset}
                        incidentCode={currentRow.incidentCode}
                        type={currentRow.type}
                        reportedBy={currentRow.reportedBy}
                        dateOfIncident={this.formatDate2(currentRow.dateOfIncident)}
                        description={currentRow.description}
                        statusIncident={currentRow.statusIncident}
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
    deleteIncident: IncidentActions.deleteIncident,
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
};

const connectedListIncident = connect(mapState, actionCreators)(withTranslate(AssetCrashManager));
export { connectedListIncident as AssetCrashManager };
