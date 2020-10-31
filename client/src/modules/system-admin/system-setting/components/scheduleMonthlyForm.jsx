import React, { Component } from 'react';
import {SelectBox} from '../../../../common-components';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SystemSettingActions } from '../redux/actions';
import { translate } from 'react-redux-multilingual/lib/utils';
class ScheduleMonthlyForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            config: {},
            date: '15',
            hour: '2',
            minute: '0',
            second: '0'
         }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.systemSetting.backup.config && JSON.stringify(nextProps.systemSetting.backup.config) !== JSON.stringify(prevState.config)){
            return {
                ...prevState,
                config: nextProps.systemSetting.backup.config,
                date: nextProps.systemSetting.backup.config.time.date,
                hour: nextProps.systemSetting.backup.config.time.hour,
                minute: nextProps.systemSetting.backup.config.time.minute,
                second: nextProps.systemSetting.backup.config.time.second,
            }
        }else return null;
    }

    render() { 
        const {date, hour, minute, second} = this.state;
        const {translate} = this.props;
        
        return (<React.Fragment>
            <div className="row">
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>{translate('system_admin.system_setting.backup.date')}</label>
                        <SelectBox
                            id="schedule-monthly-day"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
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
                                {value: '24', text: '24'},
                                {value: '25', text: '25'},
                                {value: '26', text: '26'},
                                {value: '27', text: '27'},
                                {value: '28', text: '28'},
                                {value: '29', text: '29'},
                                {value: '30', text: '30'},
                                {value: '31', text: '31'},
                            ]}
                            value={date}
                            onChange={this.handleDate}
                            multiple={false}
                        />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>{translate('system_admin.system_setting.backup.hour')}</label>
                        <SelectBox
                            id="schedule-monthly-hour"
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
                            value={hour}
                            onChange={this.handleHour}
                            multiple={false}
                        />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>{translate('system_admin.system_setting.backup.minute')}</label>
                        <SelectBox
                            id="schedule-monthly-minute"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                {value: '0', text: '00'},
                                {value: '5', text: '05'},
                                {value: '10', text: '10'},
                                {value: '15', text: '15'},
                                {value: '20', text: '20'},
                                {value: '25', text: '25'},
                                {value: '30', text: '30'},
                                {value: '35', text: '35'},
                                {value: '40', text: '40'},
                                {value: '45', text: '45'},
                                {value: '50', text: '50'},
                                {value: '55', text: '55'}
                            ]}
                            value={minute}
                            onChange={this.handleMinute}
                            multiple={false}
                        />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>{translate('system_admin.system_setting.backup.second')}</label>
                        <SelectBox
                            id="schedule-monthly-second"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                {value: '0', text: '00'},
                                {value: '30', text: '30'}
                            ]}
                            value={second}
                            onChange={this.handleSecond}
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

    handleDate = (value) => {
        this.setState({
            date: value[0]
        })
    }

    handleHour = (value) => {
        this.setState({
            hour: value[0]
        })
    }

    handleMinute = (value) => {
        this.setState({
            minute: value[0]
        })
    }

    handleSecond = (value) => {
        this.setState({
            second: value[0]
        })
    }

    save = () => {
        const {limit, schedule} = this.props;
        const {date, hour, minute, second} = this.state;

        return this.props.configBackup({auto: 'on', schedule},{
           limit, date, hour, minute, second
        })
    }
}
 
function mapState(state) {
    return state;
}

const dispatchStateToProps = {
    configBackup: SystemSettingActions.configBackup
}

export default connect(mapState, dispatchStateToProps)(withTranslate(ScheduleMonthlyForm));