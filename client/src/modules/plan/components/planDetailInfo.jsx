import React, { Component } from 'react';
import { connect } from 'react-redux';
import { planActions } from '../redux/actions';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal } from '../../../common-components';

class PlanDetailInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.planID !== prevState.planID) {
            return {
                ...prevState,
                planID: nextProps.planID
            }
        } else {
            return null;
        }

    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.planID !== this.state.planID) {
            this.props.getDetailPlan(nextProps.planID);
            return false;
        }
        return true;
    }

    render() {
        const { translate, plan } = this.props;
        let currentDetailPlan = {};
        if (plan.currentDetailPlan) {
            currentDetailPlan = plan.currentDetailPlan;
        }
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-info-plan`} isLoading={plan.isLoading}
                    title={translate('manage_plan.detail_info_plan')}
                    formID={`form-detail-plan`}
                    size={50}
                    maxWidth={500}
                >
                    <form id={`form-detail-plan`}>
                        <div className={`form-group`}>
                            <label>{translate('manage_plan.code')}<span className="text-red">*</span></label>
                            <p>{currentDetailPlan.code}</p>
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manage_plan.planName')}<span className="text-red">*</span></label>
                            <p>{currentDetailPlan.planName}</p>
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manage_plan.description')}</label>
                            <p>{currentDetailPlan.description}</p>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { plan } = state;
    return { plan };
}

const mapDispatchToProps = {
    getDetailPlan: planActions.getDetailPlan
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PlanDetailInfo));