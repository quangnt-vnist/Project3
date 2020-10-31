import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

import { DialogModal } from '../../../../../common-components';

import {
    GeneralTab, ContactTab, TaxTab, InsurranceTab, DisciplineTab,
    ExperienceTab, CertificateTab, ContractTab, SalaryTab, FileTab
} from '../../employee-create/components/combinedContent';

import { EmployeeManagerActions } from '../redux/actions';
import { EmployeeInfoActions } from '../../employee-info/redux/actions';

class EmployeeEditFrom extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        };
    }

    /**
     * Function upload avatar 
     * @param {*} img 
     * @param {*} avatar 
     */
    handleUpload = (img, avatar) => {
        this.setState({
            img: img,
            avatar: avatar
        })
    }

    /**
     * Function lưu các trường thông tin vào state
     * @param {*} name : Tên trường
     * @param {*} value : Giá trị của trường
     */
    handleChange = (name, value) => {
        const { employee } = this.state;
        if (name === 'startingDate' || name === 'leavingDate' || name === 'birthdate' || name === 'identityCardDate' || name === 'taxDateOfIssue' || name === 'healthInsuranceStartDate' || name === 'healthInsuranceEndDate') {
            if (value) {
                let partValue = value.split('-');
                value = [partValue[2], partValue[1], partValue[0]].join('-');
            }
        }
        this.setState({
            employee: {
                ...employee,
                [name]: value
            }
        });
    }


    /**
     * Function thêm kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     * @param {*} addData : Kinh nghiệm làm việc muốn thêm
     */
    handleCreateExperiences = (data, addData) => {
        this.setState({
            experiences: data
        })
    }

    /**
     * Function chỉnh sửa kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     * @param {*} editData : Kinh nghiệm làm việc muốn chỉnh sửa
     */
    handleEditExperiences = (data, editData) => {
        const { editExperiences } = this.state;
        if (editData._id) {
            this.setState({
                editExperiences: [...editExperiences, editData]
            })
        } else {
            this.setState({
                experiences: data
            })
        }
    }

    /**
     * Function xoá kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     * @param {*} deleteData : Kinh nghiệm làm việc muốn xoá
     */
    handleDeleteExperiences = (data, deleteData) => {
        const { deleteExperiences, editExperiences } = this.state;
        if (deleteData._id) {
            this.setState({
                deleteExperiences: [...deleteExperiences, deleteData],
                editExperiences: editExperiences.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                experiences: data
            })
        }
    }


    /**
     * Function thêm thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp
     * @param {*} addData : Bằng cấp muốn thêm 
     */
    handleCreateDegree = (data, addData) => {
        this.setState({
            degrees: data
        })
    }

    /**
     * Function chỉnh sửa thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp
     * @param {*} editData : bằng cấp muốn chỉnh sửa
     */
    handleEditDegree = (data, editData) => {
        const { editDegrees } = this.state;
        if (editData._id) {
            this.setState({
                editDegrees: [...editDegrees, editData]
            })
        } else {
            this.setState({
                degrees: data
            })
        }
    }

    /**
     * Function xoá thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp
     * @param {*} deleteData : Bằng cấp muốn xoá
     */
    handleDeleteDegree = (data, deleteData) => {
        const { deleteDegrees, editDegrees } = this.state;
        if (deleteData._id) {
            this.setState({
                deleteDegrees: [...deleteDegrees, deleteData],
                editDegrees: editDegrees.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                degrees: data
            })
        }
    }


    /**
     * Function thêm thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ
     * @param {*} addData : Chứng chỉ muốn thêm
     */
    handleCreateCertificate = (data, addData) => {
        this.setState({
            certificates: data
        })
    }

    /**
     * Function chỉnh sửa thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ
     * @param {*} editData : Chứng chỉ muốn chỉnh sửa
     */
    handleEditCertificate = (data, editData) => {
        const { editCertificates } = this.state;
        if (editData._id) {
            this.setState({
                editCertificates: [...editCertificates, editData]
            })
        } else {
            this.setState({
                certificates: data
            })
        }
    }

    /**
     * Function xoá thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ
     * @param {*} deleteData : Chứng chỉ muốn xoá
     */
    handleDeleteCertificate = (data, deleteData) => {
        const { deleteCertificates, editCertificates } = this.state;
        if (deleteData._id) {
            this.setState({
                deleteCertificates: [...deleteCertificates, deleteData],
                editCertificates: editCertificates.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                certificates: data
            })
        }
    }


    /**
     * Function thêm quá trình đóng bảo hiểm xã hội
     * @param {*} data : Dữ liệu quá trình đóng bảo hiểm xã hội
     * @param {*} addData : Quá trình bảo hiểm xã hội muốn thêm
     */
    handleCreateBHXH = (data, addData) => {
        this.setState({
            socialInsuranceDetails: data
        })
    }

    /**
     * Function chỉnh sửa quá trình đóng bảo hiểm xã hội
     * @param {*} data : Dữ liệu quá trình đóng bảo hiểm xã hội
     * @param {*} editData : Quá trình đóng bảo hiểm xã hội muốn thêm
     */
    handleEditBHXH = (data, editData) => {
        const { editSocialInsuranceDetails } = this.state;
        if (editData._id) {
            this.setState({
                editSocialInsuranceDetails: [...editSocialInsuranceDetails, editData]
            })
        } else {
            this.setState({
                socialInsuranceDetails: data
            })
        }
    }

    /**
     * Function xoá quá trình đóng bảo hiểm xã hội
     * @param {*} data : Dữ liệu quá trình đóng bảo hiểm xã hội
     * @param {*} deleteData : Quá trình đóng bảo hiểm xã hội muốn xoá
     */
    handleDeleteBHXH = (data, deleteData) => {
        const { deleteSocialInsuranceDetails, editSocialInsuranceDetails } = this.state;
        if (deleteData._id) {
            this.setState({
                deleteSocialInsuranceDetails: [...deleteSocialInsuranceDetails, deleteData],
                editSocialInsuranceDetails: editSocialInsuranceDetails.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                socialInsuranceDetails: data
            })
        }
    }


    /**
     * Function thêm thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu hợp đồng lao động
     * @param {*} addData : Hợp đồng lao động muốn thêm
     */
    handleCreateContract = (data, addData) => {
        this.setState({
            contracts: data
        })
    }

    /**
     * Function chỉnh sửa thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu thông tin hợp đồng lao động
     * @param {*} editData : Hợp đồng lao động muốn chỉnh sửa
     */
    handleEditContract = (data, editData) => {
        const { editContracts } = this.state;
        if (editData._id) {
            this.setState({
                editContracts: [...editContracts, editData]
            })
        } else {
            this.setState({
                contracts: data
            })
        }
    }

    /**
     * Function xoá thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu thông tin hợp đồng lao động
     * @param {*} deleteData : Hợp đồng lao động muốn xoá
     */
    handleDeleteContract = (data, deleteData) => {
        const { deleteContracts, editContracts } = this.state;
        if (deleteData._id) {
            this.setState({
                deleteContracts: [...deleteContracts, deleteData],
                editContracts: editContracts.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                contracts: data
            })
        }
    }


    /**
     * Function thêm thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     * @param {*} addData : Khen thưởng muốn thêm
     */
    handleCreateConmmendation = (data, addData) => {
        this.setState({
            commendations: data
        })
    }

    /**
     * Function chỉnh sửa thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     * @param {*} editData : Khen thưởng muốn chỉnh sửa
     */
    handleEditConmmendation = (data, editData) => {
        const { editConmmendations } = this.state;
        if (editData._id) {
            this.setState({
                editConmmendations: [...editConmmendations, editData]
            })
        } else {
            this.setState({
                commendations: data
            })
        }
    }

    /**
     * Function xoá thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     * @param {*} deleteData : Khen thưởng muốn xoá
     */
    handleDeleteConmmendation = (data, deleteData) => {
        const { editConmmendations, deleteConmmendations } = this.state;
        if (deleteData._id) {
            this.setState({
                deleteConmmendations: [...deleteConmmendations, deleteData],
                editConmmendations: editConmmendations.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                commendations: data
            })
        }
    }


    /**
     * Function thêm thông tin kỷ luật
     * @param {*} data : Dữ liệu thông tin kỷ luật
     * @param {*} addData : Kỷ luật muốn thêm
     */
    handleCreateDiscipline = (data, addData) => {
        this.setState({
            disciplines: data
        })
    }

    /**
     * Function chỉnh sửa thông tin kỷ luật
     * @param {*} data : Dữ liệu thông tin kỷ luật
     * @param {*} editData : Kỷ luật muốn chỉnh sửa
     */
    handleEditDiscipline = (data, editData) => {
        const { editDisciplines } = this.state;
        if (editData._id) {
            this.setState({
                editDisciplines: [...editDisciplines, editData]
            })
        } else {
            this.setState({
                disciplines: data
            })
        }
    }

    /**
     *  Function xoá thông tin kỷ luật
     * @param {*} data : Dữ liệu thông tin kỷ luật
     * @param {*} deleteData : Kỷ luật muốn xoá
     */
    handleDeleteDiscipline = (data, deleteData) => {
        const { editDisciplines, deleteDisciplines } = this.state;
        if (deleteData._id) {
            this.setState({
                deleteDisciplines: [...deleteDisciplines, deleteData],
                editDisciplines: editDisciplines.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                disciplines: data
            })
        }
    }


    /**
     * Function thêm thông tin lịch sử lương
     * @param {*} data : Dữ liệu thông tin lịch sử lương
     * @param {*} addData : Lịch sử lương muốn thêm
     */
    handleCreateSalary = (data, addData) => {
        this.setState({
            salaries: data
        })
    }

    /**
     * Function chỉnh sửa thông tin lịch sử lương
     * @param {*} data : Dữ liệu thông tin lịch sử lương
     * @param {*} editData : Lịch sử lương muốn chỉnh sửa
     */
    handleEditSalary = (data, editData) => {
        const { editSalaries } = this.state;
        if (editData._id) {
            this.setState({
                editSalaries: [...editSalaries, editData]
            })
        } else {
            this.setState({
                salaries: data
            })
        }
    }

    /**
     * Function xoá thông tin lịch sử lương
     * @param {*} data : Dữ liệu thông tin lịch sử lương
     * @param {*} deleteData : Lịch sử lương muốn xoá
     */
    handleDeleteSalary = (data, deleteData) => {
        const { editSalaries, deleteSalaries } = this.state;
        if (deleteData._id) {
            this.setState({
                deleteSalaries: [...deleteSalaries, deleteData],
                editSalaries: editSalaries.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                salaries: data
            })
        }
    }


    /**
     * Function thêm thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép
     * @param {*} addData : Nghỉ phép muốn thêm
     */
    handleCreateAnnualLeave = (data, addData) => {
        this.setState({
            annualLeaves: data
        })
    }

    /**
     * Function chỉnh sửa thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép
     * @param {*} editData : Nghỉ phép muốn chỉnh sửa
     */
    handleEditAnnualLeave = (data, editData) => {
        const { editAnnualLeaves } = this.state;
        if (editData._id) {
            this.setState({
                editAnnualLeaves: [...editAnnualLeaves, editData]
            })
        } else {
            this.setState({
                annualLeaves: data
            })
        }
    }

    /**
     * Function xoá thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép
     * @param {*} deleteData : Nghỉ phép muốn xoá
     */
    handleDeleteAnnualLeave = (data, deleteData) => {
        const { editAnnualLeaves, deleteAnnualLeaves } = this.state;
        if (deleteData._id) {
            this.setState({
                deleteAnnualLeaves: [...deleteAnnualLeaves, deleteData],
                editAnnualLeaves: editAnnualLeaves.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                annualLeaves: data
            })
        }
    }


    /**
     * Function thêm tài liệu đính kèm
     * @param {*} data : Dữ liệu tài liệu đính kềm
     * @param {*} addData : Tài liệu đính kèm muốn thêm
     */
    handleCreateFile = (data, addData) => {
        this.setState({
            files: data
        })
    }

    /**
     * Function chỉnh sửa tài liệu đính kèm
     * @param {*} data : Dữ liệu tài liệu đính kèm
     * @param {*} editData : Tài liệu đính kèm muốn chỉnh sửa
     */
    handleEditFile = (data, editData) => {
        const { editFiles } = this.state;
        if (editData._id) {
            this.setState({
                editFiles: [...editFiles, editData]
            })
        } else {
            this.setState({
                files: data
            })
        }
    }

    /**
     * Function xoá tài liệu đính kèm
     * @param {*} data : Dữ liệu tài liệu đính kèm
     * @param {*} deleteData : Tài liệu đính kèm muốn xoá
     */
    handleDeleteFile = (data, deleteData) => {
        const { editFiles, deleteFiles } = this.state;
        if (deleteData._id) {
            this.setState({
                deleteFiles: [...deleteFiles, deleteData],
                editFiles: editFiles.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                files: data
            })
        }
    }


    /**
     * Function thêm thông tin quá trình đào tạo
     * @param {*} data : Dữ liệu quá trình đào tạo
     * @param {*} addData : Quá trình đào tạo muốn thêm
     */
    handleCreateCourse = (data, addData) => {
        this.setState({
            courses: data
        })
    }

    /**
     * Function chỉnh sửa thông tin quá trình đào tạo
     * @param {*} data : Dữ liệu quá trình đào tạo
     * @param {*} editData : Quá trình đào tạo muốn chỉnh sửa
     */
    handleEditCourse = (data, editData) => {
        const { editCourses } = this.state;
        if (editData._id) {
            this.setState({
                editCourses: [...editCourses, editData]
            })
        } else {
            this.setState({
                courses: data
            })
        }
    }

    /**
     * Function xoá thông tin quá trình đào tạo
     * @param {*} data : Dữ liệu quá trình đào tạo
     * @param {*} deleteData : Quá trình đào tạo muốn xoá
     */
    handleDeleteCourse = (data, deleteData) => {
        const { editCourses, deleteCourses } = this.state;
        if (deleteData._id) {
            this.setState({
                deleteCourses: [...deleteCourses, deleteData],
                editCourses: editCourses.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                courses: data
            })
        }
    }



    /**
     * Function kiểm tra các trường bắt buộc phải nhập
     * @param {*} value : Giá trị của trường cần kiểm tra
     */
    validatorInput = (value) => {
        if (value && value.toString().trim() !== '') {
            return true;
        }
        return false;
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        const { employee } = this.state;
        let result = true;
        if (employee) {
            result = this.validatorInput(employee.employeeNumber) && this.validatorInput(employee.employeeTimesheetId) &&
                this.validatorInput(employee.fullName) && this.validatorInput(employee.birthdate) &&
                this.validatorInput(employee.emailInCompany) && this.validatorInput(employee.identityCardNumber) &&
                this.validatorInput(employee.identityCardDate) && this.validatorInput(employee.identityCardAddress) &&
                this.validatorInput(employee.phoneNumber) && this.validatorInput(employee.temporaryResidence);
            if (employee.healthInsuranceStartDate && employee.healthInsuranceEndDate) {
                if (new Date(employee.healthInsuranceEndDate).getTime() < new Date(employee.healthInsuranceStartDate).getTime()) {
                    return false;
                }
            } else if ((employee.healthInsuranceStartDate && !employee.healthInsuranceEndDate) ||
                (!employee.healthInsuranceStartDate && employee.healthInsuranceEndDate)) {
                return false;
            }
            if (employee.leavingDate && employee.startingDate) {
                if (new Date(employee.leavingDate).getTime() < new Date(employee.startingDate).getTime()) {
                    return false;
                }
            } else if (employee.leavingDate && !employee.startingDate) {
                return false;
            }
        }
        return result;
    }


    save = async () => {
        let { _id, experiences, degrees, certificates, contracts, files, avatar,
            disciplines, commendations, salaries, annualLeaves, socialInsuranceDetails, courses } = this.state;

        await this.setState({
            createExperiences: experiences.filter(x => x._id === undefined),
            createDegrees: degrees.filter(x => x._id === undefined),
            createCertificates: certificates.filter(x => x._id === undefined),
            createContracts: contracts.filter(x => x._id === undefined),
            createDisciplines: disciplines.filter(x => x._id === undefined),
            createCommendations: commendations.filter(x => x._id === undefined),
            createSalaries: salaries.filter(x => x._id === undefined),
            createAnnualLeaves: annualLeaves.filter(x => x._id === undefined),
            createCourses: courses.filter(x => x._id === undefined),
            createSocialInsuranceDetails: socialInsuranceDetails.filter(x => x._id === undefined),
            createFiles: files.filter(x => x._id === undefined),
        });

        let formData = convertJsonObjectToFormData(this.state);
        degrees.forEach(x => {
            formData.append("fileDegree", x.fileUpload);
        })
        certificates.forEach(x => {
            formData.append("fileCertificate", x.fileUpload);
        })
        contracts.forEach(x => {
            formData.append("fileContract", x.fileUpload);
        })
        files.forEach(x => {
            formData.append("file", x.fileUpload);
        })
        formData.append("fileAvatar", avatar);

        this.props.updateInformationEmployee(_id, formData);
    }

    /**
     * Function format dữ liệu Date thành string
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

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                dataStatus: 0,

                editExperiences: [],
                deleteExperiences: [],
                editDegrees: [],
                deleteDegrees: [],
                editCertificates: [],
                deleteCertificates: [],
                editSocialInsuranceDetails: [],
                deleteSocialInsuranceDetails: [],
                editContracts: [],
                deleteContracts: [],
                editConmmendations: [],
                deleteConmmendations: [],
                editDisciplines: [],
                deleteDisciplines: [],
                editSalaries: [],
                deleteSalaries: [],
                editAnnualLeaves: [],
                deleteAnnualLeaves: [],
                editCourses: [],
                deleteCourses: [],
                editFiles: [],
                deleteFiles: [],
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (nextProps._id !== this.state._id && !nextProps.employeesInfo.isLoading) {
            await this.props.getEmployeeProfile({ id: nextProps._id, callAPIByUser: false });
            this.setState({
                dataStatus: this.DATA_STATUS.QUERYING,
                img: undefined,
                avatar: "",
                employee: '',
                experiences: [],
                degrees: [],
                certificates: [],
                contracts: [],
                files: [],
                socialInsuranceDetails: [],
                salaries: [],
                annualLeaves: [],
                commendations: [],
                disciplines: [],
                courses: [],
                roles: [],
            })
            return false;
        };

        if (this.state.dataStatus === this.DATA_STATUS.QUERYING && !nextProps.employeesInfo.isLoading) {
            await this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
                img: `.${nextProps.employeesInfo.employees[0].avatar}`,
                avatar: "",
                employee: nextProps.employeesInfo.employees[0],
                experiences: nextProps.employeesInfo.employees[0].experiences,
                degrees: nextProps.employeesInfo.employees[0].degrees,
                certificates: nextProps.employeesInfo.employees[0].certificates,
                contracts: nextProps.employeesInfo.employees[0].contracts,
                files: nextProps.employeesInfo.employees[0].files,
                socialInsuranceDetails: nextProps.employeesInfo.employees[0].socialInsuranceDetails,
                salaries: nextProps.employeesInfo.salaries,
                annualLeaves: nextProps.employeesInfo.annualLeaves,
                commendations: nextProps.employeesInfo.commendations,
                disciplines: nextProps.employeesInfo.disciplines,
                courses: nextProps.employeesInfo.courses,
                roles: nextProps.employeesInfo.roles.map(x => x._id),
                organizationalUnits: nextProps.employeesInfo.organizationalUnits.map(x => x._id),
            });
            return true;
        };
        return true;
    }

    render() {
        const { translate, employeesInfo } = this.props;

        let { _id, img, employee, degrees, certificates, socialInsuranceDetails, contracts, courses,
            organizationalUnits, roles, commendations, disciplines, salaries, annualLeaves, files } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID={`modal-edit-employee${_id}`} isLoading={employeesInfo.isLoading}
                    formID={`form-edit-employee${_id}`}
                    title={translate('human_resource.profile.employee_management.edit_employee')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* <form className="form-group" id="form-edit-employee"> */}
                    {employee &&
                        <div className="nav-tabs-custom row" style={{ marginTop: '-15px' }}>
                            <ul className="nav nav-tabs">
                                <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href={`#edit_general${_id}`}>{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                                <li><a title={translate('human_resource.profile.tab_name.menu_contact_infor_title')} data-toggle="tab" href={`#edit_contact${_id}`}>{translate('human_resource.profile.tab_name.menu_contact_infor')}</a></li>
                                <li><a title={translate('human_resource.profile.tab_name.menu_education_experience_title')} data-toggle="tab" href={`#edit_experience${_id}`}>{translate('human_resource.profile.tab_name.menu_education_experience')}</a></li>
                                <li><a title={translate('human_resource.profile.tab_name.menu_diploma_certificate_title')} data-toggle="tab" href={`#edit_diploma${_id}`}>{translate('human_resource.profile.tab_name.menu_diploma_certificate')}</a></li>
                                <li><a title={translate('human_resource.profile.tab_name.menu_account_tax_title')} data-toggle="tab" href={`#edit_account${_id}`}>{translate('human_resource.profile.tab_name.menu_account_tax')}</a></li>
                                <li><a title={translate('human_resource.profile.tab_name.menu_insurrance_infor_title')} data-toggle="tab" href={`#edit_insurrance${_id}`}>{translate('human_resource.profile.tab_name.menu_insurrance_infor')}</a></li>
                                <li><a title={translate('human_resource.profile.tab_name.menu_contract_training_title')} data-toggle="tab" href={`#edit_contract${_id}`}>{translate('human_resource.profile.tab_name.menu_contract_training')}</a></li>
                                <li><a title={translate('human_resource.profile.tab_name.menu_reward_discipline_title')} data-toggle="tab" href={`#edit_reward${_id}`}>{translate('human_resource.profile.tab_name.menu_reward_discipline')}</a></li>
                                <li><a title={translate('human_resource.profile.tab_name.menu_salary_sabbatical_title')} data-toggle="tab" href={`#edit_salary${_id}`}>{translate('human_resource.profile.tab_name.menu_salary_sabbatical')}</a></li>
                                <li><a title={translate('human_resource.profile.tab_name.menu_attachments_title')} data-toggle="tab" href={`#edit_attachments${_id}`}>{translate('human_resource.profile.tab_name.menu_attachments')}</a></li>
                            </ul>
                            <div className="tab-content">
                                {/* Tab thông tin chung */
                                    <GeneralTab
                                        id={`edit_general${_id}`}
                                        img={img}
                                        handleChange={this.handleChange}
                                        handleUpload={this.handleUpload}
                                        employee={employee}
                                    />}
                                {/* Tab thông tin liên hệ */}
                                <ContactTab
                                    id={`edit_contact${_id}`}
                                    handleChange={this.handleChange}
                                    employee={employee}
                                />
                                {/* Tab học vấn - kinh nghiệm */}
                                <ExperienceTab
                                    id={`edit_experience${_id}`}
                                    employee={employee}
                                    handleChange={this.handleChange}

                                    handleAddExperience={this.handleCreateExperiences}
                                    handleEditExperience={this.handleEditExperiences}
                                    handleDeleteExperience={this.handleDeleteExperiences}
                                />
                                {/* Tab bằng cấp - chứng chỉ */}
                                <CertificateTab
                                    id={`edit_diploma${_id}`}
                                    degrees={degrees}
                                    certificates={certificates}

                                    handleAddDegree={this.handleCreateDegree}
                                    handleEditDegree={this.handleEditDegree}
                                    handleDeleteDegree={this.handleDeleteDegree}

                                    handleAddCertificate={this.handleCreateCertificate}
                                    handleEditCertificate={this.handleEditCertificate}
                                    handleDeleteCertificate={this.handleDeleteCertificate}
                                />
                                {/* Tab Tài khoản - thuế */}
                                <TaxTab
                                    id={`edit_account${_id}`}
                                    employee={employee}
                                    handleChange={this.handleChange} />
                                {/* Tab thông tin bảo hiểm */}
                                <InsurranceTab
                                    id={`edit_insurrance${_id}`}
                                    socialInsuranceDetails={socialInsuranceDetails}
                                    employee={employee}
                                    handleChange={this.handleChange}

                                    handleAddBHXH={this.handleCreateBHXH}
                                    handleEditBHXH={this.handleEditBHXH}
                                    handleDeleteBHXH={this.handleDeleteBHXH}
                                />
                                {/* Tab hợp đồng - quá trình đào tạo*/}
                                <ContractTab
                                    id={`edit_contract${_id}`}
                                    pageCreate={false}
                                    employee={employee}
                                    contracts={contracts}
                                    courses={courses}
                                    organizationalUnits={organizationalUnits}
                                    roles={roles}
                                    handleChange={this.handleChange}

                                    handleAddContract={this.handleCreateContract}
                                    handleEditContract={this.handleEditContract}
                                    handleDeleteContract={this.handleDeleteContract}

                                    handleAddCourse={this.handleCreateCourse}
                                    handleEditCourse={this.handleEditCourse}
                                    handleDeleteCourse={this.handleDeleteCourse}
                                />
                                {/* Tab khen thưởng - kỷ luật*/}
                                <DisciplineTab
                                    id={`edit_reward${_id}`}
                                    commendations={commendations}
                                    disciplines={disciplines}
                                    handleAddConmmendation={this.handleCreateConmmendation}
                                    handleEditConmmendation={this.handleEditConmmendation}
                                    handleDeleteConmmendation={this.handleDeleteConmmendation}

                                    handleAddDiscipline={this.handleCreateDiscipline}
                                    handleEditDiscipline={this.handleEditDiscipline}
                                    handleDeleteDiscipline={this.handleDeleteDiscipline}
                                />
                                {/* Tab lương thưởng - nghỉ phép*/}
                                <SalaryTab
                                    id={`edit_salary${_id}`}
                                    salaries={salaries}
                                    annualLeaves={annualLeaves}

                                    handleAddSalary={this.handleCreateSalary}
                                    handleEditSalary={this.handleEditSalary}
                                    handleDeleteSalary={this.handleDeleteSalary}

                                    handleAddAnnualLeave={this.handleCreateAnnualLeave}
                                    handleEditAnnualLeave={this.handleEditAnnualLeave}
                                    handleDeleteAnnualLeave={this.handleDeleteAnnualLeave}
                                />
                                {/* Tab tài liệu đính kèm */}
                                <FileTab
                                    id={`edit_attachments${_id}`}
                                    files={files}
                                    employee={employee}
                                    handleChange={this.handleChange}

                                    handleAddFile={this.handleCreateFile}
                                    handleEditFile={this.handleEditFile}
                                    handleDeleteFile={this.handleDeleteFile}
                                />
                            </div>
                        </div>}
                    {/* </form> */}
                </DialogModal>
            </React.Fragment>
        )
    }
};

function mapState(state) {
    const { employeesInfo, employeesManager } = state;
    return { employeesInfo, employeesManager };
};

const actionCreators = {
    updateInformationEmployee: EmployeeManagerActions.updateInformationEmployee,
    getEmployeeProfile: EmployeeInfoActions.getEmployeeProfile,
};

const editFrom = connect(mapState, actionCreators)(withTranslate(EmployeeEditFrom));
export { editFrom as EmployeeEditFrom };