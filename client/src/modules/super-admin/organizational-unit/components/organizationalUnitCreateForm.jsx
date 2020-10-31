import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DepartmentActions } from '../redux/actions';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

class DepartmentCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deans: [],
            viceDeans: [],
            employees: []
        }
    }

    handleAddDean = (e) => {
        this.setState({
            deans: [...this.state.deans, '']
        });
    }

    handleChangeDean = (e, index) => {
        let {deans} = this.state;
        deans[index] = e.target.value;
        this.setState({ deans });
    }

    handleRemoveDean = (index) => {
        let {deans} = this.state;
        deans.splice(index, 1);
        this.setState({ deans });
    }

    handleAddViceDean = (e) => {
        this.setState({
            viceDeans: [...this.state.viceDeans, '']
        });
    }

    handleChangeViceDean = (e, index) => {
        let {viceDeans} = this.state;
        viceDeans[index] = e.target.value;
        this.setState({ viceDeans });
    }

    handleRemoveViceDean = (index) => {
        let {viceDeans} = this.state;
        viceDeans.splice(index, 1);
        this.setState({ viceDeans });
    }

    handleAddEmployee = (e) => {
        this.setState({
            employees: [...this.state.employees, '']
        });
    }

    handleChangeEmployee = (e, index) => {
        let {employees} = this.state;
        employees[index] = e.target.value;
        this.setState({ employees });
    }

    handleRemoveEmployee = (index) => {
        let {employees} = this.state;
        employees.splice(index, 1);
        this.setState({ employees });
    }

    /**
     * Validate form
     */
    isFormValidated = () => {
        let {departmentName, departmentDescription} = this.state;
        let {translate} = this.props;
        if(!ValidationHelper.validateName(translate, departmentName).status || !ValidationHelper.validateDescription(translate, departmentDescription).status) return false;
        return true;
    }

    /**
     * Thực hiện thêm đơn vị mới
     */
    save = () => {
        if (this.isFormValidated()) {
            return this.props.create({
                name: this.state.departmentName,
                description: this.state.departmentDescription,
                deans: this.state.deans,
                viceDeans: this.state.viceDeans,
                employees: this.state.employees,
                parent: this.state.departmentParent
            });
        }
    }

    handleParent = (value) => {
        this.setState({
            departmentParent: value[0]
        });
    }

    handleName = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ 
            departmentName: value,
            departmentNameError: message
        });
    }

    handleDescription = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateDescription(translate, value);
        this.setState({ 
            departmentDescription: value,
            departmentDescriptionError: message
        });
    }

    render() {
        const { translate, department } = this.props;
        const { departmentNameError, departmentDescriptionError } = this.state;
        
        return (
            <React.Fragment>
                <DialogModal
                    isLoading={department.isLoading}
                    modalID="modal-create-department"
                    formID="form-create-department"
                    title={translate('manage_department.add_title')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm đơn vị mới */}
                    <form id="form-create-department">

                        {/* Thông tin về đơn vị */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border"><span>{translate('manage_department.info')}</span></legend>

                            {/* Tên đơn vị */}
                            <div className={`form-group ${!departmentNameError ? "" : "has-error"}`}>
                                <label>{translate('manage_department.name')}<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={this.handleName} />
                                <ErrorLabel content={departmentNameError} />
                            </div>

                            {/* Mô tả về đơn vị */}
                            <div className={`form-group ${!departmentDescriptionError ? "" : "has-error"}`}>
                                <label>{translate('manage_department.description')}<span className="attention"> * </span></label>
                                <textarea type="text" className="form-control" onChange={this.handleDescription} />
                                <ErrorLabel content={departmentDescriptionError} />
                            </div>

                            {/* Đơn vị cha */}
                            <div className="form-group">
                                <label>{translate('manage_department.parent')}</label>
                                <SelectBox
                                    id="create-organizational-unit"
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { text: "Không có phòng ban cha" }, ...department.list.map(department => { return { value: department ? department._id : null, text: department ? department.name : "Organizational unit is deleted" } })
                                    ]}
                                    onChange={this.handleParent}
                                    multiple={false}
                                />
                            </div>
                        </fieldset>

                        {/* Các chức danh của đơn vị */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border"><span>{translate('manage_department.roles_of_department')}</span></legend>

                            {/* Tên chức danh cho trưởng đơn vị */}
                            <div className="form-group">
                                <table className="table table-hover table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th><label>{translate('manage_department.dean_name')}</label></th>
                                            <th style={{ width: '40px' }} className="text-center"><a href="#add-dean" className="text-green" onClick={this.handleAddDean}><i className="material-icons">add_box</i></a></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.deans.length > 0 &&
                                            this.state.deans.map((dean, index) => {
                                                return <tr key={index}>
                                                    <td>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder={translate('manage_department.dean_example')}
                                                            value={dean}
                                                            onChange={(e) => this.handleChangeDean(e, index)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <a href="#delete-dean"
                                                            className="text-red"
                                                            style={{ border: 'none' }}
                                                            onClick={() => this.handleRemoveDean(index)}><i className="fa fa-trash"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>

                            {/* Tên chức danh cho phó đơn vị */}
                            <div className="form-group">
                                <table className="table table-hover table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th><label>{translate('manage_department.vice_dean_name')}</label></th>
                                            <th style={{ width: '40px' }} className="text-center"><a href="#add-vicedean" className="text-green" onClick={this.handleAddViceDean}><i className="material-icons">add_box</i></a></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.viceDeans.length > 0 &&
                                            this.state.viceDeans.map((vicedean, index) => {
                                                return <tr key={index}>
                                                    <td>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder={translate('manage_department.vice_dean_example')}
                                                            value={vicedean}
                                                            onChange={(e) => this.handleChangeViceDean(e, index)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <a href="#delete-vice-dean"
                                                            className="text-red"
                                                            style={{ border: 'none' }}
                                                            onClick={() => this.handleRemoveViceDean(index)}><i className="fa fa-trash"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>

                            {/* Tên chức danh cho nhân viên đơn vị */}
                            <div className="form-group">
                                <table className="table table-hover table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th><label>{translate('manage_department.employee_name')}</label></th>
                                            <th style={{ width: '40px' }} className="text-center"><a href="#add-employee" className="text-green" onClick={this.handleAddEmployee}><i className="material-icons">add_box</i></a></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.employees.length > 0 &&
                                            this.state.employees.map((employee, index) => {
                                                return <tr key={index}>
                                                    <td>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder={translate('manage_department.employee_example')}
                                                            value={employee}
                                                            onChange={(e) => this.handleChangeEmployee(e, index)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <a href="#delete-employee"
                                                            className="text-red"
                                                            style={{ border: 'none' }}
                                                            onClick={() => this.handleRemoveEmployee(index)}><i className="fa fa-trash"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </fieldset>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { department } = state;
    return { department };
}

const getState = {
    create: DepartmentActions.create
}

export default connect(mapState, getState)(withTranslate(DepartmentCreateForm)); 
