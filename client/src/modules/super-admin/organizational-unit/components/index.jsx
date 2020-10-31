import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DepartmentActions } from '../redux/actions';

import DepartmentTreeView from './organizationalUnitTreeView';

class ManageDepartment extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.props.get();
    }

    render() {
        return (
            <React.Fragment>
                <div className="box" style={{ minHeight: '450px' }}>
                    <div className="box-body">
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <DepartmentTreeView />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const getState = {
    get: DepartmentActions.get,
}

export default connect(null, getState)(withTranslate(ManageDepartment)); 
