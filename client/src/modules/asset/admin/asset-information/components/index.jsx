import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AssetManagement } from './combinedContent';

class AssetManager extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <AssetManagement />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(AssetManager)); 
