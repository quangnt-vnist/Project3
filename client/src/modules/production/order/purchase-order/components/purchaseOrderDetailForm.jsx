import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from "../../../../../common-components";

class PurchaseDetailForm extends Component {
    constructor(props) {
        super(props);
    }

    format_curency(x) {
        x = x.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
        return x;
    }

    render() {
        const { data } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-detail-material-purchase-order"
                    isLoading={false}
                    formID="form-detail-material-purchase-order"
                    title={"Chi tiết đơn mua nguyên vật liệu"}
                    size="50"
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <div
                        className="row row-equal-height"
                        style={{ marginTop: -25 }}
                    >
                        <div
                            className={"col-xs-12 col-sm-12 col-md-6 col-lg-6"}
                            style={{ padding: 10 }}
                        >
                            <div
                                className="description-box"
                                style={{ height: "100%" }}
                            >
                                <h4>Thông tin chung</h4>
                                <div className="form-group">
                                    <strong>{"Mã đơn hàng"}:&emsp; </strong>
                                    {data.code}
                                </div>

                                <div className="form-group">
                                    <strong>{"Nội dung"}:&emsp; </strong>
                                    {data.description}
                                </div>

                                <div className="form-group">
                                    <strong>{"Nhập vào kho"}:&emsp; </strong>
                                    {data.stock}
                                </div>

                                <div className="form-group">
                                    <strong>{"Trạng thái"}:&emsp; </strong>
                                    {data.status}
                                </div>

                                {data.returnRule ? (
                                    <div className="form-group">
                                        <strong>
                                            {"Quy tắc đổi trả"}:&emsp;{" "}
                                        </strong>
                                        {data.returnRule}
                                    </div>
                                ) : (
                                    ""
                                )}

                                {data.serviceLevelAgreement ? (
                                    <div className="form-group">
                                        <strong>
                                            {"Cam kết chất lượng"}:&emsp;{" "}
                                        </strong>
                                        {data.serviceLevelAgreement}
                                    </div>
                                ) : (
                                    ""
                                )}

                                <div className="form-group">
                                    <strong>{"Ngày tạo"}:&emsp; </strong>
                                    {data.createAt}
                                </div>
                            </div>
                        </div>

                        <div
                            className={"col-xs-12 col-sm-12 col-md-6 col-lg-6"}
                            style={{ padding: 10 }}
                        >
                            <div
                                className="description-box"
                                style={{ height: "100%" }}
                            >
                                <h4>Các bên liên quan</h4>
                                <div className="form-group">
                                    <div className="form-group">
                                        <strong>
                                            {"Nhà cung cấp"}:&emsp;{" "}
                                        </strong>
                                        {data.partner}
                                    </div>
                                    <strong>{"Người tạo đơn"}:&emsp; </strong>
                                    {data.creator}
                                </div>
                                <div className="form-group">
                                    <strong>
                                        {"Chịu trách nhiệm mua hàng"}:&emsp;{" "}
                                    </strong>
                                    {data.responsible}
                                </div>
                                <div className="form-group">
                                    <strong>
                                        {"Những người phê duyệt"}:&emsp;{" "}
                                    </strong>
                                    {data.approvers.length
                                        ? data.approvers.map((user) => (
                                              <div style={{ display: "flex" }}>
                                                  <div style={{ width: "50%" }}>
                                                      <b>
                                                          {" "}
                                                          <i>Tên: </i>
                                                      </b>{" "}
                                                      {user.name}
                                                  </div>
                                                  <div style={{ width: "50%" }}>
                                                      <b>
                                                          <i>Chức vụ: </i>
                                                      </b>{" "}
                                                      {user.role}
                                                  </div>
                                              </div>
                                          ))
                                        : "Chưa được phê duyệt"}
                                </div>
                                <div className="form-group">
                                    {data.payments.length ? (
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border">
                                                {"Thông tin thanh toán"}
                                            </legend>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            title={
                                                                "Người thanh toán"
                                                            }
                                                        >
                                                            Người thanh toán
                                                        </th>
                                                        <th
                                                            title={
                                                                "Số tiền thanh toán"
                                                            }
                                                        >
                                                            Số tiền thanh toán
                                                            (vnđ)
                                                        </th>
                                                        <th
                                                            title={
                                                                "Thanh toán lúc"
                                                            }
                                                        >
                                                            Thanh toán lúc
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody
                                                    id={`good-edit-manage-by-purchase-order`}
                                                >
                                                    {data.payments.map(
                                                        (item, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    {
                                                                        item.accounting
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {this.format_curency(
                                                                        item.money
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.paymentAt
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </fieldset>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset
                                className="scheduler-border"
                                style={{ padding: 10 }}
                            >
                                <legend className="scheduler-border">
                                    Thông tin chi hàng nhập
                                </legend>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th title={"Tên nguyên vật liệu"}>
                                                Tên nguyên vật liệu
                                            </th>
                                            <th title={"Giá (vnđ)"}>Giá</th>
                                            <th title={"Số lượng"}>Số lượng</th>
                                            <th title={"Đơn vị tính"}>
                                                Đơn vị tính
                                            </th>
                                            <th title={"Thành tiền"}>
                                                Thành tiền
                                            </th>
                                            <th title={"Quy tắc đổi trả"}>
                                                Quy tắc đổi trả
                                            </th>
                                            <th title={"Cam kết chất lượng"}>
                                                Cam kết chất lượng
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        id={`good-edit-manage-by-purchase-order`}
                                    >
                                        {data.goods.length === 0 ? (
                                            <tr>
                                                <td colSpan={6}>
                                                    <center>
                                                        {
                                                            "Chưa có thông tin nguyên vật liệu"
                                                        }
                                                    </center>
                                                </td>
                                            </tr>
                                        ) : (
                                            data.goods.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        {this.format_curency(
                                                            item.price
                                                        )}
                                                    </td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.baseUnit}</td>
                                                    <td>2,000,000</td>
                                                    <td>
                                                        <a>Xem chi tiết</a>
                                                    </td>
                                                    <td>
                                                        <a>Xem chi tiết</a>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        <tr>
                                            <td
                                                colSpan={4}
                                                style={{ fontWeight: 600 }}
                                            >
                                                <center>Tổng</center>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>
                                                6,000,000{" "}
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(PurchaseDetailForm));
