import React, { Component } from "react";
import ManufacturingOrderTable from "./manufacturingOrderTable";

class ManufacturingOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <ManufacturingOrderTable />
                </div>
            </div>
        );
    }
}

export default ManufacturingOrder;
