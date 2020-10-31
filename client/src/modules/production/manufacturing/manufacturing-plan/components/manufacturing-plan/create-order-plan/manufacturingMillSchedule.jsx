import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, SelectMulti } from '../../../../../../../common-components';
import ManufacturingSchedule from '../../../../manufacturing-schedule/components';

class ManufacturingMillSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { id } = this.props;
        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        let defaultEndMonth = [month, year].join('-');
        let defaultStartMonth = ['01', year].join('-');
        return (
            <div id={id} className="tab-pane qlcv">
                <div className="form-inline">
                    <div className="form-group">
                        <label style={{ width: 'auto' }}>Xưởng</label>
                        <SelectMulti id="multiSelectOrganizationalUnit"
                            items={[
                                { value: '1', text: 'Xưởng thuốc bột' },
                                { value: '2', text: 'Xưởng thuốc nước' },
                                { value: '3', text: 'Xưởng thực phẩm chức năng' },
                            ]}
                            options={{ nonSelectedText: "Tất cả các xưởng", allSelectedText: "Tất cả các xưởng" }}
                            onChange={this.handleSelectOrganizationalUnit}
                        >
                        </SelectMulti>
                    </div>
                    <div className="form-group">
                        <label style={{ width: "auto" }}>Từ</label>
                        <DatePicker
                            id="monthStartInHome"
                            dateFormat="month-year"
                            value={defaultStartMonth}
                            onChange={this.handleSelectMonthStart}
                            disabled={false}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ width: "auto" }}>Đến</label>
                        <DatePicker
                            id="monthEndInHome"
                            dateFormat="month-year"
                            value={defaultEndMonth}
                            onChange={this.handleSelectMonthEnd}
                            disabled={false}
                        />
                    </div>

                    <div className="form-group">
                        <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={() => this.handleSunmitSearch()} >Tìm kiếm</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Lịch sản xuất xưởng thuốc nước từ 1/2020 đến 10/2020</div>
                            </div>
                            <ManufacturingSchedule
                                startMonth={"2020-02"}
                                endMonth={"2020-10"}
                                home={true}
                                idSelect="4"
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Lịch sản xuất xưởng thuốc bột từ 1/2020 đến 10/2020</div>
                            </div>
                            <ManufacturingSchedule
                                startMonth={"2020-02"}
                                endMonth={"2020-10"}
                                home={true}
                                idSelect="5"
                            />
                        </div>

                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Lịch sản xuất xưởng thực phẩm chức năng từ 1/2020 đến 10/2020</div>
                            </div>
                            <ManufacturingSchedule
                                startMonth={"2020-1"}
                                endMonth={"2020-10"}
                                home={true}
                                idSelect="6"
                            />
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}
export default connect(null, null)(withTranslate(ManufacturingMillSchedule));