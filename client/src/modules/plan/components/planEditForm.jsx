import React, { Component } from 'react';
import { planActions } from '../redux/actions';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal, ErrorLabel } from '../../../common-components';
import ValidationHelper from '../../../helpers/validationHelper';


class PlanEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            planCodeError: false
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
        if (this.isFormValidated) {
            const { planID, code, planName, description } = this.state;
            this.props.editPlan(planID, { code, planName, description });
        }
    }

    handlePlanCode = (e) => {
        const { value } = e.target;
        this.setState({
            code: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({
            planCodeError: message
        });
    }

    handlePlanName = (e) => {
        const { value } = e.target;
        this.setState({
            planName: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);
        this.setState({
            planNameError: message
        });
    }

    handlePlanDescriptionPlan = (e) => {
        const { value } = e.target;
        this.setState({
            description: value
        })
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.planID !== prevState.planID) {
            return {
                ...prevState,
                planID: nextProps.planID,
                code: nextProps.code,
                planName: nextProps.planName,
                description: nextProps.description,
                planCodeError: undefined,
                planNameError: undefined
            }
        } else {
            return null;
        }
    }

    render() {
        const { plan, translate } = this.props;
        const { code, planCodeError, planName, planNameError, description } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-plan`} isLoading={plan.isLoading}
                    formID={`form-edit-plan`}
                    title={translate('manage_plan.edit_title')}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={50}
                    maxWidth={500}
                >
                    <form id={`form-edit-plan`}>
                        <div className={`form-group ${!planCodeError ? "" : "has-error"}`}>
                            <label>{translate('manage_plan.code')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={code} onChange={this.handlePlanCode} />
                            <ErrorLabel content={planCodeError} />
                        </div>
                        <div className={`form-group ${!planNameError ? "" : "has-error"}`}>
                            <label>{translate('manage_plan.planName')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={planName} onChange={this.handlePlanName} />
                            <ErrorLabel content={planNameError} />
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manage_plan.description')}</label>
                            <input type="text" className="form-control" value={description} onChange={this.handlePlanDescriptionPlan} />
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
    editPlan: planActions.editPlan
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PlanEditForm));