import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { translate } from 'react-redux-multilingual/lib/utils';

class IncidentLogTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.getUser({ name: "" });
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
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                incidentLogs: nextProps.incidentLogs,
            }
        } else {
            return null;
        }
    }

    formatType = (type) => {
        const { translate } = this.props;

        if (type === 'broken') {
            return translate('asset.general_information.damaged');
        }
        else if (type === 'lost') {
            return translate('asset.general_information.lost');
        }
        else return 'Deleted';
    }

    render() {
        const { id } = this.props;
        const { translate, user } = this.props;
        const { incidentLogs } = this.state;

        var userlist = user.list;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    {/* Danh sách sự cố tài sản */}
                    {/* <fieldset className="scheduler-border">
                        <legend className="scheduler-border">
                            <h4 className="box-title">{translate('asset.asset_info.incident_list')}</h4>
                        </legend> */}

                    {/* Bảng thông tin sự cố */}
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('asset.general_information.incident_code')}</th>
                                <th>{translate('asset.general_information.incident_type')}</th>
                                <th>{translate('asset.general_information.reported_by')}</th>
                                <th>{translate('asset.general_information.date_incident')}</th>
                                <th>{translate('asset.general_information.content')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(incidentLogs && incidentLogs.length !== 0) &&
                                incidentLogs.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.incidentCode}</td>
                                        <td>{this.formatType(x.type)}</td>
                                        <td>{x.reportedby ? (userlist.length && userlist.filter(item => item._id === x.reportedBy).pop() ? userlist.filter(item => item._id === x.reportedBy).pop().name : 'User is deleted') : ''}</td>
                                        <td>{x.dateOfIncident ? this.formatDate(x.dateOfIncident) : ''}</td>
                                        <td>{x.description}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {
                        (!incidentLogs || incidentLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    {/* </fieldset> */}
                </div>
            </div>
        );
    }
};
function mapState(state) {
    const { user } = state;
    return { user };
};
const actionCreators = {
    getUser: UserActions.get,

};
const incidentLogTab = connect(mapState, actionCreators)(withTranslate(IncidentLogTab));
export { incidentLogTab as IncidentLogTab };