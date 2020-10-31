import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, Scheduler } from '../../../../../common-components';

import {
    GeneralTab, MaintainanceLogTab, UsageLogTab, DepreciationTab, IncidentLogTab, DisposalTab, AttachmentTab
} from '../../../base/detail-tab/components/combinedContent';

class AssetViewInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id || nextProps.depreciationType !== prevState.depreciationType || nextProps.typeRegisterForUse !== prevState.typeRegisterForUse) {
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
                cost: nextProps.cost,
                residualValue: nextProps.residualValue,
                startDepreciation: nextProps.startDepreciation,
                usefulLife: nextProps.usefulLife,
                estimatedTotalProduction: nextProps.estimatedTotalProduction,
                unitsProducedDuringTheYears: nextProps.unitsProducedDuringTheYears,
                depreciationType: nextProps.depreciationType,
                maintainanceLogs: nextProps.maintainanceLogs,
                usageLogs: nextProps.usageLogs,
                incidentLogs: nextProps.incidentLogs,
                disposalDate: nextProps.disposalDate,
                disposalType: nextProps.disposalType,
                disposalCost: nextProps.disposalCost,
                disposalDesc: nextProps.disposalDesc,
                archivedRecordNumber: nextProps.archivedRecordNumber,
                files: nextProps.files,
            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, assetsManager } = this.props;
        const { _id, avatar, code, assetName, serial, assetType, group, purchaseDate, warrantyExpirationDate,
            managedBy, assignedToUser, assignedToOrganizationalUnit, handoverFromDate, handoverToDate, location, description, status, typeRegisterForUse,
            detailInfo, cost, residualValue, startDepreciation, usefulLife, depreciationType, estimatedTotalProduction,
            unitsProducedDuringTheYears, maintainanceLogs, usageLogs, incidentLogs, disposalDate, disposalType, disposalCost,
            disposalDesc, archivedRecordNumber, files
        } = this.props;

        return (
            <React.Fragment>
                <form className="form-group" id="form-view-asset" >
                    <div className="nav-tabs-custom">
                        {/* Nav-tabs */}
                        <ul className="nav nav-tabs">
                            <li className="active"><a title={translate('asset.general_information.general_information')} data-toggle="tab" href={`#view_general${_id}`}>{translate('asset.general_information.general_information')}</a></li>
                            <li><a title={translate('asset.general_information.depreciation_information')} data-toggle="tab" href={`#view_depreciation${_id}`}>{translate('asset.general_information.depreciation_information')}</a></li>
                            <li><a title={translate('asset.general_information.usage_information')} data-toggle="tab" href={`#view_usage${_id}`} onClick={() => { Scheduler.triggerOnActiveEvent(".asset-usage-scheduler") }}>{translate('asset.general_information.usage_information')}</a></li>
                            <li><a title={translate('asset.general_information.incident_information')} data-toggle="tab" href={`#view_incident${_id}`}>{translate('asset.general_information.incident_information')}</a></li>
                            <li><a title={translate('asset.general_information.maintainance_information')} data-toggle="tab" href={`#view_maintainance${_id}`}>{translate('asset.general_information.maintainance_information')}</a></li>
                            <li><a title={translate('asset.general_information.disposal_information')} data-toggle="tab" href={`#view_disposal${_id}`}>{translate('asset.general_information.disposal_information')}</a></li>
                            <li><a title={translate('asset.general_information.attach_infomation')} data-toggle="tab" href={`#view_attachments${_id}`}>{translate('asset.general_information.attach_infomation')}</a></li>
                        </ul>

                        <div className="tab-content">
                            {/* Thông tin chung */}
                            <GeneralTab
                                id={`view_general${_id}`}
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
                            />

                            {/* Thông tin khấu hao */}
                            <DepreciationTab
                                id={`view_depreciation${_id}`}
                                cost={cost}
                                residualValue={residualValue}
                                startDepreciation={startDepreciation}
                                usefulLife={usefulLife}
                                estimatedTotalProduction={estimatedTotalProduction}
                                unitsProducedDuringTheYears={unitsProducedDuringTheYears}
                                depreciationType={depreciationType}
                            />

                            {/* Thông tin bảo trì */}
                            <MaintainanceLogTab
                                id={`view_maintainance${_id}`}
                                maintainanceLogs={maintainanceLogs}
                            />

                            {/* Thông tin sử dụng */}
                            <UsageLogTab
                                id={`view_usage${_id}`}
                                assetId={_id}
                                typeRegisterForUse={typeRegisterForUse}
                                managedBy={managedBy}
                                usageLogs={usageLogs}
                            />

                            {/* Thông tin sự cố */}
                            <IncidentLogTab
                                id={`view_incident${_id}`}
                                incidentLogs={incidentLogs}
                            />

                            {/* Thông tin thanh lý */}
                            <DisposalTab
                                id={`view_disposal${_id}`}
                                disposalDate={disposalDate}
                                disposalType={disposalType}
                                disposalCost={disposalCost}
                                disposalDesc={disposalDesc}
                            />

                            {/* Tài liệu đính kèm */}
                            <AttachmentTab
                                id={`view_attachments${_id}`}
                                archivedRecordNumber={archivedRecordNumber}
                                files={files}
                            />
                        </div>
                    </div>
                </form>
                {/* </DialogModal> */}
            </React.Fragment>
        );
    };
}
function mapState(state) {
    const { assetsManager } = state;
    return { assetsManager };
};

const AssetViewInfoConnected = connect(null, null)(withTranslate(AssetViewInfo));
export { AssetViewInfoConnected as AssetViewInfo };