import React, { Component } from "react";
import QuoteManageTable from "./quoteManageTable";

class Quote extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <QuoteManageTable />
                </div>
            </div>
        );
    }
}

export default Quote;
