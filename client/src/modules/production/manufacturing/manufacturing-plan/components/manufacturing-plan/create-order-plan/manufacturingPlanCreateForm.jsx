import React, { Component } from 'react';
import { ButtonModal, DatePicker, DialogModal } from '../../../../../../../common-components';
import sampleData from '../../../../sampleData';
import MaterialCalculator from './materialCalculator';
import ManufacturingCommandAndResoures from './manufacturingCommandAndResources'
import ManufacturingMillSchedule from './manufacturingMillSchedule';
import AssignMachineSchedule from './assignMachineSchedule';

class ManufacturingPlanCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    getManufacturingOrderById = (id) => {
        let { manufacturingOrders } = sampleData;
        let manufacturingOrder = manufacturingOrders.filter((a) => a._id === id);
        // let materialRequests = purchasingRequest[0].materials;
        // console.log(materialRequests)
        return manufacturingOrder[0];
    }

    handleChangeStatus = (value) => {
        this.setState((state) => {
            return {
                ...state,
                status: value[0]
            }
        })
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.manufacturingOrderId !== this.props.manufacturingOrderId) {
            this.setState((state) => {
                return {
                    ...state,
                    manufacturingOrder: this.getManufacturingOrderById(nextProps.manufacturingOrderId)
                }
            })
            return false;
        }
        return true;
    }

    render() {
        const { manufacturingOrder } = this.state;
        let goods = [];
        if (manufacturingOrder) {
            goods = manufacturingOrder.goods;
        }
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-manufacturing-plan" isLoading={false}
                    formID="form-create-manufacturing-plan"
                    title="Tạo kế hoạch sản xuất"
                    // msg_success={translate('manage_plan.add_success')}
                    // msg_faile={translate('manage_plan.add_fail')}
                    // func={this.save}
                    // disableSubmit={!this.isFormValidated()}
                    size={100}
                    maxWidth={500}
                >
                    {
                        manufacturingOrder !== undefined &&
                        <form id="form-create-manufacturing-plan">
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Mã kế hoạch<span className="text-red">*</span></label>
                                        <input type="text" className="form-control"></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Mã đơn sản xuất</label>
                                        <input type="text" value={manufacturingOrder.code} disabled={true} className="form-control" ></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Người tạo<span className="text-red">*</span></label>
                                        <input type="text" className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Ngày bắt đầu<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`maintain_after`}
                                            // dateFormat={dateFormat}
                                            // value={startValue}
                                            // onChange={this.handleChangeDateAfter}
                                            disabled={false}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Ngày dự kiến hoàn thành<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`maintain_after_1`}
                                            // dateFormat={dateFormat}
                                            // value={startValue}
                                            // onChange={this.handleChangeDateAfter}
                                            disabled={false}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Mô tả</label>
                                        <input type="text" className="form-control"></input>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">Thông tin đơn sản xuất</legend>
                                        <table id="manufacturing-order-plan-table-1" className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Mã mặt hàng</th>
                                                    <th>Tên mặt hàng</th>
                                                    <th>Đơn vị tính</th>
                                                    <th>Quy tắc đóng gói</th>
                                                    <th>Số lượng theo đơn</th>
                                                    <th>Số lượng đã lập kế hoạch</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(goods && goods.length !== 0) &&
                                                    goods.map((good, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{good.good.code}</td>
                                                            <td>{good.good.name}</td>
                                                            <td>{good.good.baseUnit}</td>
                                                            <td>{good.good.packingRule}</td>
                                                            <td>{good.quantity}</td>
                                                            <td>{good.planedQuantity}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </fieldset>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="nav-tabs-custom">
                                        {/* Nav-tabs */}
                                        <ul className="nav nav-tabs">
                                            <li className="active"><a title="Định mức nguyên vật liệu" data-toggle="tab" href={`#material-calculator`}>Định mức nguyên vật liệu</a></li>
                                            <li><a title="Lệnh sản xuất và phân bổ nguồn lực" data-toggle="tab" href={`#manufaturing-command-and-resources`}>Lệnh sản xuất và phân bổ nguồn lực</a></li>
                                            <li><a title="Lịch sản xuất" data-toggle="tab" href={`#manufacturing-mill-schedule`}>Lịch sản xuất</a></li>
                                            <li><a title="Lịch sử dụng máy móc" data-toggle="tab" href={`#assign-machine-schedule`}>Lịch sử dụng máy móc</a></li>
                                        </ul>

                                        <div className="tab-content">
                                            {/* Thông tin định mức nguyên vật liệu */}
                                            <MaterialCalculator
                                                id={`material-calculator`}
                                                manufacturingOrder={manufacturingOrder}
                                            />
                                            {/* Thông tin lệnh sản xuất và phân bổ tài nguyên */}
                                            <ManufacturingCommandAndResoures
                                                id={`manufaturing-command-and-resources`}
                                                manufacturingOrder={manufacturingOrder}
                                            />
                                            {/* Thông tin về lịch sản xuất */}
                                            <ManufacturingMillSchedule
                                                id={`manufacturing-mill-schedule`}
                                            />
                                            <AssignMachineSchedule
                                                id={`assign-machine-schedule`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    }
                </DialogModal>
            </React.Fragment >
        );
    }
}

export default ManufacturingPlanCreateForm;