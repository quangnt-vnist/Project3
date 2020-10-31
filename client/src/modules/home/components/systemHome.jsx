import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class SystemHome extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {

        console.log("Message: ", this.state);

        return (
            <React.Fragment>
                <div className="qlcv">
                   
                </div>
            </React.Fragment>
        );
    }
}

export default SystemHome = connect()(withTranslate(SystemHome));