import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { toast } from 'react-toastify';
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert';

import { DatePicker } from '../../../../../common-components';

import { ContractAddModal, ContractEditModal, CourseAddModal, CourseEditModal } from './combinedContent';

import { CourseActions } from '../../../../training/course/redux/actions';
import { AuthActions } from '../../../../auth/redux/actions';

class ContractTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     *  Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;

    };

    getCurrentContract = (contracts) => {
        let contract = contracts[0];
        contracts.forEach(x => {
            if (new Date(contract.startDate).getTime() < new Date(x.startDate).getTime()) {
                contract = x
            }
        })
        return contract
    }


    componentDidMount() {
        this.props.getListCourse({ organizationalUnits: this.state.organizationalUnits, positions: this.state.roles });
    }

    /**
     * Bắt sự kiện click edit khoá học
     * @param {*} value : Dữ liệu khoá học
     * @param {*} index : Số thứ tự khoá học muốn chỉnh sửa
     */
    handleCourseEdit = async (value, index) => {
        let courseInfo = '';
        this.props.course.listCourses.forEach(list => {
            if (list._id === value.course) {
                courseInfo = list
            }
        });
        await this.setState(state => {
            return {
                ...state,
                currentCourseRow: { ...value, index: index, courseInfo: courseInfo }
            }
        });
        window.$(`#modal-edit-course-editCourse${index}`).modal('show');
    }

    /**
     * Bắt sự kiện click edit hợp đồng
     * @param {*} value : Dữ liệu hợp đồng
     * @param {*} index : Số thứ tự hợp đồng muốn chỉnh sửa
     */
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-contract-editContract${index}`).modal('show');
    }

    /**
     * Function kiểm tra trùng lặp thời gian hợp đồng lao động
     * @param {*} data 
     * @param {*} array 
     */
    checkForDuplicate = (data, array) => {
        let checkData = true;
        if (data.startDate && data.endDate) {
            let startDate = new Date(data.startDate);
            let endDate = new Date(data.endDate);
            for (let n in array) {
                let date1 = new Date(array[n].startDate);
                let date2 = new Date(array[n].endDate);
                if (date1.getTime() === startDate.getTime() || (startDate.getTime() < date1.getTime() && endDate.getTime() > date1.getTime()) ||
                    (startDate.getTime() < date2.getTime() && endDate.getTime() > date1.getTime())) {
                    checkData = false;
                    break;
                }
            }
        }
        return checkData
    }

    /**
     * Function thêm thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu thông tin hợp đồng muốn thêm
     */
    handleAddContract = async (data) => {
        const { translate } = this.props;
        let { contracts } = this.state;

        let checkData = this.checkForDuplicate(data, contracts);
        if (checkData) {
            await this.setState({
                ...this.state,
                contracts: [...contracts, {
                    ...data
                }]
            })
            this.props.handleAddContract(this.state.contracts, data);
            let contract = this.getCurrentContract(this.state.contracts);

            this.setState({
                contractEndDate: contract.endDate,
                contractType: contract.contractType
            })
            this.props.handleChange('contractEndDate', contract.endDate ? contract.endDate : "");
            this.props.handleChange('contractType', contract.contractType);

        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={[translate('human_resource.profile.time_contract_duplicate')]}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }

    /**
     * Function chỉnh sửa thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu thông tin hợp đồng muốn chỉnh sửa
     */
    handleEditContract = async (data) => {
        const { translate } = this.props;
        let { contracts } = this.state;

        let contractsNew = [...contracts];
        let checkData = this.checkForDuplicate(data, contractsNew.filter((x, index) => index !== data.index));
        if (checkData) {
            contracts[data.index] = data;
            await this.setState({
                contracts: contracts
            })
            this.props.handleEditContract(contracts, data);

            let contract = this.getCurrentContract(this.state.contracts);
            this.setState({
                contractEndDate: contract.endDate,
                contractType: contract.contractType
            })
            this.props.handleChange('contractEndDate', contract.endDate ? contract.endDate : "");
            this.props.handleChange('contractType', contract.contractType);
        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={[translate('human_resource.profile.time_contract_duplicate')]}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }

    /**
     * Function xoá hợp đồng lao động
     * @param {*} index : Số thứ tự hợp đồng lao động muốn chỉnh sửa
     */
    delete = async (index) => {
        let { contracts } = this.state;
        let data = contracts[index];
        contracts.splice(index, 1);
        await this.setState({
            ...this.state,
            contracts: [...contracts]
        })
        this.props.handleDeleteContract(contracts, data);
        let contract = {};
        if (contracts.length !== 0) {
            contract = this.getCurrentContract(contracts);
        };

        await this.setState({
            contractEndDate: contract.endDate ? contract.endDate : "",
            contractType: contract.contractType ? contract.contractType : "",
        });

        await this.props.handleChange('contractEndDate', contract.endDate ? contract.endDate : "");
        await this.props.handleChange('contractType', contract.contractType ? contract.contractType : "");
    }


    /**
     * Function thêm thông tin khoá đào tạo
     * @param {*} data : Dữ liệu thông tin khoá đào tạo muốn thêm
     */
    handleAddCourse = async (data) => {
        const { courses } = this.state;
        let check = false;
        courses.forEach(x => {
            if (x.course === data.course) {
                check = true;
            }
        })
        if (check === false) {
            await this.setState({
                courses: [...courses, {
                    ...data
                }]
            })
            this.props.handleAddCourse(this.state.courses, data);
        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={['Khoá đào tạo đã tồn tại']}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }

    /**
     * Function chỉnh sửa thông tin khoá đào tạo
     * @param {*} data : Dữ liệu thông tin khoá đào tạo muốn chỉnh sửa
     */
    handleEditCourse = async (data) => {
        const { courses } = this.state;
        courses[data.index] = data;
        await this.setState({
            courses: courses
        })
        this.props.handleEditCourse(courses, data);
    }

    /**
     * Function xoá thông tin khoá đào tạo
     * @param {*} index : Số thứ tự khoá đào tạo muốn chỉnh sửa
     */
    deleteCourse = async (index) => {
        let { courses } = this.state;
        let data = courses[index];
        courses.splice(index, 1);
        await this.setState({
            ...this.state,
            courses: [...courses]
        })
        this.props.handleDeleteCourse(courses, data)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.id !== this.state.id) {
            this.props.getListCourse({ organizationalUnits: nextProps.organizationalUnits, positions: nextProps.roles });
        }
        return true
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                contracts: nextProps.contracts,
                contractEndDate: nextProps.employee ? nextProps.employee.contractEndDate : '',
                contractType: nextProps.employee ? nextProps.employee.contractType : '',
                courses: nextProps.courses,
                pageCreate: nextProps.pageCreate,
                organizationalUnits: nextProps.organizationalUnits,
                roles: nextProps.roles
            }
        } else {
            return null;
        }
    }


    render() {
        const { translate, course, } = this.props;

        const { id } = this.props;

        const { contracts, contractEndDate, contractType, courses, pageCreate, roles, currentRow, currentCourseRow } = this.state;

        console.log(contractEndDate);
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Danh sách hợp đồng lao động */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.labor_contract')}</h4></legend>
                        <div className="row">
                            {/* Ngày hết hạn hợp đồng */}
                            <div className="form-group col-md-4">
                                <label>{translate('human_resource.profile.contract_end_date')}</label>
                                <DatePicker
                                    id={`contractEndDate-${id}`}
                                    disabled={true}
                                    value={this.formatDate(contractEndDate)}
                                    onChange={this.handleContractEndDateChange}
                                />
                            </div>
                            {/* Loại hợp đồng */}
                            <div className="form-group col-md-4">
                                <label >{translate('human_resource.profile.type_contract')}</label>
                                <input type="text" className="form-control" name="contractType" value={contractType ? contractType : ''} disabled />
                            </div>
                            <div className="form-group col-md-4 col-xs-12">
                                <ContractAddModal handleChange={this.handleAddContract} id={`addContract${id}`} />
                            </div>
                        </div>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}  >
                            <thead>
                                <tr>
                                    <th >{translate('human_resource.profile.name_contract')}</th>
                                    <th >{translate('human_resource.profile.type_contract')}</th>
                                    <th >{translate('human_resource.profile.start_date')}</th>
                                    <th >{translate('human_resource.profile.end_date_certificate')}</th>
                                    <th >{translate('human_resource.profile.attached_files')}</th>
                                    <th style={{ width: '120px' }}>{translate('general.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contracts && contracts.length !== 0 &&
                                    contracts.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.contractType}</td>
                                            <td>{this.formatDate(x.startDate)}</td>
                                            <td>{this.formatDate(x.endDate)}</td>
                                            <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                                <a className='intable'
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => this.requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
                                                    <i className="fa fa-download"> &nbsp;Download!</i>
                                                </a>
                                            }</td>
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.edit_contract')} ><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (!contracts || contracts.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                    {/* Danh sách khoá học */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.training_process')}</h4></legend>
                        {pageCreate && <a style={{ marginBottom: '10px', marginTop: '2px' }} className="btn btn-success pull-right" title={translate('human_resource.profile.employee_management.staff_no_unit_title')} disabled >{translate('modal.create')}</a>}
                        {!pageCreate && <CourseAddModal roles={roles} handleChange={this.handleAddCourse} id={`addCourse${id}`} />}
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>Mã khoá đào tạo</th>
                                    <th>{translate('human_resource.profile.course_name')}</th>
                                    <th>{translate('human_resource.profile.start_day')}</th>
                                    <th>{translate('human_resource.profile.end_date')}</th>
                                    <th>Địa điểm đào tạo</th>
                                    <th>Kết quả</th>
                                    <th>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses && courses.length !== 0 &&
                                    courses.map((x, index) => {
                                        let courseInfo;
                                        course.listCourses.forEach(list => {
                                            if (list._id === x.course) {
                                                courseInfo = list
                                            }
                                        });
                                        if (courseInfo) {
                                            return (
                                                <tr key={index}>
                                                    <td>{courseInfo.courseId}</td>
                                                    <td>{courseInfo.name}</td>
                                                    <td>{this.formatDate(courseInfo.startDate)}</td>
                                                    <td>{this.formatDate(courseInfo.endDate)}</td>
                                                    <td>{courseInfo.coursePlace}</td>
                                                    <td>{x.result}</td>
                                                    <td >
                                                        <a onClick={() => this.handleCourseEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title='Chỉnh sửa thông tin khoá đào tạo' ><i className="material-icons">edit</i></a>
                                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.deleteCourse(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            )
                                        } else {
                                            return null
                                        }

                                    })}
                            </tbody>
                        </table>
                        {
                            (!courses || courses.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
                {   /** Form chỉnh sửa hợp đồng */
                    currentRow &&
                    <ContractEditModal
                        id={`editContract${currentRow.index}`}
                        _id={currentRow._id}
                        index={currentRow.index}
                        name={currentRow.name}
                        contractType={currentRow.contractType}
                        startDate={this.formatDate(currentRow.startDate)}
                        endDate={this.formatDate(currentRow.endDate)}
                        file={currentRow.file}
                        urlFile={currentRow.urlFile}
                        fileUpload={currentRow.fileUpload}
                        handleChange={this.handleEditContract}
                    />
                }
                {   /** Form chỉnh sửa hợp đồng */
                    currentCourseRow &&
                    <CourseEditModal
                        id={`editCourse${currentCourseRow.index}`}
                        _id={currentCourseRow._id}
                        index={currentCourseRow.index}
                        courseId={currentCourseRow.course}
                        result={currentCourseRow.result}
                        nameCourse={currentCourseRow.courseInfo.name}
                        handleChange={this.handleEditCourse}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { course } = state;
    return { course };
};

const actionCreators = {
    getListCourse: CourseActions.getListCourse,
    downloadFile: AuthActions.downloadFile,

};

const contractTab = connect(mapState, actionCreators)(withTranslate(ContractTab));
export { contractTab as ContractTab };
