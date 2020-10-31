import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { AutomaticTaskPointCalculator } from './automaticTaskPointCalculator';

class ModalShowAutoPointInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}

    }

    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    render() {
        const { translate } = this.props;
        const { task, progress, date, info, autoPoint } = this.props; // props from parent component

        let progressTask = (progress === undefined || progress === "") ? undefined : progress;
        let taskInformations = task.taskInformations;
        let splitter = date.split('-');
        let evaluationsDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let startDate = new Date(task.startDate);
        let endDate = new Date(task.endDate);
        let totalDay = endDate.getTime() - startDate.getTime();
        let dayUsed = evaluationsDate.getTime() - startDate.getTime();
        let overdueDate = (dayUsed - totalDay > 0) ? dayUsed - totalDay : 0;

        // chuyển về đơn vị ngày
        totalDay = totalDay / 86400000;
        dayUsed = dayUsed / 86400000;
        overdueDate = overdueDate / 86400000;

        if (dayUsed <= 0) dayUsed = 0.5;

        // Các hoạt động (chỉ lấy những hoạt động đã đánh giá)
        let taskActions = task.taskActions;

        let actions = taskActions.filter(item => (
            item.rating !== -1 &&
            new Date(item.createdAt).getMonth() === evaluationsDate.getMonth()
            && new Date(item.createdAt).getFullYear() === evaluationsDate.getFullYear()
        ))

        let actionRating = actions.map(action => action.rating);

        let numberOfPassedAction = actions.filter(act => act.rating >= 5).length;
        let numberOfFailedAction = actions.filter(act => act.rating < 5).length;

        // Tổng số hoạt động
        let a = actionRating.length;

        // Tổng số điểm của các hoạt động
        let reduceAction = actionRating.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        reduceAction = reduceAction > 0 ? reduceAction : 0;

        let averageActionRating = !a ? 10 : reduceAction / a; // a = 0 thì avg mặc định là 10
        let avgActionNote = !a && translate('task.task_management.explain_avg_rating');

        let formula = task.taskTemplate && task.taskTemplate.formula, checkFormulaHasAvgRating = false;

        if (!task.taskTemplate && !task.process) { // Công việc không theo mẫu
            // automaticPoint = a ? autoHasActionInfo : autoDependOnDay;
            formula = task.formula;

            if(formula.includes("averageActionRating")) checkFormulaHasAvgRating = true;

            formula = formula.replace(/overdueDate/g, `(${overdueDate})`);
            formula = formula.replace(/totalDay/g, `(${totalDay})`);
            formula = formula.replace(/dayUsed/g, `(${dayUsed})`);
            formula = formula.replace(/averageActionRating/g, `(${averageActionRating})`);
            formula = formula.replace(/numberOfFailedAction/g, `(${numberOfFailedAction})`);
            formula = formula.replace(/numberOfPassedAction/g, `(${numberOfPassedAction})`);
            formula = formula.replace(/progress/g, `(${progressTask})`);
            

            // automaticPoint = eval(formula);
        }
        else{
            formula = task.formula;
            let taskInformations = info;

            // thay các biến bằng giá trị
            formula = formula.replace(/overdueDate/g, `(${overdueDate})`);
            formula = formula.replace(/totalDay/g, `(${totalDay})`);
            formula = formula.replace(/dayUsed/g, `(${dayUsed})`);
            formula = formula.replace(/averageActionRating/g, `(${averageActionRating})`);
            formula = formula.replace(/numberOfFailedAction/g, `(${numberOfFailedAction})`);
            formula = formula.replace(/numberOfPassedAction/g, `(${numberOfPassedAction})`);
            formula = formula.replace(/progress/g, `(${progressTask})`);

            // thay mã code bằng giá trị(chỉ dùng cho kiểu số)
            for (let i in taskInformations) {
                if (taskInformations[i].type === 'number') {
                    let stringToGoIntoTheRegex = `${taskInformations[i].code}`;
                    let regex = new RegExp(stringToGoIntoTheRegex, "g");
                    formula = formula.replace(regex, `${taskInformations[i].value}`);
                }
            }

            // thay tất cả các biến có dạng p0, p1, p2,... còn lại thành undefined, để nếu không có giá trị thì sẽ trả về NaN, tránh được lỗi undefined
            for (let i = 0; i < 100; i++) {
                let stringToGoIntoTheRegex = 'p' + i;
                let regex = new RegExp(stringToGoIntoTheRegex, "g");
                formula = formula.replace(regex, undefined);
            }
        }

        let taskInfo = {
            task: task,
            progress: progressTask,
            date: date,
            info: info,
        };

        let automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined
        let calcAuto = automaticPoint;

        let result;
        if (calcAuto < 0) {
            result = `${calcAuto} ${translate('task.task_management.explain')}`;
        }
        else if (calcAuto >= 0) {
            result = calcAuto
        }
        else {
            result = translate('task.task_management.calc_nan');
        }

        return (
            <React.Fragment>
                <DialogModal
                    size="50"
                    modalID={`modal-automatic-point-info`}
                    formID="form-automatic-point-info"
                    title={translate('task.task_management.calc_form')}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    {(task.taskTemplate) &&
                        <div>
                            <p><strong>{translate('task.task_management.calc_formula')}: </strong>{task.taskTemplate.formula}</p>
                            <p>{translate('task.task_management.calc_where')}: </p>
                            <ul>
                                <li>overdueDate - {translate('task.task_management.calc_overdue_date')}: {overdueDate} ({translate('task.task_management.calc_days')})</li>
                                <li>dayUsed - {translate('task.task_management.calc_day_used')}: {dayUsed} ({translate('task.task_management.calc_days')})</li>
                                <li>averageActionRating - {translate('task.task_management.calc_average_action_rating')}: {averageActionRating} {!a && `(${avgActionNote})`}</li>
                                <li>progress - {translate('task.task_management.calc_progress')}: {progressTask === undefined ? translate('task.task_management.calc_no_value') : `${progress}(%)`}</li>
                                {
                                    taskInformations && taskInformations.map((e, index) => {
                                        if (e.type === 'Number') {
                                            return <li key={index}>{e.code} - {e.name}: {(info[`${e.code}`] && info[`${e.code}`].value) ? info[`${e.code}`].value : translate('task.task_management.calc_no_value')}</li>
                                        }
                                    })
                                }
                            </ul>
                            <p><strong>{translate('task.task_management.calc_new_formula')}: </strong>{formula} = {result}</p>
                        </div>
                    }
                    {/* {((task.taskTemplate === null || task.taskTemplate === undefined) && a === 0) && */}
                    {((task.taskTemplate === null || task.taskTemplate === undefined) && checkFormulaHasAvgRating === false) &&
                        <div>
                            <p><strong>{translate('task.task_management.calc_formula')}: </strong> {task.formula} </p>
                            <p>{translate('task.task_management.calc_where')}: </p>
                            <ul>
                                <li>progress - {translate('task.task_management.calc_progress')}: {progressTask === undefined ? translate('task.task_management.calc_no_value') : `${progress}(%)`}</li>
                                <li>dayUsed - {translate('task.task_management.calc_day_used')}: {dayUsed} ({translate('task.task_management.calc_days')})</li>
                                <li>totalDay - {translate('task.task_management.calc_total_day')}: {totalDay} ({translate('task.task_management.calc_days')})</li>
                            </ul>
                            <p><strong>{translate('task.task_management.calc_new_formula')}: </strong>{formula} = {result}</p>
                        </div>
                    }
                    {((task.taskTemplate === null || task.taskTemplate === undefined) && checkFormulaHasAvgRating === true) &&
                        <div>
                            <p><strong>{translate('task.task_management.calc_formula')}: </strong> {task.formula} </p>
                            {/* progressTask/(dayUsed/totalDay) - 0.5*(10-averageActionRating)*10 */}
                            <p>{translate('task.task_management.calc_where')}: </p>
                            <ul>
                                <li>progress - {translate('task.task_management.calc_progress')}: {progressTask === undefined ? translate('task.task_management.calc_no_value') : `${progress}(%)`}</li>
                                <li>averageActionRating - {translate('task.task_management.calc_average_action_rating')}: {averageActionRating}</li>
                                <li>dayUsed - {translate('task.task_management.calc_day_used')}: {dayUsed} ({translate('task.task_management.calc_days')})</li>
                                <li>totalDay - {translate('task.task_management.calc_total_day')}: {totalDay} ({translate('task.task_management.calc_days')})</li>
                            </ul>
                            <p><strong>{translate('task.task_management.calc_new_formula')}: </strong> {formula} = {result}</p>
                            {/* {progressTask}/({dayUsed}/{totalDay}) - {0.5}*({10}-{averageActionRating})*{10} */}
                        </div>
                    }

                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const modalShowAutoPointInfo = connect(mapState, null)(withTranslate(ModalShowAutoPointInfo));
export { modalShowAutoPointInfo as ModalShowAutoPointInfo }


