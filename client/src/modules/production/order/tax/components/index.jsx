import React, { Component } from "react";
import TaxManagementTable from "./taxManagementTable";

class Tax extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <TaxManagementTable />
                </div>
            </div>
        );
    }
}

export default Tax;
