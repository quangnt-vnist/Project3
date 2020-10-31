import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import PurchasingRequestManagementTable from './purchasingRequestManagementTable';

class PurchasingRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <PurchasingRequestManagementTable />
                </div>
            </div>

        );
    }
}
export default connect(null, null)(withTranslate(PurchasingRequest));