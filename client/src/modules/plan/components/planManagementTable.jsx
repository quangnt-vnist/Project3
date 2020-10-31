import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { planActions } from "../redux/actions";
import { DataTableSetting, DeleteNotification, PaginateBar, ConfirmNotification } from "../../../common-components";
import PlanCreateForm from "./planCreateForm";
import PlanEditForm from "./planEditForm";
import PlanDetailInfo from "./planDetailInfo";

class PlanManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            planName: "",
            description: "",
            page: 0,
            limit: 3,
            flagDelete: false
        };
    }

    componentDidMount() {
        let { code, planName, page, limit } = this.state;
        this.props.getPlans({ code, planName, page, limit });
    }

    handleChangeData = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    handleSubmitSearch = async () => {
        await this.setState({
            page: 0
        })
        this.props.getPlans(this.state);
    }

    setPage = async (pageNumber) => {
        var currentPage = pageNumber - 1;
        await this.setState({
            page: parseInt(currentPage)
        });

        this.props.getPlans(this.state);
    }

    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number)
        });
        this.props.getPlans(this.state);
    }

    handleDelete = (id) => {
        this.props.deletePlan(id);
        this.setState({
            flagDelete: false
        });
    }

    handleEdit = async (plan) => {
        await this.setState((state) => {
            return {
                ...state,
                currentRow: plan
            }
        });
        window.$('#modal-edit-plan').modal('show');
    }

    handleShowDetailInfo = async (planID) => {
        await this.setState((state) => {
            return {
                ...state,
                currentDetailPlanID: planID
            }
        });
        window.$('#modal-info-plan').modal('show');;
    }

    componentDidUpdate() {
        const { plan } = this.props;
        if (!this.state.flagDelete
            && this.state.page !== 0
            && plan.lists.length == 0) {
            this.setState({
                page: this.state.page - 1,
                flagDelete: true
            }, () => {
                this.props.getPlans(this.state);
            });
        }
    }

    render() {
        const { plan, translate } = this.props;
        let lists = [];
        if (plan.isLoading === false) {
            lists = plan.lists
        }

        const totalPage = Math.ceil(plan.totalList / this.state.limit);
        const page = this.state.page;
        return (
            <React.Fragment>
                {
                    this.state.currentRow &&
                    <PlanEditForm
                        planID={this.state.currentRow._id}
                        code={this.state.currentRow.code}
                        planName={this.state.currentRow.planName}
                        description={this.state.currentRow.description}
                    />
                }
                {
                    <PlanDetailInfo
                        planID={this.state.currentDetailPlanID}
                    />
                }
                <div className="box-body qlcv">
                    <PlanCreateForm page={this.state.page} limit={this.state.limit} />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_plan.code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder={translate('manage_plan.code')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_plan.planName')}</label>
                            <input type="text" className="form-control" name="planName" onChange={this.handleChangeData} placeholder={translate('manage_plan.planName')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_plan.search')} onClick={this.handleSubmitSearch}>{translate('manage_plan.search')}</button>
                        </div>
                    </div>
                    <table id="plan-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('manage_plan.index')}</th>
                                <th>{translate('manage_plan.code')}</th>
                                <th>{translate('manage_plan.planName')}</th>
                                <th>{translate('manage_plan.description')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="plan-table"
                                        columnArr={[
                                            translate('manage_plan.index'),
                                            translate('manage_plan.code'),
                                            translate('manage_plan.planName'),
                                            translate('manage_plan.description'),
                                        ]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length !== 0) &&
                                lists.map((plan, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 + page * this.state.limit}</td>
                                        <td>{plan.code}</td>
                                        <td>{plan.planName}</td>
                                        <td>{plan.description}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_plan.edit')} onClick={() => this.handleShowDetailInfo(plan._id)}><i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_plan.edit')} onClick={() => this.handleEdit(plan)}><i className="material-icons">edit</i></a>
                                            {/* <DeleteNotification
                                                content={translate('manage_plan.delete')}
                                                data={{
                                                    id: plan._id,
                                                    info: plan.code + " - " + plan.planName
                                                }}
                                                func={this.props.deletePlan}
                                            /> */}
                                            <ConfirmNotification
                                                icon="question"
                                                title="Restore this backup data"
                                                content="<h3>Restore this backup data</h3>"
                                                name="delete"
                                                className="text-red"
                                                func={() => { this.handleDelete(plan._id) }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {plan.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={totalPage ? totalPage : 0} currentPage={page + 1} func={this.setPage} />
                </div>
            </React.Fragment>
        )
    }
}


function mapStateToProps(state) {
    const { plan } = state;
    return { plan }
}

const mapDispatchToProps = {
    getPlans: planActions.getPlans,
    deletePlan: planActions.deletePlan
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PlanManagementTable));