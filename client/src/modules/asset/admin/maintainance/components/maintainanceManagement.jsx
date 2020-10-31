import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti, ExportExcel } from '../../../../../common-components';

import { MaintainanceCreateForm } from './maintainanceCreateForm';
import { MaintainanceEditForm } from './maintainanceEditForm';

import { AssetManagerActions } from '../../asset-information/redux/actions';
import { MaintainanceActions } from '../redux/actions';
import { AssetEditForm } from '../../asset-information/components/assetEditForm';

class MaintainanceManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            maintainanceCode: "",
            maintainCreateDate: "",
            type: '',
            status: '',
            page: 1,
            limit: 5,
            managedBy: this.props.managedBy ? this.props.managedBy : ''
        }
    }

    componentDidMount() {
        this.props.getMaintainances(this.state);
    }

    // Bắt sự kiện click chỉnh sửa thông tin phiếu đề nghị
    handleEdit = async (value, asset) => {
        value.asset = asset;
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-maintainance').modal('show');
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

    // Function lưu giá trị mã phiếu vào state khi thay đổi
    handleMaintainanceCodeChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    handleCodeChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMaintainCreateDateChange = (value) => {
        this.setState({
            ...this.state,
            maintainCreateDate: value
        });
    }

    // Function lưu giá trị loại phiếu vào state khi thay đổi
    handleTypeChange = (value) => {
        if (value.length === 0) {
            value = ''
        }

        this.setState({
            ...this.state,
            type: value
        })
    }

    // Function lưu giá trị status vào state khi thay đổi
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = ''
        }

        this.setState({
            ...this.state,
            status: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    handleSubmitSearch = async () => {
        await this.setState({
            ...this.state,
            page: 1
        })
        this.props.getMaintainances(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getMaintainances(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        await this.setState({
            page: parseInt(pageNumber),

        });
        this.props.getMaintainances(this.state);
    }

    deleteMaintainance = (assetId, maintainanceId) => {
        this.props.deleteMaintainance(assetId, maintainanceId).then(({ response }) => {
            if (response.data.success) {
                this.props.getMaintainances(this.state);
            }
        });
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data) => {
        let fileName = "Bảng quản lý thông tin bảo trì tài sản ";
        let convertedData = [];
        if (data) {
            data = data.forEach((x, index) => {
                let code = x.maintainanceCode;
                let assetName = x.asset.assetName;
                let type = x.type;
                let description = x.description;
                let createDate = this.formatDate2(x.createDate)
                let startDate = this.formatDate2(x.startDate);
                let endDate = this.formatDate2(x.endDate);
                let cost = parseInt(x.expense);
                let assetCode = x.asset.code;
                let status = x.status;

                let item = {
                    index: index + 1,
                    code: code,
                    createDate: createDate,
                    type: type,
                    assetName: assetName,
                    assetCode: assetCode,
                    des: description,
                    createDate: createDate,
                    startDate: startDate,
                    endDate: endDate,
                    cost: cost,
                    status: status

                }

                convertedData.push(item);

            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: fileName,
                    tables: [
                        {
                            rowHeader: 2,
                            columns: [
                                { key: "index", value: "STT" },
                                { key: "code", value: "Mã phiếu" },
                                { key: "createDate", value: "Ngày tạo" },
                                { key: "type", value: "Phân loại" },
                                { key: "assetCode", value: "Mã tài sản" },
                                { key: "assetName", value: "Tên tài sản" },
                                { key: "des", value: "Nội dung" },
                                { key: "startDate", value: "Ngày bắt đầu" },
                                { key: "endDate", value: "Ngày kết thúc" },
                                { key: "cost", value: "chi phí" },
                                { key: "status", value: "Trạng thái" },
                            ],
                            data: convertedData
                        }
                    ]
                },
            ]
        }
        return exportData;

    }

    // Bắt sự kiện click chỉnh sửa thông tin tài sản
    handleEditAsset = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowEditAsset: value
            }
        });
        window.$('#modal-edit-asset').modal('show');

        // Mở tab thứ 5
        window.$('.nav-tabs li:eq(4) a').tab('show');

    }

    convertMaintainStatus = (status) => {
        if (status == 1) {
            return 'Chưa thực hiện';
        } else if (status == 2) {
            return 'Đang thực hiện'
        } else if (status == 3) {
            return 'Đã thực hiện'
        } else {
            return 'Status is deleted'
        }
    }
    convertMaintainType = (type) => {
        if (type == 1) {
            return 'Sửa chữa';
        } else if (type == 2) {
            return 'Thay thế'
        } else if (type == 3) {
            return 'Nâng cấp'
        } else {
            return 'Type is deleted'
        }
    }

    render() {
        const { translate, mintainanceManager } = this.props;
        const { page, limit, currentRow, currentRowEditAsset, managedBy } = this.state;

        var lists = "", exportData;
        var formater = new Intl.NumberFormat();
        if (mintainanceManager.isLoading === false) {
            lists = mintainanceManager.mintainanceList;
            exportData = this.convertDataToExportData(lists);
        }

        var pageTotal = ((mintainanceManager.mintainanceLength % limit) === 0) ?
            parseInt(mintainanceManager.mintainanceLength / limit) :
            parseInt((mintainanceManager.mintainanceLength / limit) + 1);

        return (
            <div className="box">
                <div className="box-body qlcv">

                    {/* Form thêm phiếu bảo trì */}
                    <MaintainanceCreateForm />

                    {/* Thanh tìm kiếm */}
                    <div className="form-inline">
                        {/* Mã phiếu */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.form_code')}</label>
                            <input type="text" className="form-control" name="maintainanceCode" onChange={this.handleMaintainanceCodeChange} placeholder={translate('asset.general_information.form_code')} autoComplete="off" />
                        </div>

                        {/* Mã tài sản */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.asset_code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder={translate('asset.general_information.asset_code')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        {/* Phân loại */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.type')}</label>
                            <SelectMulti id={`multiSelectType`} multiple="multiple"
                                options={{ nonSelectedText: translate('asset.general_information.select_reception_type'), allSelectedText: translate('asset.general_information.select_all_reception_type') }}
                                onChange={this.handleTypeChange}
                                items={[
                                    { value: 1, text: translate('asset.asset_info.repair') },
                                    { value: 2, text: translate('asset.asset_info.replace') },
                                    { value: 3, text: translate('asset.asset_info.upgrade') }
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Tháng */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.create_reception_date')}</label>
                            <DatePicker
                                id="maintain-month"
                                dateFormat="month-year"
                                // value={this.formatDate(Date.now())}
                                onChange={this.handleMaintainCreateDateChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* Trạng thái */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('page.all_status') }}
                                onChange={this.handleStatusChange}
                                items={[
                                    { value: 1, text: translate('asset.asset_info.unfulfilled') },
                                    { value: 2, text: translate('asset.asset_info.processing') },
                                    { value: 3, text: translate('asset.asset_info.made') },
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={() => this.handleSubmitSearch()}>{translate('asset.general_information.search')}</button>
                        </div>
                        {exportData && <ExportExcel id="export-asset-maintainance-management" exportData={exportData} style={{ marginRight: 10 }} />}
                    </div>

                    {/* Bảng thông tin bảo trì tài sản */}
                    <table id="maintainance-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>{translate('asset.general_information.asset_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.form_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.create_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.type')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.content')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.start_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.end_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.expense')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.status')}</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="maintainance-table"
                                        columnArr={[
                                            translate('asset.general_information.asset_code'),
                                            translate('asset.general_information.form_code'),
                                            translate('asset.general_information.create_date'),
                                            translate('asset.general_information.type'),
                                            translate('asset.general_information.asset_name'),
                                            translate('asset.general_information.content'),
                                            translate('asset.general_information.start_date'),
                                            translate('asset.general_information.end_date'),
                                            translate('asset.general_information.expense'),
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
                                lists.map((x, index) => (
                                    <tr key={index}>
                                        <td><a onClick={() => this.handleEditAsset(x.asset)}>{x.asset.code}</a></td>
                                        <td>{x.maintainanceCode}</td>
                                        <td>{x.createDate ? this.formatDate2(x.createDate) : ''}</td>
                                        <td>{this.convertMaintainType(x.type)}</td>
                                        <td>{x.asset.assetName}</td>
                                        <td>{x.description}</td>
                                        <td>{x.startDate ? this.formatDate2(x.startDate) : ''}</td>
                                        <td>{x.endDate ? this.formatDate2(x.endDate) : ''}</td>
                                        <td>{x.expense ? formater.format(parseInt(x.expense)) : ''} VNĐ</td>
                                        <td>{this.convertMaintainStatus(x.status)}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleEdit(x, x.asset)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.asset_info.edit_maintenance_card')}><i
                                                className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('asset.asset_info.delete_maintenance_card')}
                                                data={{
                                                    id: x._id,
                                                    info: x.maintainanceCode ? x.maintainanceCode : '' + " - "
                                                }}
                                                func={() => this.deleteMaintainance(x.asset._id, x._id)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {mintainanceManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>

                {/* Form chỉnh sửa phiếu bảo trì */}
                {
                    currentRow &&
                    <MaintainanceEditForm
                        _id={currentRow._id}
                        asset={currentRow.asset}
                        maintainanceCode={currentRow.maintainanceCode}
                        createDate={this.formatDate2(currentRow.createDate)}
                        type={currentRow.type}
                        description={currentRow.description}
                        startDate={this.formatDate2(currentRow.startDate)}
                        endDate={this.formatDate2(currentRow.endDate)}
                        expense={currentRow.expense}
                        status={currentRow.status}
                    />
                }

                {
                    currentRowEditAsset &&
                    <AssetEditForm
                        _id={currentRowEditAsset._id}
                        employeeId={managedBy}
                        avatar={currentRowEditAsset.avatar}
                        code={currentRowEditAsset.code}
                        assetName={currentRowEditAsset.assetName}
                        serial={currentRowEditAsset.serial}
                        assetType={currentRowEditAsset.assetType}
                        group={currentRowEditAsset.group}
                        purchaseDate={currentRowEditAsset.purchaseDate}
                        warrantyExpirationDate={currentRowEditAsset.warrantyExpirationDate}
                        managedBy={currentRowEditAsset.managedBy}
                        assignedToUser={currentRowEditAsset.assignedToUser}
                        assignedToOrganizationalUnit={currentRowEditAsset.assignedToOrganizationalUnit}
                        handoverFromDate={currentRowEditAsset.handoverFromDate}
                        handoverToDate={currentRowEditAsset.handoverToDate}
                        location={currentRowEditAsset.location}
                        description={currentRowEditAsset.description}
                        status={currentRowEditAsset.status}
                        canRegisterForUse={currentRowEditAsset.canRegisterForUse}
                        detailInfo={currentRowEditAsset.detailInfo}
                        readByRoles={currentRowEditAsset.readByRoles}
                        cost={currentRowEditAsset.cost}
                        residualValue={currentRowEditAsset.residualValue}
                        startDepreciation={currentRowEditAsset.startDepreciation}
                        usefulLife={currentRowEditAsset.usefulLife}
                        depreciationType={currentRowEditAsset.depreciationType}
                        estimatedTotalProduction={currentRowEditAsset.estimatedTotalProduction}
                        unitsProducedDuringTheYears={currentRowEditAsset.unitsProducedDuringTheYears && currentRowEditAsset.unitsProducedDuringTheYears.map((x) => ({
                            month: this.formatDate2(x.month),
                            unitsProducedDuringTheYear: x.unitsProducedDuringTheYear
                        })
                        )}

                        disposalDate={currentRowEditAsset.disposalDate}
                        disposalType={currentRowEditAsset.disposalType}
                        disposalCost={currentRowEditAsset.disposalCost}
                        disposalDesc={currentRowEditAsset.disposalDesc}

                        maintainanceLogs={currentRowEditAsset.maintainanceLogs}
                        usageLogs={currentRowEditAsset.usageLogs}
                        incidentLogs={currentRowEditAsset.incidentLogs}
                        archivedRecordNumber={currentRowEditAsset.archivedRecordNumber}
                        files={currentRowEditAsset.documents}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { mintainanceManager } = state;
    return { mintainanceManager };
};

const actionCreators = {
    getMaintainances: MaintainanceActions.getMaintainances,
    deleteMaintainance: MaintainanceActions.deleteMaintainance,
};

const connectedListMaintainance = connect(mapState, actionCreators)(withTranslate(MaintainanceManagement));
export { connectedListMaintainance as MaintainanceManagement };
