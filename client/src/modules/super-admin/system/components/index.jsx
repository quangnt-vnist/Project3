import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ScheduleWeeklyForm from './scheduleWeeklyForm';
import ScheduleYearlyForm from './scheduleYearlyForm';
import ScheduleMonthlyForm from './scheduleMonthlyForm';
import { DateTimeConverter, ConfirmNotification, SelectBox } from '../../../../common-components';
import { SystemActions } from '../redux/actions';

class SystemManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            config: {},
            schedule: 'weekly',
            limit: 10
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.system.backup.config && JSON.stringify(nextProps.system.backup.config) !== JSON.stringify(prevState.config)){
            return {
                ...prevState,
                config: nextProps.system.backup.config,
                autoBackup: nextProps.system.backup.config.auto ? 'on' : 'off',
                schedule: nextProps.system.backup.config.type,
                limit: nextProps.system.backup.config.limit
            }
        }else return null;
    }

    render() {
        const { translate, system } = this.props;
        const {schedule, autoBackup, limit} = this.state;

        return (
            <React.Fragment>
                <div className="row">
                <div className="col-xs-12 col-sm-7 col-md-7 col-lg-7">
                        <div className="box box-default">
                            <div className="box-header with-border">
                                <button className="btn btn-success pull-right"onClick={this.createBackup} title={translate('system_admin.system_setting.backup.backup_button')}>             
                                    {translate('system_admin.system_setting.backup.backup_button')}
                                </button>
                            </div>
                            <div className="box-body">
                                <table className="table table-hover table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>{translate('system_admin.system_setting.backup.version')}</th>
                                            <th>{translate('system_admin.system_setting.backup.description')}</th>
                                            <th>{translate('system_admin.system_setting.backup.backup_time')}</th>
                                            <th style={{width: '100px'}}>{translate('system_admin.system_setting.backup.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            system.backup.list.map( (data, i) => 
                                                <tr key={ `backup-version-${i}` }>
                                                    <td> { data.version } </td>
                                                    <td> { data.description } </td>
                                                    <td><DateTimeConverter dateTime={data.createdAt}/></td>
                                                    <td>
                                                        <ConfirmNotification
                                                            icon="question"
                                                            title={translate('super_admin.system.restore_backup')}
                                                            content={`<h3>${translate('super_admin.system.restore_backup')}</h3>`}
                                                            name="restore"
                                                            className="text-green"
                                                            func={()=>this.props.restore(data.version)}
                                                        />
                                                        <ConfirmNotification
                                                            icon="warning"
                                                            title={translate('super_admin.system.delete_backup')}
                                                            content={`<h3>${translate('super_admin.system.delete_backup')}</h3>`}
                                                            name="delete_outline"
                                                            className="text-red"
                                                            func={()=>this.props.deleteBackup(data.version)}
                                                        />
                                                    </td>
                                                </tr>       
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-5 col-md-5 col-lg-5">
                        <div className="box box-default">
                            <div className="box-header with-border text-center">
                                <b style={{ fontSize: '24px' }}>{translate('system_admin.system_setting.backup.config')}</b>
                            </div>
                            <div className="box-body">
                                {
                                    autoBackup ? 
                                    <React.Fragment>
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <div className="form-group">
                                                <label>{translate('system_admin.system_setting.backup.automatic')}</label>
                                                <SelectBox
                                                    id="select-backup-status"
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={[
                                                        {value: 'on', text: translate('system_admin.system_setting.backup.on')},
                                                        {value: 'off', text: translate('system_admin.system_setting.backup.off')}
                                                    ]}
                                                    value={autoBackup}
                                                    onChange={this.handleBackupAutoStatus}
                                                    multiple={false}
                                                />
                                            </div>
                                        </div>
                                        {
                                            autoBackup === 'on' ?
                                            <React.Fragment>
                                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                    <div className="form-group">
                                                        <label>{translate('system_admin.system_setting.backup.limit')}</label>
                                                        <input className="form-control" type="number" min={0} onChange={this.handleBackupLimit} value={limit}/>
                                                    </div>
                                                </div>
                                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                    <div className="form-group">
                                                        <label>{translate('system_admin.system_setting.backup.period')}</label>
                                                        <SelectBox
                                                            id="select-backup-time-schedule"
                                                            className="form-control select2"
                                                            style={{ width: "100%" }}
                                                            items={[
                                                                {value: 'weekly', text: translate('system_admin.system_setting.backup.weekly')},
                                                                {value: 'monthly', text: translate('system_admin.system_setting.backup.monthly')},
                                                                {value: 'yearly', text: translate('system_admin.system_setting.backup.yearly')},
                                                            ]}
                                                            value={schedule}
                                                            onChange={this.handleSchedule}
                                                            multiple={false}
                                                        />
                                                    </div>
                                                </div>
                                            </React.Fragment> :
                                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                <button className="btn btn-success" onClick={()=>this.props.configBackup({auto: 'off'})}>{translate('system_admin.system_setting.backup.save')}</button>
                                            </div>
                                        }
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            {
                                                autoBackup === 'on' && this.renderScheduleForm()
                                            }
                                        </div>
                                    </React.Fragment> : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
                
            </React.Fragment>
         
        );
    }

    componentDidMount() {
        this.props.getBackups();
        this.props.getConfigBackup();
    }

    handleBackupType = (e) => {
        const {value} = e.target;
        this.setState({
            backupType: value
        })
    }

    handleBackupAutoStatus = (value) => {
        this.setState({
            autoBackup: value[0]
        })
    }

    renderScheduleForm = () => {
        const {schedule, limit} = this.state;
        switch(schedule) {
            case 'weekly':
                    return <ScheduleWeeklyForm schedule={schedule} limit={limit}/>
            case 'yearly':
                return <ScheduleYearlyForm schedule={schedule} limit={limit}/>
            default:
                return <ScheduleMonthlyForm schedule={schedule} limit={limit}/>
        }
    }

    handleScheduleType = (value) => {
        this.setState({ backupType: value[0]})
    }

    handleSchedule = (value) => {
        this.setState({
            schedule: value[0]
        })
    }

    handleBackupLimit = (e) => {
        const {value} = e.target;
        this.setState({
            limit: value
        })
    }

    restore = (version) => {
        console.log("restore", version);
        this.props.restore(version);
    }

    deleteBackup = (version) => {
        this.props.deleteBackup(version)
    }

    createBackup = () => {
        this.props.createBackup()
    }
}

function mapState(state) {
    return {
        system: state.system
    };
}

const dispatchStateToProps = {
    getBackups: SystemActions.getBackups,
    getConfigBackup: SystemActions.getConfigBackup,
    createBackup: SystemActions.createBackup,
    configBackup: SystemActions.configBackup,
    deleteBackup: SystemActions.deleteBackup,
    restore: SystemActions.restore
}

export default connect(mapState, dispatchStateToProps)(withTranslate(SystemManagement));

                