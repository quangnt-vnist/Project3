import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { MaintainanceLogAddModal, MaintainanceLogEditModal } from './combinedContent';

class MaintainanceLogTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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

    // Bắt sự kiện click edit phiếu
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-maintainance-editMaintainance${index}`).modal('show');
    }

    // Function thêm thông tin bảo trì
    handleAddMaintainance = async (data) => {
        let { maintainanceLogs } = this.state;
        await this.setState({
            maintainanceLogs: [...maintainanceLogs, {
                ...data
            }]
        })
        this.props.handleAddMaintainance(this.state.maintainanceLogs, data)
    }

    // Function chỉnh sửa thông tin bảo trì
    handleEditMaintainance = async (data) => {
        const { maintainanceLogs } = this.state;
        maintainanceLogs[data.index] = data;
        await this.setState({
            maintainanceLogs: maintainanceLogs
        });
        this.props.handleEditMaintainance(this.state.maintainanceLogs, data)
    }

    // Function bắt sự kiện xoá thông tin bảo trì
    handleDeleteMaintainance = async (index) => {
        var { maintainanceLogs } = this.state;
        var data = maintainanceLogs[index];
        maintainanceLogs.splice(index, 1);
        await this.setState({
            ...this.state,
            maintainanceLogs: [...maintainanceLogs]
        })
        this.props.handleDeleteMaintainance(this.state.maintainanceLogs, data)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                maintainanceLogs: nextProps.maintainanceLogs,
            }
        } else {
            return null;
        }
    }
    formatType = (type) => {
        const { translate } = this.props;

        switch (type) {
            case 1:
                return translate('asset.asset_info.repair');
            case 2:
                return translate('asset.asset_info.replace');
            case 3:
                return translate('asset.asset_info.upgrade');
            default:
                return 'Deleted';
        }
    }

    formatStatus = (status) => {
        const { translate } = this.props;

        switch (status) {
            case 1:
                return translate('asset.asset_info.unfulfilled');
            case 2:
                return translate('asset.asset_info.processing');
            case 3:
                return translate('asset.asset_info.made');
            default:
                return 'Deleted';
        }
    }

    render() {
        const { id } = this.props;
        const { translate } = this.props;
        const { maintainanceLogs, currentRow } = this.state;

        var formater = new Intl.NumberFormat();

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    {/* Lịch sử bảo trì */}
                    {/* <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('asset.asset_info.maintainance_logs')}</h4></legend> */}

                    {/* Form thêm thông tin bảo trì */}
                    <MaintainanceLogAddModal handleChange={this.handleAddMaintainance} id={`addMaintainance${id}`} />

                    {/* Bảng phiếu bảo trì */}
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>{translate('asset.general_information.form_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.create_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.type')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.content')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.start_date')}</th>
                                <th style={{ width: "12%" }}>{translate('asset.general_information.end_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.expense')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(maintainanceLogs && maintainanceLogs.length !== 0) &&
                                maintainanceLogs.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.maintainanceCode}</td>
                                        <td>{x.createDate ? this.formatDate(x.createDate) : ''}</td>
                                        <td>{this.formatType(x.type)}</td>
                                        <td>{x.description}</td>
                                        <td>{x.startDate ? this.formatDate(x.startDate) : ''}</td>
                                        <td>{x.endDate ? this.formatDate(x.endDate) : ''}</td>
                                        <td>{x.expense ? formater.format(parseInt(x.expense)) : ''} VNĐ</td>
                                        <td>{this.formatStatus(x.status)}</td>
                                        <td>
                                            <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.asset_info.edit_maintenance_card')}><i
                                                className="material-icons">edit</i></a>
                                            <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteMaintainance(index)}><i className="material-icons"></i></a>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {
                        (!maintainanceLogs || maintainanceLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    {/* </fieldset> */}
                </div>

                {/* Form chỉnh sửa phiếu bảo trì */}
                {
                    currentRow &&
                    <MaintainanceLogEditModal
                        id={`editMaintainance${currentRow.index}`}
                        _id={currentRow._id}
                        index={currentRow.index}
                        maintainanceCode={currentRow.maintainanceCode}
                        createDate={currentRow.createDate}
                        type={currentRow.type}
                        description={currentRow.description}
                        startDate={currentRow.startDate}
                        endDate={currentRow.endDate}
                        expense={currentRow.expense}
                        status={currentRow.status}
                        handleChange={this.handleEditMaintainance}
                    />
                }
            </div>
        );
    }
};


const maintainanceLogTab = connect(null, null)(withTranslate(MaintainanceLogTab));

export { maintainanceLogTab as MaintainanceLogTab };
