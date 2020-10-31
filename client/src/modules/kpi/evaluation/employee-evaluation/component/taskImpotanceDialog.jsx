import { DialogModal } from '../../../../../common-components/src/modal/dialogModal';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class TaskImpartanceDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { translate } = this.props;
        return (
            <React.Fragment>
                <DialogModal
                    size={50}
                    modalID={`modal-taskimportance-auto`}
                    title={`${translate('kpi.evaluation.employee_evaluation.explain_automatic_point')} ${this.props.task.name}`}
                    hasSaveButton={false}
                >
                    <div>
                        <div>{translate('kpi.evaluation.employee_evaluation.num_of_working_day')}: {this.props.task ? this.props.task.daykpi : "Deleted"}</div>
                        <div>{translate('kpi.evaluation.employee_evaluation.contribution')}: {this.props.task ? this.props.task.results.contribution : "Deleted"}</div>
                        <div>{translate('kpi.evaluation.employee_evaluation.priority')}: {this.props.task ? this.props.task.priority : "Deleted"}</div>
                        <div>{translate('kpi.evaluation.employee_evaluation.formula')}:</div>
                        <div> 3 * ({this.props.task.priority} / 3) + 3 * ({this.props.task.results.contribution} / 100) + 4 * ({this.props.task.daykpi} / 30)</div>
                        <div> = {this.props.task.taskImportanceLevelCal}</div>
                    </div>
                </DialogModal>
            </React.Fragment>
        )
    };
}
const taskImportance = connect(null, null)(withTranslate(TaskImpartanceDialog))
export { taskImportance as TaskDialog }