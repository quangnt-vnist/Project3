import React, { Component } from 'react';

import { CompanyTable } from './companyTable';

class Company extends Component {

    constructor(props) {
        super(props);

        this.state = { 
         }
    }

    render() {
        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <CompanyTable/>
                </div>
            </div>
         );
    }
}

export { Company }