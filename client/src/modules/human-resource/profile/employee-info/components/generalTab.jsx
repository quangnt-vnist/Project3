import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ApiImage } from '../../../../../common-components';

class GeneralTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm , false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date;
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                avatar: nextProps.employee.avatar,
                employeeNumber: nextProps.employee.employeeNumber,
                employeeTimesheetId: nextProps.employee.employeeTimesheetId,
                fullName: nextProps.employee.fullName,
                gender: nextProps.employee.gender,
                birthdate: nextProps.employee.birthdate,
                birthplace: nextProps.employee.birthplace,
                emailInCompany: nextProps.employee.emailInCompany,
                maritalStatus: nextProps.employee.maritalStatus,
                identityCardNumber: nextProps.employee.identityCardNumber,
                identityCardDate: nextProps.employee.identityCardDate,
                identityCardAddress: nextProps.employee.identityCardAddress,
                nationality: nextProps.employee.nationality,
                ethnic: nextProps.employee.ethnic,
                religion: nextProps.employee.religion,
                status: nextProps.employee.status,
                startingDate: nextProps.employee.startingDate,
                leavingDate: nextProps.employee.leavingDate,
                roles: nextProps.roles
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate } = this.props;

        const { id, avatar, employeeNumber, employeeTimesheetId, fullName, gender, birthdate, birthplace, status, roles, startingDate, leavingDate,
            emailInCompany, maritalStatus, identityCardNumber, identityCardDate, identityCardAddress, nationality, ethnic, religion } = this.state;

        return (
            <div id={id} className="tab-pane active">
                <div className=" row box-body">
                    {/* Ảnh đại diện */}
                    <div className="col-lg-4 col-md-4 col-ms-12 col-xs-12" style={{ textAlign: 'center' }}>
                        <div>
                            {avatar && <ApiImage className="attachment-img avarta" id={`avater-imform-${id}`} src={`.${avatar}`} />}
                        </div>
                    </div>
                    <div className="pull-right col-lg-8 col-md-8 col-ms-12 col-xs-12">
                        <div className="row">
                            {/* Mã nhân viên */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.staff_number')}&emsp; </strong>
                                {employeeNumber}
                            </div>
                            {/* Mã chấm công */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.attendance_code')}&emsp; </strong>
                                {employeeTimesheetId}
                            </div>
                        </div>
                        <div className="row">
                            {/* Họ và tên nhân viên */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.full_name')}&emsp; </strong>
                                {fullName}
                            </div>
                            {/* Giới tính */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.gender')}&emsp; </strong>
                                {translate(`human_resource.profile.${gender}`)}
                            </div>
                        </div>
                        <div className="row">
                            {/* Ngày sinh */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.date_birth')}&emsp; </strong>
                                {this.formatDate(birthdate)}
                            </div>
                            {/* Nơi sinh */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.place_birth')}&emsp; </strong>
                                {birthplace}
                            </div>
                        </div>
                        <div className="row">
                            {/* Trạng thái*/}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('general.status')}&emsp; </strong>
                                {translate(`human_resource.profile.${status}`)}
                            </div>
                            {/* Chức vụ */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('page.position')}&emsp; </strong>
                                {roles.length !== 0 && roles.map(x => x.roleId.name).join(', ')}
                            </div>
                        </div>
                        <div className="row">
                            {/* Email công ty */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.email_company')}&emsp; </strong>
                                {emailInCompany}
                            </div>
                            {/* Tình trạng hôn nhân */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.relationship')}&emsp; </strong>
                                {translate(`human_resource.profile.${maritalStatus}`)}
                            </div>
                        </div>
                        <div className="row">
                            {/* Ngày bắt đầu làm việc*/}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.starting_date')}&emsp; </strong>
                                {this.formatDate(startingDate)}
                            </div>
                            {/*Ngày nghỉ việc */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.leaving_date')}&emsp; </strong>
                                {this.formatDate(leavingDate)}
                            </div>
                        </div>

                        <div className="row">
                            {/* Số chứng minh thư */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.id_card')}&emsp; </strong>
                                {identityCardNumber}
                            </div>
                            {/* Ngày cấp */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.date_issued')}&emsp; </strong>
                                {this.formatDate(identityCardDate)}
                            </div>
                        </div>
                        <div className="row">
                            {/* Nơi cấp */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.issued_by')}&emsp; </strong>
                                {identityCardAddress}
                            </div>
                            {/* Dân tộc */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.ethnic')}&emsp; </strong>
                                {ethnic}
                            </div>

                        </div>
                        <div className="row">
                            {/* Tôn giáo */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.religion')}&emsp; </strong>
                                {religion}
                            </div>
                            {/* Quốc tịch */}
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('human_resource.profile.nationality')}&emsp; </strong>
                                {nationality}
                            </div>
                        </div>

                    </div>
                </div>
            </div >
        );
    }
};

const tabGeneral = connect(null, null)(withTranslate(GeneralTab));
export { tabGeneral as GeneralTab };