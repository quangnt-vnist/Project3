import React, { Component } from 'react';

/**
 * Cần dùng jquery plugin http://jdewit.github.com/bootstrap-timepicker
 */
class TimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        }
        this.zIndex = 1050;
    }
    componentDidMount = () => {
        const { id, dateFormat, onChange, deleteValue = true, getDefaultValue } = this.props;
        let zIndex = 1050;
        window.$("#" + id).timepicker({
            template: "dropdown",
            minuteStep: 5,
        })
        window.$("#" + id).on("change", () => {
            let value = this.refs.timePicker.value;
            this.setState({
                value: value
            })
            onChange(value); // Thông báo lại cho parent component về giá trị mới (để parent component lưu vào state của nó)
        });
        if(getDefaultValue)
            getDefaultValue(window.$("#" + id).val())
    }

    componentDidUpdate = () => {
        const { id, dateFormat } = this.props;
        window.$("#" + id).timepicker({
            template: "dropdown",
            minuteStep: 5
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...prevState,
            value: nextProps.value, // Lưu value ban đầu vào state
            id: nextProps.id
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.id !== this.state.id || nextState.value !== this.state.value) // Chỉ render 1 lần, trừ khi id,value thay đổi
            return true;
        return false;  // Tự chủ động update (do đã lưu value vào state)
    }

    render() {
        const { id, disabled = false } = this.props;
        return (
            <React.Fragment>
                <div className="bootstrap-timepicker input-group has-feedback">
                    <span className="input-group-addon">
                        <i style={{ width: 16, height: 16 }} className="fa fa-clock-o"></i>
                    </span>
                    <input type="text" id={id} className="form-control" value={this.state.value ? this.state.value : ""}
                        onClick={() => window.$("#" + id).timepicker('showWidget')} onChange={() => { }} ref="timePicker"
                        disabled={disabled} />
                </div>
            </React.Fragment>
        );
    }
}

export { TimePicker as TimePicker };