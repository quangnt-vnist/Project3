import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { AssetCreateValidator } from '../../../base/create-tab/components/assetCreateValidator';

import { IncidentActions } from '../redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { AssetManagerActions } from '../../../admin/asset-information/redux/actions';

class IncidentCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            incidentCode: "",
            type: "broken", // Phân loại: 1. broken, 2.  lost
            reportedBy: "", // Người báo cáo
            dateOfIncident: this.formatDate(Date.now()), // Ngày phát hiện
            description: "",
        };
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
     * Bắt sự kiện thay đổi Mã tài sản
     */
    handleAssetChange = (value) => {
        this.setState({
            asset: value[0]
        });
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


    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validateDateOfIncident(this.state.dateOfIncident, false) &&
            this.validateIncidentDescription(this.state.description, false)

        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        var partIncident = this.state.dateOfIncident.split('-');
        var dateOfIncident = [partIncident[2], partIncident[1], partIncident[0]].join('-');
        let assetId = !this.state.asset ? this.props.assetsManager.listAssets[0]._id : this.state.asset._id;

        if (this.isFormValidated()) {
            let dataToSubmit = {
                incidentCode: this.state.incidentCode,
                type: this.state.type,
                reportedBy: this.props.auth.user._id,
                dateOfIncident: dateOfIncident,
                description: this.state.description,
                statusIncident: "Chờ xử lý",
                status: this.state.type,
                assetId
            }

            return this.props.createIncident(assetId, dataToSubmit).then(({ response }) => {
                if (response.data.success) {
                    this.props.getAllAsset({
                        code: "",
                        assetName: "",
                        month: null,
                        status: "",
                        page: 0,
                        // limit: 5,
                    });
                }
            });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                asset: nextProps.asset
            }
        } else {
            return null;
        }

    }

    render() {
        const { _id } = this.props;
        const { translate, assetsManager, user, auth } = this.props;
        const { incidentCode, type, asset, reportedBy, dateOfIncident, description, errorOnIncidentCode, errorOnDateOfIncident, errorOnDescription } = this.state;

        var userlist = user.list;
        var assetlist = assetsManager.listAssets;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-create-assetcrash"
                    formID="form-create-assetcrash"
                    title={translate('asset.incident.report_incident')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm thông tin sự cố */}
                    <form className="form-group" id="form-create-assetcrash">

                        <div className="col-md-12">
                            {/* Mã sự cố */}
                            <div className={`form-group ${errorOnIncidentCode === undefined ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.incident_code')}</label>
                                <input type="text" className="form-control" name="incidentCode" value={incidentCode} onChange={this.handleIncidentCodeChange} autoComplete="off" placeholder={translate('asset.general_information.incident_code')} />
                                <ErrorLabel content={errorOnIncidentCode} />
                            </div>

                            {/* Phân loại */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.type')}</label>
                                <select className="form-control" value={type} name="type" onChange={this.handleTypeChange}>
                                    <option value="broken">{translate('asset.general_information.damaged')}</option>
                                    <option value="lost">{translate('asset.general_information.lost')}</option>
                                </select>
                            </div>

                            {/* Tài sản */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.asset')}</label>
                                <div>
                                    <div id="assetUBox">
                                        <SelectBox
                                            id={`add-incident-asset${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={assetlist.map(x => ({ value: x._id, text: x.code + " - " + x.assetName }))}
                                            onChange={this.handleAssetChange}
                                            value={asset._id}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Người báo cáo */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.reported_by')}</label>
                                <div>
                                    <div id="reportedByBox">
                                        <SelectBox
                                            id={`reportedBy${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={userlist.map(x => { return { value: x._id, text: x.name + " - " + x.email } })}
                                            onChange={this.handleReportedByChange}
                                            value={auth.user._id}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thời gian phát hiện sự cố */}
                            <div className={`form-group ${!errorOnDateOfIncident ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.date_incident')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`add-dateOfIncident-${_id}`}
                                    value={dateOfIncident}
                                    onChange={this.handleDateOfIncidentChange}
                                />
                                <ErrorLabel content={errorOnDateOfIncident} />
                            </div>

                            {/* Nội dung */}
                            <div className={`form-group ${!errorOnDescription ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.content')}<span className="text-red">*</span></label>
                                <textarea className="form-control" rows="3" name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off"
                                    placeholder={translate('asset.general_information.content')}></textarea>
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
    const { assetsManager, user, auth } = state;
    return { assetsManager, user, auth };
};

const actionCreators = {
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
    createIncident: IncidentActions.createIncident,
};

const createForm = connect(mapState, actionCreators)(withTranslate(IncidentCreateForm));
export { createForm as IncidentCreateForm };
