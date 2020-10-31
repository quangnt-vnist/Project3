import React, { Component } from "react";
import SalesOrderTable from "./salesOrderTable";

class SalesOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <SalesOrderTable />
                </div>
            </div>
        );
    }
}

export default SalesOrder;
