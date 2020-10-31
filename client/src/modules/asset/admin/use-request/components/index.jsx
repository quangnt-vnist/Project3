import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { UseRequestManager } from './UseRequestManager';

class ManagerRecommendDistribute extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <UseRequestManager />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ManagerRecommendDistribute)); 
