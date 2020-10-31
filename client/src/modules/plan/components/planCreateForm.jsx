import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel } from '../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../helpers/validationHelper';
import { planActions } from '../redux/actions';

class PlanCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            planName: "",
            description: ""
        }
    }

    isFormValidated = () => {
        const { code, planName } = this.state;
        let { translate } = this.props;
        if (!ValidationHelper.validateName(translate, code, 4, 255).status || !ValidationHelper.validateName(translate, planName, 6, 255).status) {
            return false;
        }
        return true;
    }

    save = () => {
        if (this.isFormValidated()) {
            const { page, limit } = this.props;
            const { code, planName, description } = this.state;
            this.props.createPlan({ code, planName, description });
            this.props.getPlans({ page: page, limit: limit });
        }
    }

    handlePlanCode = (e) => {
        const { value } = e.target;
        this.setState({
            code: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ planCodeError: message })
    }

    handlePlanName = (e) => {
        const { value } = e.target;
        this.setState({
            planName: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);
        this.setState({ planNameError: message })
    }

    handlePlanDescription = (e) => {
        const { value } = e.target;
        this.setState({
            description: value
        });
    }

    render() {
        const { translate, plan } = this.props;
        const { code, planName, description, planCodeError, planNameError } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-plan" button_name={translate('manage_plan.add')} title={translate('manage_plan.add_title')} />
                <DialogModal
                    modalID="modal-create-plan" isLoading={plan.isLoading}
                    formID="form-create-plan"
                    title={translate('manage_plan.add_title')}
                    msg_success={translate('manage_plan.add_success')}
                    msg_faile={translate('manage_plan.add_fail')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-plan" onSubmit={() => this.save(translate('manage_plan.add_success'))}>
                        <div className={`form-group ${!planCodeError ? "" : "has-error"}`}>
                            <label>{translate('manage_plan.code')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={code} onChange={this.handlePlanCode}></input>
                            <ErrorLabel content={planCodeError} />
                        </div>
                        <div className={`form-group ${!planNameError ? "" : "has-error"}`}>
                            <label>{translate('manage_plan.planName')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={planName} onChange={this.handlePlanName}></input>
                            <ErrorLabel content={planNameError} />
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manage_plan.plan_description')}</label>
                            <input type="text" className="form-control" value={description} onChange={this.handlePlanDescription}></input>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { plan } = state;
    return { plan }
}

const mapDispatchToProps = {
    createPlan: planActions.createPlan,
    getPlans: planActions.getPlans
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PlanCreateForm)); 