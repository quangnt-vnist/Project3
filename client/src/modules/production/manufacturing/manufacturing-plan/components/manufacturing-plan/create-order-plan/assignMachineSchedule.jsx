import React, { Component } from 'react';
import { UseRequestManager } from '../../../../../../asset/admin/use-request/components/UseRequestManager';
class AssignMachineSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { id } = this.props;
        return (
            <div id={id} className="tab-pane">
                <UseRequestManager />
            </div>
        );
    }
}

export default AssignMachineSchedule;