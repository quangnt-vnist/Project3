import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, UploadFile } from '../../../../../common-components';

import { EmployeeCreateValidator } from './combinedContent';

class DegreeEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /** Bắt sự kiện thay đổi file đính kèm */
    handleChangeFile = (value) => {
        if (value.length !== 0) {
            this.setState({
                file: value[0].fileName,
                urlFile: value[0].urlFile,
                fileUpload: value[0].fileUpload

            })
        } else {
            this.setState({
                file: "",
                urlFile: "",
                fileUpload: ""
            })
        }
    }

    /** Bắt sự kiên thay đổi tên bằng cấp */
    handleNameChange = (e) => {
        let { value } = e.target;
        this.validateName(value, true);
    }
    validateName = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateNameDegree(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnName: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi nơi đào tạo */
    handleIssuedByChange = (e) => {
        let { value } = e.target;
        this.validateIssuedBy(value, true);
    }
    validateIssuedBy = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateIssuedByDegree(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnIssuedBy: msg,
                    issuedBy: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi năm tốt nghiệp */
    handleYearChange = (e) => {
        let { value } = e.target;
        this.validateYear(value, true);
    }
    validateYear = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = EmployeeCreateValidator.validateYearDegree(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnYear: msg,
                    year: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi xếp loại */
    handleDegreeTypeChange = (e) => {
        let { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        const { name, issuedBy, year } = this.state;
        let result =
            this.validateName(name, false) && this.validateIssuedBy(issuedBy, false) &&
            this.validateYear(year, false);
        return result;
    }

    /** Bắt sự kiện submit form */
    save = () => {
        if (this.isFormValidated()) {
            return this.props.handleChange(this.state);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                index: nextProps.index,
                name: nextProps.name,
                issuedBy: nextProps.issuedBy,
                year: nextProps.year,
                degreeType: nextProps.degreeType,
                file: nextProps.file,
                urlFile: nextProps.urlFile,
                fileUpload: nextProps.fileUpload,

                errorOnName: undefined,
                errorOnIssuedBy: undefined,
                errorOnYear: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate } = this.props;

        const { id } = this.props;

        const { name, issuedBy, year, degreeType, file, urlFile, fileUpload, errorOnName, errorOnIssuedBy, errorOnYear } = this.state;

        let files;
        if (file) {
            files = [{ fileName: file, urlFile: urlFile, fileUpload: fileUpload }]
        }

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-certificate-${id}`} isLoading={false}
                    formID={`form-edit-certificate-${id}`}
                    title={translate('human_resource.profile.edit_diploma')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-certificate-${id}`}>
                        {/* Tên bằng cấp */}
                        <div className={`form-group ${errorOnName && "has-error"}`}>
                            <label>{translate('human_resource.profile.name_diploma')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleNameChange} autoComplete="off" />
                            <ErrorLabel content={errorOnName} />
                        </div>
                        {/* Nơi đào tạo */}
                        <div className={`form-group ${errorOnIssuedBy && "has-error"}`}>
                            <label>{translate('human_resource.profile.diploma_issued_by')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="issuedBy" value={issuedBy} onChange={this.handleIssuedByChange} autoComplete="off" />
                            <ErrorLabel content={errorOnIssuedBy} />
                        </div>
                        <div className="row">
                            {/* Năm tốt nghiệp */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnYear && "has-error"}`}>
                                <label>{translate('human_resource.profile.graduation_year')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="year" value={year} onChange={this.handleYearChange} autoComplete="off" />
                                <ErrorLabel content={errorOnYear} />
                            </div>
                            {/* Loại bằng cấp */}
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>{translate('human_resource.profile.ranking_learning')}<span className="text-red">*</span></label>
                                <select className="form-control" value={degreeType} name="degreeType" onChange={this.handleDegreeTypeChange}>
                                    <option value="excellent">{translate('human_resource.profile.excellent')}</option>
                                    <option value="very_good">{translate('human_resource.profile.very_good')}</option>
                                    <option value="good">{translate('human_resource.profile.good')}</option>
                                    <option value="average_good">{translate('human_resource.profile.average_good')}</option>
                                    <option value="ordinary">{translate('human_resource.profile.ordinary')}</option>
                                </select>
                            </div>
                        </div>
                        {/* File đính kèm */}
                        <div className="form-group">
                            <label htmlFor="file">{translate('human_resource.profile.attached_files')}</label>
                            <UploadFile files={files} onChange={this.handleChangeFile} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

const editModal = connect(null, null)(withTranslate(DegreeEditModal));
export { editModal as DegreeEditModal };
