import React, { Component } from 'react';
import { connect } from 'react-redux';

import { kpiMemberActions } from '../redux/actions';
import { createKpiSetActions } from '../../../employee/creation/redux/actions';
import { AuthActions } from '../../../../auth/redux/actions';

import { DataTableSetting } from '../../../../../common-components';
import { DialogModal, ErrorLabel, DatePicker, Comment } from '../../../../../common-components/index';

import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../../config';
import Swal from 'sweetalert2';

// import { Comment } from '../../../employee/creation/component/comment'
var translate = '';
class EmployeeKpiApproveModal extends Component {

    constructor(props) {
        super(props);

        let idUser = getStorage("userId");
        translate = this.props.translate;

        this.state = {
            currentUser: idUser,
            date: this.formatDateBack(Date.now()),
            editing: false,
            edit: "",
            compare: false,
            checkInput: false,
            checkWeight: false,
        };
        this.newWeight = [];
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const { id } = this.state;
        if (nextProps.id !== id) {
            if (nextProps.id) {
                this.props.getKpisByKpiSetId(nextProps.id);
            }
            return false;
        }
        if (nextProps.auth.user.avatar !== this.props.auth.user.avatar) {
            this.props.getKpisByKpiSetId(nextProps.id);
            return true;
        }
        return true;
    }

    handleEdit = async (target) => {
        if (target && target.status !== 1) {
            await this.setState(state => {
                return {
                    ...state,
                    editing: true,
                    edit: target && state.edit === target._id ? "" : target._id,
                }
            })
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.edit_target.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
    }

    handleSaveEdit = async (target) => {
        await this.setState(state => {
            return {
                ...state,
                newTarget: {
                    ...target,
                    weight: parseInt(this.newWeight[target._id].value)
                },
            }
        })
        const { newTarget } = this.state;
        if (this.newWeight[target._id].value !== "") {
            this.props.editTarget(target._id, newTarget);
            await this.setState(state => {
                return {
                    ...state,
                    edit: "",
                    checkWeight: false,
                    editing: true
                }
            })
        }
    }

    handleDateChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                errorOnDate: this.validateDate(value),
                date: value,
            }
        });

    }

    validateDate = (value) => {
        const { translate } = this.props;
        let msg = undefined;
        if (value.trim() === "") {
            msg = translate('kpi.evaluation.employee_evaluation.choose_month_cmp');
        }
        return msg;
    }

    handleCompare = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                compare: !state.compare
            }
        })
        if (id) {
            this.props.getKpisByMonth(id, this.formatDateBack(Date.now()));
        }
    }

    formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    formatDateBack(date) {
        let d = new Date(date), month, day, year;
        if (d.getMonth() === 0) {
            month = '' + 12;
            day = '' + d.getDate();
            year = d.getFullYear() - 1;
        } else {
            month = '' + (d.getMonth() + 1);
            day = '' + d.getDate();
            year = d.getFullYear();
        }
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    searchKPIMemberByMonth = async (id) => {
        let { date } = this.state;
        if (date === undefined || date === this.formatDateBack(Date.now())) {
            this.props.getKpisByMonth(id, this.formatDateBack(Date.now()));
        }
        else {
            this.props.getKpisByMonth(id, date);
        }
    }

    handleEditStatusTarget = async (event, id, status, listTarget) => {
        event.preventDefault();

        let totalWeight;
        if (listTarget) {
            totalWeight = listTarget.filter(item => item.status === 1 || item._id === id).map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        }

        if (totalWeight > 100 && listTarget) {
            await this.setState(state => {
                return {
                    ...state,
                    checkWeight: true
                }
            })
        } else {
            if (id) {
                this.props.editStatusKpi(id, status);
                await this.setState(state => {
                    return {
                        ...state,
                        checkWeight: false
                    }
                })
            }
        }
    }

    handleApproveKPI = async (id, listTarget) => {
        let totalWeight = listTarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        if (totalWeight !== 100) {
            await this.setState(state => {
                return {
                    ...state,
                    checkWeight: true
                }
            })
        } else {
            this.props.approveAllKpis(id);
            await this.setState(state => {
                return {
                    ...state,
                    checkWeight: false
                }
            })
        }
    }

    handleCheckEmployeeKpiStatus = (employeeKpiStatus) => {
        const { translate } = this.props;
        if (employeeKpiStatus === null) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.not_approved');
        } else if (employeeKpiStatus === 0) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.edit_request');
        } else if (employeeKpiStatus === 1) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.activated');
        } else if (employeeKpiStatus === 2) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.not_finished')
        }
    }

    render() {
        const { kpimembers } = this.props;
        const { translate } = this.props;
        const { errorOnDate, date, compare, edit, checkWeight, perPage } = this.state;
        let kpimember, kpimembercmp, month, totalWeight;

        if (kpimembers.currentKPI) {
            kpimember = kpimembers.currentKPI;
            month = kpimember.date.split('-');
        }
        if (kpimembers.kpimembers) {
            let arrkpimember = kpimembers.kpimembers;
            arrkpimember.forEach(item => {
                let datekpi = item.date.split('-');
                let date = new Date();
                if ((date.getMonth() + 1) === datekpi[1] && date.getFullYear() === datekpi[2]) {
                    kpimember = item;
                }
            });
        }
        if (kpimembers.kpimember) kpimembercmp = kpimembers.kpimember;

        totalWeight = kpimember && kpimember.kpis && kpimember.kpis.length !== 0
            && kpimember.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-approve-KPI-member`}
                    title={`${translate('kpi.evaluation.employee_evaluation.approve_KPI_employee')} - ${translate('kpi.evaluation.employee_evaluation.month')} ${kpimember && month[1]}/${kpimember && month[0]}`}
                    hasSaveButton={false}
                    size={100}>
                    <div className="qlcv">
                        <div className="form-inline pull-right">
                            {compare ?
                                <button className=" btn btn-primary" onClick={() => this.handleCompare()}>{translate('kpi.evaluation.employee_evaluation.end_compare')}</button> :
                                <button className=" btn btn-primary" onClick={() => kpimember && kpimember.creator && this.handleCompare(kpimember.creator._id)}>{translate('kpi.evaluation.employee_evaluation.compare')}</button>
                            }
                            <button className=" btn btn-success" onClick={() => kpimember && this.handleApproveKPI(kpimember._id, kpimember.kpis)}>{translate('kpi.evaluation.employee_evaluation.approve_all')}</button>
                        </div>
                        <br />
                        {compare &&
                            <div>
                                <div className="form-inline">
                                    <div className={`form-group ${errorOnDate === undefined ? "" : "has-error"}`}>
                                        <label style={{ minWidth: "160px", marginLeft: "-40px" }}>{translate('kpi.evaluation.employee_evaluation.choose_month_cmp')}</label>
                                        <DatePicker
                                            id="create_date"
                                            dateFormat="month-year"
                                            value={date}
                                            onChange={this.handleDateChange}
                                        />
                                        <ErrorLabel content={errorOnDate} />
                                    </div>
                                    <div className="form-group" >
                                        <button className="btn btn-success" onClick={() => this.searchKPIMemberByMonth(kpimember && kpimember.creator._id)}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                                    </div>
                                </div>
                                <table className="table table-bordered table-striped table-hover">
                                    <thead>
                                        <tr key="approve">
                                            <th title="STT" className="col-fixed" style={{ width: 50 }}>STT</th>
                                            <th title="Tên mục tiêu">{translate('kpi.evaluation.employee_evaluation.name')}</th>
                                            <th title="Mục tiêu đơn vị">{translate('kpi.evaluation.employee_evaluation.target')}</th>
                                            <th title="Tiêu chí đánh giá">{translate('kpi.evaluation.employee_evaluation.criteria')}</th>
                                            <th title="Trọng số">{translate('kpi.evaluation.employee_evaluation.weight')}</th>
                                            <th title="Kết quả đánh giá">{translate('kpi.evaluation.employee_evaluation.result')}</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {kpimembercmp ?
                                            kpimembercmp.kpis.map((item, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item ? item.name : "Deleted"}</td>
                                                    <td>{item.parent ? item.parent.name : "Deleted"}</td>
                                                    <td>{item ? item.criteria : "Deleted"}</td>
                                                    <td>{edit === item._id ? <input min="0" max="100" defaultValue={item.weight} style={{ width: "60px" }} /> : item.weight}</td>
                                                    <td>{item ? item.approvedPoint : "Deleted"}</td>
                                                </tr>
                                            ) : <tr><td colSpan={6}>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }
                        <br></br>
                        <br></br>
                        <label>{`${translate('kpi.evaluation.employee_evaluation.kpi_this_month')} ${kpimember && month[1]}/${kpimember && month[0]}`} ({totalWeight}/100)</label>
                        {checkWeight && <p className="text-danger" style={{ fontWeight: 900 }}>{translate('kpi.evaluation.employee_evaluation.unsuitable_weight')}</p>}
                        <table id="kpi-approve-table" className="table table-bordered table-striped table-hover">
                            <thead>
                                <tr>
                                    <th className="col-fixed" style={{ width: 50 }}>{translate('kpi.evaluation.employee_evaluation.index')}</th>
                                    <th>{translate('kpi.evaluation.employee_evaluation.name')}</th>
                                    <th>{translate('kpi.evaluation.employee_evaluation.target')}</th>
                                    <th>{translate('kpi.evaluation.employee_evaluation.criteria')}</th>
                                    <th>{translate('kpi.evaluation.employee_evaluation.weight')}</th>
                                    <th>{translate('kpi.evaluation.employee_evaluation.status')}</th>
                                    <th>{translate('kpi.evaluation.employee_evaluation.result')}</th>
                                    <th className="col-fixed" style={{ width: 130 }}>
                                        {translate('kpi.evaluation.employee_evaluation.action')}
                                        <DataTableSetting className="pull-right" tableId="kpi-approve-table"
                                            columnArr={[
                                                'STT',
                                                'Tên mục tiêu'
                                                , 'Mục tiêu đơn vị',
                                                'Tiêu chí đánh giá',
                                                'Trọng số',
                                                'Trạng thái',
                                                'Kết quả đánh giá',
                                                'Hành động']}
                                            limit={perPage}
                                            setLimit={this.setLimit}
                                            hideColumnOption={true}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {kpimember && kpimember.kpis.map((item, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item ? item.name : "Deleted"}</td>
                                        <td>{item.parent ? item.parent.name : "Deleted"}</td>
                                        <td>{item ? item.criteria : "Deleted"}</td>
                                        <td>{edit === item._id ?
                                            <input min="0" max="100"
                                                ref={input => this.newWeight[item._id] = input}
                                                defaultValue={item.weight}
                                                style={{ width: "60px" }}
                                            /> : item.weight}
                                        </td>
                                        <td>{this.handleCheckEmployeeKpiStatus(item.status)}</td>
                                        <td>{item ? item.approvedPoint : "Deleted"}</td>
                                        <td>
                                            {edit === item._id ? <a style={{ cursor: 'pointer' }} className="approve" title={translate('kpi.evaluation.employee_evaluation.save_result')} onClick={() => this.handleSaveEdit(item)}><i className="material-icons">save</i></a>
                                                : <a style={{ cursor: 'pointer' }} className="edit" title={translate('kpi.evaluation.employee_evaluation.edit_target')} onClick={() => this.handleEdit(item)}><i className="material-icons">edit</i></a>}
                                            <a style={{ cursor: 'pointer' }} className="add_circle" title={translate('kpi.evaluation.employee_evaluation.pass')} onClick={(event) => kpimember && this.handleEditStatusTarget(event, item._id, 1, kpimember.kpis)}><i className="material-icons">check</i></a>
                                            <a style={{ cursor: 'pointer' }} className="delete" title={translate('kpi.evaluation.employee_evaluation.fail')} onClick={(event) => this.handleEditStatusTarget(event, item._id, 0)}><i className="material-icons">clear</i></a>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="row" style={{ display: 'flex', flex: 'no-wrap', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="col-xs-12 col-sm-12 col-md-6">
                            <Comment
                                data={kpimembers?.currentKPI}
                                comments={kpimembers?.currentKPI?.comments}
                                createComment={(dataId, data) => this.props.createComment(dataId, data)}
                                editComment={(dataId, commentId, data) => this.props.editComment(dataId, commentId, data)}
                                deleteComment={(dataId, commentId) => this.props.deleteComment(dataId, commentId)}
                                createChildComment={(dataId, commentId, data) => this.props.createChildComment(dataId, commentId, data)}
                                editChildComment={(dataId, commentId, childCommentId, data) => this.props.editChildComment(dataId, commentId, childCommentId, data)}
                                deleteChildComment={(dataId, commentId, childCommentId) => this.props.deleteChildComment(dataId, commentId, childCommentId)}
                                deleteFileComment={(fileId, commentId, dataId) => this.props.deleteFileComment(fileId, commentId, dataId)}
                                deleteFileChildComment={(fileId, commentId, childCommentId, dataId) => this.props.deleteFileChildComment(fileId, commentId, childCommentId, dataId)}
                                downloadFile={(path, fileName) => this.props.downloadFile(path, fileName)}
                            />
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { kpimembers, auth } = state;
    return { kpimembers, auth };
}

const actionCreators = {
    getKpisByKpiSetId: kpiMemberActions.getKpisByKpiSetId,
    getKpisByMonth: kpiMemberActions.getKpisByMonth,
    editStatusKpi: kpiMemberActions.editStatusKpi,
    approveAllKpis: kpiMemberActions.approveAllKpis,
    editTarget: kpiMemberActions.editKpi,
    createComment: createKpiSetActions.createComment,
    editComment: createKpiSetActions.editComment,
    deleteComment: createKpiSetActions.deleteComment,
    createChildComment: createKpiSetActions.createChildComment,
    editChildComment: createKpiSetActions.editChildComment,
    deleteChildComment: createKpiSetActions.deleteChildComment,
    deleteFileComment: createKpiSetActions.deleteFileComment,
    deleteFileChildComment: createKpiSetActions.deleteFileChildComment,
    downloadFile: AuthActions.downloadFile,
};
const connectedEmployeeKpiApproveModal = connect(mapState, actionCreators)(withTranslate(EmployeeKpiApproveModal));
export { connectedEmployeeKpiApproveModal as EmployeeKpiApproveModal };