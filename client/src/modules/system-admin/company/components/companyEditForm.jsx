import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ErrorLabel, DialogModal } from '../../../../common-components';

class CompanyEditForm extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.companyId !== prevState.companyId) {
            return {
                ...prevState,
                companyId: nextProps.companyId,
                companyName: nextProps.companyName,
                companyShortName: nextProps.companyShortName,
                companyDescription: nextProps.companyDescription,
                companyLog: nextProps.companyLog,
                companyLinks: nextProps.companyLinks,
                companyActive: nextProps.companyActive,
                companyEmail: nextProps.companyEmail,
                nameError: undefined,
                shortNameError: undefined,
                descriptionError: undefined,
                emailError: undefined
            } 
        } else {
            return null;
        }
    }

    // Luu du lieu ve cong ty
    save = () => {
        const data = { 
            name: this.state.companyName, 
            shortName: this.state.companyShortName, 
            log: this.state.companyLog, 
            description: this.state.companyDescription, 
            email: this.state.companyEmail, 
            active: this.state.companyActive
        };

        if (this.isFormValidated()) {
            return this.props.editCompany(this.state.companyId, data);
        } 
    }

    // Xu ly handle log va active
    handleActive = (e) => {
        const value = e.target.value;
        this.setState({
            companyActive: value
        });
    }

    handleLog = (e) => {
        const value = e.target.value;
        this.setState({
            companyLog: value
        });
    }

    handleChangeName = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ 
            companyName: value,
            nameError: message
        });
    }

    handleChangeDescription = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateDescription(translate, value);
        this.setState({ 
            companyDescription: value,
            descriptionError: message
        });
    }

    handleChangeEmail = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateEmail(translate, value);
        this.setState({ 
            companyEmail: value,    
            emailError: message 
        });
    }

    isFormValidated = () => {
        let {companyName, companyShortName, companyDescription, companyEmail} = this.state;
        let {translate} = this.props;
        if(
            !ValidationHelper.validateName(translate, companyName).status  || 
            !ValidationHelper.validateName(translate, companyShortName).status ||
            !ValidationHelper.validateEmail(translate, companyEmail).status  || 
            !ValidationHelper.validateDescription(translate, companyDescription).status
        ) return false;
        return true;
    }

    render() { 
        const { translate, company } = this.props;
        const {
            // Phần edit nội dung của công ty
            companyName, 
            companyShortName, 
            companyDescription, 
            companyLog, 
            companyActive, 
            companyEmail, 
            nameError, 
            shortNameError, 
            descriptionError, 
            emailError,
        } = this.state;

        return ( 
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-company"
                    formID="form-edit-company" isLoading={company.isLoading}
                    title={translate('system_admin.company.edit')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-edit-company">
                        <div className="row">
                            <div className={`form-group col-sm-9 ${nameError===undefined?"":"has-error"}`}>
                                <label>{ translate('system_admin.company.table.name') }<span className="text-red"> * </span></label>
                                <input type="text" className="form-control" onChange={ this.handleChangeName } value={ companyName }/>
                                <ErrorLabel content={nameError}/>
                            </div>
                            <div className="form-group col-sm-3">
                                <label>{ translate('system_admin.company.table.service') }<span className="text-red"> * </span></label>
                                <select className="form-control" onChange={ this.handleActive } value={companyActive}>
                                    <option key='1' value={true}>{ translate('system_admin.company.on') }</option>
                                    <option key='2' value={false}>{ translate('system_admin.company.off') }</option>
                                </select>
                            </div>

                            <div className={`form-group col-sm-9 ${shortNameError===undefined?"":"has-error"}`}>
                                <label>{ translate('system_admin.company.table.short_name') }</label>
                                <input type="text" className="form-control" value={ companyShortName } disabled={true}/>
                                <ErrorLabel content={shortNameError}/>
                            </div>
                            <div className="form-group col-sm-3">
                                <label>{ translate('system_admin.company.table.log') }<span className="text-red"> * </span></label>
                                <select className="form-control" onChange={ this.handleLog } value={companyLog}>
                                    <option key='1' value={true}>{ translate('system_admin.company.on') }</option>
                                    <option key='2' value={false}>{ translate('system_admin.company.off') }</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className={`form-group ${emailError===undefined?"":"has-error"}`}>
                            <label>{ translate('system_admin.company.table.super_admin') }<span className="text-red"> * </span></label>
                            <input type="email" className="form-control" onChange={ this.handleChangeEmail } value={companyEmail}/>
                            <ErrorLabel content={emailError}/>
                        </div>
                        <div className={`form-group ${descriptionError===undefined?"":"has-error"}`}>
                            <label>{ translate('system_admin.company.table.description') }<span className="text-red"> * </span></label>
                            <textarea type="text" className="form-control" onChange={ this.handleChangeDescription } value={companyDescription}/>
                            <ErrorLabel content={descriptionError}/>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }
}

function mapState(state) {
    const { linksDefault, company } = state;
    return { linksDefault, company };
}
const action = {
    editCompany: CompanyActions.editCompany
}

const connectedCompanyEditForm = connect(mapState, action)(withTranslate(CompanyEditForm))
export { connectedCompanyEditForm as CompanyEditForm }