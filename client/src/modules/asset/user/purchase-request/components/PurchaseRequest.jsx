import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../../common-components';

import { RecommendProcureActions } from '../redux/actions';
import { UserActions } from "../../../../super-admin/user/redux/actions";

import { PurchaseRequestCreateForm } from './PurchaseRequestCreateForm';
import { PurchaseRequestDetailForm } from './PurchaseRequestDetailForm';
import { PurchaseRequestEditForm } from './PurchaseRequestEditForm';

class PurchaseRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendNumber: "",
            month: "",
            status: "",
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
        window.$('#modal-edit-recommendprocure').modal('show');
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
            month: value
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
        })

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
        const { translate, recommendProcure, auth } = this.props;
        const { page, limit, currentRowView, currentRow } = this.state;

        var listRecommendProcures = "";
        if (recommendProcure.isLoading === false) {
            listRecommendProcures = recommendProcure.listRecommendProcures;
        }

        var pageTotal = ((recommendProcure.totalList % limit) === 0) ?
            parseInt(recommendProcure.totalList / limit) :
            parseInt((recommendProcure.totalList / limit) + 1);

        var currentPage = parseInt((page / limit) + 1);

        return (
            <div className="box" >
                <div className="box-body qlcv">

                    {/* Form thêm mới phiếu đề nghị mua sắm thiết bị */}
                    <PurchaseRequestCreateForm />

                    {/* Thanh tìm kiếm */}
                    <div className="form-inline">

                        {/* Mã phiếu */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.form_code')}</label>
                            <input type="text" className="form-control" name="recommendNumber" onChange={this.handleRecommendNumberChange} placeholder={translate('asset.general_information.form_code')} autoComplete="off" />
                        </div>

                        {/* Tháng */}
                        <div className="form-group">
                            <label className="form-control-static">Ngày đề nghị</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate(Date.now())}
                                onChange={this.handleMonthChange}
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
                                    { value: "approved", text: translate('asset.usage.approved') },
                                    { value: "waiting_for_approval", text: translate('asset.usage.waiting_approval') },
                                    { value: "disapproved", text: translate('asset.usage.not_approved') }
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSubmitSearch()} >{translate('page.add_search')}</button>
                        </div>
                    </div>

                    {/* Bảng thông tin đề nghị mua sắm thiết bị */}
                    <table id="recommendprocure-table" className="table table-striped table-bordered table-hover">
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
                                        tableId="recommendprocure-table"
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
                                listRecommendProcures.filter(item => item.proponent && item.proponent._id === auth.user._id).map((x, index) => (
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
                                                    info: x.dateCreate ? x.recommendNumber + " - " + x.dateCreate.replace(/-/gi, "/") : x.recommendNumber
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

                {/* Form xem chi tiết phiếu đề nghị mua sắm thiết bị */}
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

                {/* Form chỉnh sửa phiếu đề nghị mua sắm thiết bị */}
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
                        status={currentRow.status}
                        approver={currentRow.approver}
                        note={currentRow.note}
                    />
                }
            </div >
        );
    }
};

function mapState(state) {
    const { recommendProcure, auth } = state;
    return { recommendProcure, auth };
};

const actionCreators = {
    searchRecommendProcures: RecommendProcureActions.searchRecommendProcures,
    deleteRecommendProcure: RecommendProcureActions.deleteRecommendProcure,
    getUser: UserActions.get
};

const connectedListRecommendProcure = connect(mapState, actionCreators)(withTranslate(PurchaseRequest));
export { connectedListRecommendProcure as PurchaseRequest };