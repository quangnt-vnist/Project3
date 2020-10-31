import React, { Component } from 'react';
import { DatePicker, SelectBox } from '../../../../../../../common-components';
import { RoleActions } from '../../../../../../super-admin/role/redux/actions';

class ManufacturingCommandAndResources1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commands: [],
            status: "1"
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
        const { id, manufacturingOrder } = this.props;
        const { commands, status } = this.state;
        console.log(commands);
        return (
            <div id={id} className="tab-pane">
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
                                                <th>Chọn xưởng SX</th>
                                                <th>nhà máy</th>
                                                <th>Năng suất xưởng/ ca</th>
                                                <th>Số lượng</th>
                                                <th>Ngày bắt đầu</th>
                                                <th>Ca bắt đầu</th>
                                                <th>Ngày kết thúc</th>
                                                <th>Ca kết thúc</th>
                                                <th>Người chịu trách nhiệm</th>
                                                <th>Người giám sát</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (!commands[index] || commands[index].length === 0) ?
                                                    <tr>
                                                        <td colSpan={15}>
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
                                                            <td>Nhà máy X</td>
                                                            <td>400</td>
                                                            <td><input className="form-control" type="number" placeholder="" name="nameField" style={{ width: "100%" }} /></td>
                                                            <td>
                                                                <DatePicker
                                                                    id={`day_start`}
                                                                    // dateFormat={dateFormat}
                                                                    // value={startValue}
                                                                    // onChange={this.handleChangeDateAfter}
                                                                    disabled={false}
                                                                />
                                                            </td>
                                                            <td>
                                                                <SelectBox
                                                                    id={`select-manufacturing-mill`}
                                                                    className="form-control select2"
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
                                                                    id={`day_finsh`}
                                                                    // dateFormat={dateFormat}
                                                                    // value={startValue}
                                                                    // onChange={this.handleChangeDateAfter}
                                                                    disabled={false}
                                                                />
                                                            </td>
                                                            <td>
                                                                <SelectBox
                                                                    id={`select-manufacturing-mill`}
                                                                    className="form-control select2"
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
                                                            <td>Nguyễn Anh Phương</td>
                                                            <td>Phạm Đại Tài</td>
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
                <button className="btn btn-primary">Ước tính</button>
            </div>
        );
    }
}

export default ManufacturingCommandAndResources1;