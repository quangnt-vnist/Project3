import React, { Component } from 'react';
import WorkSchedule from '../../workScheduleComponent/workSchedule';
class MillScheduleBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <div>
                    <WorkSchedule />
                </div >
                <div>
                    <WorkSchedule />
                </div >
            </React.Fragment>


        );
    }
}

export default MillScheduleBooking;