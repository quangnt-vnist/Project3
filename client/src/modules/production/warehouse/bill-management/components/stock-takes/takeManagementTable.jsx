import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import TakeDetailForm from './takeDetailForm';

import { SelectMulti, DatePicker, DataTableSetting } from '../../../../../../common-components/index';

class TakeManagementTable extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleShowDetailInfo = async () => {
        window.$('#modal-detail-take').modal('show');
    }

    render() {

        const { translate } = this.props;

        return (
                    <div className="box-body qlcv">
                    {/* <GoodCreateForm type={ type } />
                    {
                        this.state.currentRow &&
                        <GoodEditForm
                            goodId={this.state.currentRow._id}
                            code={this.state.currentRow.code}
                            name={this.state.currentRow.name}
                            type={this.state.currentRow.type}
                            category={this.state.currentRow.category}
                            baseUnit={this.state.currentRow.baseUnit}
                            units={this.state.currentRow.units}
                            materials={this.state.currentRow.materials}
                            description={this.state.currentRow.description}
                        />
                    }

                    {
                        this.state.currentRow &&
                        <GoodDetailForm
                            goodId={this.state.currentRow._id}
                            code={this.state.currentRow.code}
                            name={this.state.currentRow.name}
                            type={this.state.currentRow.type}
                            category={this.state.currentRow.category}
                            baseUnit={this.state.currentRow.baseUnit}
                            units={this.state.currentRow.units}
                            materials={this.state.currentRow.materials}
                            description={this.state.currentRow.description}
                        />
                    } */}
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.stock')}</label>
                            <SelectMulti
                                id={`select-multi-stock-take`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Tổng các kho", allSelectedText: "Tổng các kho" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: "Kho Tạ Quang Bửu"},
                                    { value: '2', text: "Kho Trần Đại Nghĩa"},
                                    { value: '3', text: "Kho Đại Cồ Việt"},
                                    { value: '4', text: "Kho Lê Thanh Nghị"},
                                ]}
                                onChange={this.handleCategoryChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.creator')}</label>
                            <SelectMulti
                                id={`select-multi-creator-take`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn người tạo", allSelectedText: "Chọn tất cả" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: "Nguyễn Văn Thắng"},
                                    { value: '2', text: "Phạm Đại Tài"},
                                    { value: '3', text: "Nguyễn Anh Phương"},
                                    { value: '4', text: "Kho Lê Thanh Nghị"},
                                ]}
                                onChange={this.handleCategoryChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.code')}</label>
                            <input type="text" className="form-control" name="name" onChange={this.handleNameChange} placeholder={translate('manage_warehouse.bill_management.code')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.type')}</label>
                            <SelectMulti
                                id={`select-multi-type-take`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn loại phiếu", allSelectedText: "Chọn tất cả" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: "Phiếu kiểm kê định kì"},
                                    { value: '2', text: "Phiếu kiểm kê đột xuất"},
                                ]}
                                onChange={this.handleCategoryChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.from_date')}</label>
                            <DatePicker
                                id="purchase-month"
                                dateFormat="month-year"
                                value=""
                                onChange={this.handlePurchaseMonthChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.to_date')}</label>
                            <DatePicker
                                id="purchase-month"
                                dateFormat="month-year"
                                value=""
                                onChange={this.handlePurchaseMonthChange}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.bill_management.search')}</button>
                        </div>
                    </div>
                    <TakeDetailForm />

                        <table id={`good-table`} className="table table-striped table-bordered table-hover" style={{marginTop: '15px'}}>
                            <thead>
                                <tr>
                                    <th rowSpan="2" style={{ width: '5%', textAlign: 'center', verticalAlign: 'middle' }}>{translate('manage_warehouse.bill_management.index')}</th>
                                    <th>{translate('manage_warehouse.bill_management.code')}</th>
                                    <th>{translate('manage_warehouse.bill_management.type')}</th>
                                    <th>{translate('manage_warehouse.bill_management.creator')}</th>
                                    <th>{translate('manage_warehouse.bill_management.date')}</th>
                                    <th>{translate('manage_warehouse.bill_management.stock')}</th>
                                    <th>{translate('manage_warehouse.bill_management.description')}</th>
                                    <th rowSpan="2" style={{ width: '120px', textAlign: 'center', verticalAlign: 'middle' }}>{translate('table.action')}
                                    <DataTableSetting
                                            tableId={`good-table`}
                                            columnArr={[
                                                translate('manage_warehouse.bill_management.index'),
                                                translate('manage_warehouse.bill_management.code'),
                                                translate('manage_warehouse.bill_management.creator'),
                                                translate('manage_warehouse.bill_management.date'),
                                                translate('manage_warehouse.bill_management.stock'),
                                                translate('manage_warehouse.bill_management.description')
                                            ]}
                                            limit={this.state.limit}
                                            setLimit={this.setLimit}
                                            hideColumnOption={true}
                                        />
                                    </th>
                                </tr>
                                <tr>
                                            <th style={{padding: '2px'}}><input style={{width: '100%'}} /></th>
                                            <th style={{padding: '2px'}}><input style={{width: '100%'}} /></th>
                                            <th style={{padding: '2px'}}><input style={{width: '100%'}} /></th>
                                            <th style={{padding: '2px'}}><input style={{width: '100%'}} /></th>
                                            <th style={{padding: '2px'}}><input style={{width: '100%'}} /></th>
                                            <th style={{padding: '2px'}}><input style={{width: '100%'}} /></th>
                                        </tr>
                            </thead>
                            <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>BR012</td>
                                            <td>Phiếu kiểm kê định kì</td>
                                            <td>Nguyễn Văn Thắng</td>
                                            <td>05-10-2020</td>
                                            <td>Tạ Quang Bửu</td>
                                            <td>Nhập kho nguyên vật liệu</td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailInfo()}><i className="material-icons">visibility</i></a>
                                                <a onClick={() => this.handleEdit()} className="text-yellow" ><i className="material-icons">edit</i></a>
                                                <a className="text-black" onClick={() => this.handleShow()}><i className="material-icons">print</i></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>BI025</td>
                                            <td>Phiếu kiểm kê đột xuất</td>
                                            <td>Nguyễn Văn Thắng</td>
                                            <td>06-10-2020</td>
                                            <td>Đại Cồ Việt</td>
                                            <td>Xuất bán sản phẩm</td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailInfo()}><i className="material-icons">visibility</i></a>
                                                <a onClick={() => this.handleEdit()} className="text-yellow" ><i className="material-icons">edit</i></a>
                                                <a className="text-black" onClick={() => this.handleShow()}><i className="material-icons">print</i></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>BI025</td>
                                            <td>Phiếu kiểm kê đột xuất</td>
                                            <td>Phạm Đại Tài</td>
                                            <td>06-10-2020</td>
                                            <td>Đại Cồ Việt</td>
                                            <td>Xuất bán sản phẩm</td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailInfo()}><i className="material-icons">visibility</i></a>
                                                <a onClick={() => this.handleEdit()} className="text-yellow" ><i className="material-icons">edit</i></a>
                                                <a className="text-black" onClick={() => this.handleShow()}><i className="material-icons">print</i></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>BI025</td>
                                            <td>Phiếu kiểm kê định kì</td>
                                            <td>Nguyễn Anh Phương</td>
                                            <td>06-10-2020</td>
                                            <td>Tạ Quang Bửu</td>
                                            <td>Xuất bán sản phẩm</td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailInfo()}><i className="material-icons">visibility</i></a>
                                                <a onClick={() => this.handleEdit()} className="text-yellow" ><i className="material-icons">edit</i></a>
                                                <a className="text-black" onClick={() => this.handleShow()}><i className="material-icons">print</i></a>
                                            </td>
                                        </tr>
                            </tbody>
                        </table>
                    </div>
        );
    }
    
}

const mapStateToProps = state => state;
export default connect(mapStateToProps, null)(withTranslate(TakeManagementTable));
