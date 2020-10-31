import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class ExperiencTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm , false trả về ngày tháng năm
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
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                experiences: nextProps.employee.experiences,
                educationalLevel: nextProps.employee.educationalLevel,
                foreignLanguage: nextProps.employee.foreignLanguage,
                professionalSkill: nextProps.employee.professionalSkill,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate } = this.props;

        const { id, educationalLevel, foreignLanguage, professionalSkill, experiences } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.academic_level')}</h4></legend>
                        {/* Trình độ văn hoá */}
                        <div className="form-group">
                            <strong>{translate('human_resource.profile.educational_level')}&emsp; </strong>
                            {educationalLevel}
                        </div>
                        {/* Trình độ ngoại ngữ */}
                        <div className="form-group" >
                            <strong>{translate('human_resource.profile.language_level')}&emsp; </strong>
                            {foreignLanguage}
                        </div>
                        {/* Trình độ chuyên môn */}
                        <div className="form-group">
                            <strong>{translate('human_resource.profile.qualification')}&emsp; </strong>
                            {translate(`human_resource.profile.${professionalSkill}`)}
                        </div>
                    </fieldset>
                    {/* Danh sách kinh nghiệm làm việc */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.work_experience')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.profile.from_month_year')}</th>
                                    <th>{translate('human_resource.profile.to_month_year')}</th>
                                    <th>{translate('human_resource.profile.unit')}</th>
                                    <th>{translate('table.position')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (experiences && experiences.length !== 0) &&
                                    experiences.map((x, index) => (
                                        <tr key={index}>
                                            <td>{this.formatDate(x.startDate, true)}</td>
                                            <td>{this.formatDate(x.endDate, true)}</td>
                                            <td>{x.company}</td>
                                            <td>{x.position}</td>
                                        </tr>

                                    ))
                                }

                            </tbody>
                        </table>
                        {
                            (!experiences || experiences.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
            </div>
        );
    }
};

const tabExperience = connect(null, null)(withTranslate(ExperiencTab));
export { tabExperience as ExperiencTab };