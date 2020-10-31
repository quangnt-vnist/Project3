import React, { Component } from "react";
import PurchaseOrderTable from "./purchaseOrderTable";
import "./purchaseOrder.css";

class PurchaseOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <PurchaseOrderTable />
                </div>
            </div>
        );
    }
}

export default PurchaseOrder;
