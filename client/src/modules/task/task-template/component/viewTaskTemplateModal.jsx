import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';
import { taskTemplateActions } from '../redux/actions';
import { ViewTaskTemplate } from './viewTaskTemplate';

class ModalViewTaskTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(props, state) {
        if (props.taskTemplateId !== state.taskTemplateId) {
            props.getTaskTemplate(props.taskTemplateId);

            return {
                ...state,
                taskTemplateId: props.taskTemplateId
            }
        } else {
            return null;
        }
    }

    render() {
        const { taskTemplate } = this.props.tasktemplates;

        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-view-tasktemplate" isLoading={false}
                    formID="form-view-tasktemplate"
                    title={taskTemplate && taskTemplate.name}
                    hasSaveButton={false}
                >
                    <ViewTaskTemplate
                        taskTemplate={taskTemplate}
                        isProcess={false}
                    />
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasktemplates } = state;
    return { tasktemplates };
}

const actionCreators = {
    getTaskTemplate: taskTemplateActions.getTaskTemplateById,
};

const connectedModalViewTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalViewTaskTemplate));
export { connectedModalViewTaskTemplate as ModalViewTaskTemplate };