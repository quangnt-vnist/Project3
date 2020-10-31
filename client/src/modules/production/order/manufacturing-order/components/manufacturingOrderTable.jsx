import React, { Component } from "react";
import {
    PaginateBar,
    DataTableSetting,
    DeleteNotification,
    SelectBox,
    DatePicker,
} from "../../../../../common-components";

import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import dataManufacturing from "../../dataTest/manufacturingOrderData.json";
import ManufacturingOrderCreateForm from "./manufacturingOrderCreateForm";
import ManufacturingOrderDetailForm from "./manufacturingOrderDetailForm";

class ManufacturingOrderTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            page: 1,
        };
    }

    static getDerivedStateFromProps(props, state) {
        return {
            list: dataManufacturing,
        };
    }

    handleShowDetailInfo = (data) => {
        this.setState({
            currentRow: data,
        });
        window.$("#modal-show-detail-manufacturing-order").modal("show");
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
                    <ManufacturingOrderCreateForm />
                    {this.state.currentRow ? (
                        <ManufacturingOrderDetailForm />
                    ) : (
                        ""
                    )}
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">
                                Tìm mã đơn
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
                                        value: "Đang sản xuất",
                                        text: "Đang sản xuất",
                                    },
                                    {
                                        value: "Đã nhập kho",
                                        text: "Đã nhập kho",
                                    },
                                ]}
                                onChange={this.handleStatusChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">
                                Hạn hoàn thành từ
                            </label>
                            <DatePicker
                                id="monthEndInHome"
                                dateFormat="month-year"
                                value={"10-2020"}
                                onChange={this.handleChangeDate}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Đến</label>
                            <DatePicker
                                id="monthEndInHome"
                                dateFormat="month-year"
                                value={"10-2020"}
                                onChange={this.handleChangeDate}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">
                                Loại đơn
                            </label>
                            <SelectBox
                                id={`select-filter-status-material-purchase-order`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    {
                                        value: "Đơn đề nghị",
                                        text: "Đơn đề nghị",
                                    },
                                    {
                                        value: "Đơn sản xuất",
                                        text: "Đơn sản xuất",
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
                                <th>Loại đơn</th>
                                <th>Hạn hoàn thành</th>
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
                                        <td>{item.type}</td>
                                        <td>{item.deadline}</td>
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

export default connect(null, null)(withTranslate(ManufacturingOrderTable));
