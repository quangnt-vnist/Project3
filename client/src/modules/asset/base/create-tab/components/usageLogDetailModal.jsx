import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox, TimePicker } from '../../../../../common-components';

import { AssetCreateValidator } from './combinedContent';

import { UserActions } from '../../../../super-admin/user/redux/actions';

class UsageLogDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                index: nextProps.index,
                usedByUser: nextProps.usedByUser,
                usedByOrganizationalUnit: nextProps.usedByOrganizationalUnit,
                startDate: nextProps.startDate,
                startTime: nextProps.startTime,
                stopTime: nextProps.stopTime,
                endDate: nextProps.endDate,
                description: nextProps.description,
                errorOnDescription: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id } = this.props;
        const { translate, user, department } = this.props;
        const { usedByUser, usedByOrganizationalUnit, startDate, endDate, description, startTime, stopTime, errorOnDescription } = this.state;

        var userlist = user.list, departmentlist = department.list;
        console.log("Dòng 63", this.props);
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-display-usage-detail-infor-${id}`} isLoading={false}
                    formID={`display-usage-detail-infor-${id}`}
                    title={'Thông tin chi tiết sử dụng'}
                    hasSaveButton = {false}                   
                >
                    {/* Form chỉnh sửa thông tin sử dụng */}
                    <form className="form-group" id={`form-edit-usage-${id}`}>
                        <div className="col-md-12">

                            {/* Người sử dụng */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.user')}</label>
                                <div>
                                    <div id="usedByUserBox">
                                        <SelectBox
                                            id={`usedByUser${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[{value: 'null', text: 'Chọn người sử dụng'}, ...userlist.map(x => { return { value: x._id, text: x.name + " - " + x.email } })]}
                                            value={usedByUser}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Đơn vị sử dụng */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.user')}</label>
                                <div>
                                    <div id="usedByUserBox">
                                        <SelectBox
                                            id={`usedByOrganizationalUnit${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[{value: 'null', text: 'Chọn đơn vị sử dụng'}, ...departmentlist.map(x => { return { value: x._id, text: x.name} })]}
                                            value={usedByOrganizationalUnit}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thời gian bắt đầu sử dụng */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.handover_from_date')}</label>
                                <DatePicker
                                    id={`edit-start-date-${id}`}
                                    value={this.formatDate(startDate)}
                                    disabled
                                />
                                <TimePicker
                                    id={`time-picker-start`}
                                    value={startTime}
                                    disabled
                                />
                            </div>

                            {/* Thời gian kết thúc sử dụng */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.handover_to_date')}</label>
                                <DatePicker
                                    id={`edit-end-date-${id}`}
                                    value={this.formatDate(endDate)}
                                    disabled
                                />
                                <TimePicker
                                    id={`time-picker-end`}
                                    value={stopTime}
                                    disabled
                                />
                            </div>

                            {/* Nội dung */}
                            <div className={`form-group ${!errorOnDescription ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.content')}</label>
                                <textarea className="form-control" rows="3" name="description" value={description} autoComplete="off"
                                    placeholder="Nội dung"></textarea>
                                <ErrorLabel content={errorOnDescription} />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    var { user, department } = state;
    return { user, department };
};

const usageLogDetailModal = connect(mapState, null)(withTranslate(UsageLogDetailModal));

export { usageLogDetailModal as UsageLogDetailModal };
