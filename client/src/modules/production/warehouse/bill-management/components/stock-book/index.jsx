import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import BookManagementTable from './bookManagementTable';

class BookManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {
        return (
            <div>
                <BookManagementTable />
            </div>
        );
    }
}
export default connect(null, null)(withTranslate(BookManagement));