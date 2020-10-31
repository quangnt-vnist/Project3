import React, { Component } from 'react';

import TableComponent from './tableComponent';

class ManageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <TableComponent />
                </div>
            </div>
        );
    }
}

export default ManageComponent;