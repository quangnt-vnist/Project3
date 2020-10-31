import React, { Component } from 'react';
import sampleData from '../../sampleData';
import { DataTableSetting, DatePicker, DeleteNotification, SelectMulti } from "../../../../../common-components";
import ManufacturingCommandDetailInfo from './manufacturingCommandDetailInfo';
class ManufacturingCommandManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    // handleChangeValue = async (value) => {
    //     this.setState(state => {
    //         return {
    //             ...state,
    //             value: value
    //         }
    //     })
    // }

    handleShowDetailInfo = async (id) => {
        await this.setState((state) => {
            return {
                ...state,
                manufacturingOrderId: id
            }
        });
        window.$(`#modal-detail-info-manufacturing-command`).modal('show');
    }

    render() {
        const { manufacturingCommands } = sampleData;
        return (
            <React.Fragment>
                {
                    <ManufacturingCommandDetailInfo />
                }
                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã lệnh</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="KH001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Mã lô SX</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="KH001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={this.handleSubmitSearch}>Tìm kiếm</button>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã kế hoạch</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="DSX001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Mã đơn sản xuất</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="DSX001" autoComplete="off" />
                        </div>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Người phụ trách</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="LSX001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Tình trạng</label>
                            <SelectMulti
                                id={`select-multi-process`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn trạng thái", allSelectedText: "Chọn tất cả" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: "Chưa được duyệt" },
                                    { value: '2', text: "Đã được duyệt" },
                                    { value: '3', text: "Đúng tiến độ" },
                                    { value: '4', text: "Trễ Tiến độ" },
                                    { value: '5', text: "Quá hạn" },
                                    { value: '6', text: "Đã hoàn thành" },
                                ]}
                            // onChange={this.handleChangeValue}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Từ ngày</label>
                            <DatePicker
                                id={`maintain_after`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Đến ngày</label>
                            <DatePicker
                                id={`maintain_after_1`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <table id="manufacturing-plan-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã lệnh sản xuất</th>
                                <th>Mã kế hoạch</th>
                                <th>Thời gian tạo</th>
                                <th>Người thực hiện</th>
                                <th>Người giám sát</th>
                                <th>Xưởng sản xuất</th>
                                <th>Thời gian bắt đầu</th>
                                <th>Thời gian dự kiến hoàn thành</th>
                                <th>Trạng thái</th>
                                <th style={{ width: "120px", textAlign: "center" }}>Hành động
                                    <DataTableSetting
                                        tableId="manufacturing-plan-table"
                                        columnArr={[
                                            "STT",
                                            "Mã lệnh sản xuất",
                                            "Mã kế hoạch",
                                            "Thời gian tạo",
                                            "Người thực hiện",
                                            "Người giám sát",
                                            "Xưởng sản xuất",
                                            "Thời gian bắt đầu",
                                            "Thời gian dự kiến hoàn thành",
                                            "Trạng thái"
                                        ]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(manufacturingCommands && manufacturingCommands.length !== 0) &&
                                manufacturingCommands.map((manufacturingCommand, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{manufacturingCommand.code}</td>
                                        <td>{manufacturingCommand.manufacturingPlan !== undefined && manufacturingCommand.manufacturingPlan.code}</td>
                                        <td>{manufacturingCommand.createdAt}</td>
                                        <td>{manufacturingCommand.responsible.map((res, index) => {
                                            if (manufacturingCommand.responsible.length === index + 1)
                                                return res.name
                                            return res.name + ", "
                                        })}
                                        </td>
                                        <td>{manufacturingCommand.accountable.map((acc, index) => {
                                            if (manufacturingCommand.accountable.length === index + 1)
                                                return acc.name;
                                            return acc.name + ", "
                                        })}</td>
                                        <td>{manufacturingCommand.manufacturingMill !== undefined && manufacturingCommand.manufacturingMill.name}</td>
                                        <td>{"Ca " + manufacturingCommand.startTurn + " ngày " + manufacturingCommand.startDate}</td>
                                        <td>{"Ca " + manufacturingCommand.endTurn + " ngày " + manufacturingCommand.endDate}</td>
                                        {
                                            manufacturingCommand.status === "Trễ tiến độ"
                                                ?
                                                <td style={{ color: "orange" }}>{manufacturingCommand.status}</td>
                                                :
                                                manufacturingCommand.status === "Đúng tiến độ"
                                                    ?
                                                    <td style={{ color: "green" }}>{manufacturingCommand.status}</td>
                                                    :
                                                    <td>{manufacturingCommand.status}</td>
                                        }

                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title="Xem chi tiết lệnh sản xuất" onClick={() => this.handleShowDetailInfo(manufacturingCommand._id)}><i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title="Sửa lệnh sản xuất"><i className="material-icons">edit</i></a>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </React.Fragment >
        );
    }
}

export default ManufacturingCommandManagementTable;