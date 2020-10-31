import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ArchiveManagementTable from './archiveManagementTable';

class ArchiveManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {
        return (
            <div className="box-body" style={{ minHeight: "450px" }}>
                <ArchiveManagementTable />
            </div>
        );
    }
}
export default connect(null, null)(withTranslate(ArchiveManagement));