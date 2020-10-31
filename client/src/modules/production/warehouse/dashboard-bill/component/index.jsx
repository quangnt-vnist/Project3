import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import DashBoardBills from './billDashboard';

class BillDashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <DashBoardBills />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(BillDashBoard));
