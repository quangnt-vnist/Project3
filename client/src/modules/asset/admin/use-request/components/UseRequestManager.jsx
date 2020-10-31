import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti, ExportExcel } from '../../../../../common-components';

import { UseRequestEditForm } from './UseRequestManagerEditForm';

import { RecommendDistributeActions } from '../../../user/use-request/redux/actions';
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { AssetManagerActions } from "../../asset-information/redux/actions";
import { AssetEditForm } from '../../asset-information/components/assetEditForm';

class UseRequestManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendNumber: "",
            month: "",
            status: null,
            page: 0,
            limit: 5,
            managedBy: this.props.managedBy ? this.props.managedBy : ''
        }
    }

    componentDidMount() {
        let { managedBy } = this.state;
        this.props.searchRecommendDistributes(this.state);
        this.props.getUser();

        if (!this.props.isActive || this.props.isActive === "tab-pane active") {
            this.props.getAllAsset({
                code: "",
                assetName: "",
                assetType: null,
                status: null,
                page: 0,
                limit: 5,
                managedBy: managedBy
            });
        }
    }

    // Bắt sự kiện click chỉnh sửa thông tin phiếu đề nghị
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-recommenddistributemanage').modal('show');
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
    handleRecommendNumberChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    // Function lưu giá trị mã  vào state khi thay đổi
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

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        this.setState({
            ...this.state,
            createReceiptsDate: value
        });
    }

    // Function lưu giá trị status vào state khi thay đổi
    handleReqForUsingEmployeeChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    // Function lưu giá trị status vào state khi thay đổi
    handleAppoverChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    // Function lưu giá trị status vào state khi thay đổi
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        };

        this.setState({
            ...this.state,
            reqUseStatus: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    handleSubmitSearch = async () => {
        if (this.state.month === "") {
            await this.setState({
                month: this.formatDate(Date.now()),
                page: 0
            })
        }
        this.props.searchRecommendDistributes(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.searchRecommendDistributes(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.searchRecommendDistributes(this.state);
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data) => {
        let fileName = "Bảng quản lý thông tin đăng kí sử dụng tài sản ";
        if (data) {
            data = data.map((x, index) => {

                let code = x.recommendNumber;
                let assetName = (x.asset) ? x.asset.assetName : "";
                let approver = (x.approver) ? x.approver.email : '';
                let assigner = (x.proponent) ? x.proponent.email : "";
                let createDate = x.dateCreate
                let dateStartUse = x.dateStartUse;
                let dateEndUse = x.dateEndUse;
                let assetCode = (x.asset) ? x.asset.code : ''
                let status = x.status;

                return {
                    index: index + 1,
                    code: code,
                    createDate: createDate,
                    assigner: assigner,
                    assetName: assetName,
                    assetCode: assetCode,
                    dateStartUse: dateStartUse,
                    dateEndUse: dateEndUse,
                    approver: approver,
                    status: status

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
                                { key: "code", value: "Mã phiếu" },
                                { key: "createDate", value: "Ngày tạo" },
                                { key: "assigner", value: "Người đăng kí" },
                                { key: "assetName", value: "Tên tài sản" },
                                { key: "assetCode", value: "Mã tài sản" },
                                { key: "dateStartUse", value: "Ngày bắt đầu sử dụng" },
                                { key: "dateEndUse", value: "Ngày kết thúc sử dụng" },
                                { key: "appprover", value: "Người phê duyệt" },
                                { key: "status", value: "Trạng thái" },
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData;

    }

    // Bắt sự kiện click chỉnh sửa thông tin tài sản
    handleEditAsset = async (value) => {
        console.log(value);
        await this.setState(state => {
            return {
                ...state,
                currentRowEditAsset: value
            }
        });
        window.$('#modal-edit-asset').modal('show');

        // Mở tab thứ 3
        window.$('.nav-tabs li:eq(2) a').tab('show');

    }

    formatStatus(status) {
        const { translate } = this.props;

        switch (status) {
            case 'approved': return translate('asset.usage.approved');
            case 'waiting_for_approval': return translate('asset.usage.waiting_approval');
            case 'disapproved': return translate('asset.usage.not_approved');
            default: return 'Deleted';
        }
    }

    render() {
        const { translate, recommendDistribute, isActive } = this.props;
        const { page, limit, currentRow, currentRowEditAsset, managedBy } = this.state;

        var listRecommendDistributes = "", exportData;
        if (recommendDistribute.isLoading === false) {
            listRecommendDistributes = recommendDistribute.listRecommendDistributes;
            exportData = this.convertDataToExportData(listRecommendDistributes);
        }

        var pageTotal = ((recommendDistribute.totalList % limit) === 0) ?
            parseInt(recommendDistribute.totalList / limit) :
            parseInt((recommendDistribute.totalList / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);
        return (
            //Khi id !== undefined thi component nay duoc goi tu module user
            <div className={isActive ? isActive : "box"} >
                <div className="box-body qlcv">
                    {/* Thanh tìm kiếm */}
                    <div className="form-inline">
                        {/* Mã phiếu */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.form_code')}</label>
                            <input type="text" className="form-control" name="receiptsCode" onChange={this.handleRecommendNumberChange} placeholder={translate('asset.general_information.form_code')} autoComplete="off" />
                        </div>

                        {/* Tháng  lập phiếu*/}
                        <div className="form-group">
                            <label className="form-control-static">Ngày lập phiếu</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                // value={this.formatDate(Date.now())}
                                onChange={this.handleMonthChange}
                            />
                        </div>
                    </div>

                    <div className="form-inline">
                        {/* Người được đăng ký sử dụng */}
                        <div className="form-group">
                            <label className="form-control-static">Người đăng ký</label>
                            <input type="text" className="form-control" name="reqUseEmployee" onChange={this.handleReqForUsingEmployeeChange} placeholder="Người đăng ký" autoComplete="off" />
                        </div>

                        {/* Người phê duyệt đăng ký sử dụng */}
                        <div className="form-group">
                            <label className="form-control-static">Người phê duyệt</label>
                            <input type="text" className="form-control" name="approver" onChange={this.handleAppoverChange} placeholder="Người phê duyệt" autoComplete="off" />
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
                                    { value: "Đã phê duyệt", text: translate('asset.usage.approved') },
                                    { value: "Chờ phê duyệt", text: translate('asset.usage.waiting_approval') },
                                    { value: "Không phê duyệt", text: translate('asset.usage.not_approved') }
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSubmitSearch()} >{translate('page.add_search')}</button>
                        </div>
                        {exportData && <ExportExcel id="export-asset-recommened-distribute-management" exportData={exportData} style={{ marginRight: 10 }} />}
                    </div>

                    {/* Bảng thông tin đăng kí sử dụng tài sản */}
                    <table id="recommenddistributemanager-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "17%" }}>{translate('asset.general_information.asset_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.form_code')}</th>
                                <th style={{ width: "15%" }}>{translate('asset.general_information.create_date')}</th>
                                <th style={{ width: "15%" }}>{translate('asset.usage.proponent')}</th>
                                <th style={{ width: "15%" }}>{translate('asset.general_information.asset_name')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.general_information.handover_from_date')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.general_information.handover_to_date')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.usage.accountable')}</th>
                                <th style={{ width: "11%" }}>{translate('asset.general_information.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="recommenddistributemanager-table"
                                        columnArr={[
                                            translate('asset.general_information.asset_code'),
                                            translate('asset.general_information.form_code'),
                                            translate('asset.general_information.create_date'),
                                            translate('asset.usage.proponent'),
                                            translate('asset.general_information.asset_name'),
                                            translate('asset.general_information.handover_from_date'),
                                            translate('asset.general_information.handover_to_date'),
                                            translate('asset.usage.accountable'),
                                            translate('asset.general_information.status'),
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(listRecommendDistributes && listRecommendDistributes.length !== 0) &&
                                listRecommendDistributes.map((x, index) => {
                                    return (<tr key={index}>
                                        <td><a onClick={() => this.handleEditAsset(x.asset)}>{x.asset ? x.asset.code : 'Asset is deleted'}</a></td>
                                        <td>{x.recommendNumber}</td>
                                        <td>{this.formatDate2(x.dateCreate)}</td>
                                        <td>{x.proponent ? x.proponent.name : 'User is deleted'}</td>
                                        <td>{x.asset ? x.asset.assetName : 'Asset is deleted'}</td>
                                        <td>{this.formatDate2(x.dateStartUse)}</td>
                                        <td>{this.formatDate2(x.dateEndUse)}</td>
                                        <td>{x.approver ? x.approver.name : 'User is deleted'}</td>
                                        <td>{this.formatStatus(x.status)}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.asset_info.edit_usage_info')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('asset.asset_info.delete_usage_info')}
                                                data={{
                                                    id: x._id,
                                                    // info: x.recommendNumber + " - " + x.dateCreate.replace(/-/gi, "/")
                                                }}
                                                func={this.props.deleteRecommendDistribute}
                                            />
                                        </td>
                                    </tr>)
                                })
                            }
                        </tbody>
                    </table>
                    {recommendDistribute.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listRecommendDistributes || listRecommendDistributes.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>

                {/* Form chỉnh sửa phiếu đăng ký sử dụng */}
                {
                    currentRow &&
                    <UseRequestEditForm
                        _id={currentRow._id}
                        employeeId={managedBy}
                        recommendNumber={currentRow.recommendNumber}
                        dateCreate={currentRow.dateCreate}
                        proponent={currentRow.proponent}
                        reqContent={currentRow.reqContent}
                        asset={currentRow.asset}
                        dateStartUse={currentRow.dateStartUse}
                        dateEndUse={currentRow.dateEndUse}
                        approver={currentRow.approver}
                        status={currentRow.status}
                        note={currentRow.note}
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

            </div >
        );
    }
};

function mapState(state) {
    const { recommendDistribute, assetsManager, assetType, user, auth } = state;
    return { recommendDistribute, assetsManager, assetType, user, auth };
};

const actionCreators = {
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
    searchRecommendDistributes: RecommendDistributeActions.searchRecommendDistributes,
    deleteRecommendDistribute: RecommendDistributeActions.deleteRecommendDistribute,

};

const connectedUseRequestManager = connect(mapState, actionCreators)(withTranslate(UseRequestManager));
export { connectedUseRequestManager as UseRequestManager };
