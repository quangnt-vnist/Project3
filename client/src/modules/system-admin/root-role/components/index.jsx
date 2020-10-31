import React, { Component } from 'react';

import { RootRoleTable } from './rootRoleTable';

class ManageRootRoles extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        return (
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <RootRoleTable/>
                </div>
            </div>
        );
    }
}

export default ManageRootRoles;