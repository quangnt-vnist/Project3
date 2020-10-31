import React, { Component } from "react";
import {
    DatePicker,
    DialogModal,
    SelectBox,
    ButtonModal,
} from "../../../../../common-components";

class SalesOrderCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: "",
            stock: "",
            responsible: "",
            goods: [],
            returnRule: "",
            serviceLevelAgreement: "",

            customerCode: "",
            customerName: "",
            customerAddress: "",
            customerPhone: "",
            customerEmployee: "",

            goodCode: "",
            goodName: "",
            baseUnit: "",
            goodPrice: "",
            goodTax: "",

            type: "quotation",
            note: "",
            returnRuleOfGood: "",
            serviceLevelAgreementOfGood: "",
            nameOfGood: "",
            baseUnitOfGood: "",
            priceOfGood: null,
            quantityOfGood: null,
        };
    }

    handleChangeDate = () => {};

    isGoodsValidated = () => {};

    handleCustomerChange = (value) => {
        const customer = [
            {
                customerCode: "NVA_1875",
                customerName: "Công ty XYZ",
                customerAddress: "Hoàng Mai, Hà Nội",
                customerEmployee: "Nguyễn Văn A",
                customerPhone: "0937985739",
            },
            {
                customerCode: "NVB_1789",
                customerName: "Công ty ABC",
                customerAddress: "Bạch Mai, Hà Nội",
                customerEmployee: "Nguyễn Văn B",
                customerPhone: "0359687930",
            },
        ];

        const customerInfo = customer.filter(
            (item) => item.customerCode === value[0]
        );

        this.setState({
            customerCode: customerInfo[0].customerCode,
            customerName: customerInfo[0].customerName,
            customerAddress: customerInfo[0].customerAddress,
            customerPhone: customerInfo[0].customerPhone,
            customerEmployee: customerInfo[0].customerEmployee,
        });
    };

    handleGoodCodeChange = (value) => {
        const goods = [
            {
                goodCode: "SP_0943",
                goodName: "Thuốc gà rù",
                baseUnit: "Hộp",
                goodPrice: "250,000 vnđ",
                goodTax: "25,000 vnđ (10%)",
            },
            {
                goodCode: "SP_0349",
                goodName: "Thuốc trị ghẻ",
                baseUnit: "kg",
                goodPrice: "100,000 vnđ",
                goodTax: "10,000 vnđ (10%)",
            },
            {
                goodCode: "SP_0344",
                goodName: "Kháng sinh bê con",
                baseUnit: "Hộp",
                goodPrice: "150,000 vnđ",
                goodTax: "15,000 vnđ (10%)",
            },
        ];
        const goodInfo = goods.filter((item) => item.goodCode === value[0]);
        this.setState({
            goodCode: goodInfo[0].goodCode,
            goodName: goodInfo[0].goodName,
            baseUnit: goodInfo[0].baseUnit,
            goodPrice: goodInfo[0].goodPrice,
            goodTax: goodInfo[0].goodTax,
        });
    };

    render() {
        let {
            description,
            note,
            responsible,
            goods,
            returnRule,
            serviceLevelAgreement,
            customerCode,
            customerName,
            customerAddress,
            customerPhone,
            customerEmployee,
            returnRuleOfGood,
            serviceLevelAgreementOfGood,
            nameOfGood,
            baseUnitOfGood,
            priceOfGood,
            quantityOfGood,
            year,
            goodCode,
            goodName,
            goodPrice,
            baseUnit,
            goodTax,
        } = this.state;
        console.log(goodName);
        return (
            <React.Fragment>
                <ButtonModal
                    modalID={`modal-add-sales-order`}
                    button_name={"Đơn hàng mới"}
                    title={"Đơn hàng mới"}
                />
                <DialogModal
                    modalID={`modal-add-sales-order`}
                    isLoading={false}
                    formID={`form-add-sales-order`}
                    title={"Đơn hàng mới"}
                    msg_success={"Thêm đơn thành công"}
                    msg_faile={"Thêm đơn không thành công"}
                    // disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="75"
                    style={{ backgroundColor: "green" }}
                >
                    <DialogModal
                        modalID="modal-create-sales-order-sla"
                        isLoading={false}
                        formID="form-create-sales-order-sla"
                        title={"Chi tiết cam kết chất lượng"}
                        size="50"
                        hasSaveButton={false}
                        hasNote={false}
                    >
                        <form id="form-create-sales-order-sla">
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
                    <form id={`form-create-sales-order`}>
                        <div
                            className="row row-equal-height"
                            style={{ marginTop: -25 }}
                        >
                            <div
                                className="col-xs-12 col-sm-8 col-md-8 col-lg-8"
                                style={{ padding: 10 }}
                            >
                                <fieldset
                                    className="scheduler-border"
                                    style={{ borderRadius: "4px" }}
                                >
                                    <legend className="scheduler-border">
                                        Thông tin chung
                                    </legend>
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                        <div className="form-group">
                                            <label>
                                                Khách hàng
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <SelectBox
                                                id={`select-customer-code-quote`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={customerCode}
                                                items={[
                                                    {
                                                        value: "NVA_1875",
                                                        text: "NVA_1875",
                                                    },
                                                    {
                                                        value: "NVB_1789",
                                                        text: "NVB_1789",
                                                    },
                                                ]}
                                                onChange={
                                                    this.handleCustomerChange
                                                }
                                                multiple={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                        <div className="form-group">
                                            <label>
                                                Tên khách hàng{" "}
                                                <span className="attention">
                                                    {" "}
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={customerName}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div className="form-group">
                                            <label>
                                                Địa chỉ
                                                <span className="attention">
                                                    {" "}
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={customerAddress}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                        <div className="form-group">
                                            <label>
                                                Số điện thoại
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={customerPhone}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                        <div className="form-group">
                                            <label>
                                                Người liên hệ{" "}
                                                <span className="attention">
                                                    {" "}
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={customerEmployee}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div className="form-group">
                                            <label>
                                                Ghi chú
                                                <span className="attention">
                                                    {" "}
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={note}
                                            />
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div
                                className="col-xs-12 col-sm-4 col-md-4 col-lg-4"
                                style={{ padding: 10, height: "100%" }}
                            >
                                <fieldset
                                    className="scheduler-border"
                                    style={{ borderRadius: "4px" }}
                                >
                                    <legend className="scheduler-border">
                                        Đơn hàng
                                    </legend>
                                    <div className="form-group">
                                        <label>
                                            Mã đơn
                                            <span className="attention">
                                                {" "}
                                                *{" "}
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={"QUOTE_3593"}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Dự kiến giao hàng ngày</label>
                                        <DatePicker
                                            id="incident_after"
                                            // dateFormat={dateFormat}
                                            // value={startValue}
                                            onChange={this.handleChangeDate}
                                            disabled={false}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Hạn chót giao hàng</label>
                                        <DatePicker
                                            id="incident_after"
                                            // dateFormat={dateFormat}
                                            // value={startValue}
                                            onChange={this.handleChangeDate}
                                            disabled={false}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Nhân viên bán hàng
                                            <span className="attention">
                                                {" "}
                                                *{" "}
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={"Phạm Đại Tài"}
                                            disabled={true}
                                        />
                                    </div>
                                </fieldset>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset
                                    className="scheduler-border"
                                    style={{ padding: 10 }}
                                >
                                    <legend className="scheduler-border">
                                        Các mặt hàng
                                    </legend>
                                    <div
                                        className="col-xs-12 col-sm-4 col-md-4 col-lg-4"
                                        style={{ padding: 10, height: "100%" }}
                                    >
                                        <div className="form-group">
                                            <label>
                                                Mã sản phẩm
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <SelectBox
                                                id={`select-good-code-quote`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={goodCode}
                                                items={[
                                                    {
                                                        value: "SP_0943",
                                                        text: "SP_0943",
                                                    },
                                                    {
                                                        value: "SP_0349",
                                                        text: "SP_0349",
                                                    },
                                                    {
                                                        value: "SP_0344",
                                                        text: "SP_0344",
                                                    },
                                                ]}
                                                onChange={
                                                    this.handleGoodCodeChange
                                                }
                                                multiple={false}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Tên sản phẩm
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <SelectBox
                                                id={`select-good-name-quote`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={goodName}
                                                items={[
                                                    {
                                                        value: "Thuốc gà rù",
                                                        text: "Thuốc gà rù",
                                                    },
                                                    {
                                                        value: "Thuốc trị ghẻ",
                                                        text: "Thuốc trị ghẻ",
                                                    },
                                                    {
                                                        value:
                                                            "Kháng sinh bê con",
                                                        text:
                                                            "Kháng sinh bê con",
                                                    },
                                                ]}
                                                // onChange={this.handleGoodCodeChange}
                                                multiple={false}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Đơn vị tính
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <SelectBox
                                                id={`select-good-name-quote`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={baseUnit}
                                                items={[
                                                    {
                                                        value: "Gói",
                                                        text: "Gói",
                                                    },
                                                    {
                                                        value: "Hộp",
                                                        text: "Hộp",
                                                    },
                                                    {
                                                        value: "Thùng",
                                                        text: "Thùng",
                                                    },
                                                ]}
                                                // onChange={this.handleGoodCodeChange}
                                                multiple={false}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>
                                                Giá
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={goodPrice}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className="col-xs-12 col-sm-4 col-md-4 col-lg-4"
                                        style={{ padding: 10, height: "100%" }}
                                    >
                                        <div className="form-group">
                                            <label>
                                                Số lượng còn trong kho
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={"30 " + baseUnit}
                                                disabled={true}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Số lượng
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Thành tiền
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={`2,500,000 vnđ`}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Thuế{" "}
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <SelectBox
                                                id={`select-good-name-quote`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={goodName}
                                                items={[
                                                    {
                                                        value: "Thuế VAT : 10%",
                                                        text: "Thuế VAT : 10%",
                                                    },
                                                ]}
                                                // onChange={this.handleGoodCodeChange}
                                                multiple={false}
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="col-xs-12 col-sm-4 col-md-4 col-lg-4"
                                        style={{ padding: 10, height: "100%" }}
                                    >
                                        <div className="form-group">
                                            <label>
                                                Khuyến mãi{" "}
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <SelectBox
                                                id={`select-good-name-quote`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={goodName}
                                                items={[
                                                    {
                                                        value:
                                                            "Mua 1000 sản phẩm được tặng 10 sản phẩm",
                                                        text:
                                                            "Mua 1000 sản phẩm được tặng 10 sản phẩm",
                                                    },
                                                ]}
                                                // onChange={this.handleGoodCodeChange}
                                                multiple={false}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Tổng tiền
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={`6,500,000 vnđ`}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>
                                                Cam kế chất lượng
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <SelectBox
                                                id={`select-good-name-quote`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={goodName}
                                                items={[
                                                    {
                                                        value: "Cam kết 1",
                                                        text: "Cam kết 1",
                                                    },
                                                    {
                                                        value: "Cam kết 2",
                                                        text: "Cam kết 2",
                                                    },
                                                ]}
                                                // onChange={this.handleGoodCodeChange}
                                                multiple={false}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>
                                                Ghi chú
                                                <span className="attention">
                                                    {" "}
                                                    *{" "}
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={``}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div
                                            className={"pull-right"}
                                            style={{ padding: 10 }}
                                        >
                                            <button
                                                className="btn btn-success"
                                                style={{ marginLeft: "10px" }}
                                                disabled={
                                                    !this.isGoodsValidated()
                                                }
                                                onClick={this.handleAddGood}
                                            >
                                                Thêm mới
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                style={{ marginLeft: "10px" }}
                                                onClick={this.handleClearGood}
                                            >
                                                Xóa trắng
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hiển thị bảng */}
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th title={"STT"}>STT</th>
                                                <th title={"Mã sản phẩm"}>
                                                    Mã sản phẩm
                                                </th>
                                                <th title={"Tên sản phẩm"}>
                                                    Tên sản phẩm
                                                </th>
                                                <th title={"Đơn vị tính"}>
                                                    Đ/v tính
                                                </th>
                                                <th title={"Giá"}>Giá (vnđ)</th>
                                                <th title={"Số lượng"}>
                                                    Số lượng
                                                </th>
                                                <th title={"Thành tiền"}>
                                                    Thành tiền
                                                </th>
                                                <th title={"Khuyến mãi"}>
                                                    Khuyến mãi
                                                </th>
                                                <th title={"Thuế"}>Thuế</th>
                                                <th title={"Tổng tiền"}>
                                                    Tổng tiền
                                                </th>
                                                <th
                                                    title={"Cam kết chất lượng"}
                                                >
                                                    Cam kết chất lượng
                                                </th>
                                                <th title={"Ghi chú"}>
                                                    Ghi chú
                                                </th>
                                                <th title={"Hành động"}>
                                                    Hành động
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-edit-manage-by-stock`}>
                                            <tr>
                                                <td>1</td>
                                                <td>SP_0395</td>
                                                <td>Thuốc úm gà</td>
                                                <td>Hộp</td>
                                                <td>350,000</td>
                                                <td>10</td>
                                                <td>3,500,000</td>
                                                <td>0 vnđ</td>
                                                <td>350,000 vnđ (10%)</td>
                                                <td>3,850,000 vnđ</td>
                                                <td>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                        }}
                                                    >
                                                        <a
                                                            style={{
                                                                cursor:
                                                                    "pointer",
                                                            }}
                                                            data-toggle="modal"
                                                            data-backdrop="static"
                                                            href={
                                                                "#modal-create-sales-order-sla"
                                                            }
                                                        >
                                                            Chi tiết
                                                            <i className="fa fa-arrow-circle-right"></i>
                                                        </a>
                                                    </div>
                                                </td>
                                                <td></td>
                                                <td>
                                                    <a className="edit text-yellow">
                                                        <i className="material-icons">
                                                            edit
                                                        </i>
                                                    </a>
                                                    <a className="edit text-red">
                                                        <i className="material-icons">
                                                            delete
                                                        </i>
                                                    </a>
                                                </td>
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
                                                <td colSpan={3}></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

export default SalesOrderCreateForm;
