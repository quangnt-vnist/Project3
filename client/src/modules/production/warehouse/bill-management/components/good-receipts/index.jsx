import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ReceiptManagementTable from './receiptManagementTable';

class ReceiptManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {
        return (
            <div>
                <ReceiptManagementTable />
            </div>
        );
    }
}
export default connect(null, null)(withTranslate(ReceiptManagement));