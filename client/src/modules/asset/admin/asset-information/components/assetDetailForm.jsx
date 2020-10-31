import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, Scheduler } from '../../../../../common-components';

import {
    GeneralTab, MaintainanceLogTab, UsageLogTab, DepreciationTab, IncidentLogTab, DisposalTab, AttachmentTab
} from '../../../base/detail-tab/components/combinedContent';
import { AssetViewInfo } from './assetViewInfo';

class AssetDetailForm extends Component {
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
            disposalDesc, archivedRecordNumber, files, readByRoles
        } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-view-asset" isLoading={assetsManager}
                    formID="form-view-asset"
                    title={translate('asset.asset_info.asset_info')}
                    hasSaveButton={false}
                >
                    <AssetViewInfo
                        id="form-view-asset"
                        _id={_id}
                        avatar={avatar}
                        code={code}
                        assetName={assetName}
                        serial={serial}
                        assetType={assetType}
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
                        cost={cost}
                        readByRoles={readByRoles}
                        residualValue={residualValue}
                        startDepreciation={startDepreciation}
                        usefulLife={usefulLife}
                        depreciationType={depreciationType}
                        estimatedTotalProduction={estimatedTotalProduction}
                        unitsProducedDuringTheYears={unitsProducedDuringTheYears}

                        maintainanceLogs={maintainanceLogs}
                        usageLogs={usageLogs}
                        incidentLogs={incidentLogs}

                        disposalDate={disposalDate}
                        disposalType={disposalType}
                        disposalCost={disposalCost}
                        disposalDesc={disposalDesc}

                        archivedRecordNumber={archivedRecordNumber}
                        files={files}
                    />
                </DialogModal>
            </React.Fragment>
        );
    };
}
function mapState(state) {
    const { assetsManager } = state;
    return { assetsManager };
};

const detailAsset = connect(null, null)(withTranslate(AssetDetailForm));
export { detailAsset as AssetDetailForm };