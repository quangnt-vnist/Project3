import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../common-components';

class ViewAllSalary extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { dataSalary, title } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={'modal-view-all-salary'} isLoading={false}
                    formID={`form-view-all-salary`}
                    title={title}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form className="form-group" id={`form-view-all-salary`}>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã nhân viên</th>
                                    <th>Họ và tên</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataSalary && dataSalary.length !== 0 &&
                                    dataSalary.map((x, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{x.employee.employeeNumber}</td>
                                            <td>{x.employee.fullName}</td>
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

const viewAllSalary = connect(null, null)(withTranslate(ViewAllSalary));
export { viewAllSalary as ViewAllSalary };