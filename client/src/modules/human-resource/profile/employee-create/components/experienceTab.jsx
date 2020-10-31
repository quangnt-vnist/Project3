import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { toast } from 'react-toastify';
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert';

import { ModalAddExperience, ModalEditExperience } from './combinedContent';

class ExperienceTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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

    /**
     * Bắt sự kiện click edit kinh nghiệm làm việc
     * @param {*} value : Kinh nghiệm làm việc cần chỉnh sửa
     * @param {*} index : Số thứ tự kinh nghiệm làm việc cần chỉnh sửa
     */
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-experience-editExperience${index}`).modal('show');
    }

    /** Function lưu các trường thông tin vào state */
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        })
        this.props.handleChange(name, value);
    }

    /**  */

    /**
     * Function kiểm tra trùng lặp thời gian làm Việc
     * @param {*} data : Dữ liệu kinh nghiệm làm việc muốn thêm, chỉnh sửa
     * @param {*} array : Danh sách kinh nghiệm làm việc
     */
    checkForDuplicate = (data, array) => {
        let startDate = new Date(data.startDate);
        let endDate = new Date(data.endDate);
        let checkData = true;
        for (let n in array) {
            let date1 = new Date(array[n].startDate);
            let date2 = new Date(array[n].endDate);
            if (date1.getTime() === startDate.getTime() || (startDate.getTime() < date1.getTime() && endDate.getTime() > date1.getTime()) ||
                (startDate.getTime() < date2.getTime() && endDate.getTime() > date1.getTime())) {
                checkData = false;
                break;
            }
        }
        return checkData
    }

    /**
     * Function thêm mới kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     */
    handleAddExperience = async (data) => {
        const { translate } = this.props;
        let { experiences } = this.state;

        let checkData = this.checkForDuplicate(data, experiences);
        if (checkData) {
            await this.setState({
                ...this.state,
                experiences: [...experiences, {
                    ...data
                }]
            })
            this.props.handleAddExperience(this.state.experiences, data);
        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={[translate('human_resource.profile.time_experience_duplicate')]}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }

    /**
     * Function chỉnh sửa kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     */
    handleEditExperience = async (data) => {
        const { translate } = this.props;
        let { experiences } = this.state;

        let experiencesNew = [...experiences];
        let checkData = this.checkForDuplicate(data, experiencesNew.filter((x, index) => index !== data.index));
        if (checkData) {
            experiences[data.index] = data;
            await this.setState({
                ...this.state,
                experiences: experiences
            });
            this.props.handleEditExperience(experiences, data);
        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={[translate('human_resource.profile.time_experience_duplicate')]}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }

    /**
     * Function xoá kinh nghiệm làm việc
     * @param {*} index : Số thứ tự kinh nghiệm làm việc muốn xoá
     */
    delete = async (index) => {
        let { experiences } = this.state;

        let data = experiences[index];
        experiences.splice(index, 1);
        await this.setState({
            ...this.state,
            experiences: [...experiences]
        })
        this.props.handleDeleteExperience(experiences, data);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                experiences: nextProps.employee ? nextProps.employee.experiences : "",
                professionalSkill: nextProps.employee ? nextProps.employee.professionalSkill : "",
                foreignLanguage: nextProps.employee ? nextProps.employee.foreignLanguage : "",
                educationalLevel: nextProps.employee ? nextProps.employee.educationalLevel : "",
            }
        } else {
            return null;
        }
    }


    render() {
        const { translate } = this.props;

        const { id } = this.props;

        const { educationalLevel, foreignLanguage, professionalSkill, experiences, currentRow } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Trình độ học vấn*/}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.academic_level')}</h4></legend>
                        {/* Trình độ văn hoá */}
                        <div className="form-group">
                            <label>{translate('human_resource.profile.educational_level')}<span className="text-red">&#42;</span></label>
                            <select className="form-control" name="educationalLevel" value={educationalLevel} onChange={this.handleChange}>
                                <option value="12/12">12/12</option>
                                <option value="11/12">11/12</option>
                                <option value="10/12">10/12</option>
                                <option value="9/12">9/12</option>
                            </select>
                        </div>

                        {/* Trình độ ngoại ngữ */}
                        <div className="form-group">
                            <label >{translate('human_resource.profile.language_level')}</label>
                            <input type="text" className="form-control" name="foreignLanguage" value={foreignLanguage ? foreignLanguage : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.language_level')} autoComplete="off" />
                        </div>

                        {/* Trình độ chuyên môn */}
                        <div className="form-group">
                            <label>{translate('human_resource.profile.qualification')}</label>
                            <select className="form-control" name="professionalSkill" value={professionalSkill} onChange={this.handleChange}>
                                <option value="intermediate_degree">{translate('human_resource.profile.intermediate_degree')}</option>
                                <option value="colleges">{translate('human_resource.profile.colleges')}</option>
                                <option value="university">{translate('human_resource.profile.university')}</option>
                                <option value="master_degree">{translate('human_resource.profile.master_degree')}</option>
                                <option value="phd">{translate('human_resource.profile.phd')}</option>
                                <option value="unavailable">{translate('human_resource.profile.unavailable')}</option>
                            </select>
                        </div>
                    </fieldset>
                    {/* Kinh nghiệm làm việc */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border" ><h4 className="box-title">{translate('human_resource.profile.work_experience')}</h4></legend>
                        <ModalAddExperience handleChange={this.handleAddExperience} id={`addExperience${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.profile.from_month_year')}</th>
                                    <th>{translate('human_resource.profile.to_month_year')}</th>
                                    <th>{translate('human_resource.profile.unit')}</th>
                                    <th>{translate('table.position')}</th>
                                    <th style={{ width: '120px' }}>{translate('general.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {experiences && experiences.length !== 0 &&
                                    experiences.map((x, index) => (
                                        <tr key={index}>
                                            <td>{this.formatDate(x.startDate, true)}</td>
                                            <td>{this.formatDate(x.endDate, true)}</td>
                                            <td>{x.company}</td>
                                            <td>{x.position}</td>
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.edit_experience')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (!experiences || experiences.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }

                    </fieldset>
                </div>
                {   /** Form chỉnh sửa kinh nghiệm làm việc*/
                    currentRow &&
                    <ModalEditExperience
                        id={`editExperience${currentRow.index}`}
                        _id={currentRow._id}
                        index={currentRow.index}
                        company={currentRow.company}
                        startDate={this.formatDate(currentRow.startDate, true)}
                        endDate={this.formatDate(currentRow.endDate, true)}
                        position={currentRow.position}
                        handleChange={this.handleEditExperience}
                    />
                }
            </div>
        );
    }
};

const experienceTab = connect(null, null)(withTranslate(ExperienceTab));
export { experienceTab as ExperienceTab };