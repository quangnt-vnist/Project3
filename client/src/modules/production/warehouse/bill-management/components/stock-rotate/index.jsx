import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import RotateManagementTable from './rotateManagementTable';

class RotateManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {
        return (
            <div>
                <RotateManagementTable />
            </div>
        );
    }
}
export default connect(null, null)(withTranslate(RotateManagement));