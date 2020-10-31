import React, { Component } from 'react';
import sampleData from '../../../../sampleData';
class CommandCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commands: []
        }
    }
    handleAddCommand = (index, e) => {
        this.setState((state) => {
            state.commands[index] = state.commands[index] ? state.commands[index] : []
            state.commands[index].push({
                code: ""
            })
            console.log(state.commands)
            return {
                ...state,
                commands: state.commands
            }
        });
    }
    render() {
        const { commands } = this.state
        const { manufacturingOrders } = sampleData;
        const manufacturingOrder = manufacturingOrders[0];
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <ul>
                            <li>
                                Sản phẩm A: Xưởng 1: 500 sp/ ca, Xưởng 2: 1000 sp/ ca
                            </li>
                            <li>
                                Sản phẩm B: Xưởng 2: 500 sp/ ca, Xưởng 3: 1000 sp/ ca
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Phân chia lệnh sản xuất</legend>
                            {
                                manufacturingOrder.goods.map((good, index) => (
                                    <React.Fragment>
                                        <div className="form-group">
                                            <label>Mặt hàng: {good.good.name}</label>
                                        </div>
                                        <div className="form-group">
                                            <label>Số lượng sản xuất: {good.quantity}</label>
                                        </div>
                                        <div className="form-group">
                                            <label>Thêm lệnh: <a style={{ cursor: "pointer" }} title='Thêm thông tin mặt hàng'><i className="fa fa-plus-square" style={{ color: "#00a65a", marginLeft: 5 }}
                                                onClick={(e) => this.handleAddCommand(index, e)} /></a></label>
                                            <div className={`form-group`}>
                                                {/* Bảng thông tin chi tiết */}
                                                <table className="table table-striped table-bordered table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>STT</th>
                                                            <th>Mã lệnh</th>
                                                            <th>Tên mặt hàng</th>
                                                            <th>Đơn vị tính</th>
                                                            {/* <th>Chọn xưởng SX</th> */}
                                                            {/* <th>nhà máy</th> */}
                                                            <th>Số lượng</th>
                                                            {/* <th>Ngày bắt đầu</th>
                                                    <th>Ca bắt đầu</th>
                                                    <th>Ngày kết thúc</th>
                                                    <th>Ca kết thúc</th>
                                                    <th>Người chịu trách nhiệm</th>
                                                    <th>Người giám sát</th> */}
                                                            <th>Hành động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            (!commands[index] || commands[index].length === 0) ?
                                                                <tr>
                                                                    <td colSpan={6}>
                                                                        <center>Chưa tạo lệnh</center>
                                                                    </td>
                                                                </tr>
                                                                :
                                                                commands[index].map((command, index) => {
                                                                    return <tr key={index}>
                                                                        {/* Tên trường dữ liệu */}
                                                                        <td>{index + 1}</td>
                                                                        <td><input className="form-control" type="text" placeholder="LSX001" name="commandCode" style={{ width: "100%" }} /></td>
                                                                        <td>{good.good.name}</td>
                                                                        <td>{good.good.baseUnit}</td>
                                                                        {/* 
                                                                <td>
                                                                    <SelectBox
                                                                        id={`select-manufacturing-mill`}
                                                                        className="form-control select2"
                                                                        style={{ width: "100%" }}
                                                                        value={status}
                                                                        items={[
                                                                            { value: '1', text: "Xưởng A" },
                                                                            { value: '2', text: "Xưởng B" },
                                                                            { value: '3', text: "Xưởng C" },
                                                                            { value: '4', text: "Xưởng D" },
                                                                        ]}
                                                                        onChange={this.handleChangeStatus}
                                                                        multiple={false}
                                                                    />

                                                                </td>
                                                                <td>Nhà máy X</td> */}
                                                                        <td><input className="form-control" type="number" placeholder="" name="nameField" style={{ width: "100%" }} /></td>
                                                                        {/* <td>
                                                                    <DatePicker
                                                                        id={`day_start`}
                                                                        style={{ marginRight: "-2rem" }}
                                                                        // dateFormat={dateFormat}
                                                                        // value={startValue}
                                                                        onChange={this.handleChangeDateAfter}
                                                                        disabled={false}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <SelectBox

                                                                        id={`select-manufacturing-mill`}
                                                                        className="form-control select"
                                                                        style={{ width: "100%" }}
                                                                        value={status}
                                                                        items={[
                                                                            { value: '1', text: "Ca 1" },
                                                                            { value: '2', text: "Ca 2" },
                                                                            { value: '3', text: "Ca 3" },
                                                                        ]}
                                                                        onChange={this.handleChangeStatus}
                                                                        multiple={false}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <DatePicker
                                                                        id={`day_finish`}
                                                                        // dateFormat={dateFormat}
                                                                        // value={startValue}
                                                                        // onChange={this.handleChangeDateAfter}
                                                                        disabled={false}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <SelectBox
                                                                        id={`select-manufacturing-mill`}
                                                                        className="form-control select"

                                                                        value={status}
                                                                        items={[
                                                                            { value: '1', text: "Ca 1" },
                                                                            { value: '2', text: "Ca 2" },
                                                                            { value: '3', text: "Ca 3" },
                                                                        ]}
                                                                        onChange={this.handleChangeStatus}
                                                                        multiple={false}
                                                                    />
                                                                </td>
                                                                <td>Nguyễn Anh Phương</td>
                                                                <td>Phạm Đại Tài</td> */}
                                                                        {/* Hành động */}
                                                                        <td style={{ textAlign: "center" }}>
                                                                            <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteCommand(command)}><i className="material-icons"></i></a>
                                                                        </td>
                                                                    </tr>
                                                                })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))
                            }
                        </fieldset>
                    </div>
                </div >
            </React.Fragment>
        );
    }
}

export default CommandCreateForm;