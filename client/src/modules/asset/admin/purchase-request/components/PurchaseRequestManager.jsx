import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti, ExportExcel } from '../../../../../common-components';

import { RecommendProcureActions } from '../../../user/purchase-request/redux/actions';
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { PurchaseRequestDetailForm } from "../../../user/purchase-request/components/PurchaseRequestDetailForm";

import { PurchaseRequestEditForm } from './PurchaseRequestManagerEditForm';

class PurchaseRequestManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendNumber: "",
            month: "",
            status: null,
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.searchRecommendProcures(this.state);
        this.props.getUser();
    }

    // Bắt sự kiện click xem thông tin phiếu đề nghị mua sắm
    handleView = async (value) => {
        await this.setState(state => {
            return {
                currentRowView: value
            }
        });
        window.$('#modal-view-recommendprocure').modal('show');
    }

    // Bắt sự kiện click chỉnh sửa thông tin phiếu đề nghị mua sắm
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-recommendprocuremanage').modal('show');
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

    // Function lưu giá trị mã nhân viên vào state khi thay đổi
    handleRecommendNumberChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        this.setState({
            ...this.state,
            proposalDate: value
        });
    }

    // Function lưu người đề nghị vào state khi thay đổi
    handleProposalEmployeeChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    // Function lưu giá trị tháng vào state khi thay đổi
    handleApproverChange = (event) => {
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
            status: value
        })
    }

    // Function bắt sự kiện tìm kiếm 
    handleSubmitSearch = async () => {
        await this.setState({
            ...this.state,
            page: 0
        })
        console.log('thí', this.state);
        this.props.searchRecommendProcures(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.searchRecommendProcures(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.searchRecommendProcures(this.state);
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data) => {
        let fileName = "Bảng quản lý đề nghị mua sắm tài sản ";
        if (data) {
            data = data.map((x, index) => {

                let code = x.recommendNumber;
                let equipment = x.equipment;
                let assigner = (x.proponent) ? x.proponent.email : 'Không tìm thấy người đề nghị'
                let createDate = x.dateCreate;
                let note = x.note;
                let supplier = x.supplier;
                let amount = x.total;
                let cost = parseInt(x.estimatePrice);
                let status = x.status;
                let approver = (x.approver) ? x.approver.email : "";

                return {
                    index: index + 1,
                    code: code,
                    createDate: createDate,
                    assigner: assigner,
                    note: note,
                    supplier: supplier,
                    amount: amount,
                    cost: cost,
                    status: status,
                    equipment: equipment,
                    approver: approver
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
                                { key: "assigner", value: " Người đăng kí" },
                                { key: "approver", value: "Người phê duyệt" },
                                { key: "createDate", value: "Ngày tạo" },
                                { key: "equipment", value: "Thiết bị đề nghị mua sắm" },
                                { key: "note", value: "Ghi chú" },
                                { key: "amount", value: "Số lượng" },
                                { key: "cost", value: "Đơn giá" },
                                { key: "supplier", value: "Nhà cung cấp" },
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

    getUserId = () => {
        let { user } = this.props;
        let listUser = user && user.list;
        let userArr = [];
        listUser.map(x => {
            userArr.push({
                value: x._id,
                text: x.name
            })
        })

        return userArr;
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
        const { translate, recommendProcure } = this.props;
        const { page, limit, currentRowView, currentRow } = this.state;

        var listRecommendProcures = "", exportData;
        if (recommendProcure.isLoading === false) {
            listRecommendProcures = recommendProcure.listRecommendProcures;
            exportData = this.convertDataToExportData(listRecommendProcures)
        }

        var pageTotal = ((recommendProcure.totalList % limit) === 0) ?
            parseInt(recommendProcure.totalList / limit) :
            parseInt((recommendProcure.totalList / limit) + 1);

        var currentPage = parseInt((page / limit) + 1);
        let userIdArr = this.getUserId();

        return (
            <div className="box" >
                <div className="box-body qlcv">

                    {/* Thanh tìm kiếm */}
                    <div className="form-inline">
                        {/* Mã phiếu */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.form_code')}</label>
                            <input type="text" className="form-control" name="recommendNumber" onChange={this.handleRecommendNumberChange} placeholder={translate('asset.general_information.form_code')} autoComplete="off" />
                        </div>

                        {/* Tháng */}
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

                        {/* Người đề nghị */}
                        <div className="form-group">
                            <label className="form-control-static">Người đề nghị</label>
                            <input type="text" className="form-control" name="proponent" onChange={this.handleProposalEmployeeChange} placeholder="Người đề nghị" autoComplete="off" />
                        </div>

                        {/* Người phê duyệt */}
                        <div className="form-group">
                            <label className="form-control-static">Người phê duyệt</label>
                            <input type="text" className="form-control" name="approver" onChange={this.handleApproverChange} placeholder="Người phê duyệt" autoComplete="off" />
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
                        {exportData && <ExportExcel id="export-asset-incident-management" exportData={exportData} style={{ marginRight: 10 }} />}
                    </div>

                    {/* Bảng phiếu đăng ký mua sắm tài sản */}
                    <table id="recommendprocuremanage-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.form_code')}</th>
                                <th style={{ width: "15%" }}>{translate('asset.general_information.create_date')}</th>
                                <th style={{ width: "15%" }}>{translate('asset.usage.proponent')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.manage_recommend_procure.asset_recommend')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.manage_recommend_procure.equipment_description')}</th>
                                <th style={{ width: "15%" }}>{translate('asset.usage.accountable')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.usage.note')}</th>
                                <th style={{ width: "11%" }}>{translate('asset.general_information.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('asset.general_information.action')}
                                    <DataTableSetting
                                        tableId="recommendprocuremanage-table"
                                        columnArr={[
                                            translate('asset.general_information.form_code'),
                                            translate('asset.general_information.create_date'),
                                            translate('asset.usage.proponent'),
                                            translate('asset.manage_recommend_procure.asset_recommend'),
                                            translate('asset.manage_recommend_procure.equipment_description'),
                                            translate('asset.usage.accountable'),
                                            translate('asset.usage.note'),
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
                            {(listRecommendProcures && listRecommendProcures.length !== 0) &&
                                listRecommendProcures.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.recommendNumber}</td>
                                        <td>{this.formatDate2(x.dateCreate)}</td>
                                        <td>{x.proponent ? x.proponent.name : 'User is deleted'}</td>
                                        <td>{x.equipmentName}</td>
                                        <td>{x.equipmentDescription}</td>
                                        <td>{x.approver ? x.approver.name : ''}</td>
                                        <td>{x.note}</td>
                                        <td>{this.formatStatus(x.status)}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('asset.manage_recommend_procure.view_recommend_card')}><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.manage_recommend_procure.edit_recommend_card')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('asset.manage_recommend_procure.delete_recommend_card')}
                                                data={{
                                                    id: x._id,
                                                    // info: x.recommendNumber + " - " + x.dateCreate.replace(/-/gi, "/")
                                                }}
                                                func={this.props.deleteRecommendProcure}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {recommendProcure.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listRecommendProcures || listRecommendProcures.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>

                {/* Form xem chi tiết phiếu đăng ký mua sắm tài sản */}
                {
                    currentRowView &&
                    <PurchaseRequestDetailForm
                        _id={currentRowView._id}
                        recommendNumber={currentRowView.recommendNumber}
                        dateCreate={currentRowView.dateCreate}
                        proponent={currentRowView.proponent}
                        equipmentName={currentRowView.equipmentName}
                        equipmentDescription={currentRowView.equipmentDescription}
                        supplier={currentRowView.supplier}
                        total={currentRowView.total}
                        unit={currentRowView.unit}
                        estimatePrice={currentRowView.estimatePrice}
                        approver={currentRowView.approver}
                        note={currentRowView.note}
                        status={currentRowView.status}
                    />
                }

                {/* Form chỉnh sửa phiếu đăng ký mua sắm tài sản */}
                {
                    currentRow &&
                    <PurchaseRequestEditForm
                        _id={currentRow._id}
                        recommendNumber={currentRow.recommendNumber}
                        dateCreate={currentRow.dateCreate}
                        proponent={currentRow.proponent}
                        equipmentName={currentRow.equipmentName}
                        equipmentDescription={currentRow.equipmentDescription}
                        supplier={currentRow.supplier}
                        total={currentRow.total}
                        unit={currentRow.unit}
                        estimatePrice={currentRow.estimatePrice}
                        approver={currentRow.approver}
                        note={currentRow.note}
                        status={currentRow.status}
                    />
                }
            </div >
        );
    }
};

function mapState(state) {
    const { recommendProcure, user, auth } = state;
    return { recommendProcure, user, auth };
};

const actionCreators = {
    searchRecommendProcures: RecommendProcureActions.searchRecommendProcures,
    deleteRecommendProcure: RecommendProcureActions.deleteRecommendProcure,
    getUser: UserActions.get
};

const connectedListRecommendProcureManager = connect(mapState, actionCreators)(withTranslate(PurchaseRequestManager));
export { connectedListRecommendProcureManager as PurchaseRequestManager };