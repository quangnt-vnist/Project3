import React, { Component } from "react";

class InfoBox extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="col-xs-12">
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-red">
                                <i className="fa fa-hand-o-right"></i>
                            </span>
                            <div
                                className="info-box-content"
                                title="Tổng tiền mua hàng"
                            >
                                <span className="info-box-text">
                                    Số đơn sản xuất
                                </span>
                                <span className="info-box-number">18 đơn</span>
                                <a
                                    href={`/manage-manufacturing-order`}
                                    target="_blank"
                                >
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
                                    Số đơn mua NVL
                                </span>
                                <span className="info-box-number">32 đơn</span>
                                <a
                                    href={`/manage-purchase-order`}
                                    target="_blank"
                                >
                                    Xem thêm{" "}
                                    <i className="fa fa-arrow-circle-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
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
                                    Tổng tiền mua hàng
                                </span>
                                <span className="info-box-number">
                                    236,859,000 vnđ
                                </span>
                                <a
                                    href={`/manage-purchase-order`}
                                    target="_blank"
                                >
                                    Xem thêm{" "}
                                    <i className="fa fa-arrow-circle-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
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
                                    Tổng tiền đã thanh toán
                                </span>
                                <span className="info-box-number">
                                    120,000,000 vnđ
                                </span>
                                <a
                                    href={`/manage-purchase-order`}
                                    target="_blank"
                                >
                                    Xem thêm{" "}
                                    <i className="fa fa-arrow-circle-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default InfoBox;
