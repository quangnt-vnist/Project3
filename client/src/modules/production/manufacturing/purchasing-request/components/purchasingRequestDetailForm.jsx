import React, { Component } from 'react';
import { DialogModal } from '../../../../../common-components';
import sampleData from '../../sampleData';
class PurchasingRequestDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getPurchasingRequestById = (id) => {
        let { purchasingRequests } = sampleData;
        let purchasingRequest = purchasingRequests.filter((a) => a._id === id);
        // let materialRequests = purchasingRequest[0].materials;
        // console.log(materialRequests)
        return purchasingRequest[0];
    }


    shouldComponentUpdate(nextProps) {
        if (nextProps.purchasingRequestId !== this.props.purchasingRequestId) {
            this.setState((state) => {
                return {
                    ...state,
                    purchasingRequest: this.getPurchasingRequestById(nextProps.purchasingRequestId)
                }
            })
            return false;
        }
        return true;
    }

    render() {

        const { purchasingRequest } = this.state;
        console.log(purchasingRequest);
        let materials = [];
        if (purchasingRequest) {
            materials = purchasingRequest.materials;
        }
        return (
            <React.Fragment>
                {
                    purchasingRequest !== undefined &&
                    <DialogModal
                        modalID={`modal-detail-info-purchasing-request`} isLoading={false}
                        title="Chi tiết phiếu đề nghị"
                        formID={`form-detail-purchasing-request`}
                        size={75}
                        maxWidth={600}
                        hasSaveButton={false}
                        hasNote={false}
                    >
                        <form id={`form-detail-purchasing-request`}>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <strong>Mã phiếu đề nghị:&emsp;</strong>
                                        {purchasingRequest.code}
                                    </div>
                                    <div className="form-group">
                                        <strong>Người tạo:&emsp;</strong>
                                        {purchasingRequest.creator.name}
                                    </div>
                                    <div className="form-group">
                                        <strong>Ngày tạo:&emsp;</strong>
                                        {purchasingRequest.createdAt}
                                    </div>
                                    <div className="form-group">
                                        <strong>Ngày dự kiến nhận hàng:&emsp;</strong>
                                        {purchasingRequest.intendReceiveTime}
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <strong>Mục đích:&emsp;</strong>
                                        {purchasingRequest.purpose}
                                    </div>
                                    <div className="form-group">
                                        <strong>Mô tả:&emsp;</strong>
                                        {purchasingRequest.description}
                                    </div>
                                    <div className="form-group">
                                        <strong>Trạng thái:&emsp;</strong>
                                        {purchasingRequest.status ? "Đang được xử lý" : "Chưa được xử lý"}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">Chi tiết nguyên vật liệu</legend>
                                        <table id="manufacturing-works-table" className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Mã mặt hàng</th>
                                                    <th>Tên mặt hàng</th>
                                                    <th>Số lượng</th>
                                                    <th>Đơn vị tính</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(materials && materials.length !== 0) &&
                                                    materials.map((material, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{material.code}</td>
                                                            <td>{material.name}</td>
                                                            <td>{material.quantity}</td>
                                                            <td>{material.baseUnit}</td>
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

export default PurchasingRequestDetailForm;