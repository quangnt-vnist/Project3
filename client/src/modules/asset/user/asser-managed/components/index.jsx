import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AssetManagement } from '../../../admin/asset-information/components/assetManagement';
import { UseRequestManager } from '../../../admin/use-request/components/UseRequestManager';
import { IncidentManagement } from '../../../admin/incident/components/incidentManagement';

class EmployeeAssetManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            managedBy: localStorage.getItem('userId'),
            openTab1: "tab-pane active",
            openTab2: "tab-pane",
            openTab3: "tab-pane"
        };
    }

    openIncidentTab = () => {
        this.setState({
            ...this.state,
            openTab1: "tab-pane",
            openTab2: "tab-pane",
            openTab3: "tab-pane active",
        });

    }
    openUseRequestTab = () => {
        this.setState({
            ...this.state,
            openTab1: "tab-pane",
            openTab2: "tab-pane active",
            openTab3: "tab-pane"
        });

    }
    openGeneralTab = () => {
        this.setState({
            ...this.state,
            openTab1: "tab-pane active",
            openTab2: "tab-pane",
            openTab3: "tab-pane"
        });

    }


    render() {
        let { translate } = this.props;
        let { managedBy, openTab1, openTab2, openTab3 } = this.state;
        return (
            <div className="nav-tabs-custom" >

                <ul className="nav nav-tabs">
                    <li className="active"><a title={translate('menu.manage_info_asset')} data-toggle="tab" onClick={this.openGeneralTab} >{translate('menu.manage_info_asset')}</a></li>
                    <li><a title={translate('menu.manage_recommend_distribute_asset')} data-toggle="tab" onClick={this.openUseRequestTab} >{translate('menu.manage_recommend_distribute_asset')}</a></li>
                    <li><a title={translate('menu.manage_incident_asset')} data-toggle="tab" onClick={this.openIncidentTab} >{translate('menu.manage_incident_asset')}</a></li>
                </ul>

                <div className="tab-content">
                    <AssetManagement managedBy={managedBy} isActive={openTab1} />
                    <UseRequestManager managedBy={managedBy} isActive={openTab2} />
                    <IncidentManagement managedBy={managedBy} isActive={openTab3} />
                </div>

            </div>
        );
    };
}


export default connect(null, null)(withTranslate(EmployeeAssetManagement)); 