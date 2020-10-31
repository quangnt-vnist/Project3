import React, { Component } from "react";

class InfoBox extends Component {
    render() {
        return (
            <div className="col-xs-12">
                <div className="col-md-3 col-sm-6 col-xs-6">
                    <div className="info-box with-border">
                        <span className="info-box-icon bg-aqua">
                            <i className="fa fa-hand-o-right"></i>
                        </span>
                        <div
                            className="info-box-content"
                            title="Tổng tiền mua hàng"
                        >
                            <span className="info-box-text">
                                Số đơn báo giá
                            </span>
                            <span className="info-box-number">1893 đơn</span>
                            <a href={`/manage-purchase-order`} target="_blank">
                                Xem thêm{" "}
                                <i className="fa fa-arrow-circle-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-6">
                    <div className="info-box with-border">
                        <span className="info-box-icon bg-green">
                            <i className="fa fa-hand-o-right"></i>
                        </span>
                        <div
                            className="info-box-content"
                            title="Tổng tiền mua hàng"
                        >
                            <span className="info-box-text">
                                Số đơn kinh doanh
                            </span>
                            <span className="info-box-number">983 đơn</span>
                            <a href={`/manage-sales-order`} target="_blank">
                                Xem thêm{" "}
                                <i className="fa fa-arrow-circle-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-6">
                    <div className="info-box with-border">
                        <span className="info-box-icon bg-red">
                            <i className="fa fa-hand-o-right"></i>
                        </span>
                        <div
                            className="info-box-content"
                            title="Tổng tiền mua hàng"
                        >
                            <span className="info-box-text">Doanh số</span>
                            <span className="info-box-number">
                                1,334,553,332.00 vnđ
                            </span>
                            <a href={`/manage-sales-order`} target="_blank">
                                Xem thêm{" "}
                                <i className="fa fa-arrow-circle-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-6">
                    <div className="info-box with-border">
                        <span className="info-box-icon bg-yellow">
                            <i className="fa fa-hand-o-right"></i>
                        </span>
                        <div
                            className="info-box-content"
                            title="Tổng tiền mua hàng"
                        >
                            <span className="info-box-text">Doanh thu</span>
                            <span className="info-box-number">
                                893,425,500.00 vnđ
                            </span>
                            <a href={`/manage-sales-order`} target="_blank">
                                Xem thêm{" "}
                                <i className="fa fa-arrow-circle-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoBox;
