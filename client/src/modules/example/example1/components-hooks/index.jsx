import React from 'react';

import { withTranslate } from "react-redux-multilingual";

import ExampleManagementTable from './exampleManagementTable';

function ExampleManagement() {
    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                <ExampleManagementTable />
            </div>
        </div>
    );
}

export default (withTranslate(ExampleManagement));