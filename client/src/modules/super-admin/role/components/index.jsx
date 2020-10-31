import React, { Component } from 'react';

import RoleTable from './roleTable';

class ManageRole extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <RoleTable />
                </div>
            </div>
        );
    }
}

export default ManageRole;