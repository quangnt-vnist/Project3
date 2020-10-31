import React, { Component } from 'react';
import sampleData from '../../../sampleData';
import { DataTableSetting, DatePicker, DeleteNotification, SelectMulti } from "../../../../../../common-components";
import ManufacturingOrderDetailInfo from './manufacturingOrderDetailInfo';
import ManufacturingPlanCreateForm from '../manufacturing-plan/create-order-plan/manufacturingPlanCreateForm';
class ManufacturingOrderManagement extends Component {
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
        window.$(`#modal-detail-info-manufacturing-order`).modal('show');
    }

    handleShowPlanCreateForm = async (id) => {
        await this.setState((state) => {
            return {
                ...state,
                manufacturingPlanCreatedOrderId: id
            }
        });
        window.$(`#modal-create-manufacturing-plan`).modal('show');
    }

    render() {
        const { manufacturingOrders } = sampleData;
        return (
            <React.Fragment>
                {
                    <ManufacturingOrderDetailInfo manufacturingOrderId={this.state.manufacturingOrderId} />
                }
                <div className="box-body qlcv">
                    {
                        <ManufacturingPlanCreateForm manufacturingOrderId={this.state.manufacturingPlanCreatedOrderId} />
                    }
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã đơn sản xuất</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="DSX 001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Mã đơn kinh doanh</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="DKD 001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Mã phiếu đề nghị</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="PDN 001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Độ ưu tiên</label>
                            <SelectMulti
                                id={`select-multi-priority`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn độ ưu tiên", allSelectedText: "Chọn tất cả" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: "Rất cao" },
                                    { value: '2', text: "Cao" },
                                    { value: '3', text: "Bình thường" },
                                    { value: '4', text: "Thấp" },
                                    { value: '5', text: "Rất thấp" },
                                ]}
                            // onChange={this.handleChangeValue}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label>Ngày tạo</label>
                            <DatePicker
                                id={`maintain_after`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Trạng thái</label>
                            <SelectMulti
                                id={`select-multi-status`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn trạng thái", allSelectedText: "Chọn tất cả" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { status: '1', text: "Chưa lập kế hoạch" },
                                    { status: '2', text: "Đang lập kế hoạch" },
                                    { status: '3', text: "Đã lập kế hoạch" },
                                ]}
                            // onChange={this.handleStatusChange}
                            />
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={this.handleSubmitSearch}>Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="manufacturing-works-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn sản xuất</th>
                                <th>Người tạo</th>
                                <th>Thời gian tạo</th>
                                <th>Dự kiến hoàn thành</th>
                                <th>Độ ưu tiên</th>
                                <th>Mô tả</th>
                                <th>Trạng thái</th>
                                <th style={{ width: "120px", textAlign: "center" }}>Hành động
                                    <DataTableSetting
                                        tableId="manufacturing-works-table"
                                        columnArr={[
                                            "STT",
                                            "Mã đơn sản xuất",
                                            "Người tạo",
                                            "Thời gian tạo",
                                            "Dự kiến hoàn thành",
                                            "Độ ưu tiên",
                                            "Mô tả",
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
                            {(manufacturingOrders && manufacturingOrders.length !== 0) &&
                                manufacturingOrders.map((manufacturingOrder, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{manufacturingOrder.code}</td>
                                        <td>{manufacturingOrder.creator.name}</td>
                                        <td>{manufacturingOrder.createdAt}</td>
                                        <td>{manufacturingOrder.deadline}</td>
                                        <td>{manufacturingOrder.priority}</td>
                                        <td>{manufacturingOrder.description}</td>
                                        {
                                            manufacturingOrder.status === "Đã lập kế hoạch"
                                                ?
                                                <td style={{ color: "green" }}>{manufacturingOrder.status}</td>
                                                : manufacturingOrder.status === "Chưa lập kế hoạch"
                                                    ?
                                                    <td style={{ color: "red" }}>{manufacturingOrder.status}</td>
                                                    :
                                                    <td style={{ color: "blue" }}>{manufacturingOrder.status}</td>
                                        }

                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title="Xem chi tiết đơn sản xuất" onClick={() => this.handleShowDetailInfo(manufacturingOrder._id)}><i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title="Sửa đơn sản xuất"><i className="material-icons">edit</i></a>
                                            {
                                                manufacturingOrder.status !== "Đã lập kế hoạch" &&
                                                <a className="edit text-red" style={{ width: '5px' }} title="Lập kế hoạch" onClick={() => this.handleShowPlanCreateForm(manufacturingOrder._id)}><i className="material-icons">add</i></a>
                                            }
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

export default ManufacturingOrderManagement;