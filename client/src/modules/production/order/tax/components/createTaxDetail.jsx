import React, { Component } from "react";
import { DialogModal } from "../../../../../common-components";

class CreateTaxDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goods: [],
            percent: "",
            key: "",
            goodsDeleted: [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data.key !== prevState.key) {
            return {
                ...prevState,
                goods: nextProps.data.goods,
                percent: nextProps.data.percent,
                key: nextProps.data.key,
                goodsDeleted: [],
            };
        } else {
            return null;
        }
    }

    handleDeleteGoodsTax = (item) => {
        let { goods, goodsDeleted } = this.state;
        goodsDeleted.push(item.value);

        let goodsFilter = goods.filter((element) => element.value !== item.value);
        this.setState({
            goods: goodsFilter,
            goodsDeleted,
        });
    };

    handlePercentChange = (e) => {
        this.setState({
            percent: e.target.value,
        });
    };

    submitChange = () => {
        let data = this.state;
        this.props.handleSubmitGoodChange(data);
    };

    render() {
        let { goods, percent } = this.state;
        const { translate } = this.props;
        return (
            <DialogModal
                modalID={`modal-create-tax-detail-good`}
                isLoading={false}
                formID={`form-create-tax-detail-good`}
                title={translate("manage_order.tax.detail_goods")}
                size="75"
                style={{ backgroundColor: "green" }}
                func={this.submitChange}
            >
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10 }}>
                    <div className="form-group">
                        <label>
                                    {translate("manage_order.tax.tax_percent")}
                            <span className="attention"> * </span>
                        </label>
                        <input type="number" className="form-control" placeholder="Nhập %" value={percent} onChange={this.handlePercentChange} />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 10 }}>
                    <table id={`order-table-tax-create`} className="table table-bordered">
                        <thead>
                            <tr>
                                <th title={"STT"}>{translate("manage_order.tax.index")}</th>
                                <th title={"Tên"}>{translate("manage_order.tax.code")}</th>
                                <th>{translate("manage_order.tax.name")}</th>
                                <th>{translate("manage_order.tax.action")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goods &&
                                goods.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.code}</td>
                                            <td>{item.name}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a
                                                    onClick={() => this.handleDeleteGoodsTax(item)}
                                                    className="delete red-yellow"
                                                    style={{ width: "5px" }}
                                                    title={translate("manage_order.tax.delete_good")}
                                                >
                                                    <i className="material-icons">delete</i>
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </DialogModal>
        );
    }
}

export default CreateTaxDetail;
