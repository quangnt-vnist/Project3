import React, { Component } from 'react';
import { DatePicker, SelectBox } from '../../../../../../../common-components';
import GoodIssue from './goodIssue';

class ManufacturingCommandAndResources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commands: [],
            status: "1",
            estimated: false
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

    showGoodIssue = (e) => {
        e.preventDefault();
        window.$(`#modal-detail-issue-id`).modal('show');
    }
    handleClickEstimate = (e) => {
        e.preventDefault();
        this.setState({
            estimated: true
        });
    }
    handleDeleteEstimate = (e) => {
        e.preventDefault();
        this.setState({
            estimated: false
        })
    }
    render() {
        const { id, manufacturingOrder } = this.props;
        const { commands, status } = this.state;
        console.log(commands);
        return (
            <div id={id} className="tab-pane">
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
                <button className="btn btn-primary" onClick={(e) => this.handleClickEstimate(e)}>Ước tính</button>
                {
                    this.state.estimated && <button className="btn btn-danger" style={{ marginLeft: "1rem" }} onClick={(e) => this.handleDeleteEstimate(e)}>Xóa ước tính</button>
                }
                {
                    this.state.estimated === true &&
                    <div className="row" style={{ marginTop: "1rem" }}>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Ước lượng máy móc</legend>
                                <table id="manufacturing-order-plan-table-1" className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Mã lệnh</th>
                                            <th>Tên mặt hàng</th>
                                            <th>Số lượng</th>
                                            <th>Xưởng</th>
                                            <th>Nhà máy</th>
                                            <th>Ca bắt đầu</th>
                                            <th>Ca kết thúc</th>
                                            <th>STT</th>
                                            <th>Loại máy</th>
                                            <th>Số lượng cần thiết</th>
                                            <th>Số lượng có sẵn</th>
                                            <th>Trạng thái ước tính</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td rowSpan={3}>1</td>
                                            <td rowSpan={3}>LSX001</td>
                                            <td rowSpan={3}>Paracetamol</td>
                                            <td rowSpan={3}>100</td>
                                            <td rowSpan={3}>Xưởng A</td>
                                            <td rowSpan={3}>Nhà máy SRXS</td>
                                            <td rowSpan={3}>Ca 3 - 10/10/2020</td>
                                            <td rowSpan={3}>Ca 1 - 11/10/2020</td>
                                            <td>1</td>
                                            <td>Máy khuấy</td>
                                            <td>2</td>
                                            <td>2</td>
                                            <td style={{ color: "green" }}>Có sẵn</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Máy trộn</td>
                                            <td>1</td>
                                            <td>2</td>
                                            <td style={{ color: "green" }}>Có sẵn</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Máy ép thuốc</td>
                                            <td>1</td>
                                            <td>2</td>
                                            <td style={{ color: "green" }}>Có sẵn</td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={2}>2</td>
                                            <td rowSpan={2}>LSX002</td>
                                            <td rowSpan={2}>W3Q</td>
                                            <td rowSpan={2}>100</td>
                                            <td rowSpan={2}>Xưởng B</td>
                                            <td rowSpan={2}>Nhà máy AWX</td>
                                            <td rowSpan={2}>Ca 1 - 11/10/2020</td>
                                            <td rowSpan={2}>Ca 3 - 11/10/2020</td>
                                            <td>1</td>
                                            <td>Máy trộn loại 1</td>
                                            <td>2</td>
                                            <td>1</td>
                                            <td style={{ color: "red" }}>Không có sẵn</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Máy rây thuốc</td>
                                            <td>2</td>
                                            <td>4</td>
                                            <td style={{ color: "green" }}>Có sẵn</td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={2}>3</td>
                                            <td rowSpan={2}>LSX003</td>
                                            <td rowSpan={2}>W3Q</td>
                                            <td rowSpan={2}>100</td>
                                            <td rowSpan={2}>Xưởng B</td>
                                            <td rowSpan={2}>Nhà máy AWX</td>
                                            <td rowSpan={2}>Ca 1 - 1210/2020</td>
                                            <td rowSpan={2}>Ca 3 - 12/10/2020</td>
                                            <td>1</td>
                                            <td>Máy khuấy</td>
                                            <td>2</td>
                                            <td>0</td>
                                            <td style={{ color: "green" }}>Không có sẵn</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Máy cân liều</td>
                                            <td>1</td>
                                            <td>4</td>
                                            <td style={{ color: "green" }}>Có sẵn</td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>LSX004</td>
                                            <td>Bột nap</td>
                                            <td>300</td>
                                            <td>Xưởng C</td>
                                            <td>Nhà máy SRXS</td>
                                            <td>Ca 3 - 13/10/2020</td>
                                            <td>Ca 1 - 14/10/2020</td>
                                            <td>1</td>
                                            <td>Máy ép</td>
                                            <td>2</td>
                                            <td>2</td>
                                            <td style={{ color: "green" }}>Có sẵn</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    </div>
                }
                {
                    this.state.estimated === true &&
                    <div className="row" style={{ marginTop: "1rem" }}>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Ước lượng nhân công</legend>
                                <table id="manufacturing-order-plan-table-1" className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Mã lệnh</th>
                                            <th>Tên mặt hàng</th>
                                            <th>Số lượng</th>
                                            <th>Xưởng</th>
                                            <th>Nhà máy</th>
                                            <th>Ca bắt đầu</th>
                                            <th>Ca kết thúc</th>
                                            <th>Số lượng nhân công cần thiết</th>
                                            <th>Tổng nhân công có sẵn</th>
                                            <th>Trạng thái ước tính</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>LSX001</td>
                                            <td>Paracetamol</td>
                                            <td>100</td>
                                            <td>Xưởng A</td>
                                            <td>Nhà máy SRXS</td>
                                            <td>Ca 3 - 10/10/2020</td>
                                            <td>Ca 1 - 11/10/2020</td>
                                            <td>10</td>
                                            <td>30</td>
                                            <td style={{ color: "green" }}>Có sẵn</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>LSX002</td>
                                            <td>W3Q</td>
                                            <td>100</td>
                                            <td>Xưởng B</td>
                                            <td>Nhà máy AWX</td>
                                            <td>Ca 1 - 11/10/2020</td>
                                            <td>Ca 3 - 11/10/2020</td>
                                            <td>8</td>
                                            <td>15</td>
                                            <td style={{ color: "green" }}>Có sẵn</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>LSX003</td>
                                            <td>W3Q</td>
                                            <td>100</td>
                                            <td>Xưởng B</td>
                                            <td>Nhà máy AWX</td>
                                            <td>Ca 1 - 1210/2020</td>
                                            <td>Ca 3 - 12/10/2020</td>
                                            <td>15</td>
                                            <td>20</td>
                                            <td style={{ color: "green" }}>Có sẵn</td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>LSX004</td>
                                            <td>Bột nap</td>
                                            <td>300</td>
                                            <td>Xưởng C</td>
                                            <td>Nhà máy SRXS</td>
                                            <td>Ca 3 - 13/10/2020</td>
                                            <td>Ca 1 - 14/10/2020</td>
                                            <td>13</td>
                                            <td>10</td>
                                            <td style={{ color: "red" }}>Không có sẵn</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </fieldset>
                            <button className="btn btn-info" onClick={(e) => this.showGoodIssue(e)}>Xem phiếu đề nghị xuất kho NVL</button>
                        </div>
                    </div>

                }
                <GoodIssue style={{ zIndex: 0 }} />

            </div>
        );
    }
}

export default ManufacturingCommandAndResources;