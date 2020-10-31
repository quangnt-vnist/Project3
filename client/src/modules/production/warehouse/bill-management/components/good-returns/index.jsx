import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ReturnManagementTable from './returnManagementTable';

class ReturnManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {
        return (
            <div>
                <ReturnManagementTable />
            </div>
        );
    }
}
export default connect(null, null)(withTranslate(ReturnManagement));