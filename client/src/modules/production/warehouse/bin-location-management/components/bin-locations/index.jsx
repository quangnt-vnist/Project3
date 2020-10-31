import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import BinManagementTable from './binManagementTable';

class BinManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {
        return (
            <div className="box-body" style={{ minHeight: "450px" }}>
                <BinManagementTable />
            </div>
        );
    }
}
export default connect(null, null)(withTranslate(BinManagement));