import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';
import { CompanyManageLinks } from './companyManageLink';
import { CompanyManageComponent } from './companyManageComponent';
import { DialogModal } from '../../../../common-components';
class CompanyServicesForm extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.companyId !== prevState.companyId) {
            return {
                ...prevState,
                companyId: nextProps.companyId,
                companyShortName: nextProps.companyShortName
            }
        } else {
            return null;
        }
    }

    render() { 
        const { translate, systemLinks, systemComponents, company } = this.props;
        const {companyId, companyShortName} = this.state;

        return ( 
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-services-company" size="75"
                    formID="form-edit-services-company" isLoading={company.isLoading}
                    title={translate('manage_company.service')}
                    func={this.save} hasSaveButton={false}
                >
                    <div role="tabpanel">
                        {/* Nav tabs */}
                        <ul className="nav nav-tabs" role="tablist">
                            <li role="presentation" className="active">
                                <a href="#company_manage_link" aria-controls="home" role="tab" data-toggle="tab"><b>Links</b>{`(${company.item.links.list.filter(link=>link.deleteSoft === false).length}/${systemLinks.list.length})`}</a>
                            </li>
                            <li role="presentation">
                                <a href="#company_manage_component" aria-controls="tab" role="tab" data-toggle="tab"><b>Component</b>{`(${company.item.components.list.length}/${systemComponents.list.length})`}</a>
                            </li>
                        </ul>
                        
                        {/* Tab panes */}
                        <div className="tab-content">
                            <div role="tabpanel" className="tab-pane active" id="company_manage_link">
                                <CompanyManageLinks companyId={companyId} companyShortName={companyShortName}/>
                            </div>
                            <div role="tabpanel" className="tab-pane" id="company_manage_component">
                                <CompanyManageComponent companyId={companyId} companyShortName={companyShortName}/>
                            </div>
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
         );
    }
}

function mapState(state) {
    const { systemLinks, systemComponents, company } = state;
    return { systemLinks, systemComponents, company };
}
const action = {
    editCompany: CompanyActions.editCompany
}

const connectedCompanyServicesForm = connect(mapState, action)(withTranslate(CompanyServicesForm))
export { connectedCompanyServicesForm as CompanyServicesForm }