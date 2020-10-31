import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import DashBoardInventories from './inventoryDashboard';

class InventoryDashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <DashBoardInventories />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(InventoryDashBoard));
