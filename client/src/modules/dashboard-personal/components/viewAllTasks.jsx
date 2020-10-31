import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../common-components';

class ViewAllTasks extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { title, employeeTasks } = this.props;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={'modal-view-all-task'} isLoading={false}
                    formID={`form-view-all-task`}
                    title={title}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form className="form-group" id={`form-view-all-task`}>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Họ và tên</th>
                                    <th>Số công việc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeTasks.length !== 0 &&
                                    employeeTasks.map((x, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{x.name}</td>
                                            <td>{x.totalTask}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const viewAllTasks = connect(null, null)(withTranslate(ViewAllTasks));
export { viewAllTasks as ViewAllTasks };