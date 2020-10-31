import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

import { DialogModal, Scheduler } from '../../../../../common-components';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';
import {
    GeneralTab, MaintainanceLogTab, UsageLogTab, DepreciationTab, IncidentLogTab, DisposalTab, FileTab
} from '../../../base/create-tab/components/combinedContent';

import { AssetManagerActions } from '../redux/actions';
import { UseRequestActions } from '../../use-request/redux/actions';

class AssetEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeId: this.props.employeeId ? this.props.employeeId : ''
        };
    }

    // Function upload avatar
    handleUpload = (img, avatar) => {
        this.setState({
            img: img,
            avatar: avatar
        })
    }

    // Function lưu các trường thông tin vào state
    handleChange = (name, value) => {
        if (name === 'purchaseDate' || name === 'warrantyExpirationDate' || name === 'handoverFromDate' ||
            name === 'handoverToDate' || name === 'startDepreciation' || name === 'disposalDate') { //
            if (value) {
                var partValue = value.split('-');
                value = [partValue[2], partValue[1], partValue[0]].join('-');
            } else {
                value = null
            }
        }

        this.setState({
            [name]: value
        });
    }

    // Function thêm sửa chữa, thay thế, nâng cấp
    handleCreateMaintainanceLogs = (data, addData) => {
        this.setState({
            maintainanceLogs: data
        })
    }

    // Function chỉnh sửa sửa chữa, thay thế, nâng cấp
    handleEditMaintainanceLogs = (data, editData) => {
        if (editData._id) {
            this.setState({
                editMaintainanceLogs: [...this.state.editMaintainanceLogs, editData]
            })
        } else {
            this.setState({
                maintainanceLogs: data
            })
        }
    }

    // Function xoá sửa chữa, thay thế, nâng cấp
    handleDeleteMaintainanceLogs = (data, deleteData) => {
        if (deleteData._id) {
            this.setState({
                deleteMaintainanceLogs: [...this.state.deleteMaintainanceLogs, deleteData],
                editMaintainanceLogs: this.state.editMaintainanceLogs.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                maintainanceLogs: data
            })
        }
    }

    // Function thêm thông tin cấp phát, điều chuyển, thu hồi
    handleCreateUsageLogs = async (data, addData) => {
        await this.setState({
            ...this.state,
            usageLogs: data.usageLogs,
            assignedToUser: data.assignedToUser,
            assignedToOrganizationalUnit: data.assignedToOrganizationalUnit,
            status: "in_use"
        })

    }

    // Function chỉnh sửa thông tin cấp phát, điều chuyển, thu hồi
    handleEditUsageLogs = (data, editData) => {
        if (editData && editData._id) {
            this.setState({
                editUsageLogs: [...this.state.editUsageLogs, editData]
            })
        } else {
            this.setState({
                usageLogs: data.usageLogs,
                assignedToUser: data.assignedToUser,
                assignedToOrganizationalUnit: data.assignedToOrganizationalUnit,
            })
        }
    }

    handleRecallAsset = async (data) => {
        await this.setState({
            ...this.state,
            assignedToUser: data.assignedToUser,
            assignedToOrganizationalUnit: data.assignedToOrganizationalUnit,
            status: data.status
        })
    }

    // Function xoá thông tin cấp phát, điều chuyển, thu hồi
    handleDeleteUsageLogs = (data, deleteData) => {
        if (deleteData._id) {
            this.setState({
                deleteUsageLogs: [...this.state.deleteUsageLogs, deleteData],
                editUsageLogs: this.state.editUsageLogs.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                usageLogs: data
            })
        }
    }

    // Function thêm thông tin sự cố tài sản
    handleCreateIncidentLogs = (data, addData) => {
        this.setState({
            incidentLogs: data
        })
    }

    // Function chỉnh sửa thông tin sự cố tài sản
    handleEditIncidentLogs = (data, editData) => {
        if (editData._id) {
            this.setState({
                editIncidentLogs: [...this.state.editIncidentLogs, editData]
            })
        } else {
            this.setState({
                incidentLogs: data
            })
        }
    }

    // Function xoá thông tin sự cố tài sản
    handleDeleteIncidentLogs = (data, deleteData) => {
        if (deleteData._id) {
            this.setState({
                deleteIncidentLogs: [...this.state.deleteIncidentLogs, deleteData],
                editIncidentLogs: this.state.editIncidentLogs.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                incidentLogs: data
            })
        }
    }

    // Function thêm thông tin tài liệu đính kèm
    handleCreateFile = (data, addData) => {
        this.setState({
            files: data
        })
    }

    // Function chỉnh sửa thông tin tài liệu đính kèm
    handleEditFile = (data, editData) => {
        if (editData._id) {
            this.setState({
                editFiles: [...this.state.editFiles, editData]
            })
        } else {
            this.setState({
                files: data
            })
        }
    }

    // Function xoá thông tin tài liệu đính kèm
    handleDeleteFile = (data, deleteData) => {
        if (deleteData._id) {
            this.setState({
                deleteFiles: [...this.state.deleteFiles, deleteData],
                editFiles: this.state.editFiles.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                files: data
            })
        }
    }

    // TODO: function
    handleChangeCourse = (data) => {
        const { assetNew } = this.state;
        this.setState({
            assetNew: {
                ...assetNew
            }
        })
    }

    // function kiểm tra các trường bắt buộc phải nhập
    validatorInput = (value) => {
        if (value !== undefined && value !== null && value.toString().trim() !== '') {
            return true;
        }
        return false;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let { code, assetName, serial, assetType, managedBy, purchaseDate, warrantyExpirationDate, location, status, group,
            typeRegisterForUse, cost, usefulLife, startDepreciation, depreciationType, unitsProducedDuringTheYears, estimatedTotalProduction } = this.state;

        if (this.state !== {}) {
            let unitProductionValidate = true;
            if (depreciationType === "units_of_production") {
                unitProductionValidate = this.validatorInput(estimatedTotalProduction);
            }

            let result = this.validatorInput(code) && this.validatorInput(assetName) &&
                // this.validatorInput(serial) && 
                this.validatorInput(assetType) && this.validatorInput(group) &&
                // this.validatorInput(managedBy) && 
                this.validatorInput(purchaseDate) &&
                // this.validatorInput(warrantyExpirationDate) && //this.validatorInput(location) &&
                this.validatorInput(status) && this.validatorInput(typeRegisterForUse) &&
                this.validatorInput(cost) && this.validatorInput(usefulLife) &&
                this.validatorInput(startDepreciation) && this.validatorInput(depreciationType)
                && unitProductionValidate;

            // console.log('\n\n\n ***', this.validatorInput(code) , this.validatorInput(assetName) ,
            //     // this.validatorInput(serial) , 
            //     this.validatorInput(assetType) , this.validatorInput(group) ,
            //     // this.validatorInput(managedBy) , 
            //     this.validatorInput(purchaseDate) ,
            //     // this.validatorInput(warrantyExpirationDate) , //this.validatorInput(location) ,
            //     this.validatorInput(status) , this.validatorInput(typeRegisterForUse) ,
            //     this.validatorInput(cost) , this.validatorInput(usefulLife) ,
            //     this.validatorInput(startDepreciation) , this.validatorInput(depreciationType)
            //     , unitProductionValidate);
            return result;
        }

        return true;
    }

    save = async () => {
        let { maintainanceLogs, usageLogs, incidentLogs, files, assignedToUser, assignedToOrganizationalUnit, handoverFromDate, handoverToDate, employeeId } = this.state;

        await this.setState({
            img: "",
            createMaintainanceLogs: maintainanceLogs.filter(x => !x._id),
            createUsageLogs: usageLogs.filter(x => !x._id),
            createIncidentLogs: incidentLogs.filter(x => !x._id),
            createFiles: files.filter(x => !x._id),
        })

        let formData = convertJsonObjectToFormData(this.state);
        files.forEach(x => {
            x.files.forEach(item => {
                formData.append("file", item.fileUpload);
            })
        })
        formData.append("fileAvatar", this.state.avatar);
        this.props.updateInformationAsset(this.state._id, formData, employeeId);

        // Thêm vào thông tin sử dụng
        if (assignedToUser !== this.props.assignedToUser || assignedToOrganizationalUnit !== this.props.assignedToOrganizationalUnit || handoverFromDate !== this.props.handoverFromDate || handoverToDate !== this.props.handoverToDate) {
            this.props.createUsage(this.state._id, {
                usageLogs: {
                    usedByUser: this.state.assignedToUser,
                    startDate: this.state.handoverFromDate,
                    endDate: this.state.handoverToDate,
                    description: '',
                },
                assignedToUser: this.state.assignedToUser,
                assignedToOrganizationalUnit: this.state.assignedToOrganizationalUnit,
                status: "in_use",
            });
        }
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

    addMonth = (date, month) => {
        date = new Date(date);
        let newDate = new Date(date.setMonth(date.getMonth() + month));

        return this.formatDate(newDate);
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                img: process.env.REACT_APP_SERVER + nextProps.avatar,
                avatar: "",
                avatar: nextProps.avatar,
                code: nextProps.code,
                assetName: nextProps.assetName,
                serial: nextProps.serial,
                assetType: nextProps.assetType,
                group: nextProps.group,
                purchaseDate: nextProps.purchaseDate,
                warrantyExpirationDate: nextProps.warrantyExpirationDate,
                managedBy: nextProps.managedBy,
                assignedToUser: nextProps.assignedToUser,
                assignedToOrganizationalUnit: nextProps.assignedToOrganizationalUnit,
                handoverFromDate: nextProps.handoverFromDate,
                handoverToDate: nextProps.handoverToDate,
                location: nextProps.location,
                description: nextProps.description,
                status: nextProps.status,
                typeRegisterForUse: nextProps.typeRegisterForUse,
                detailInfo: nextProps.detailInfo,
                readByRoles: nextProps.readByRoles,
                // Khấu hao
                cost: nextProps.cost,
                residualValue: nextProps.residualValue,
                usefulLife: nextProps.usefulLife,
                startDepreciation: nextProps.startDepreciation,
                depreciationType: nextProps.depreciationType,
                estimatedTotalProduction: nextProps.estimatedTotalProduction,
                unitsProducedDuringTheYears: nextProps.unitsProducedDuringTheYears,
                // Thanh lý
                disposalDate: nextProps.disposalDate,
                disposalType: nextProps.disposalType,
                disposalCost: nextProps.disposalCost,
                disposalDesc: nextProps.disposalDesc,
                // Bảo trì
                maintainanceLogs: nextProps.maintainanceLogs,
                // Sử dụng
                usageLogs: nextProps.usageLogs,
                // Sự cố
                incidentLogs: nextProps.incidentLogs,
                // Tài liệu tham khảo
                archivedRecordNumber: nextProps.archivedRecordNumber,
                files: nextProps.files,

                editUsageLogs: [],
                deleteUsageLogs: [],
                editMaintainanceLogs: [],
                deleteMaintainanceLogs: [],
                editIncidentLogs: [],
                deleteIncidentLogs: [],
                editFiles: [],
                deleteFiles: [],

                errorOnCode: undefined,
                errorOnAssetName: undefined,
                errorOnSerial: undefined,
                errorOnAssetType: undefined,
                errorOnLocation: undefined,
                errorOnPurchaseDate: undefined,
                errorOnWarrantyExpirationDate: undefined,
                errorOnManagedBy: undefined,
                errorOnAssignedToUser: undefined,
                errorOnAssignedToOrganizationalUnit: undefined,
                errorOnNameField: undefined,
                errorOnValue: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, assetsManager } = this.props;
        const { _id, img, avatar, code, assetName, serial, assetType, group, purchaseDate, warrantyExpirationDate, managedBy, assignedToUser, assignedToOrganizationalUnit, handoverFromDate,
            handoverToDate, location, description, status, typeRegisterForUse, detailInfo, usageLogs, maintainanceLogs, cost, residualValue, startDepreciation,
            usefulLife, depreciationType, incidentLogs, disposalDate, disposalType, unitsProducedDuringTheYears, disposalCost, disposalDesc, archivedRecordNumber,
            files, estimatedTotalProduction, readByRoles } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-edit-asset" isLoading={assetsManager.isLoading}
                    formID="form-edit-asset"
                    title={translate('asset.general_information.edit_info')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Nav-tabs */}
                    <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                        <ul className="nav nav-tabs">
                            <li className="active"><a title={translate('asset.general_information.general_information')} data-toggle="tab" href={`#edit_general${_id}`}>{translate('asset.general_information.general_information')}</a></li>
                            <li><a title={translate('asset.general_information.depreciation_information')} data-toggle="tab" href={`#edit_depreciation${_id}`}>{translate('asset.general_information.depreciation_information')}</a></li>
                            <li><a title={translate('asset.general_information.usage_information')} data-toggle="tab" href={`#edit_usage${_id}`} onClick={() => { Scheduler.triggerOnActiveEvent(".asset-usage-scheduler") }}>{translate('asset.general_information.usage_information')}</a></li>
                            <li><a title={translate('asset.general_information.incident_information')} data-toggle="tab" href={`#edit_incident${_id}`}>{translate('asset.general_information.incident_information')}</a></li>
                            <li><a title={translate('asset.general_information.maintainance_information')} data-toggle="tab" href={`#edit_maintainance${_id}`}>{translate('asset.general_information.maintainance_information')}</a></li>
                            <li><a title={translate('asset.general_information.disposal_information')} data-toggle="tab" href={`#edit_disposal${_id}`}>{translate('asset.general_information.disposal_information')}</a></li>
                            <li><a title={translate('asset.general_information.attach_infomation')} data-toggle="tab" href={`#edit_attachments${_id}`}>{translate('asset.general_information.attach_infomation')}</a></li>
                        </ul>

                        < div className="tab-content">
                            {/* Thông tin chung */}
                            <GeneralTab
                                id={`edit_general${_id}`}
                                img={img}
                                handleChange={this.handleChange}
                                handleUpload={this.handleUpload}
                                avatar={avatar}
                                code={code}
                                assetName={assetName}
                                serial={serial}
                                assetTypes={assetType}
                                group={group}
                                purchaseDate={purchaseDate}
                                warrantyExpirationDate={warrantyExpirationDate}
                                managedBy={managedBy}
                                assignedToUser={assignedToUser}
                                assignedToOrganizationalUnit={assignedToOrganizationalUnit}
                                handoverFromDate={handoverFromDate}
                                handoverToDate={handoverToDate}
                                location={location}
                                description={description}
                                status={status}
                                typeRegisterForUse={typeRegisterForUse}
                                detailInfo={detailInfo}
                                usageLogs={usageLogs}
                                readByRoles={readByRoles}
                            />

                            {/* Thông tin khấu hao */}
                            <DepreciationTab
                                id={`edit_depreciation${_id}`}
                                handleChange={this.handleChange}
                                cost={cost}
                                residualValue={residualValue}
                                startDepreciation={moment(startDepreciation).format('DD-MM-YYYY')}
                                endDepreciation={this.addMonth(startDepreciation, usefulLife)}
                                usefulLife={usefulLife}
                                depreciationType={depreciationType}
                                estimatedTotalProduction={estimatedTotalProduction}
                                unitsProducedDuringTheYears={unitsProducedDuringTheYears}
                            />

                            {/* Thông tin sử dụng */}
                            <UsageLogTab
                                id={`edit_usage${_id}`}
                                assetId={_id}
                                assignedToUser={assignedToUser}
                                assignedToOrganizationalUnit={assignedToOrganizationalUnit}
                                usageLogs={usageLogs}
                                typeRegisterForUse={typeRegisterForUse}
                                managedBy={managedBy}
                                handleAddUsage={this.handleCreateUsageLogs}
                                handleEditUsage={this.handleEditUsageLogs}
                                handleDeleteUsage={this.handleDeleteUsageLogs}
                                handleRecallAsset={this.handleRecallAsset}
                            />

                            {/* Thông tin sự cố */}
                            <IncidentLogTab
                                id={`edit_incident${_id}`}
                                incidentLogs={incidentLogs}
                                handleAddIncident={this.handleCreateIncidentLogs}
                                handleEditIncident={this.handleEditIncidentLogs}
                                handleDeleteIncident={this.handleDeleteIncidentLogs}
                            />

                            {/* Thông tin bảo trì */}
                            <MaintainanceLogTab
                                id={`edit_maintainance${_id}`}
                                maintainanceLogs={maintainanceLogs}
                                handleAddMaintainance={this.handleCreateMaintainanceLogs}
                                handleEditMaintainance={this.handleEditMaintainanceLogs}
                                handleDeleteMaintainance={this.handleDeleteMaintainanceLogs}
                            />

                            {/* Thông tin thanh lý */}
                            <DisposalTab
                                id={`edit_disposal${_id}`}
                                handleChange={this.handleChange}
                                disposalDate={disposalDate}
                                disposalType={disposalType}
                                disposalCost={disposalCost}
                                disposalDesc={disposalDesc}
                            />

                            {/* Tài liệu đính kèm */}
                            <FileTab
                                id={`edit_attachments${_id}`}
                                handleChange={this.handleChange}
                                handleAddFile={this.handleCreateFile}
                                handleEditFile={this.handleEditFile}
                                handleDeleteFile={this.handleDeleteFile}
                                archivedRecordNumber={archivedRecordNumber}
                                files={files}
                            />
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        )
    }
};

function mapState(state) {
    const { assetsInfo, assetsManager } = state;
    return { assetsInfo, assetsManager };
};

const actionCreators = {
    updateInformationAsset: AssetManagerActions.updateInformationAsset,
    createUsage: UseRequestActions.createUsage,
};
const editForm = connect(mapState, actionCreators)(withTranslate(AssetEditForm));
export { editForm as AssetEditForm };
