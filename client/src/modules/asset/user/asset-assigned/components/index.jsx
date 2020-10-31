import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AssetAssignedManager } from './AssetAssignedManager';
import { AssetCrashManager } from './AssetCrashManager';

class ManagerAssetAssignedCrash extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { translate } = this.props;
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a title={translate('menu.manage_assigned_asset')} data-toggle="tab" href="#assetassigned">{translate('menu.manage_assigned_asset')}</a></li>
                    <li><a title={translate('asset.incident.incident')} data-toggle="tab" href="#assetcrash">{translate('asset.incident.incident')}</a></li>
                </ul>
                <div className="tab-content" style={{ padding: 0 }}>
                    <AssetAssignedManager />
                    <AssetCrashManager />
                </div>
            </div>
        )
    };
}

const assetAssignedCrash = connect(null, null)(withTranslate(ManagerAssetAssignedCrash));

export { assetAssignedCrash as ManagerAssetAssignedCrash };