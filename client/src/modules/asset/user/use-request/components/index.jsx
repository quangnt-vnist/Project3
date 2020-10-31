import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ListAsset } from './listAsset';
import { UseRequest } from './UseRequest';

class RecommendDistributeAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { translate } = this.props;
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a title={translate('asset.general_information.asset_list')} data-toggle="tab" href="#listasset">{translate('asset.general_information.asset_list')}</a></li>
                    <li><a title={translate('menu.recommend_distribute_asset')} data-toggle="tab" href="#recommenddistribute">{translate('menu.recommend_distribute_asset')}</a></li>
            </ul>
            <div className="tab-content" style={{ padding: 0 }}>
                <ListAsset />
                <UseRequest />
            </div>
        </div>
        );
    }
}

export default connect(null, null)(withTranslate(RecommendDistributeAsset)); 
