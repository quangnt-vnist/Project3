import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import {
    DialogModal,
    ButtonModal,
    SelectBox,
} from "../../../../../common-components";

class PurchaseOrderEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: "",
            stock: "",
            responsible: "",
            goods: [],
            returnRule: "",
            serviceLevelAgreement: "",
            partner: "",
            returnRuleOfGood: "",
            serviceLevelAgreementOfGood: "",
            nameOfGood: "",
            baseUnitOfGood: "",
            priceOfGood: null,
            quantityOfGood: null,
            isChangeGood: false,
            goodId: "",
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data) {
            return {
                description: props.data.description,
                stock: props.data.stock,
                responsible: props.data.responsible,
                goods: props.data.goods,
                returnRule: props.data.returnRule,
                serviceLevelAgreement: props.data.serviceLevelAgreement,
                partner: props.data.partner,
            };
        }
    }

    format_curency(x) {
        x = x.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
        return x;
    }

    handleNameOfGoodChange = (e) => {
        this.setState({
            nameOfGood: e,
        });
    };

    handleBaseUnitOfGoodChange = (e) => {
        this.setState({
            baseUnitOfGood: e.target.value,
        });
    };

    handlePriceOfGoodChange = (e) => {
        this.setState({
            priceOfGood: e.target.value,
        });
    };

    handleQuantityOfGoodChange = (e) => {
        this.setState({
            quantityOfGood: e.target.value,
        });
    };

    handleReturnRuleOfGoodChange = (e) => {
        this.setState({
            returnRuleOfGood: e.target.value,
        });
    };

    handleServiceLevelAgreementOfGoodChange = (e) => {
        this.setState({
            serviceLevelAgreementOfGood: e.target.value,
        });
    };

    isGoodsValidated = () => {
        let {
            returnRuleOfGood,
            serviceLevelAgreementOfGood,
            nameOfGood,
            baseUnitOfGood,
            priceOfGood,
            quantityOfGood,
        } = this.state;
        if (
            returnRuleOfGood &&
            serviceLevelAgreementOfGood &&
            nameOfGood &&
            baseUnitOfGood &&
            priceOfGood &&
            quantityOfGood
        ) {
            return true;
        }
        return false;
    };

    handleAddGood = () => {
        let {
            returnRuleOfGood,
            serviceLevelAgreementOfGood,
            nameOfGood,
            baseUnitOfGood,
            priceOfGood,
            quantityOfGood,
            goods,
            goodId,
        } = this.state;
        let good = {};
        good.name = nameOfGood;
        good.price = priceOfGood;
        good.quantity = quantityOfGood;
        good.baseUnit = baseUnitOfGood;
        good.returnRule = returnRuleOfGood;
        good.serviceLevelAgreement = serviceLevelAgreementOfGood;

        goods = goods.map((item) => {
            if (item._id !== goodId) {
                return item;
            } else {
                return good;
            }
        });
        this.setState({
            goods,
            isChangeGood: false,
            returnRuleOfGood: "",
            serviceLevelAgreementOfGood: "",
            nameOfGood: "",
            baseUnitOfGood: "",
            priceOfGood: null,
            quantityOfGood: null,
            goodId: "",
        });
    };

    handleClearGood = (e) => {
        this.setState({
            returnRuleOfGood: "",
            serviceLevelAgreementOfGood: "",
            nameOfGood: "",
            baseUnitOfGood: "",
            priceOfGood: null,
            quantityOfGood: null,
        });
    };

    handleGoodEdit = (data) => {
        this.setState({
            isChangeGood: !this.state.isChangeGood,
            returnRuleOfGood: data.returnRuleOfGood,
            serviceLevelAgreementOfGood: data.serviceLevelAgreementOfGood,
            nameOfGood: data.nameOfGood,
            baseUnitOfGood: data.baseUnitOfGood,
            priceOfGood: data.priceOfGood,
            quantityOfGood: data.quantityOfGood,
            goodId: data._id,
        });
    };

    render() {
        let {
            description,
            stock,
            responsible,
            goods,
            returnRule,
            serviceLevelAgreement,
            partner,
            returnRuleOfGood,
            serviceLevelAgreementOfGood,
            nameOfGood,
            baseUnitOfGood,
            priceOfGood,
            quantityOfGood,
        } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-material-purchase-order`}
                    isLoading={false}
                    formID={`form-edit-material-purchase-order`}
                    title={"Chỉnh sửa đơn mua nguyên vật liệu"}
                    msg_success={"Chỉnh sửa thành công"}
                    msg_faile={"Chỉnh sửa không thành công"}
                    // disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="100"
                >
                    <form id={`form-edit-material-purchase-order`}>
                        <div
                            className="row row-equal-height"
                            style={{ marginTop: -25 }}
                        >
                            <div
                                className="col-xs-12 col-sm-6 col-md-6 col-lg-6"
                                style={{ padding: 10 }}
                            >
                                <div className="form-group">
                                    <label>
                                        Mô tả đơn{" "}
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        value={description}
                                        onChange={this.handleCodeChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        Quy tắc đổi trả chung
                                        <span className="attention"> </span>
                                    </label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        value={returnRule}
                                        onChange={this.handleCodeChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        Cam kết chất lượng chung
                                        <span className="attention"> </span>
                                    </label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        value={serviceLevelAgreement}
                                        onChange={this.handleCodeChange}
                                    />
                                </div>
                            </div>
                            <div
                                className="col-xs-12 col-sm-6 col-md-6 col-lg-6"
                                style={{ padding: 10 }}
                            >
                                <div className="form-group">
                                    <label>
                                        Nhà cung cấp
                                        <span className="attention"> * </span>
                                    </label>
                                    <SelectBox
                                        id={`select-partner-material-purchase-order`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={partner}
                                        items={[
                                            {
                                                value: "1",
                                                text: "Dương Đình A",
                                            },
                                            {
                                                value: "2",
                                                text: "Nguyễn Văn B",
                                            },
                                            { value: "3", text: "Trần Đình C" },
                                            { value: "4", text: "Đặng Văn X" },
                                        ]}
                                        onChange={this.handlePartnerChange}
                                        multiple={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        Chọn kho nhập hàng về
                                        <span className="attention"> * </span>
                                    </label>
                                    <SelectBox
                                        id={`select-stock-material-purchase-order`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={stock}
                                        items={[
                                            {
                                                value: "1",
                                                text: "Kho vật tư A1",
                                            },
                                            {
                                                value: "2",
                                                text: "Kho vật tư A2",
                                            },
                                            {
                                                value: "3",
                                                text: "Kho vật tư A3",
                                            },
                                            {
                                                value: "4",
                                                text: "Kho vật tư A4",
                                            },
                                        ]}
                                        onChange={this.handleStockChange}
                                        multiple={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        Người thực hiện mua hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <SelectBox
                                        id={`select-responsible-material-purchase-order`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={responsible}
                                        items={[
                                            {
                                                value: "1",
                                                text: "Dương Đình A",
                                            },
                                            {
                                                value: "2",
                                                text: "Nguyễn Văn B",
                                            },
                                            { value: "3", text: "Trần Đình C" },
                                            { value: "4", text: "Đặng Văn X" },
                                        ]}
                                        onChange={this.handleReponsibleChange}
                                        multiple={false}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset
                                    className="scheduler-border"
                                    style={{ padding: 10 }}
                                >
                                    <legend className="scheduler-border">
                                        Các mặt hàng nhập về
                                    </legend>
                                    {this.state.isChangeGood ? (
                                        <>
                                            <div
                                                className={
                                                    "col-xs-12 col-sm-12 col-md-6 col-lg-6"
                                                }
                                                style={{ padding: 10 }}
                                            >
                                                <div className="form-group">
                                                    <label>
                                                        Nguyên vật liệu cần nhập
                                                        <span className="attention">
                                                            {" "}
                                                            *{" "}
                                                        </span>
                                                    </label>
                                                    <SelectBox
                                                        id={`select-nameOfGood-material-purchase-order`}
                                                        className="form-control select2"
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        value={nameOfGood}
                                                        items={[
                                                            {
                                                                value:
                                                                    "Oxytetracyclin, HCL",
                                                                text:
                                                                    "Oxytetracyclin, HCL",
                                                            },
                                                            {
                                                                value:
                                                                    "Vitamin D3",
                                                                text:
                                                                    "Vitamin D3",
                                                            },
                                                            {
                                                                value:
                                                                    "Vitamin K3",
                                                                text:
                                                                    "Vitamin K3",
                                                            },
                                                            {
                                                                value:
                                                                    "Vitamin B2",
                                                                text:
                                                                    "Vitamin B2",
                                                            },
                                                            {
                                                                value:
                                                                    "L – Lysine",
                                                                text:
                                                                    "L – Lysine",
                                                            },
                                                            {
                                                                value:
                                                                    "DL – Methionin",
                                                                text:
                                                                    "DL – Methionin",
                                                            },
                                                            {
                                                                value:
                                                                    "Vitamin B6",
                                                                text:
                                                                    "Vitamin B6",
                                                            },
                                                            {
                                                                value:
                                                                    "Vitamin A",
                                                                text:
                                                                    "Vitamin A",
                                                            },
                                                        ]}
                                                        onChange={
                                                            this
                                                                .handleNameOfGoodChange
                                                        }
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
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="ví dụ: Hộp"
                                                        value={baseUnitOfGood}
                                                        onChange={
                                                            this
                                                                .handleBaseUnitOfGoodChange
                                                        }
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
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Nhập vào một số"
                                                        value={priceOfGood}
                                                        onChange={
                                                            this
                                                                .handlePriceOfGoodChange
                                                        }
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
                                                        placeholder="Nhập vào một số"
                                                        value={quantityOfGood}
                                                        onChange={
                                                            this
                                                                .handleQuantityOfGoodChange
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div
                                                className={
                                                    "col-xs-12 col-sm-12 col-md-6 col-lg-6"
                                                }
                                                style={{ padding: 10 }}
                                            >
                                                <div className="form-group">
                                                    <label>
                                                        Quy tắc đổi trả đối với
                                                        mặt hàng này
                                                        <span className="attention">
                                                            {" "}
                                                            *{" "}
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        type="text"
                                                        className="form-control"
                                                        value={returnRuleOfGood}
                                                        onChange={
                                                            this
                                                                .handleReturnRuleOfGoodChange
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>
                                                        Cam kết chất lượng đối
                                                        với mặt hàng này
                                                        <span className="attention">
                                                            {" "}
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            serviceLevelAgreementOfGood
                                                        }
                                                        onChange={
                                                            this
                                                                .handleServiceLevelAgreementOfGoodChange
                                                        }
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
                                                        style={{
                                                            marginLeft: "10px",
                                                        }}
                                                        disabled={
                                                            !this.isGoodsValidated()
                                                        }
                                                        onClick={
                                                            this.handleAddGood
                                                        }
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{
                                                            marginLeft: "10px",
                                                        }}
                                                        onClick={
                                                            this.handleClearGood
                                                        }
                                                    >
                                                        Xóa trắng
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                    {/* Hiển thị bảng */}
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th
                                                    title={
                                                        "Tên nguyên vật liệu"
                                                    }
                                                >
                                                    Tên nguyên vật liệu
                                                </th>
                                                <th title={"Giá (vnđ)"}>
                                                    Giá (vnđ)
                                                </th>
                                                <th title={"Số lượng"}>
                                                    Số lượng
                                                </th>
                                                <th title={"Đơn vị tính"}>
                                                    Đơn vị tính
                                                </th>
                                                <th title={"Quy tắc đổi trả"}>
                                                    Quy tắc đổi trả
                                                </th>
                                                <th
                                                    title={"Cam kết chất lượng"}
                                                >
                                                    Cam kết chất lượng
                                                </th>
                                                <th title={"Hành động"}>
                                                    Hành động
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-edit-manage-by-stock`}>
                                            {goods.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6}>
                                                        <center>
                                                            {
                                                                "Chưa có thông tin hàng nhập"
                                                            }
                                                        </center>
                                                    </td>
                                                </tr>
                                            ) : (
                                                goods.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.name}</td>
                                                        <td>
                                                            {this.format_curency(
                                                                item.price
                                                            )}
                                                        </td>
                                                        <td>
                                                            {this.format_curency(
                                                                item.quantity
                                                            )}
                                                        </td>
                                                        <td>{item.baseUnit}</td>
                                                        <td>
                                                            {item.returnRule}
                                                        </td>
                                                        <td>
                                                            {
                                                                item.serviceLevelAgreement
                                                            }
                                                        </td>
                                                        <td>
                                                            <a
                                                                className="edit text-yellow"
                                                                onClick={() =>
                                                                    this.handleGoodEdit(
                                                                        item
                                                                    )
                                                                }
                                                            >
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
                                                ))
                                            )}
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

export default PurchaseOrderEditForm;
