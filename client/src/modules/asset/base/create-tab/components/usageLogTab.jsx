import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { UsageLogAddModal, UsageLogEditModal } from './combinedContent';
import { UseRequestActions } from '../../../admin/use-request/redux/actions'
import { CalendarUsage } from './calendarUsage';
class UsageLogTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignedToUser: this.props.assignedToUser,
            assignedToOrganizationalUnit: this.props.assignedToOrganizationalUnit,
        };
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    // Function lưu giá trị mã phiếu vào state khi thay đổi
    handleDistributeNumberChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    handleCodeChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        this.setState({
            ...this.state,
            month: value
        });
    }

    // Function lưu giá trị loại phiếu vào state khi thay đổi
    handleTypeChange = (value) => {
        if (value.length === 0) {
            value = null
        }
        ;
        this.setState({
            ...this.state,
            type: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    handleSunmitSearch = async () => {
        if (this.state.month === "") {
            await this.setState({
                month: this.formatDate(Date.now())
            })
        }

    }

    // Bắt sự kiện click edit phiếu
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-usage-editUsage${index}`).modal('show');
    }

    // Function thêm thông tin phiếu
    handleAddUsage = async (data) => {
        const { assignedToUser, usageLogs, assignedToOrganizationalUnit } = this.state
        usageLogs.push(data);
        await this.setState({
            ...this.state,
            usageLogs: usageLogs,
            assignedToUser: data.usedByUser,
            assignedToOrganizationalUnit: data.usedByOrganizationalUnit,
            status: "in_use",
        })

        let createUsage = {
            usageLogs: usageLogs,
            status: "in_use",
            assignedToUser: data.usedByUser,
            assignedToOrganizationalUnit: data.usedByOrganizationalUnit,
        }

        await this.props.createUsage(this.props.assetId, createUsage)
        await this.props.handleAddUsage(createUsage);
    }

    // Function chỉnh sửa thông tin phiếu
    handleEditUsage = async (data) => {
        const { usageLogs } = this.state;
        let assignedToUser, assignedToOrganizationalUnit, updateUsage;
        usageLogs[data.index] = data;
        if (data.index == (usageLogs.length - 1) && (this.state.assignedToUser || this.state.assignedToOrganizationalUnit)) {
            assignedToUser = data.usedByUser ? data.usedByUser : null;
            assignedToOrganizationalUnit = data.assignedToOrganizationalUnit ? data.assignedToOrganizationalUnit : null;
        } else {
            assignedToUser = this.state.assignedToUser;
            assignedToOrganizationalUnit = this.state.assignedToOrganizationalUnit
        }

        await this.setState({
            usageLogs: usageLogs,
            assignedToUser: assignedToUser,
            assignedToOrganizationalUnit: assignedToOrganizationalUnit,
        })

        updateUsage = {
            _id: data._id,
            usedByUser: data.usedByUser,
            usedByOrganizationalUnit: data.usedByOrganizationalUnit,
            description: data.description,
            endDate: data.endDate,
            startDate: data.startDate,
            assignedToUser: assignedToUser,
            assignedToOrganizationalUnit: assignedToOrganizationalUnit,
        }
        await this.props.updateUsage(this.props.assetId, updateUsage)
        await this.props.handleEditUsage({
            usageLogs: usageLogs,
            assignedToUser: assignedToUser,
            assignedToOrganizationalUnit: assignedToOrganizationalUnit,
        });
    }

    // Function bắt sự kiện xoá thông tin phiếu
    handleDeleteUsage = async (index) => {
        var { usageLogs } = this.state;
        var data = usageLogs[index];
        usageLogs.splice(index, 1);
        await this.setState({
            ...this.state,
            usageLogs: [...usageLogs]
        })

        await this.props.deleteUsage(this.props.assetId, data._id)
    }

    handleRecallAsset = async () => {
        let assetId = this.props.assetId;
        let assignedToUser = this.props.assignedToUser;

        await this.setState({
            ...this.state,
            assignedToUser: null,
            assignedToOrganizationalUnit: null,
            status: "ready_to_use",
        })
        let data = {
            usageId: assignedToUser,
        }

        await this.props.recallAsset(assetId, data);
        await this.props.handleRecallAsset({
            assignedToUser: null,
            assignedToOrganizationalUnit: null,
            status: "ready_to_use",
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || nextProps.usageLogs !== prevState.usageLogs || nextProps.typeRegisterForUse !== prevState.typeRegisterForUse) {
            return {
                ...prevState,
                id: nextProps.id,
                usageLogs: nextProps.usageLogs,
                assignedToUser: nextProps.assignedToUser,
                assignedToOrganizationalUnit: nextProps.assignedToOrganizationalUnit,
                typeRegisterForUse: nextProps.typeRegisterForUse,
                managedBy: nextProps.managedBy
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, assetId } = this.props;
        const { translate, user, department } = this.props;
        const { assignedToOrganizationalUnit, assignedToUser, usageLogs, currentRow, typeRegisterForUse, managedBy } = this.state;
        var userlist = user.list, departmentlist = department.list;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    {/* Lịch sử sử dụng */}

                    {/* <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('asset.asset_info.usage_logs')}</h4></legend> */}

                    {/* Form thêm thông tin sử dụng */}
                    <UsageLogAddModal handleChange={this.handleAddUsage} typeRegisterForUse={typeRegisterForUse} id={`addUsage${id}`} />

                    <div className="form-inline">
                        <div className="form-group">
                            <label style={{ width: "auto" }} className="form-control-static"> Đối tượng đang sử dụng:</label>
                            <div style={{ width: "auto" }} className="form-control-static">
                                {assignedToUser ?
                                    userlist.filter(item => item._id === assignedToUser).pop() ? userlist.filter(item => item._id === assignedToUser).pop().name : "Chưa có đối tượng sử dụng" : ''}
                                {assignedToUser && assignedToOrganizationalUnit && ' , '}
                                {assignedToOrganizationalUnit ?
                                    departmentlist.filter(item => item._id === assignedToOrganizationalUnit).pop() ? departmentlist.filter(item => item._id === assignedToOrganizationalUnit).pop().name : "Chưa có đối tượng sử dụng" : ''}
                                {!assignedToUser && !assignedToOrganizationalUnit && 'Chưa có'}
                            </div>
                        </div>

                        {(assignedToUser || assignedToOrganizationalUnit) &&
                            <div className="form-group" style={{ marginLeft: "20px" }}>
                                <button type="button" className="btn btn-success" onClick={this.handleRecallAsset} >Thu hồi</button>
                            </div>
                        }
                    </div>

                    {/* Bảng thông tin sử dụng */}
                    {
                        (typeRegisterForUse == 3 || typeRegisterForUse == 1) &&
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.user')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.organization_unit')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.handover_from_date')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.handover_to_date')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.content')}</th>
                                    <th style={{ width: '100px', textAlign: 'center' }}>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(usageLogs && usageLogs.length !== 0) &&
                                    usageLogs.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.usedByUser ? (userlist.length && userlist.filter(item => item._id === x.usedByUser).pop() ? userlist.filter(item => item._id === x.usedByUser).pop().name : 'User is deleted') : ''}</td>
                                            <td>{x.usedByOrganizationalUnit ? (departmentlist.length && departmentlist.filter(item => item._id === x.usedByOrganizationalUnit).pop() ? departmentlist.filter(item => item._id === x.usedByOrganizationalUnit).pop().name : 'Organizational Unit is deleted') : ''}</td>
                                            <td>{x.startDate ? this.formatDate(x.startDate) : ''}</td>
                                            <td>{x.endDate ? this.formatDate(x.endDate) : ''}</td>
                                            <td>{x.description}</td>
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin sử dụng"><i
                                                    className="material-icons">edit</i></a>
                                                {((assignedToUser && index != (usageLogs.length - 1)) || !assignedToUser) &&
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteUsage(index)}><i className="material-icons"></i></a>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    }
                    {
                        typeRegisterForUse == 2 &&

                        <CalendarUsage
                            id={`edit`}
                            assetId={assetId}
                            usageLogs={usageLogs}
                            assignedToUser={assignedToUser}
                            assignedToOrganizationalUnit={assignedToOrganizationalUnit}
                            typeRegisterForUse={typeRegisterForUse}
                            managedBy={managedBy}
                        />
                    }
                    {typeRegisterForUse !== 2 &&
                        (!usageLogs || usageLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    {/* </fieldset> */}

                </div>
                {
                    currentRow &&
                    <UsageLogEditModal
                        id={`editUsage${currentRow.index}`}
                        _id={currentRow._id}
                        index={currentRow.index}
                        usedByUser={currentRow.usedByUser}
                        usedByOrganizationalUnit={currentRow.usedByOrganizationalUnit}
                        startDate={currentRow.startDate}
                        endDate={currentRow.endDate}
                        description={currentRow.description}
                        handleChange={this.handleEditUsage}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { user, department } = state;
    return { user, department };
};

const actionCreators = {
    recallAsset: UseRequestActions.recallAsset,
    createUsage: UseRequestActions.createUsage,
    deleteUsage: UseRequestActions.deleteUsage,
    updateUsage: UseRequestActions.updateUsage,
};

const usageLogTab = connect(mapState, actionCreators)(withTranslate(UsageLogTab));

export { usageLogTab as UsageLogTab };
