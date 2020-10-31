import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from  'react-redux-multilingual';
import {PaginateBar,
    DataTableSetting,
    DeleteNotification, SelectBox, DatePicker} from '../../../../../common-components';
import data from '../../dataTest/salesOrderData.json';
import SalesOrderDetailForm from './salesOrderDetailForm';
import SalesOrderCreateForm from './salesOrderCreateForm';

class SalesOrderTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 5,
      page: 1,
      type: 'sales'
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      list: data
    }
  }

  handleTypeSaleOrder = () => {
 
    this.setState({
      type: 'sales'
    })
  }

  handleTypeQuotationOrder =  () =>{
    this.setState({
      type: 'quotation'
    })
  }
  
  handleShowDetailInfo = (data) => {
    this.setState(state => {
      return {
        ...state,
        currentRow: data
      }
    })
    window.$('#modal-detail-sales-order').modal('show');
  }

  handleChangeDate = () =>{

  }


  render() {
     let {list, limit, page, type} = this.state;

     const { translate } = this.props;

    let totalPages = 0;
      totalPages =
        list.length % limit === 0
          ? parseInt(list.length / limit)
          : parseInt(list.length / limit + 1);

    const priority= ["Thấp", "Trung bình", "Cao", "Đặc biệt"];

    let listFilter = list.filter((item) => {
      if (type === "sales" && item.type === "Đơn hàng kinh doanh"){
        return item;
      } else if (type === 'quotation' && item.type === "Đơn báo giá"){
        return item;
      }
    })
    return (
      <React.Fragment>
        {/* <div className="nav-tabs-custom"> */}
          <div className="box-body qlcv">
            {this.state.currentRow && 
            <SalesOrderDetailForm 
              data = {this.state.currentRow}
              type = {this.state.type}
            />}
            <SalesOrderCreateForm />
            <div className="form-inline">
              <div className="form-group">
                <label className="form-control-static">
                Tìm mã đơn mua
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  onChange={this.handleOrderCodeChange}
                  placeholder="Nhập vào mã đơn"
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label className="form-control-static">Trạng thái đơn</label>
                <SelectBox
                  id={`select-filter-status-material-purchase-order`}
                  className="form-control select2"
                  style={{ width: "100%" }}
                  items={[
                    { value: 'Chờ phê duyệt', text: 'Chờ phê duyệt'},
                    { value: 'Đã phê duyệt', text: 'Đã phê duyệt'},
                    { value: 'Chờ lấy hàng', text: 'Chờ lấy hàng'},
                    { value: 'Đang giao hàng', text: 'Đang giao hàng'},
                    { value: 'Đã hoàn thành', text: 'Đã hoàn thành'},
                    { value: 'Hủy đơn', text: 'Hủy đơn'},
                  ]}
                  onChange={this.handleStatusChange}
                />
            </div>
            </div>
            <div className="form-inline">
            <div className="form-group">
                <label className="form-control-static">Bắt đầu giao hàng từ</label>
                <DatePicker
                    id="monthEndInHome"
                    dateFormat="month-year"
                    value={"10-2020"}
                    onChange={this.handleChangeDate}
                    disabled={false}
                />
            </div>
            <div className="form-group">
                <label className="form-control-static">Đến</label>
                <DatePicker
                    id="monthEndInHome"
                    dateFormat="month-year"
                    value={"10-2020"}
                    onChange={this.handleChangeDate}
                    disabled={false}
                />
            </div>
            </div>
            <div className="form-inline">
            <div className="form-group">
                <label className="form-control-static">Hạn chót giao hàng</label>
                <DatePicker
                    id="monthEndInHome"
                    dateFormat="month-year"
                    value={"10-2020"}
                    onChange={this.handleChangeDate}
                    disabled={false}
                />
            </div>
            <div className="form-group">
                <label className="form-control-static">Đến</label>
                <DatePicker
                    id="monthEndInHome"
                    dateFormat="month-year"
                    value={"10-2020"}
                    onChange={this.handleChangeDate}
                    disabled={false}
                />
            </div>
            </div>
            <div className="form-inline">
            <div className="form-group">
                <label className="form-control-static">Độ ưu tiên</label>
                <SelectBox
                  id={`select-filter-status-material-purchase-order`}
                  className="form-control select2"
                  style={{ width: "100%" }}
                  items={[
                    { value: 'Thấp', text: 'Thấp'},
                    { value: 'Trung bình', text: 'Trung bình'},
                    { value: 'Cao', text: 'Cao'},
                    { value: 'Đặc biệt', text: 'Đặc biệt'}
                  ]}
                  onChange={this.handleStatusChange}
                />
                </div>
              <div className="form-group">
                   <label className="form-control-static"></label>
                <button
                  type="button"
                  className="btn btn-success"
                  title="Lọc"
                  onClick={this.handleSubmitSearch}
                >
                  Tìm kiếm
                </button>
              </div>

            </div>

            <table
              id={`order-table-${type}`}
              className="table table-striped table-bordered table-hover"
              style={{marginTop: 20}}
            >
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã đơn</th>
                  {type==='sales' ? <th>Độ ưu tiên</th>: '' }
                  <th>Trạng thái</th>
                  <th>Người tạo</th>
                  <th>Khách hàng</th>
                  {type==='sales' ? <th>Ngày bắt đầu giao hàng</th>: <th>Báo giá có hiệu lực từ ngày</th> }
                  {type==='sales' ? <th>Hạn chót giao hàng</th>: <th>Báo giá hết hiệu lực ngày</th> }
                  <th style={{ width: "120px", textAlign: "center" }}>
                    {translate("table.action")}
                    <DataTableSetting
                      tableId="purchase-order-table"
                      columnArr={[
                        "STT",
                        "Nội dung mua hàng",
                        "Trạng thái",
                        "Người tạo",
                      ]}
                      limit={limit}
                      setLimit={this.setLimit}
                      hideColumnOption={true}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {typeof listFilter !== "undefined" &&
                  listFilter.length !== 0 && type==='sales' &&
                  listFilter.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1 + (page - 1) * limit}</td>
                      <td>{item.code}</td>
                      <td className={item.priority===1 ? 'text-primary' : 'text-danger'}>{priority[item.priority]}</td>
                      <td className={item.status === "Đã hoàn thành" ? 'text-success' : 'text-warning'}>{item.status}</td>
                      <td>{item.creator}</td>
                      <td>{item.customer}</td>
                      <td>{item.deliveryStartDate}</td>
                      <td>{item.deliveryEndDate}</td>
                      <td style={{ textAlign: "center" }}>
                      <a className="text-green" onClick={() => this.handleShowDetailInfo(item)}>
                        <i className="material-icons">visibility</i>
                        </a>
                        <a
                          onClick={() => this.handleEdit(item)}
                          className="edit text-yellow"
                          style={{ width: "5px" }}
                          title="Sửa đơn"
                        >
                          <i className="material-icons">edit</i>
                        </a>
                        <DeleteNotification
                          content={"Xóa đơn hàng"}
                          data={{
                            info: 'Bạn có chắc chắn muốn xóa đơn: ' + item.code
                          }}
                          func={()=>this.deletePurchaseOrder(item._id)}
                        />
                      </td>
                    </tr>
                  ))}
                {typeof listFilter !== "undefined" &&
                  listFilter.length !== 0 && type==='quotation' &&
                  listFilter.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1 + (page - 1) * limit}</td>
                      <td>{item.code}</td>
                      <td>{item.status}</td>
                      <td>{item.creator}</td>
                      <td>{item.customer}</td>
                      <td>{item.effectiveDate}</td>
                      <td>{item.expirationDate}</td>
                      <td style={{ textAlign: "center" }}>
                      <a className="text-green" onClick={() => this.handleShowDetailInfo(item)}>
                        <i className="material-icons">visibility</i>
                        </a>
                        <a
                          onClick={() => this.handleEdit(item)}
                          className="edit text-yellow"
                          style={{ width: "5px" }}
                          title="Sửa đơn"
                        >
                          <i className="material-icons">edit</i>
                        </a>
                        <DeleteNotification
                          content={"Xóa đơn hàng"}
                          data={{
                            info: 'Bạn có chắc chắn muốn xóa đơn: ' + item.code
                          }}
                          func={()=>this.deletePurchaseOrder(item._id)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <PaginateBar
              pageTotal={totalPages ? totalPages : 0}
              currentPage={page}
              func={this.setPage}
            />
          </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}

export default connect(null, null)(withTranslate(SalesOrderTable));