import React, { Component } from 'react';
import { connect } from 'react-redux';
import ManufacturingDashboardHeader from './manufacturingDashboardHeader';
import ManufacturingOrderPieChart from './manufacturingOrderPieChart';
import PlanPieChart from './planPieChart';
import CommandPieChart from './commandPieChart';
import ManufacturingQuantityChart from './manufacturingQuantityChart';
import TopTenProductBarChart from './topTenProductBarChart';
import TopTenCommandBarChart from './topTenCommandBarChart';
import FluctuatingProductLineChart from './fluctuatingProductLineChart';
import PurchasingRequestPieChart from './purchasingRequestPieChart'
class ManufacturingDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                <div className="qlcv">
                    <ManufacturingDashboardHeader />
                    <div className="row">
                        <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                            <ManufacturingOrderPieChart />
                        </div>

                        <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                            <PlanPieChart />
                        </div>
                        <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                            <CommandPieChart />
                        </div>
                        <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                            <PurchasingRequestPieChart />
                        </div>
                    </div>
                    <div className="row">
                        <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                            <TopTenProductBarChart />
                        </div>
                        <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                            <TopTenCommandBarChart />
                        </div>
                    </div>
                    {/* <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                            <ManufacturingQuantityChart />
                        </div> */}
                    <div className="row">
                        <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                            <FluctuatingProductLineChart />
                        </div>
                    </div>
                </div>
            </React.Fragment >
        );
    }
}
export default connect(null, null)((ManufacturingDashboard));