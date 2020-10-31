import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from "../../../../../common-components";
import "./quote.css";

class QuoteDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            print: false,
        };
    }

    format_curency(x) {
        x = x.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
        return x;
    }

    render() {
        const { data, type } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-detail-quote"
                    isLoading={false}
                    formID="form-detail-quote"
                    title={"Chi tiết báo giá"}
                    size="75"
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <DialogModal
                        modalID="modal-detail-quote-sla"
                        isLoading={false}
                        formID="form-detail-quote-sla"
                        title={"Chi tiết cam kết chất lượng"}
                        size="50"
                        hasSaveButton={false}
                        hasNote={false}
                    >
                        <form id="form-detail-quote-sla">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <i className="fa fa-check-square-o text-success"></i>
                                <div>
                                    Sản phẩm được sản xuất 100% đảm bảo tiêu
                                    chuẩn an toàn
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <i className="fa fa-check-square-o text-success"></i>
                                <div>Sản phẩm đúng với cam kết trên bao bì</div>
                            </div>
                        </form>
                    </DialogModal>
                    <div
                        className="row row-equal-height"
                        style={{ marginTop: -25 }}
                    >
                        {this.state.print ? (
                            <div
                                className={
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-12"
                                }
                                style={{
                                    marginTop: "10px",
                                    borderWidth: "1px",
                                    borderStyle: "solid",
                                    display: "flex",
                                }}
                            >
                                <div
                                    style={{
                                        padding: "20px 30px 20px 20px",
                                        borderWidth: "0px 1px 0px 0px",
                                        borderStyle: "solid",
                                        width: "23%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img
                                        src="https://bongluavang.vn/wp-content/uploads/2018/10/C%C3%B4ng-ty-CP-%C4%90%E1%BA%A7u-t%C6%B0-Li%C3%AAn-doanh-Vi%E1%BB%87t-Anh.png"
                                        style={{
                                            height: "60px",
                                            width: "60xp",
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        padding: "20px",
                                        width: "77%",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "16px",
                                            textTransform: "uppercase",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Công ty cổ phần Việt Anh
                                    </div>
                                    <div>
                                        Đc: Số 30, Tạ Quang Bửu, Bách Khoa, Hà
                                        Nội
                                    </div>
                                    <div>Liên hệ: 0399678989</div>
                                    <div>Mã số thuế: 1092842003</div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}

                        <div
                            className={
                                "col-xs-12 col-sm-12 col-md-12 col-lg-12"
                            }
                            style={{
                                borderWidth: "0px 1px 1px 1px",
                                borderStyle: "solid",
                                display: "flex",
                                backgroundColor: "#dafafb",
                                justifyContent: "center",
                                padding: "10px",
                            }}
                        >
                            <div
                                style={{
                                    textTransform: "uppercase",
                                    fontWeight: "600",
                                }}
                            >
                                Bảng báo giá
                            </div>
                        </div>

                        <div
                            className={
                                "col-xs-12 col-sm-12 col-md-12 col-lg-12"
                            }
                            style={{
                                borderWidth: "0px 1px 1px 1px",
                                borderStyle: "solid",
                                padding: "10px",
                            }}
                        >
                            <div
                                className={
                                    "col-xs-12 col-sm-12 col-md-6 col-lg-6"
                                }
                                style={{ padding: "0px 10px 0px 0px" }}
                            >
                                <div style={{ display: "flex" }}>
                                    <div className="quote-detail-info-left">
                                        Mã khách hàng:{" "}
                                    </div>
                                    <div className="quote-detail-info-right">
                                        KH_1908
                                    </div>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <div className="quote-detail-info-left">
                                        Khách hàng:{" "}
                                    </div>
                                    <div className="quote-detail-info-right">
                                        Công ty TNHH XYZ
                                    </div>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <div className="quote-detail-info-left">
                                        Đ/c nhận hàng:{" "}
                                    </div>
                                    <div className="quote-detail-info-right">
                                        Đường Bạch Mai, quận Hai Bà Trưng, Hà
                                        Nội, Việt Nam
                                    </div>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <div className="quote-detail-info-left">
                                        Người liên hệ:{" "}
                                    </div>
                                    <div className="quote-detail-info-right">
                                        Nguyễn Văn A
                                    </div>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <div className="quote-detail-info-left">
                                        Điện thoại:{" "}
                                    </div>
                                    <div className="quote-detail-info-right">
                                        0987909385
                                    </div>
                                </div>
                            </div>
                            <div
                                className={
                                    "col-xs-12 col-sm-12 col-md-6 col-lg-6"
                                }
                                style={{ padding: "0px 0px 0px 10px" }}
                            >
                                <div style={{ display: "flex" }}>
                                    <div className="quote-detail-info-left">
                                        Mã báo giá:{" "}
                                    </div>
                                    <div className="quote-detail-info-right">
                                        QUOTE_1983
                                    </div>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <div className="quote-detail-info-left">
                                        NV báo giá:{" "}
                                    </div>
                                    <div className="quote-detail-info-right">
                                        Phạm Đại Tài
                                    </div>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <div className="quote-detail-info-left">
                                        Ngày báo giá:{" "}
                                    </div>
                                    <div className="quote-detail-info-right">
                                        10/10/2020
                                    </div>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <div className="quote-detail-info-left">
                                        Hiệu lực đến:{" "}
                                    </div>
                                    <div className="quote-detail-info-right">
                                        15/10/2020
                                    </div>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <div className="quote-detail-info-left">
                                        Ghi chú:{" "}
                                    </div>
                                    <div className="quote-detail-info-right">
                                        Báo giá chỉ áp dụng với khách hàng nhận
                                        được báo giá này
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={
                                "col-xs-12 col-sm-12 col-md-12 col-lg-12"
                            }
                            style={{
                                borderWidth: "0px 1px 1px 1px",
                                borderStyle: "solid",
                                padding: "10px",
                            }}
                        >
                            <table className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Mã sản phẩm</th>
                                        <th>Đ/v tính</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                        <th>Khuyến mãi</th>
                                        <th>Thuế</th>
                                        <th>Tổng tiền</th>
                                        <th>Cam kết chất lượng</th>
                                        <th>Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Thuốc úm gà</td>
                                        <td>SP_0395</td>
                                        <td>Hộp</td>
                                        <td>350,000 vnđ</td>
                                        <td>10</td>
                                        <td>3,500,000 vnđ</td>
                                        <td>0 vnđ</td>
                                        <td>350,000 vnđ (10%)</td>
                                        <td>3,850,000 vnđ</td>
                                        <td>
                                            <div style={{ display: "flex" }}>
                                                <a
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    data-toggle="modal"
                                                    data-backdrop="static"
                                                    href={
                                                        "#modal-detail-quote-sla"
                                                    }
                                                >
                                                    Chi tiết
                                                    <i className="fa fa-arrow-circle-right"></i>
                                                </a>
                                            </div>
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Thuốc gà rù</td>
                                        <td>SP_0394</td>
                                        <td>Kg</td>
                                        <td>50,000 vnđ</td>
                                        <td>10</td>
                                        <td>500,000 vnđ</td>
                                        <td>0 vnđ</td>
                                        <td>50,000 vnđ (10%)</td>
                                        <td>550,000 vnđ</td>
                                        <td>
                                            <div style={{ display: "flex" }}>
                                                <a
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    data-toggle="modal"
                                                    data-backdrop="static"
                                                    href={
                                                        "#modal-detail-quote-sla"
                                                    }
                                                >
                                                    Chi tiết
                                                    <i className="fa fa-arrow-circle-right"></i>
                                                </a>
                                            </div>
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td
                                            colSpan={7}
                                            style={{ fontWeight: 600 }}
                                        >
                                            <center>Tổng</center>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            0 (vnđ)
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            400,000 (vnđ)
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            4,400,000 (vnđ)
                                        </td>
                                        <td colSpan={2}></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div
                            className={
                                "col-xs-12 col-sm-12 col-md-12 col-lg-12"
                            }
                            style={{ padding: "0px 0px 0px 10px" }}
                        >
                            <div
                                className="info-box-content"
                                title="Đơn kinh doanh"
                                style={{ position: "absolute", right: "0px" }}
                            >
                                <a href={`/manage-sales-order`} target="_blank">
                                    Đơn kinh doanh{" "}
                                    <i className="fa fa-arrow-circle-right"></i>
                                </a>
                            </div>
                        </div>

                        <button
                            className="btn btn-info print-quote"
                            onClick={() => this.setState({ print: true })}
                        >
                            <i className="fa  fa-print"></i>
                            <span> In báo giá</span>
                        </button>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

export default QuoteDetailForm;
