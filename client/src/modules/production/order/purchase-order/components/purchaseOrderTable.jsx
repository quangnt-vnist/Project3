import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import {
    PaginateBar,
    DataTableSetting,
    DeleteNotification,
    SelectBox,
} from "../../../../../common-components";

import data from "../../dataTest/PurchaseOrderData.json";
import PurchaseDetailForm from "./purchaseOrderDetailForm";
import PurchaseOrderCreateForm from "./purchaseOrderCreateForm";
import PurchaseOrderEditForm from "./purchaseOrderEditForm";

class PurchaseOrderTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            page: 1,
        };
    }

    static getDerivedStateFromProps(props, state) {
        return {
            list: data,
        };
    }

    handleShowDetailInfo = (data) => {
        this.setState((state) => {
            return {
                ...state,
                currentRow: data,
            };
        });
        window.$("#modal-detail-material-purchase-order").modal("show");
    };

    deletePurchaseOrder = (_id) => {
        let { list } = this.state;
        list = list.filter((item) => item._id !== _id);

        this.setState((state) => {
            return {
                ...state,
                list,
            };
        });

        console.log("st", this.state);
    };

    handleEdit = (data) => {
        this.setState((state) => {
            return {
                ...state,
                editRow: data,
            };
        });
        window.$("#modal-edit-material-purchase-order").modal("show");
    };

    render() {
        let { list, limit, page } = this.state;
        console.log("sss", this.state.editRow);

        const { translate } = this.props;

        let totalPages = 0;
        totalPages =
            list.length % limit === 0
                ? parseInt(list.length / limit)
                : parseInt(list.length / limit + 1);

        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <PurchaseOrderCreateForm />
                    {this.state.currentRow && (
                        <PurchaseDetailForm data={this.state.currentRow} />
                    )}
                    {this.state.editRow && (
                        <PurchaseOrderEditForm data={this.state.editRow} />
                    )}
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">
                                Tìm mã đơn mua
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="code"
                                onChange={this.handleOrderCodeChange}
                                placeholder="Nhập vào mã đơn"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">
                                Trạng thái đơn
                            </label>
                            <SelectBox
                                id={`select-filter-status-material-purchase-order`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    {
                                        value: "Chờ phê duyệt",
                                        text: "Chờ phê duyệt",
                                    },
                                    {
                                        value: "Đã phê duyệt",
                                        text: "Đã phê duyệt",
                                    },
                                    {
                                        value: "Đang mua hàng",
                                        text: "Đang mua hàng",
                                    },
                                    {
                                        value: "Đã hoàn thành",
                                        text: "Đã hoàn thành",
                                    },
                                    {
                                        value: "Đã nhập kho",
                                        text: "Đã nhập kho",
                                    },
                                ]}
                                onChange={this.handleStatusChange}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                className="btn btn-success"
                                title="Lọc"
                                onClick={this.handleSubmitSearch}
                            >
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                    <table
                        id="order-table"
                        className="table table-striped table-bordered table-hover"
                        style={{ marginTop: 20 }}
                    >
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn</th>
                                <th>Trạng thái</th>
                                <th>Người tạo</th>
                                <th
                                    style={{
                                        width: "120px",
                                        textAlign: "center",
                                    }}
                                >
                                    {translate("table.action")}
                                    <DataTableSetting
                                        tableId="purchase-order-table"
                                        columnArr={[
                                            "STT",
                                            "Nội dung mua hàng",
                                            "Trạng thái",
                                            "Người tạo",
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {typeof list !== "undefined" &&
                                list.length !== 0 &&
                                list.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            {index + 1 + (page - 1) * limit}
                                        </td>
                                        <td>{item.code}</td>
                                        <td>{item.status}</td>
                                        <td>{item.creator}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a
                                                className="text-green"
                                                onClick={() =>
                                                    this.handleShowDetailInfo(
                                                        item
                                                    )
                                                }
                                            >
                                                <i className="material-icons">
                                                    visibility
                                                </i>
                                            </a>
                                            <a
                                                onClick={() =>
                                                    this.handleEdit(item)
                                                }
                                                className="edit text-yellow"
                                                style={{ width: "5px" }}
                                                title="Sửa đơn"
                                            >
                                                <i className="material-icons">
                                                    edit
                                                </i>
                                            </a>
                                            <DeleteNotification
                                                content={translate(
                                                    "Xóa đơn nhập nguyên vật liệu"
                                                )}
                                                data={{
                                                    info:
                                                        "Bạn có chắc chắn muốn xóa đơn: " +
                                                        item.code,
                                                }}
                                                func={() =>
                                                    this.deletePurchaseOrder(
                                                        item._id
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <PaginateBar
                        pageTotal={totalPages ? totalPages : 0}
                        currentPage={page}
                        func={this.setPage}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(PurchaseOrderTable));
