import React, { Component } from 'react';

/**
 * Cần dùng jquery plugin https://github.com/uxsolutions/bootstrap-datepicker
 */
class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        }
        this.zIndex = 1050;
    }
    componentDidMount = () => {
        const { id, dateFormat, onChange, deleteValue = true } = this.props;
        let zIndex = 1050;
        dateFormat === "month-year" ?
            window.$("#" + id).datepicker({
                autoclose: true,
                format: "mm-yyyy",
                startView: 1,
                minViewMode: "months",
                zIndexOffset: this.zIndex,
            }) : (
                dateFormat === "year" ?
                    window.$("#" + id).datepicker({
                        autoclose: true,
                        format: "yyyy",
                        viewMode: "years",
                        minViewMode: "years",
                        zIndexOffset: this.zIndex,
                    }) :
                    window.$("#" + id).datepicker({
                        autoclose: true,
                        format: "dd-mm-yyyy",
                        todayHighlight: true,
                        zIndexOffset: this.zIndex,
                    })
            )
        if (deleteValue) {
            window.$("#" + id).keyup(function (e) {
                if (e.keyCode == 8 || e.keyCode == 46) {
                    window.$("#" + id).datepicker('update', "");
                }
            });
        }
        window.$("#" + id).on("change", () => {
            let value = this.refs.datePicker.value;
            this.setState({
                value: value
            })
            onChange(value); // Thông báo lại cho parent component về giá trị mới (để parent component lưu vào state của nó)
        });
    }

    componentDidUpdate = () => {
        const { id, dateFormat } = this.props;
        window.$("#" + id).datepicker("destroy");
        dateFormat === "month-year" ?
            window.$("#" + id).datepicker({
                autoclose: true,
                format: "mm-yyyy",
                startView: 1,
                minViewMode: "months",
                zIndexOffset: this.zIndex,
            }) : (
                dateFormat === "year" ?
                    window.$("#" + id).datepicker({
                        autoclose: true,
                        format: "yyyy",
                        viewMode: "years",
                        minViewMode: "years",
                        zIndexOffset: this.zIndex,
                    }) :
                    window.$("#" + id).datepicker({
                        autoclose: true,
                        format: "dd-mm-yyyy",
                        todayHighlight: true,
                        zIndexOffset: this.zIndex,
                    })
            )

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || nextProps.value !== prevState.value || nextProps.dateFormat !== prevState.dateFormat) {
            return {
                value: nextProps.value, // Lưu value ban đầu vào state
                id: nextProps.id,
                dateFormat: nextProps.dateFormat,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.id !== this.state.id || nextProps.value !== this.state.value || nextProps.dateFormat !== this.state.dateFormat) // Chỉ render 1 lần, trừ khi id,value thay đổi
            return true;
        return false;  // Tự chủ động update (do đã lưu value vào state)
    }

    render() {
        const { id, disabled = false, defaultValue, style = {} } = this.props;

        const { value } = this.state;
        return (
            <React.Fragment>
                <div className={'input-group date has-feedback'} id={id}>
                    <div className="input-group-addon">
                        <i style={{ width: 16, height: 16 }} className="fa fa-calendar" />
                    </div>
                    <input type="text" style={style} className="form-control" value={value !== undefined ? value : defaultValue} ref="datePicker" onChange={() => { }} disabled={disabled} />
                </div>
            </React.Fragment>
        );
    }
}

export { DatePicker as DatePicker };