import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {SelectBox} from '../../../../common-components';
import { SystemActions } from '../redux/actions';

class ScheduleWeeklyForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            config: {},
            day: '0',
            hour: '0',
            minute: '0',
            second: '0'
         }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.system.backup.config && JSON.stringify(nextProps.system.backup.config) !== JSON.stringify(prevState.config)){
            return {
                ...prevState,
                config: nextProps.system.backup.config,
                day: nextProps.system.backup.config.time.day,
                hour: nextProps.system.backup.config.time.hour,
                minute: nextProps.system.backup.config.time.minute,
                second: nextProps.system.backup.config.time.second,
            }
        }else return null;
    }

    render() { 
        const {day, hour, minute, second} = this.state;
        const {translate} = this.props;

        return (<React.Fragment>
            <div className="row">
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>{translate('system_admin.system_setting.backup.day')}</label>
                        <SelectBox
                            id="schedule-weekly-day"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                {value: '1', text: translate('system_admin.system_setting.backup.week_day.mon')},
                                {value: '2', text: translate('system_admin.system_setting.backup.week_day.tue')},
                                {value: '3', text: translate('system_admin.system_setting.backup.week_day.wed')},
                                {value: '4', text: translate('system_admin.system_setting.backup.week_day.thur')},
                                {value: '5', text: translate('system_admin.system_setting.backup.week_day.fri')},
                                {value: '6', text: translate('system_admin.system_setting.backup.week_day.sat')},
                                {value: '0', text: translate('system_admin.system_setting.backup.week_day.sun')},
                            ]}
                            value={day}
                            onChange={this.handleDay}
                            multiple={false}
                        />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>{translate('system_admin.system_setting.backup.hour')}</label>
                        <SelectBox
                            id="schedule-weekly-hour"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                {value: '0', text: '0'},
                                {value: '1', text: '1'},
                                {value: '2', text: '2'},
                                {value: '3', text: '3'},
                                {value: '4', text: '4'},
                                {value: '5', text: '5'},
                                {value: '6', text: '6'},
                                {value: '7', text: '7'},
                                {value: '8', text: '8'},
                                {value: '9', text: '9'},
                                {value: '10', text: '10'},
                                {value: '11', text: '11'},
                                {value: '12', text: '12'},
                                {value: '13', text: '13'},
                                {value: '14', text: '14'},
                                {value: '15', text: '15'},
                                {value: '16', text: '16'},
                                {value: '17', text: '17'},
                                {value: '18', text: '18'},
                                {value: '19', text: '19'},
                                {value: '20', text: '20'},
                                {value: '21', text: '21'},
                                {value: '22', text: '22'},
                                {value: '23', text: '23'},
                            ]}
                            onChange={this.hanldeHour}
                            value={hour}
                            multiple={false}
                        />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>{translate('system_admin.system_setting.backup.minute')}</label>
                        <SelectBox
                            id="schedule-weekly-minute"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                {value: '0', text: '00'},
                                {value: '5', text: '5'},
                                {value: '10', text: '10'},
                                {value: '15', text: '15'},
                                {value: '20', text: '20'},
                                {value: '25', text: '25'},
                                {value: '30', text: '30'},
                                {value: '35', text: '35'},
                                {value: '40', text: '40'},
                                {value: '45', text: '45'},
                                {value: '50', text: '50'},
                                {value: '55', text: '55'},
                            ]}
                            value={minute}
                            onChange={this.hanldeMinute}
                            multiple={false}
                        />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>{translate('system_admin.system_setting.backup.second')}</label>
                        <SelectBox
                            id="schedule-weekly-second"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                {value: '0', text: '00'},
                                {value: '30', text: '30'},
                            ]}
                            value={second}
                            onChange={this.hanldeSecond}
                            multiple={false}
                        />
                    </div>
                </div>
            
            </div>
            <button className="btn btn-success" onClick={this.save}>
            {translate('system_admin.system_setting.backup.save')}
            </button>
        </React.Fragment>);
    }

    handleDay = (value) => {
        this.setState({
            day: value[0]
        })
    }

    hanldeHour = (value) => {
        this.setState({
            hour: value[0]
        })
    }

    hanldeMinute = (value) => {
        this.setState({
            minute: value[0]
        })
    }

    hanldeSecond = (value) => {
        this.setState({
            second: value[0]
        })
    }

    save = () => {
        const {schedule, limit} = this.props;
        const {day, hour, minute, second} = this.state;

        return this.props.configBackup({auto: 'on', schedule},{
            limit, day, hour, minute, second
        })
    }
}
 
const mapState = (state) => {
    return state;
}

const dispatchStateToProps = {
    configBackup: SystemActions.configBackup
}

export default connect(mapState, dispatchStateToProps)(withTranslate(ScheduleWeeklyForm));