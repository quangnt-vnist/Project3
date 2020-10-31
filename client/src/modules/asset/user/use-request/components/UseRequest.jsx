import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../../common-components';

import { UseRequestEditForm } from './UseRequestEditForm';

import { AssetManagerActions } from "../../../admin/asset-information/redux/actions";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { RecommendDistributeActions } from '../redux/actions';

class UseRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendNumber: "",
            month: "",
            status: null,
            page: 0,
            limit: 10,
        }
    }
    componentDidMount() {
        this.props.searchRecommendDistributes(this.state);
        this.props.getUser();
    }

    // Bắt sự kiện click chỉnh sửa thông tin phiếu đăng ký cấp phát
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowEdit: value
            }
        });
        window.$('#modal-edit-recommenddistribute').modal('show');
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
        if (this.state.month === "") {
            await this.setState({
                month: this.formatDate(Date.now())
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
        const { translate, recommendDistribute, assetsManager, assetType, user, auth } = this.props;
        const { page, limit, currentRowEdit } = this.state;

        var listRecommendDistributes = "";
        var lists = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;

        if (recommendDistribute.isLoading === false) {
            listRecommendDistributes = recommendDistribute.listRecommendDistributes;
        }

        var pageTotal = ((recommendDistribute.totalList % limit) === 0) ?
            parseInt(recommendDistribute.totalList / limit) :
            parseInt((recommendDistribute.totalList / limit) + 1);

        var currentPage = parseInt((page / limit) + 1);

        return (
            <div id="recommenddistribute" className="tab-pane">
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
                            <label className="form-control-static">{translate('page.month')}</label>
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
                    </div>

                    {/* Bảng thông tin đăng ký sử dụng tài sản */}
                    <table id="recommenddistribute-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.form_code')}</th>
                                <th style={{ width: "15%" }}>{translate('asset.general_information.create_date')}</th>
                                <th style={{ width: "15%" }}>{translate('asset.usage.proponent')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.general_information.asset_code')}</th>
                                <th style={{ width: "15%" }}>{translate('asset.general_information.asset_name')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.general_information.handover_from_date')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.general_information.handover_to_date')}</th>
                                <th style={{ width: "17%" }}>{translate('asset.usage.accountable')}</th>
                                <th style={{ width: "11%" }}>{translate('asset.general_information.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="recommenddistribute-table"
                                        columnArr={[
                                            translate('asset.general_information.form_code'),
                                            translate('asset.general_information.create_date'),
                                            translate('asset.usage.proponent'),
                                            translate('asset.general_information.asset_code'),
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
                                listRecommendDistributes.filter(item => item.proponent && item.proponent._id === auth.user._id).map((x, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{x.recommendNumber}</td>
                                            <td>{x.dateCreate}</td>
                                            <td>{x.proponent ? x.proponent.name : 'User is deleted'}</td>
                                            <td>{x.asset ? x.asset.code : 'Asset is deleted'}</td>
                                            <td>{x.asset ? x.asset.assetName : 'Asset is deleted'}</td>
                                            <td>{x.dateStartUse}</td>
                                            <td>{x.dateEndUse}</td>
                                            <td>{x.approver ? x.approver.name : 'User is deleted'}</td>
                                            <td>{this.formatStatus(x.status)}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.asset_info.edit_usage_info')}><i className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content={translate('asset.asset_info.delete_usage_info')}
                                                    data={{
                                                        id: x._id,
                                                        info: x.dateCreate ? x.recommendNumber + " - " + x.dateCreate.replace(/-/gi, "/") : x.recommendNumber
                                                    }}
                                                    func={this.props.deleteRecommendDistribute}
                                                />
                                            </td>
                                        </tr>
                                    )
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

                {/* Form chỉnh sửa thông tin đăng ký sử dụng tài sản */}
                {
                    currentRowEdit &&
                    <UseRequestEditForm
                        _id={currentRowEdit._id}
                        recommendNumber={currentRowEdit.recommendNumber}
                        dateCreate={currentRowEdit.dateCreate}
                        proponent={currentRowEdit.proponent}
                        reqContent={currentRowEdit.reqContent}
                        asset={currentRowEdit.asset}
                        dateStartUse={currentRowEdit.dateStartUse}
                        dateEndUse={currentRowEdit.dateEndUse}
                        status={currentRowEdit.status}
                        approver={currentRowEdit.approver}
                        note={currentRowEdit.note}
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
    getAllAsset: AssetManagerActions.getAllAsset,
    getUser: UserActions.get,
    searchRecommendDistributes: RecommendDistributeActions.searchRecommendDistributes,
    deleteRecommendDistribute: RecommendDistributeActions.deleteRecommendDistribute,
};

const connectedListRecommendDistribute = connect(mapState, actionCreators)(withTranslate(UseRequest));
export { connectedListRecommendDistribute as UseRequest };
