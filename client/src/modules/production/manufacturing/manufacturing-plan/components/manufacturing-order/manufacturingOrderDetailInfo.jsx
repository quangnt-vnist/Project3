import React, { Component } from 'react';
import { DialogModal } from '../../../../../../common-components';
import sampleData from '../../../sampleData';



class ManufacturingOrderDetailInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getManufacturingOrderById = (id) => {
        let { manufacturingOrders } = sampleData;
        let manufacturingOrder = manufacturingOrders.filter((a) => a._id === id);
        // let materialRequests = purchasingRequest[0].materials;
        // console.log(materialRequests)
        return manufacturingOrder[0];
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
                {
                    manufacturingOrder !== undefined &&
                    <DialogModal
                        modalID={`modal-detail-info-manufacturing-order`} isLoading={false}
                        title="Chi tiết đơn sản xuất"
                        formID={`form-detail-manufacturing-order`}
                        size={75}
                        maxWidth={600}
                        hasSaveButton={false}
                        hasNote={false}
                    >
                        <form id={`form-detail-manufacturing-order`}>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <strong>Mã đơn sản xuất:&emsp;</strong>
                                        {manufacturingOrder.code}
                                    </div>
                                    <div className="form-group">
                                        <strong>Người tạo:&emsp;</strong>
                                        {manufacturingOrder.creator.name}
                                    </div>
                                    <div className="form-group">
                                        <strong>Ngày tạo:&emsp;</strong>
                                        {manufacturingOrder.createdAt}
                                    </div>
                                    <div className="form-group">
                                        <strong>Ngày dự kiến hoàn thành:&emsp;</strong>
                                        {manufacturingOrder.deadline}
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <strong>Độ ưu tiên:&emsp;</strong>
                                        {manufacturingOrder.priority}
                                    </div>
                                    <div className="form-group">
                                        <strong>Mô tả:&emsp;</strong>
                                        {manufacturingOrder.description}
                                    </div>
                                    <div className="form-group">
                                        <strong>Trạng thái:&emsp;</strong>
                                        {manufacturingOrder.status}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">Chi tiết mặt hàng</legend>
                                        <table id="manufacturing-order-table" className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Mã mặt hàng</th>
                                                    <th>Tên mặt hàng</th>
                                                    <th>Đơn vị tính</th>
                                                    <th>Số lượng</th>
                                                    <th>Quy cách đóng gói</th>
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
                                                            <td>{good.quantity}</td>
                                                            <td>{good.good.packingRule}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </fieldset>
                                </div>
                            </div>
                        </form>
                    </DialogModal>
                }
            </React.Fragment>
        );
    }
}

export default ManufacturingOrderDetailInfo;