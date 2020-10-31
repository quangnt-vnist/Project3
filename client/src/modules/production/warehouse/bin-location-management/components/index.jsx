import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ArchiveManagement from '../components/archives';
import BinManagement from '../components/bin-locations';
import { BinLocationActions} from '../redux/actions';

import { LazyLoadComponent, forceCheckOrVisible } from '../../../../../common-components/index';

class BinLocationManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5
        }
    }

    updateStateArchive = async () => {
        let { page, limit } = this.state;
        await this.props.getChildBinLocations({ page, limit });
        forceCheckOrVisible(true, false);
    }

    updateStateBinLocation = async () => {
        await this.props.getBinLocations();
        forceCheckOrVisible(true, false);
    }

    render() {

        const { translate } = this.props;

        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#bin-locations" data-toggle="tab" onClick={() => this.updateStateArchive()}>{translate('manage_warehouse.bin_location_management.bin_location')}</a></li>
                    <li><a href="#bin-location-archives" data-toggle="tab" onClick={() => this.updateStateBinLocation()}>{translate('manage_warehouse.bin_location_management.archive')}</a></li>
                </ul>
                <div className="tab-content">

                    <div className="tab-pane active" id="bin-locations">
                        <LazyLoadComponent
                        >
                        <ArchiveManagement />
                        </LazyLoadComponent>
                    </div>

                    <div className="tab-pane" id="bin-location-archives">
                        <LazyLoadComponent
                        >
                        <BinManagement />
                        </LazyLoadComponent>
                    </div>
                </div>
            </div>
        );
    }
    
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getBinLocations: BinLocationActions.getBinLocations,
    getChildBinLocations: BinLocationActions.getChildBinLocations
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BinLocationManagement));
