import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import IssueManagementTable from './issueManagementTable';

class IssueManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {
        return (
            <div>
                <IssueManagementTable />
            </div>
        );
    }
}
export default connect(null, null)(withTranslate(IssueManagement));