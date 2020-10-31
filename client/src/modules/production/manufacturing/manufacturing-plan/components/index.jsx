import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LazyLoadComponent, forceCheckOrVisible } from '../../../../../common-components';
import ManufacturingOrderList from './manufacturing-order';
import ManufacturingPLanList from './manufacturing-plan';
class ManufacturingPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#list-manufacturing-plan" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Kế hoạch sản xuất</a></li>
                    <li ><a href="#list-manufacturing-order" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Đơn hàng sản xuất</a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="list-manufacturing-plan">
                        <LazyLoadComponent
                        >
                            <ManufacturingPLanList />
                        </LazyLoadComponent>
                    </div>
                    <div className="tab-pane" id="list-manufacturing-order">
                        <LazyLoadComponent
                        >
                            <ManufacturingOrderList />
                        </LazyLoadComponent>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(null, null)(withTranslate(ManufacturingPlan));