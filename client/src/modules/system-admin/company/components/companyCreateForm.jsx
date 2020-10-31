import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';
import { SystemLinkActions } from '../../system-link/redux/actions';
import { ButtonModal, DialogModal, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';
class CompanyCreateForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            linkDefaultArr: []
        }
    }

    componentDidMount() {
        this.props.getAllSystemLinks();
    }

    checkCheckBoxAll = (arr) => {
        if (arr.length > 0 && arr.length === this.state.linkDefaultArr.length) {
            return true;
        } else {
            return false;
        }
    }

    checkedCheckbox = (item, arr) => {
        let index = arr.indexOf(item);

        if (index !== -1) {
            return true;
        } else {
            return false;
        }
    }

    checkAll = (e) => {
        const {checked} = e.target;
        const { systemLinks } = this.props;

        if (checked) {
            this.setState({
                linkDefaultArr: systemLinks.list.map(link => link._id)
            })
        } else { 
            this.setState({
                linkDefaultArr: []
            })
        } 
    }

    handleCheckbox = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            this.setState({
                linkDefaultArr: [
                    ...this.state.linkDefaultArr,
                    value
                ]
            });
        } else {
            const arr = this.state.linkDefaultArr;
            const index = arr.indexOf(value);

            arr.splice(index,1);
            this.setState({
                linkDefaultArr: arr
            })
        }
    }

    /**
     * Hàm xử lý khi chọn theo danh mục
     */
    handleCategoryCheckbox = async (e, link) => {
        const { checked } = e.target;
        const { systemLinks } = this.props;

        if (checked) {
            for (const element of systemLinks.list) {
                if (element.category === link.category) {
                    // Nếu phần tử đó chưa tồn tại thì mới thêm vào state
                    if (this.state.linkDefaultArr.indexOf(element._id) === -1){
                        await this.setState({
                            linkDefaultArr: [
                                ...this.state.linkDefaultArr,
                                element._id
                            ]
                        });
                    }
                }
            }
        } else {
            for (const element of systemLinks.list) {
                if (element.category === link.category) {
                    const arr = this.state.linkDefaultArr;
                    const index = arr.indexOf(element._id);

                    arr.splice(index,1);
                    await this.setState({
                        linkDefaultArr: arr
                    })
                }
            }
        }
    }

    save = () => {
        const company = {
            name: this.state.companyName, 
            shortName: this.state.companyShortName, 
            description: this.state.companyDescription, 
            email: this.state.companyEmail, 
            links: this.state.linkDefaultArr
        };

        if (this.isFormValidated()) return this.props.createCompany(company);
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

    handleChangeShortName = (e) => {
        let {value} = e.target;
        let {translate} = this.props;
        let {message} = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ 
            companyShortName: value,
            shortNameError: message
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
        const { translate, systemLinks, company } = this.props;
        const {
            // Phần edit nội dung của công ty
            nameError, 
            shortNameError, 
            descriptionError, 
            emailError,
        } = this.state;

        let list = [];
        let category;

        for (let i = 0; i < systemLinks.list.length; i++) {
            const element = systemLinks.list[i];
            
            if (element.category !== category){
                const group = {
                    _id: i,
                    category: element.category,
                    isGroup: true,
                }

                list.push(group);
                category = element.category;
            }

            list.push(element);
        }

        return ( 
            <React.Fragment>
                <ButtonModal modalID="modal-create-company" button_name={translate('general.add')} title={translate('system_admin.company.add')}/>
                
                <DialogModal
                    modalID="modal-create-company" size="75"
                    formID="form-create-company" isLoading={company.isLoading}
                    title={translate('system_admin.company.add')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-create-company">
                        <div className="row" style={{padding: '20px'}}>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className={`form-group ${nameError===undefined?"":"has-error"}`}>
                                    <label>{ translate('system_admin.company.table.name') }<span className="text-red"> * </span></label>
                                    <input type="text" className="form-control" onChange={ this.handleChangeName }/>
                                    <ErrorLabel content={nameError}/>
                                </div>
                                <div className={`form-group ${shortNameError===undefined?"":"has-error"}`}>
                                    <label>{ translate('system_admin.company.table.short_name') }<span className="text-red"> * </span></label>
                                    <input type="text" className="form-control" onChange={ this.handleChangeShortName }/>
                                    <ErrorLabel content={shortNameError}/>
                                </div>
                                <div className={`form-group ${emailError===undefined?"":"has-error"}`}>
                                    <label>{ translate('system_admin.company.table.super_admin') }<span className="text-red"> * </span></label>
                                    <input type="email" className="form-control" onChange={ this.handleChangeEmail }/>
                                    <ErrorLabel content={emailError}/>
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className={`form-group ${descriptionError===undefined?"":"has-error"}`}>
                                    <label>{ translate('system_admin.company.table.description') }<span className="text-red"> * </span></label>
                                    <textarea style={{ height: '182px' }}  type="text" className="form-control" onChange={ this.handleChangeDescription }/>
                                    <ErrorLabel content={descriptionError}/>
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border" style={{minHeight: '300px'}}>
                                    <legend className="scheduler-border">{ translate('system_admin.company.service') }</legend>
                                    
                                    <table className="table table-hover table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{width: '32px'}} className="col-fixed">
                                                    <input 
                                                        type="checkbox" 
                                                        onChange={this.checkAll} 
                                                    />
                                                </th>
                                                <th>{ translate('system_admin.system_link.table.category') }</th>
                                                <th>{ translate('system_admin.system_link.table.url') }</th>
                                                <th>{ translate('system_admin.system_link.table.description') }</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                            {
                                                list.length > 0 ? list.map( link => 
                                                    link.isGroup ?
                                                        <tr key={link._id}>
                                                            <td>
                                                                <input 
                                                                    type="checkbox" 
                                                                    value={link._id} 
                                                                    onChange={ (e) => this.handleCategoryCheckbox(e, link) } 
                                                                />
                                                            </td>
                                                            <th>{ link.category }</th>
                                                            <td>{ link.url }</td>
                                                            <td>{ link.description }</td>
                                                        </tr>
                                                    :
                                                        <tr key={link._id}>
                                                            <td>
                                                                <input 
                                                                    type="checkbox" 
                                                                    value={link._id} 
                                                                    onChange={this.handleCheckbox} 
                                                                    checked={this.checkedCheckbox(link._id, this.state.linkDefaultArr)}
                                                                />
                                                            </td>
                                                            <td>{ link.category }</td>
                                                            <td>{ link.url }</td>
                                                            <td>{ link.description }</td>
                                                        </tr> 
                                                ): systemLinks.isLoading ?
                                                <tr><td colSpan={4}>{translate('general.loading')}</td></tr>:
                                                <tr><td colSpan={4}>{translate('general.no_data')}</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }
}
 
function mapState(state) {
    const { systemLinks, company } = state;
    return { systemLinks, company };
}
const action = {
    createCompany: CompanyActions.createCompany,
    getAllSystemLinks: SystemLinkActions.getAllSystemLinks
}

const connectedCompanyCreateForm = connect(mapState, action)(withTranslate(CompanyCreateForm))
export { connectedCompanyCreateForm as CompanyCreateForm }