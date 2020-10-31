import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, ErrorLabel, ExportExcel } from '../../../../../common-components';

import { toast } from 'react-toastify';
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert';

import { SocialInsuranceAddModal, SocialInsuranceEditModal } from './combinedContent';


class InsurranceTab extends Component {
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
     * Bắt sự kiện click edit BHXH
     * @param {*} value : BHXH cần chỉnh sửa
     * @param {*} index : Số thứ tự BHXH cần chỉnh sửa
     */
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-BHXH-editBHXH${index}`).modal('show');
    }


    /** Function bắt sự kiện thay đổi mã số BHYT, BHXH*/
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
        this.props.handleChange(name, value);
    }

    /**
     * Bắt sự kiện thay đổi ngày có hiệu lực
     * @param {*} value : Ngày có hiệu lực
     */
    handleStartDateBHYTChange = (value) => {
        const { translate } = this.props;
        let { errorOnHealthInsuranceEndDate, healthInsuranceEndDate } = this.state;

        let errorOnHealthInsuranceStartDate = undefined;
        let startDate;
        if (value) {
            let partValue = value.split('-');
            startDate = [partValue[2], partValue[1], partValue[0]].join('-');
            let date = new Date(startDate);
            if (healthInsuranceEndDate) {
                let endDate = healthInsuranceEndDate.split('-');
                endDate = [endDate[2], endDate[1], endDate[0]].join('-');
                let d = new Date(endDate);
                if (date.getTime() >= d.getTime()) {
                    errorOnHealthInsuranceStartDate = translate('human_resource.commendation_discipline.discipline.start_date_before_end_date');
                } else {
                    errorOnHealthInsuranceEndDate = translate('human_resource.commendation_discipline.discipline.end_date_after_start_date') ? undefined : errorOnHealthInsuranceEndDate
                }
            }
        }
        this.setState({
            healthInsuranceStartDate: startDate,
            errorOnHealthInsuranceStartDate: errorOnHealthInsuranceStartDate,
            errorOnHealthInsuranceEndDate: errorOnHealthInsuranceEndDate === translate('human_resource.profile.start_date_insurance_required') ? undefined : errorOnHealthInsuranceEndDate
        })
        this.props.handleChange("healthInsuranceStartDate", value)

    }

    /**
     * Bắt sự kiện thay dổi ngày hêt hiệu lực
     * @param {*} value : Ngày hết hiệu lực
     */
    handleEndDateBHYTChange = (value) => {
        const { translate } = this.props;
        let { healthInsuranceStartDate } = this.state;

        if (value) {
            let partValue = value.split('-');
            let endDate = [partValue[2], partValue[1], partValue[0]].join('-');
            let date = new Date(endDate);
            if (healthInsuranceStartDate) {
                let startDate = healthInsuranceStartDate.split('-');
                startDate = [startDate[2], startDate[1], startDate[0]].join('-');
                let d = new Date(startDate);
                if (d.getTime() >= date.getTime()) {
                    this.setState({
                        healthInsuranceEndDate: endDate,
                        errorOnHealthInsuranceEndDate: translate('human_resource.commendation_discipline.discipline.end_date_after_start_date'),
                    })
                } else {
                    this.setState({
                        healthInsuranceEndDate: endDate,
                        errorOnHealthInsuranceStartDate: undefined,
                        errorOnHealthInsuranceEndDate: undefined,
                    })

                }
            } else {
                this.setState({
                    healthInsuranceEndDate: endDate,
                    errorOnHealthInsuranceEndDate: translate('human_resource.profile.start_date_insurance_required'),
                })
            }
        } else {
            this.setState({
                healthInsuranceEndDate: value,
                errorOnHealthInsuranceEndDate: undefined,
            })
        }

        this.props.handleChange("healthInsuranceEndDate", value)
    }

    /**
     * Function kiểm tra trùng lặp thời gian đóng bảo hiểm
     * @param {*} data : Dữ liệu quá trình đóng bảo hiểm muốn thêm, chỉnh sửa
     * @param {*} array : Danh sách quá trình đóng baoe hiểm
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
     * Function thêm thông tin quá trình đóng BHXH
     * @param {*} data : Dữ liệu quá trình đóng BHXH muốn thêm
     */
    handleAddBHXH = async (data) => {
        const { translate } = this.props;
        let { socialInsuranceDetails } = this.state;

        let checkData = this.checkForDuplicate(data, socialInsuranceDetails);
        if (checkData) {
            await this.setState({
                socialInsuranceDetails: [...socialInsuranceDetails, {
                    ...data
                }]
            })
            this.props.handleAddBHXH(this.state.socialInsuranceDetails, data);
        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={[translate('human_resource.profile.time_BHXH_duplicate')]}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }

    /**
     * Function chỉnh sửa thông tin quá trình đóng BHXH
     * @param {*} data : Dữ liệu quá trình đóng BHXH muốn chỉnh sửa
     */
    handleEditBHXH = async (data) => {
        const { translate } = this.props;
        let { socialInsuranceDetails } = this.state;
        socialInsuranceDetails[data.index] = data;
        let checkData = this.checkForDuplicate(data, socialInsuranceDetails.filter((x, index) => index !== data.index));

        if (checkData) {
            await this.setState({
                socialInsuranceDetails: socialInsuranceDetails
            })
            this.props.handleEditBHXH(socialInsuranceDetails, data);
        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={[translate('human_resource.profile.time_BHXH_duplicate')]}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }

    /**
     * Function bắt sự kiện xoá quá trình đóng BHXH
     * @param {*} index : Số thứ tự quá trình đóng BHXH cần xoá
     */
    delete = async (index) => {
        let { socialInsuranceDetails } = this.state;

        let data = socialInsuranceDetails[index];
        socialInsuranceDetails.splice(index, 1);
        console.log(socialInsuranceDetails);
        await this.setState({
            ...this.state,
            socialInsuranceDetails: [...socialInsuranceDetails]
        })
        this.props.handleDeleteBHXH(socialInsuranceDetails, data);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                socialInsuranceDetails: nextProps.socialInsuranceDetails,
                healthInsuranceNumber: nextProps.employee ? nextProps.employee.healthInsuranceNumber : '',
                healthInsuranceStartDate: nextProps.employee ? nextProps.employee.healthInsuranceStartDate : '',
                healthInsuranceEndDate: nextProps.employee ? nextProps.employee.healthInsuranceEndDate : '',
                socialInsuranceNumber: nextProps.employee ? nextProps.employee.socialInsuranceNumber : '',
            }
        } else {
            return null;
        }
    };

    /**
     * Function chyển đổi quá trình đóng bảo hiểm thành dạng dữ liệu dùng export
     * @param {*} data : quá trình đóng bảo hiểm
     */
    convertDataToExportData = (data) => {
        const { translate, employee } = this.props;

        data = data.map((x, index) => {
            return {
                STT: index + 1,
                startDate: this.formatDate(x.startDate, true),
                endDate: this.formatDate(x.endDate, true),
                company: x.company,
                position: x.position
            }
        })

        let exportData = {
            fileName: translate('human_resource.profile.employee_info.export_bhxh'),
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    sheetTitle: `${translate('human_resource.profile.employee_info.export_bhxh')}: ${employee.fullName} - ${employee.employeeNumber}`,
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate('human_resource.stt') },
                                { key: "startDate", value: translate('human_resource.profile.from_month_year') },
                                { key: "endDate", value: translate('human_resource.profile.to_month_year') },
                                { key: "company", value: translate('human_resource.profile.unit') },
                                { key: "position", value: translate('table.position') }
                            ],
                            data: data
                        },
                    ]
                },
            ]
        }
        return exportData
    }


    render() {
        const { translate } = this.props;

        const { id, pageCreate } = this.props;

        const { healthInsuranceNumber, healthInsuranceStartDate, healthInsuranceEndDate, errorOnHealthInsuranceStartDate,
            socialInsuranceNumber, socialInsuranceDetails, errorOnHealthInsuranceEndDate, currentRow } = this.state;

        let exportData = this.convertDataToExportData(socialInsuranceDetails);

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Thông tin bảo hiểm y tế */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border" ><h4 className="box-title">{translate('human_resource.profile.bhyt')}</h4></legend>
                        <div className="row">
                            {/* Mã số bảo hiểm y tế */}
                            <div className="form-group col-md-4">
                                <label>{translate('human_resource.profile.number_BHYT')}</label>
                                <input type="text" className="form-control" name="healthInsuranceNumber" value={healthInsuranceNumber ? healthInsuranceNumber : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.number_BHYT')} autoComplete="off" />
                            </div>
                            {/* Ngày có hiệu lực */}
                            <div className={`form-group col-md-4 ${errorOnHealthInsuranceStartDate && "has-error"}`}>
                                <label >{translate('human_resource.profile.start_date')}</label>
                                <DatePicker
                                    id={`startDateBHYT${id}`}
                                    value={healthInsuranceStartDate !== undefined ? this.formatDate(healthInsuranceStartDate) : undefined}
                                    onChange={this.handleStartDateBHYTChange}
                                />
                                <ErrorLabel content={errorOnHealthInsuranceStartDate} />
                            </div>
                            {/* Ngày hết hiệu lực */}
                            <div className={`form-group col-md-4 ${errorOnHealthInsuranceEndDate && "has-error"}`}>
                                <label>{translate('human_resource.commendation_discipline.discipline.table.end_date')}</label>
                                <DatePicker
                                    id={`endDateBHYT${id}`}
                                    value={healthInsuranceEndDate !== undefined ? this.formatDate(healthInsuranceEndDate) : undefined}
                                    onChange={this.handleEndDateBHYTChange}
                                />
                                <ErrorLabel content={errorOnHealthInsuranceEndDate} />
                            </div>
                        </div>
                    </fieldset>
                    {/* Thông tin bảo hiểm xã hội */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border" ><h4 className="box-title">{translate('human_resource.profile.bhxh')}</h4></legend>
                        <div className="row">
                            {/* Mã số bảo hiểm xã hội */}
                            <div className="form-group col-md-4">
                                <label>{translate('human_resource.profile.number_BHXH')}</label>
                                <input type="text" className="form-control" name="socialInsuranceNumber" value={socialInsuranceNumber ? socialInsuranceNumber : ''} onChange={this.handleChange} placeholder={translate('human_resource.profile.number_BHXH')} autoComplete="off" />
                            </div>
                            {/* Quá trình đóng bảo hiểm xã hội */}
                            <div className="col-md-12">
                                <h4 className="row col-md-6">{translate('human_resource.profile.bhxh_process')}:</h4>
                                <SocialInsuranceAddModal handleChange={this.handleAddBHXH} id={`addBHXH${id}`} />
                                {!pageCreate && <ExportExcel id={`edit-create-export-bhxh${id}`} buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginTop: 2, marginRight: 15 }} />}
                                <table className="table table-striped table-bordered table-hover " style={{ marginBottom: 0 }} >
                                    <thead>
                                        <tr>
                                            <th>{translate('human_resource.profile.from_month_year')}</th>
                                            <th>{translate('human_resource.profile.to_month_year')}</th>
                                            <th>{translate('human_resource.profile.unit')}</th>
                                            <th>{translate('table.position')}</th>
                                            <th style={{ width: '120px' }}>{translate('table.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {socialInsuranceDetails && socialInsuranceDetails.length !== 0 &&
                                            socialInsuranceDetails.map((x, index) => (
                                                <tr key={index}>
                                                    <td>{this.formatDate(x.startDate, true)}</td>
                                                    <td>{this.formatDate(x.endDate, true)}</td>
                                                    <td>{x.company}</td>
                                                    <td>{x.position}</td>
                                                    <td>
                                                        <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.edit_bhxh')}><i className="material-icons">edit</i></a>
                                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                {
                                    (!socialInsuranceDetails || socialInsuranceDetails.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                }
                            </div>
                        </div>
                    </fieldset>
                </div>
                {   /** Form chỉnh sửa quá trình đóng bảo hiểm xã hội */
                    currentRow !== undefined &&
                    <SocialInsuranceEditModal
                        id={`editBHXH${currentRow.index}`}
                        _id={currentRow._id}
                        index={currentRow.index}
                        company={currentRow.company}
                        startDate={this.formatDate(currentRow.startDate, true)}
                        endDate={this.formatDate(currentRow.endDate, true)}
                        position={currentRow.position}
                        handleChange={this.handleEditBHXH}
                    />
                }
            </div >
        );
    }
};

const insurranceTab = connect(null, null)(withTranslate(InsurranceTab));
export { insurranceTab as InsurranceTab };