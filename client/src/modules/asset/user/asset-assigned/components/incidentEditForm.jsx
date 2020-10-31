import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { AssetCreateValidator } from '../../../base/create-tab/components/assetCreateValidator';

import { ManageIncidentActions } from '../../../admin/incident/redux/actions';

class IncidentEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            managedBy : this.props.managedBy?this.props.managedBy:''
        };
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
    handleTypeChange = (value) => {
        if (value.length === 0) {
            value = ''
        }

        this.setState({
            ...this.state,
            type: value[0]
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

    // Bắt sự kiện thay đổi "Thời gian phát hiện"
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

    // Bắt sự kiện thay đổi "Nội dung sự cố"
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

    handleStatusIncidentChange = (e) => {
        let { value } = e.target;
        this.setState({
            ...this.state,
            statusIncident: value
        })
    }

    save = () => {
        let { managedBy } =this.state;
        var partIncident = this.state.dateOfIncident.split('-');
        var dateOfIncident = [partIncident[2], partIncident[1], partIncident[0]].join('-');
        let assetId = !this.state.asset ? this.props.assetsManager.listAssets[0]._id : this.state.asset._id;
        if (this.isFormValidated()) {
            let dataToSubmit = {
                incidentCode: this.state.incidentCode,
                type: this.state.type,
                reportedBy: !this.state.reportedBy ? this.props.user.list[0].id : this.state.reportedBy,
                dateOfIncident: dateOfIncident,
                description: this.state.description,
                statusIncident: this.state.statusIncident,
                status: this.state.type,
                assetId
            }
            return this.props.updateIncident(this.props._id, dataToSubmit,managedBy);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                asset: nextProps.asset,
                incidentCode: nextProps.incidentCode,
                type: nextProps.type,
                reportedBy: nextProps.reportedBy,
                dateOfIncident: nextProps.dateOfIncident,
                description: nextProps.description,
                statusIncident: nextProps.statusIncident,
                errorOnIncidentCode: undefined,
                errorOnDateOfIncident: undefined,
                errorOnDescription: undefined,

            }
        } else {
            return null;
        }

    }

    render() {
        const { _id } = this.props;
        const { translate, assetsManager, user, auth } = this.props;
        const {
            incidentCode, type, asset, reportedBy, dateOfIncident, description, errorOnIncidentCode, errorOnDateOfIncident, errorOnDescription, statusIncident
        } = this.state;

        var userlist = user.list;
        var assetlist = assetsManager.listAssets;

        console.log('\n\n @@@@@@@@@@', asset._id, assetlist);
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-incident"
                    formID="form-edit-incident"
                    title={translate('asset.asset_info.edit_incident_info')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa thông tin sự cố */}
                    <form className="form-group" id="form-edit-incident">

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
                                <SelectBox
                                    id={`edit-type-incident-asset${_id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: 1, text: translate('asset.general_information.damaged') },
                                        { value: 2, text: translate('asset.general_information.lost') },
                                    ]}
                                    onChange={this.handleTypeChange}
                                    multiple={false}
                                />
                            </div>

                            {/* Tài sản */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.asset')}</label>
                                <SelectBox
                                    id={`edit-incident-asset${_id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={assetlist.map(x => ({ value: x._id, text: x.code + " - " + x.assetName }))}
                                    onChange={this.handleAssetChange}
                                    value={asset._id}
                                    multiple={false}
                                    disabled
                                />
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
                                            value={reportedBy}
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
                            
                            {/* Trạng thái */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.status')}</label>
                                <select className="form-control" value={statusIncident} name="type" onChange={this.handleStatusIncidentChange}>
                                    <option value="Chờ xử lý">{translate('asset.general_information.waiting')}</option>
                                    <option value="Đã xử lý">{translate('asset.general_information.processed')}</option>
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
    const { assetsManager, auth, user } = state;
    return { assetsManager, auth, user };
};

const actionCreators = {
    updateIncident: ManageIncidentActions.updateIncident,
};

const editForm = connect(mapState, actionCreators)(withTranslate(IncidentEditForm));
export { editForm as IncidentEditForm };
