import React, { Component } from 'react';
import sampleData from '../../../sampleData';
import { DataTableSetting, DatePicker, DeleteNotification, SelectMulti } from "../../../../../../common-components";
import NewPlanCreateForm from './create-new-plan/newPlanCreateForm';
class ManufacturingPlanManagementTable extends Component {
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

    render() {
        const { manufacturingPlans } = sampleData;
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <NewPlanCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã kế hoạch</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="KH001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Ngày bắt đầu</label>
                            <DatePicker
                                id={`maintain_after`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã đơn sản xuất</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="DSX001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Ngày dự kiến hoàn thành</label>
                            <DatePicker
                                id={`maintain_after_1`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã lệnh sản xuất</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="LSX001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Ngày tạo</label>
                            <DatePicker
                                id={`maintain_after_2`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>


                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã đơn kinh doanh</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="DKD001" autoComplete="off" />
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
                                    { value: '1', text: "Đã hoàn thành" },
                                    { value: '2', text: "Đang thực hiện" },
                                    { value: '3', text: "Chưa thực hiện" },
                                    { value: '4', text: "Đã hủy bỏ" },
                                    { value: '5', text: "Chưa được duyệt" },
                                ]}
                            // onChange={this.handleChangeValue}
                            />
                        </div>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã phiếu đề nghị</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="PDN001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={this.handleSubmitSearch}>Tìm kiếm</button>
                        </div>
                    </div>

                    <table id="manufacturing-plan-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã kế hoạch</th>
                                <th>Mã đơn sản xuất</th>
                                <th>Người tạo</th>
                                <th>Thời gian tạo</th>
                                <th>Thời gian bắt đầu</th>
                                <th>Thời gian dự kiến hoàn thành</th>
                                <th>Trạng thái</th>
                                <th>Hành động
                                    <DataTableSetting
                                        tableId="manufacturing-plan-table"
                                        columnArr={[
                                            "STT",
                                            "Mã kế hoạch",
                                            "Mã đơn sản xuất",
                                            "Người tạo",
                                            "Thời gian tạo",
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
                            {(manufacturingPlans && manufacturingPlans.length !== 0) &&
                                manufacturingPlans.map((manufacturingPlan, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{manufacturingPlan.code}</td>
                                        <td>{manufacturingPlan.manufacturingOrder !== undefined && manufacturingPlan.manufacturingOrder.code}</td>
                                        <td>{manufacturingPlan.creator.name}</td>
                                        <td>{manufacturingPlan.createdAt}</td>
                                        <td>{manufacturingPlan.startDate}</td>
                                        <td>{manufacturingPlan.endDate}</td>
                                        <td>{manufacturingPlan.status}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title="Xem chi tiết kế hoạch sản xuất" onClick={() => this.handleShowDetailInfo(manufacturingPlan._id)}><i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title="Sửa kế hoạch sản xuất"><i className="material-icons">edit</i></a>
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

export default ManufacturingPlanManagementTable;