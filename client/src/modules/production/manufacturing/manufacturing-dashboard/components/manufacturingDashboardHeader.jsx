import React, { Component } from 'react';
import { DatePicker, SelectBox } from '../../../../../common-components';


class ManufacturingDashboardHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                <div className="form-inline">
                    <div className="form-group">
                        <label style={{ width: "auto" }}>Đơn vị thời gian</label>
                        <SelectBox id="selectBoxDay"
                            items={[
                                { value: '0', text: 'Tháng' },
                                { value: '1', text: 'Ngày' },
                                { value: '2', text: 'Tuần' },
                                { value: '3', text: 'Năm' },
                            ]}
                            style={{ width: "10rem" }}
                            onChange={this.handleSelectOrganizationalUnit}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ width: "auto" }}>Từ</label>
                        <DatePicker
                            id="monthStartInHome"
                            dateFormat="month-year"
                            value={"02-2020"}
                            onChange={this.handleSelectMonthStart}
                            disabled={false}
                        />
                    </div>

                    {/**Chọn ngày kết thúc */}
                    <div className="form-group">
                        <label style={{ width: "auto" }}>Đến</label>
                        <DatePicker
                            id="monthEndInHome"
                            dateFormat="month-year"
                            value={"10-2020"}
                            onChange={this.handleSelectMonthEnd}
                            disabled={false}
                        />
                    </div>

                    <div className="form-group">
                        <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={() => this.handleSunmitSearch()} >Tìm kiếm</button>
                    </div>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-file-text"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Số đơn sản xuất</span>
                                <span className="info-box-number">
                                    300
                                </span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-file"></i></span>
                            <div className="info-box-content" title="Số khen thưởng tháng/số khen thưởng năm" >
                                <span className="info-box-text">Số kế hoạch</span>
                                <span className="info-box-number">100</span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-blue"><i className="fa fa-file-text-o"></i></span>
                            <div className="info-box-content" title="Số khen thưởng tháng/số khen thưởng năm" >
                                <span className="info-box-text">Phiếu đề nghị mua NVL</span>
                                <span className="info-box-number">50</span>
                                <a href={`/manage-purchasing-request`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-orange"><i className="fa  fa-gavel"></i></span>
                            <div className="info-box-content" title="Số kỷ luật tháng/số kỷ luật năm">
                                <span className="info-box-text">Số lệnh sản xuất</span>
                                <span className="info-box-number">200</span>
                                <a href={`/manage-manufacturing-command`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-hourglass-half"></i></span>
                            <div className="info-box-content" title="Số nghỉ phép tháng/số nghỉ phép năm">
                                <span className="info-box-text">Số lệnh chậm tiến độ</span>
                                <span className="info-box-number">6</span>
                                <a href={`/manage-manufacturing-process`} target="_blank" >Xem thêm <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-exclamation"></i></span>
                            <div className="info-box-content" title="Số nghỉ phép tháng/số nghỉ phép năm">
                                <span className="info-box-text">Số lệnh quá hạn</span>
                                <span className="info-box-number">2</span>
                                <a href={`/manage-manufacturing-process`} target="_blank" >Xem thêm <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ManufacturingDashboardHeader;