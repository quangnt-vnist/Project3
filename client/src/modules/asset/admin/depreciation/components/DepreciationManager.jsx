import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, PaginateBar, SelectMulti, ExportExcel, TreeSelect } from '../../../../../common-components';

import { AssetManagerActions } from '../../asset-information/redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { UserActions } from '../../../../super-admin/user/redux/actions';

import { AssetDetailForm, AssetEditForm } from '../../asset-information/components/combinedContent';
import { DepreciationEditForm } from './depreciationEditForm';

class DepreciationManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            assetName: "",
            assetType: null,
            month: "",
            page: 0,
            limit: 5,
            managedBy: this.props.managedBy ? this.props.managedBy : ''
        }
    }

    componentDidMount() {
        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        this.props.getAllAsset(this.state);
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

    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate2(date) {
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

    // Bắt sự kiện click xem thông tin tài sản
    // handleView = async (value) => {
    //     await this.setState(state => {
    //         return {
    //             currentRowView: value
    //         }
    //     });
    //     window.$('#modal-view-asset').modal('show');
    // }

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

    // Function lưu giá trị tháng bắt đầu khấu hao vào state khi thay đổi
    handleMonthStartChange = (value) => {
        this.setState({
            ...this.state,
            startDepreciation: value
        });
    }

    // Function lưu loại khấu hao
    handleDepreciationTypeChange = (value) => {
        this.setState({
            ...this.state,
            depreciationType: value
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

    addMonth = (date, month) => {
        date = new Date(date);
        let newDate = new Date(date.setMonth(date.getMonth() + month));

        return this.formatDate(newDate);
    };

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data, assettypelist) => {
        let fileName = "Bảng quản lý khấu hao tài sản ";
        let formater = new Intl.NumberFormat();

        if (data) {

            data = data.map((x, index) => {

                let code = x.code;
                let assetName = x.assetName;
                let type = assettypelist && assettypelist.filter(item => item._id === x.assetType).pop() ? assettypelist.filter(item => item._id === x.assetType).pop().typeName : ''
                let cost = formater.format(parseInt(x.cost));
                let startDepreciation = this.formatDate(x.startDepreciation);
                let month = x.usefulLife;
                let depreciationPerYear = formater.format(parseInt(12 * (x.cost / x.usefulLife)));
                let depreciationPerMonth = formater.format(parseInt((x.cost / x.usefulLife)));
                let accumulatedValue = formater.format(parseInt(((x.cost / x.usefulLife)) * ((new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(x.startDepreciation).getFullYear() * 12 + new Date(x.startDepreciation).getMonth()))));
                let remainingValue = formater.format(parseInt(x.cost - ((x.cost / x.usefulLife)) * ((new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(x.startDepreciation).getFullYear() * 12 + new Date(x.startDepreciation).getMonth()))));
                let endDepreciation = this.addMonth(x.startDepreciation, x.usefulLife);

                return {
                    index: index + 1,
                    code: code,
                    assetName: assetName,
                    type: type,
                    cost: cost,
                    startDepreciation: startDepreciation,
                    month: month,
                    depreciationPerYear: depreciationPerYear,
                    depreciationPerMonth: depreciationPerMonth,
                    accumulatedValue: accumulatedValue,
                    remainingValue: remainingValue,
                    endDepreciation: endDepreciation

                }

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
                                { key: "code", value: "Mã tài sản" },
                                { key: "assetName", value: "Tên tài sản" },
                                { key: "type", value: "Loại tài sản" },
                                { key: "cost", value: "Nguyên giá (VNĐ)" },
                                { key: "startDepreciation", value: "Thời gian bắt đầu trích khấu hao" },
                                { key: "month", value: "Thời gian chích khấu hao" },
                                { key: "depreciationPerYear", value: "Mức độ khấu hao trung bình hàng năm" },
                                { key: "depreciationPerMonth", value: "Mức độ khấu hao trung bình hàng tháng" },
                                { key: "accumulatedValue", value: "Giá trị hao mòn lũy kế" },
                                { key: "remainingValue", value: "Giá trị còn lại" },
                                { key: "endDepreciation", value: "Thời gian kết thúc trích khấu hao" },
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData;

    }

    /**
     * Hàm để tính các giá trị khấu hao cho tài sản
     * @param {*} depreciationType Phương pháp khấu hao
     * @param {*} cost Nguyên giá
     * @param {*} usefulLife Thời gian trích khấu hao
     * @param {*} startDepreciation Thời gian bắt đầu trích khấu hao
     * @param {*} estimatedTotalProduction Sản lượng theo công suất thiết kế (trong 1 năm)
     * @param {*} unitsProducedDuringTheYears Sản lượng sản phẩm trong các tháng
     */
    calculateDepreciation = (depreciationType, cost, usefulLife, estimatedTotalProduction, unitsProducedDuringTheYears, startDepreciation) => {
        let annualDepreciation = 0, monthlyDepreciation = 0, remainingValue = cost;

        if (depreciationType === "straight_line") { // Phương pháp khấu hao theo đường thẳng
            annualDepreciation = ((12 * cost) / usefulLife);
            monthlyDepreciation = cost / usefulLife;
            remainingValue = cost - (cost / usefulLife) * ((new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth()));

        } else if (depreciationType === "declining_balance") { // Phương pháp khấu hao theo số dư giảm dần
            let lastYears = false,
                t,
                usefulYear = usefulLife / 12,
                usedTime = (new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth());

            if (usefulYear < 4) {
                t = (1 / usefulYear) * 1.5;
            } else if (usefulYear >= 4 && usefulYear <= 6) {
                t = (1 / usefulYear) * 2;
            } else if (usefulYear > 6) {
                t = (1 / usefulYear) * 2.5;
            }

            // Tính khấu hao đến năm hiện tại
            for (let i = 1; i <= usedTime / 12; i++) {
                if (!lastYears) {
                    if (remainingValue * t > (remainingValue / (usefulYear - i + 1))) {
                        annualDepreciation = remainingValue * t;
                    } else {
                        annualDepreciation = (remainingValue / (usefulYear - i + 1));
                        lastYears = true;
                    }
                }

                remainingValue = remainingValue - annualDepreciation;
            }

            // Tính khấu hao đến tháng hiện tại
            if (usedTime % 12 !== 0) {
                if (!lastYears) {
                    if (remainingValue * t > (remainingValue / (usefulYear - Math.floor(usedTime / 12)))) {
                        annualDepreciation = remainingValue * t;
                    } else {
                        annualDepreciation = (remainingValue / (usefulYear - Math.floor(usedTime / 12)));
                        lastYears = true;
                    }
                }

                monthlyDepreciation = annualDepreciation / 12;
                remainingValue = remainingValue - (monthlyDepreciation * (usedTime % 12))
            }

        } else if (depreciationType === "units_of_production") { // Phương pháp khấu hao theo sản lượng
            let monthTotal = unitsProducedDuringTheYears.length; // Tổng số tháng tính khấu hao
            let productUnitDepreciation = cost / (estimatedTotalProduction * (usefulLife / 12)); // Mức khấu hao đơn vị sản phẩm
            let accumulatedDepreciation = 0; // Giá trị hao mòn lũy kế

            for (let i = 0; i < monthTotal; i++) {
                accumulatedDepreciation += unitsProducedDuringTheYears[i].unitsProducedDuringTheYear * productUnitDepreciation;
            }

            remainingValue = cost - accumulatedDepreciation;
            annualDepreciation = monthTotal ? accumulatedDepreciation * 12 / monthTotal : 0;
        }

        return [parseInt(annualDepreciation), parseInt(annualDepreciation / 12), parseInt(remainingValue)];
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

        // Mở tab thứ 2
        window.$('.nav-tabs li:eq(1) a').tab('show');

    }
    // Lấy danh sách loại tài sản cho tree select
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
        const { translate } = this.props;

        if (group === 'building') {
            return translate('asset.asset_info.building');
        } else if (group === 'vehicle') {
            return translate('asset.asset_info.vehicle')
        } else if (group === 'machine') {
            return translate('asset.asset_info.machine')
        } else {
            return translate('asset.asset_info.other')
        }

    }

    render() {
        const { translate, assetsManager, assetType } = this.props;
        var { page, limit, currentRowView, currentRowEditAsset, managedBy } = this.state;

        var lists = "", exportData;
        var assettypelist = assetType.listAssetTypes;
        let typeArr = this.getAssetTypes();
        let assetTypeName = this.state.assetType ? this.state.assetType : [];

        var formater = new Intl.NumberFormat();
        if (assetsManager.isLoading === false) {
            lists = assetsManager.listAssets;
        }

        var pageTotal = ((assetsManager.totalList % limit) === 0) ?
            parseInt(assetsManager.totalList / limit) :
            parseInt((assetsManager.totalList / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);

        if (lists && assettypelist) {
            exportData = this.convertDataToExportData(lists, assettypelist);
        }

        return (
            <div className="box">
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

                        {/* Phân loại */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.asset_type')}</label>
                            <TreeSelect
                                data={typeArr}
                                value={assetTypeName}
                                handleChange={this.handleAssetTypeChange}
                                mode="hierarchical"
                            />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>

                        {/* Loại khấu hao */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.asset_type')}</label>
                            <SelectMulti id={`multiSelectDepreTypeInManagement`} multiple="multiple"
                                options={{ nonSelectedText: translate('asset.depreciation.select_depreciation_type'), allSelectedText: translate('asset.depreciation.select_all_depreciation_type') }}
                                onChange={this.handleDepreciationTypeChange}
                                items={[
                                    { value: "straight_line", text: translate('asset.depreciation.line') },
                                    { value: "declining_balance", text: translate('asset.depreciation.declining_balance') },
                                    { value: "units_of_production", text: translate('asset.depreciation.units_production') },
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Tháng bắt đầu trích khấu hao */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.start_depreciation')}</label>
                            <DatePicker
                                id="month-start-depreciation"
                                dateFormat="month-year"
                                // value={this.formatDate2(Date.now())}
                                onChange={this.handleMonthStartChange}
                            />
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={() => this.handleSubmitSearch()}>{translate('asset.general_information.search')}</button>
                        </div>
                        {exportData && <ExportExcel id="export-asset-depreciation-management" exportData={exportData} style={{ marginRight: 10 }} />}
                    </div>

                    {/* Bảng thông tin khấu hao */}
                    <table id="depreciation-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>{translate('asset.general_information.asset_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_group')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_type')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.original_price')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.start_depreciation')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.depreciation.depreciation_time')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.asset_info.annual_depreciation')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.asset_info.monthly_depreciation')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.depreciation.accumulated_value')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.depreciation.remaining_value')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.end_depreciation')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('asset.general_information.action')}
                                    <DataTableSetting
                                        tableId="depreciation-table"
                                        columnArr={[
                                            translate('asset.general_information.asset_code'),
                                            translate('asset.general_information.asset_name'),
                                            translate('asset.general_information.asset_group'),
                                            translate('asset.general_information.asset_type'),
                                            translate('asset.general_information.original_price'),
                                            translate('asset.general_information.start_depreciation'),
                                            translate('asset.depreciation.depreciation_time'),
                                            translate('asset.asset_info.annual_depreciation'),
                                            translate('asset.asset_info.monthly_depreciation'),
                                            translate('asset.depreciation.accumulated_value'),
                                            translate('asset.depreciation.remaining_value'),
                                            translate('asset.general_information.end_depreciation')
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {lists &&
                                lists.map((x, index) => {
                                    let result = this.calculateDepreciation(x.depreciationType, x.cost, x.usefulLife, x.estimatedTotalProduction, x.unitsProducedDuringTheYears, x.startDepreciation);
                                    return (
                                        <tr key={index}>
                                            <td><a onClick={() => this.handleEditAsset(x)}>{x.code}</a></td>
                                            <td>{x.assetName}</td>
                                            <td>{this.convertGroupAsset(x.group)}</td>
                                            <td>{x.assetType && x.assetType.length ? x.assetType.map((item, index) => { let suffix = index < x.assetType.length - 1 ? ", " : ""; return item.typeName + suffix }) : 'Asset is deleted'}</td>
                                            <td>{formater.format(parseInt(x.cost))} VNĐ</td>
                                            <td>{this.formatDate(x.startDepreciation)}</td>
                                            <td>{x.usefulLife} {translate('training.course.month')}</td>
                                            <td>{formater.format(result[0])} VNĐ/{translate('training.course.year')}</td>
                                            <td>{formater.format(result[1])} VNĐ/{translate('training.course.month')}</td>
                                            <td>{formater.format(x.cost - result[2])} VNĐ</td>
                                            <td>{formater.format(result[2])} VNĐ</td>
                                            <td>{this.addMonth(x.startDepreciation, x.usefulLife)}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('asset.general_information.view')}><i className="material-icons">view_list</i></a>
                                            </td>
                                        </tr>
                                    )
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

                {/* Form xem chi tiết thông tin khấu hao */}
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
                        estimatedTotalProduction={currentRowView.estimatedTotalProduction}
                        unitsProducedDuringTheYears={currentRowView.unitsProducedDuringTheYears}
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

                {/* Form chỉnh sửa thông tin tài sản */}
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
    const { assetsManager, assetType, user } = state;
    return { assetsManager, assetType, user };
};

const actionCreators = {
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getAllAsset: AssetManagerActions.getAllAsset,
    getUser: UserActions.get,
};

const connectedListDepreciation = connect(mapState, actionCreators)(withTranslate(DepreciationManager));
export { connectedListDepreciation as DepreciationManager };
