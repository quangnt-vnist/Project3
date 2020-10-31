import React, { Component } from 'react';

import ManageUserTable from './manageUserTable';

class ManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <ManageUserTable />
                </div>
            </div>
        );
    }
}

export default ManageUser;
