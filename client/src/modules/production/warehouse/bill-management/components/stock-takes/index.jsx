import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import TakeManagementTable from './takeManagementTable';

class TakeManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {
        return (
            <div>
                <TakeManagementTable />
            </div>
        );
    }
}
export default connect(null, null)(withTranslate(TakeManagement));