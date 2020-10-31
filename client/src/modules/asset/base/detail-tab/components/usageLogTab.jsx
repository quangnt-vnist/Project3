import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CalendarUsage } from '../../create-tab/components/calendarUsage';
class UsageLogTab extends Component {
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || nextProps.typeRegisterForUse !== prevState.typeRegisterForUse) {
            return {
                ...prevState,
                id: nextProps.id,
                usageLogs: nextProps.usageLogs,
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
        const { usageLogs, typeRegisterForUse, managedBy } = this.state;
        var userlist = user.list, departmentlist = department.list;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    {/* Lịch sử cấp phát - điều chuyển - thu hồi */}
                    {/* <fieldset className="scheduler-border"> */}
                    {/* <legend className="scheduler-border"><h4 className="box-title">{translate('asset.asset_info.usage_logs')}</h4></legend> */}

                    {/* Bảng thông tin sử dụng */}
                    {
                        typeRegisterForUse != 2 &&

                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>{translate('asset.general_information.user')}</th>
                                    <th>{translate('asset.general_information.organization_unit')}</th>
                                    <th>{translate('asset.general_information.handover_from_date')}</th>
                                    <th>{translate('asset.general_information.handover_to_date')}</th>
                                    <th>{translate('asset.general_information.content')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(usageLogs && usageLogs.length !== 0) &&
                                    usageLogs.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.usedByUser && userlist.length && userlist.filter(item => item._id === x.usedByUser).pop() ? userlist.filter(item => item._id === x.usedByUser).pop().name : 'User is deleted'}</td>
                                            <td>{x.usedByOrganizationalUnit && departmentlist.length && departmentlist.filter(item => item._id === x.usedByOrganizationalUnit).pop() ? departmentlist.filter(item => item._id === x.usedByOrganizationalUnit).pop().name : 'Organizational Unit is deleted'}</td>
                                            <td>{x.startDate ? this.formatDate(x.startDate) : ''}</td>
                                            <td>{x.endDate ? this.formatDate(x.endDate) : ''}</td>
                                            <td>{x.description}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    }
                    {
                        typeRegisterForUse == 2 &&
                        <CalendarUsage
                            assetId={assetId}
                            usageLogs={usageLogs}
                            managedBy={managedBy}
                            typeRegisterForUse={typeRegisterForUse}
                        />
                    }
                    {   typeRegisterForUse !== 2 &&
                        (!usageLogs || usageLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    {/* </fieldset> */}
                </div>
            </div>
        );
    }
};
function mapState(state) {
    const { user, department } = state;
    return { user, department };
};
const usageLogTab = connect(mapState, null)(withTranslate(UsageLogTab));
export { usageLogTab as UsageLogTab };