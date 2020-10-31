import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ManufacturingOrderManagement from './manufacturingOrderManagementTable';

class ManufacturingOrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <ManufacturingOrderManagement />
                </div>
            </div>

        );
    }
}
export default connect(null, null)(withTranslate(ManufacturingOrderList));