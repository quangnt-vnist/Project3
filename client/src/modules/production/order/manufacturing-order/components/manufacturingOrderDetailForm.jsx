import React, { Component } from 'react';
import {connect} from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';

class ManufacturingOrderDetailForm extends Component {
  constructor(props) {
    super(props);
    
  }

  format_curency(x) {
    x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
    x = x.replace(pattern, "$1,$2");
  return x;
  }
  
  render() {

    return (
      <React.Fragment>

      <DialogModal
          modalID="modal-show-detail-manufacturing-order" isLoading={false}
          formID="form-show-detail-manufacturing-order"
          title={'Chi tiết đơn sản xuất'}
          size='50'
          hasSaveButton={false}
          hasNote={false}
      >
        <div className="row row-equal-height" style={{ marginTop: -25 }} >
        <div className={"col-xs-12 col-sm-12 col-md-12 col-lg-12"} style={{borderWidth: '0px 1px 1px 1px', borderStyle: 'solid', padding: '10px',}}>
            <div className={"col-xs-12 col-sm-12 col-md-6 col-lg-6"} style={{padding: '0px 10px 0px 0px'}}>
                <div style={{display: 'flex'}}>
                    <div className='quote-detail-info-left'>Mã đơn: </div>
                    <div className='quote-detail-info-right'>MO_1908</div>
                </div>
                <div style={{display: 'flex'}}>
                    <div className='quote-detail-info-left'>Loại đơn: </div>
                    <div className='quote-detail-info-right'>Sản xuất từ đơn kinh doanh</div>
                </div>
                <div style={{display: 'flex'}}>
                    <div className='quote-detail-info-left'>Trạng thái đơn: </div>
                    <div className='quote-detail-info-right'>Đề nghị</div>
                </div>
                <div style={{display: 'flex'}}>
                    <div className='quote-detail-info-left'>Độ ưu tiên: </div>
                    <div className='quote-detail-info-right'>Cao</div>
                </div>
                <div style={{display: 'flex'}}>
                    <div className='quote-detail-info-left'>Các đơn kinh doanh: </div>
                    <div className='quote-detail-info-right'>
                        <ul>
                            <li style={{cursor:'pointer'}}><a>Đơn 1 <i className="fa fa-arrow-circle-right"></i></a></li>
                            <li style={{cursor:'pointer'}}><a>Đơn 2 <i className="fa fa-arrow-circle-right"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div> 
            <div className={"col-xs-12 col-sm-12 col-md-6 col-lg-6"} style={{padding: '0px 0px 0px 10px'}}>
                <div style={{display: 'flex'}}>
                    <div className='quote-detail-info-left'>Người tạo: </div>
                    <div className='quote-detail-info-right'>Phạm Đại Tài</div>
                </div>
                <div style={{display: 'flex'}}>
                    <div className='quote-detail-info-left'>Người phê duyệt: </div>
                    <div className='quote-detail-info-right'>Chưa được phê duyệt</div>
                </div>
                <div style={{display: 'flex'}}>
                    <div className='quote-detail-info-left'>Tạo lúc: </div>
                    <div className='quote-detail-info-right'>01/10/2020</div>
                </div>
                <div style={{display: 'flex'}}>
                    <div className='quote-detail-info-left'>Hạn hoàn thành: </div>
                    <div className='quote-detail-info-right'>10/10/2020</div>
                </div>
                <div style={{display: 'flex'}}>
                    <div className='quote-detail-info-left'>Ghi chú: </div>
                    <div className='quote-detail-info-right'>Báo giá chỉ áp dụng với khách hàng nhận được báo giá này</div>
                </div>
            </div> 
        </div>

        <div className={"col-xs-12 col-sm-12 col-md-12 col-lg-12"} style={{borderWidth: '0px 1px 1px 1px', borderStyle: 'solid', padding: '10px',}}>
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên sản phẩm</th>
                        <th>Mã sản phẩm</th>
                        <th>Đ/v tính</th>
                        <th>Số lượng</th>
                        <th>Số lượng đã sản xuất</th>
                        <th>Số lượng nhập kho</th>
                        <th>Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Thuốc úm gà</td>
                        <td>SP_0395</td>
                        <td>Hộp</td>
                        <td>10</td>
                        <td>5</td>
                        <td>5</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Thuốc gà rù</td>
                        <td>SP_0394</td>
                        <td>Kg</td>
                        <td>100</td>
                        <td>30</td>
                        <td>25</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
       
        <button className='btn btn-info print-quote' >
            <i className='fa  fa-print'></i> 
            <span> In đơn</span>
        </button>
        </div>
         
      </DialogModal>
    </React.Fragment>
    );
  }
}

export default ManufacturingOrderDetailForm;
