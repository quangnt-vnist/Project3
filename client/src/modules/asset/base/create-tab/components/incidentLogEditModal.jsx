import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { AssetCreateValidator } from './combinedContent';

import { UserActions } from '../../../../super-admin/user/redux/actions';

class IncidentLogEditModal extends Component {
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

    // Bắt sự kiện thay đổi mã sự cố
    handleIncidentCodeChange = (e) => {
        let { value } = e.target;
        this.validateIncidentCode(value, true);
    }
    validateIncidentCode = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateIncidentCode(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnIncidentCode: msg,
                    incidentCode: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi loại sự cố
    handleTypeChange = (e) => {
        let { value } = e.target;
        this.setState({
            ...this.state,
            type: value
        })
    }

    /**
     * Bắt sự kiện thay đổi người báo cáo
     */
    handleReportedByChange = (value) => {
        this.setState({
            ...this.state,
            reportedBy: value[0]
        });
    }

    //Bắt sự kiện thay đổi "Thời gian phát hiện"
    handleDateOfIncidentChange = (value) => {
        this.validateDateOfIncident(value, true);
    }
    validateDateOfIncident = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateDateOfIncident(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateOfIncident: msg,
                    dateOfIncident: value,
                }
            });
        }
        return msg === undefined;
    }


    //8. Bắt sự kiện thay đổi "Nội dung sự cố"
    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.validateIncidentDescription(value, true);
    }
    validateIncidentDescription = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateIncidentDescription(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDescription: msg,
                    description: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi loại sự cố
    handleStatusIncidentChange = (e) => {
        let { value } = e.target;
        this.setState({
            ...this.state,
            statusIncident: value
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validateDateOfIncident(this.state.dateOfIncident, false) &&
            this.validateIncidentDescription(this.state.description, false) &&
            this.validateDateOfIncident(this.state.dateOfIncident, false)

        return result;
    }

    // Bắt sự kiện submit form
    save = async () => {
        var partDateOfIncident = this.state.dateOfIncident.split('-');
        var dateOfIncident = [partDateOfIncident[2], partDateOfIncident[1], partDateOfIncident[0]].join('-');

        if (this.isFormValidated()) {
            return this.props.handleChange({ ...this.state, dateOfIncident: dateOfIncident });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                _id: nextProps._id,
                id: nextProps.id,
                index: nextProps.index,
                incidentCode: nextProps.incidentCode,
                type: nextProps.type,
                reportedBy: nextProps.reportedBy,
                dateOfIncident: nextProps.dateOfIncident,
                description: nextProps.description,
                statusIncident: nextProps.statusIncident,
                errorOnIncidentCode: undefined,
                errorOnDescription: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id } = this.props;
        const { translate, user } = this.props;
        const { incidentCode, type, reportedBy, dateOfIncident, description, statusIncident, errorOnIncidentCode, errorOnDescription } = this.state;

        var userlist = user.list;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-incident-${id}`} isLoading={false}
                    formID={`form-edit-incident-${id}`}
                    title={translate('asset.asset_info.edit_incident_info')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa thông tin sự cố */}
                    <form className="form-group" id={`form-edit-incident-${id}`}>
                        <div className="col-md-12">
                            {/* Mã sự cố */}
                            <div className={`form-group ${!errorOnIncidentCode ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.incident_code')}</label>
                                <input type="text" className="form-control" name="incidentCode" value={incidentCode} onChange={this.handleIncidentCodeChange} autoComplete="off" placeholder={translate('asset.general_information.incident_code')} />
                                <ErrorLabel content={errorOnIncidentCode} />
                            </div>

                            {/* Phân loại */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.incident_type')}</label>
                                <select className="form-control" value={type} name="type" onChange={this.handleTypeChange}>
                                    <option value="broken">{translate('asset.general_information.damaged')}</option>
                                    <option value="lost">{translate('asset.general_information.lost')}</option>
                                </select>
                            </div>

                            {/* Người báo cáo */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.reported_by')}</label>
                                <div>
                                    <div id="reportedByBox">
                                        <SelectBox
                                            id={`reportedBy${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={userlist.map(x => { return { value: x._id, text: x.name + " - " + x.email } })}
                                            onChange={this.handleReportedByChange}
                                            value={reportedBy}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thời gian phát hiện sự cố */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.date_incident')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit-dateOfIncident-${id}`}
                                    value={dateOfIncident}
                                    onChange={this.handleDateOfIncidentChange}
                                />
                            </div>

                            {/* Nội dung */}
                            <div className={`form-group ${!errorOnDescription ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.content')}<span className="text-red">*</span></label>
                                <textarea className="form-control" rows="3" name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off"
                                    placeholder={translate('asset.general_information.content')}></textarea>
                                <ErrorLabel content={errorOnDescription} />
                            </div>

                            {/* Trạng thái */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.status')}</label>
                                <select className="form-control" value={statusIncident} name="type" onChange={this.handleStatusIncidentChange}>
                                    <option value="1">{translate('asset.general_information.waiting')}</option>
                                    <option value="2">{translate('asset.general_information.processed')}</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    var { user } = state;
    return { user };
};

const actionCreators = {
    getUser: UserActions.get,
};


const editModal = connect(mapState, actionCreators)(withTranslate(IncidentLogEditModal));
export { editModal as IncidentLogEditModal };
