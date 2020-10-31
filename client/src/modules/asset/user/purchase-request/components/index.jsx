import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { PurchaseRequest } from './PurchaseRequest';

class RecommendProcure1 extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <PurchaseRequest />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(RecommendProcure1)); 
