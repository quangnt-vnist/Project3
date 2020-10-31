import React, { Component } from 'react';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
class TaskInformationForm extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.task !== prevState.task) {
            return {
                ...prevState,

                id: nextProps.id,

                errorOnInfoDate: undefined,
                errorOnProgress: undefined
            }
        } else {
            return null;
        }
    }

    checkNullUndefined = (x) => {
        if( x === null || x === undefined ) {
            return false;
        }
        else return true;
    }

    render() {
        const { translate } = this.props;
        const { value, task, perform, role, id, disabled, indexReRender, legendText = translate('task.task_management.detail_info')} = this.props;

        return (
            <React.Fragment>
                <div>

                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{legendText}</legend>

                        {(perform === 'evaluate' && !disabled) &&
                            <div className="pull-right" style={{marginTop: -20}}>
                                <a style={{cursor: "pointer"}} onClick={this.props.updateInfo}>{translate('task.task_management.get_outside_info')}</a>
                            </div>
                        }

                        <div className={`form-group ${value.errorOnProgress === undefined ? "" : "has-error"}`}>
                            <label>{translate('task.task_management.detail_progress')}</label>
                            <input
                                className="form-control"
                                type="number"
                                name="progress"
                                placeholder={translate('task.task_management.edit_enter_progress')}
                                onChange={this.props.handleChangeProgress}
                                value={this.checkNullUndefined(value.progress) ? value.progress : ''}
                                disabled={disabled} 
                            />
                            <ErrorLabel content={value.errorOnProgress} />

                        </div>

                        {
                            (task && task.taskInformations.length !== 0) &&
                            task.taskInformations.map((info, index) => {
                                if (info.type === 'text') {
                                    return <div className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`} key={index}>
                                        <label>{info.name}</label>
                                        <textarea
                                            className="form-control"
                                            row={3}
                                            // type="text"
                                            name={info.code}
                                            placeholder={translate('task.task_management.edit_enter_value')}
                                            onChange={this.props.handleChangeTextInfo}
                                            disabled={ disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                            value={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) ? value.info[`${info.code}`].value : ''}
                                        />

                                        <ErrorLabel content={value.errorInfo ? value.errorInfo[info.code] : ''}/>
                                    </div>
                                }

                                {
                                    if (info.type === 'number') {
                                        return <div className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`} key={index}>
                                            <label>{info.name}</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                name={info.code}
                                                placeholder={translate('task.task_management.edit_enter_value')}
                                                onChange={this.props.handleChangeNumberInfo}
                                                disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                                value={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) ? value.info[`${info.code}`].value : ''}
                                            />
                                            <ErrorLabel content={value.errorInfo ? value.errorInfo[`${info.code}`] : ''}/>
                                        </div>
                                    }
                                }

                                {
                                    if (info.type === 'date') {
                                        return <div key={index} className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`}>
                                            <label>{info.name}</label>
                                            <DatePicker
                                                id={`info_date_${perform}_${index}_${info.code}_${id}_${indexReRender}`}
                                                name={info.code}
                                                value={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) ? value.info[`${info.code}`].value : undefined}
                                                onChange={(value) => this.props.handleInfoDateChange(value, info.code)}
                                                disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                            />
                                            <ErrorLabel content={value.errorInfo ? value.errorInfo[info.code] : ''} />
                                        </div>
                                    }
                                }

                                {
                                    if (info.type === 'boolean') {
                                        return <div key={index} className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`}>
                                            <label style={{ marginRight: "30px" }}>{info.name}</label>
                                            <label className="radio-inline">
                                                <input
                                                    type="radio"
                                                    name={info.code}
                                                    value={true}
                                                    onChange={this.props.handleInfoBooleanChange}
                                                    checked={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) && value.info[`${info.code}`].value === "true"}
                                                    disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                                /> {translate('task.task_management.bool_yes')}
                                            </label>
                                            <label className="radio-inline">
                                                <input
                                                    type="radio"
                                                    name={info.code}
                                                    value={false}
                                                    onChange={this.props.handleInfoBooleanChange}
                                                    checked={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) && value.info[`${info.code}`].value === "false"}
                                                    disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                                /> {translate('task.task_management.bool_no')}
                                            </label>
                                        </div>
                                    }
                                }

                                {
                                    if (info.type === 'set_of_values') {
                                        return <div key={index} className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`}>
                                            <label>{info.name}</label>
                                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                id={`select-set-of-value-${index}-${id}-${perform}_${indexReRender}`}
                                                className="form-control select2"
                                                name={info.code}
                                                style={{ width: "100%" }}
                                                items={info.extra.split('\n').map(x => { return { value: x, text: x } })}
                                                onChange={(value) => this.props.handleSetOfValueChange(value, info.code)}
                                                multiple={false}
                                                disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                                value={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value[0])) && value.info[`${info.code}`].value[0]}
                                            />
                                        </div>
                                    }
                                }
                            })
                        }
                        {(perform === 'evaluate' && !disabled) &&
                            <label className={`form-group`}>
                                <input
                                    type="checkbox"
                                    checked={value.checkSave === true}
                                    disabled={disabled} 
                                    name="checkSave" onChange={(e) => this.props.handleChangeSaveInfo(e)}
                                /> {translate('task.task_management.store_info')}
                            </label>
                        }

                    </fieldset>
                </div>
            </React.Fragment>
        );
    }
}

const informationTaskForm = connect(null, null)(withTranslate(TaskInformationForm));
export { informationTaskForm as TaskInformationForm };