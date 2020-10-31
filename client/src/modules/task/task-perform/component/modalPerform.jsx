import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { TaskComponent } from './taskComponent';

class ModalPerform extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        
    }

    render() {
        let task;
        const { tasks, units } = this.props; 
        
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task;
        
        return (
            <React.Fragment>
                <DialogModal
                    size="100"
                    modalID={`modelPerformTask${this.props.id}`}
                    formID="form-perform-task"
                    title={task && task.name}
                    bodyStyle={{padding: "0px"}}
                    hasSaveButton={false}
                >
                    <TaskComponent 
                        units={units}
                        id={this.props.id} 
                    />
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const actionDispatch = {}

const modalPerform = connect(mapState, actionDispatch)(withTranslate(ModalPerform));
export { modalPerform as ModalPerform }


