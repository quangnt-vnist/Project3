import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ManufacturingPlanMangementTable from './manufacturingPlanManagementTable';

class ManufacturingPLanList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <ManufacturingPlanMangementTable />
                </div>
            </div>

        );
    }
}
export default connect(null, null)(withTranslate(ManufacturingPLanList));