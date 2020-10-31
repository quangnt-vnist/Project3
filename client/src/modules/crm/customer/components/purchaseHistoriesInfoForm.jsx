import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class PurchaseHistoriesInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { translate } = this.props;
        const { id } = this.props;
        return (
            <div className="tab-pane purchaseHistories" id={id}>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="nav-tabs-custom">
                            <ul className="nav nav-tabs">
                                <li className="active"><a href="#purchaseHistoriesAll" data-toggle="tab">{translate('crm.customer.purchaseHistories.all')}(5)</a></li>
                                <li><a href="#waitingForApproval" data-toggle="tab">{translate('crm.customer.purchaseHistories.waitingForApproval')}</a></li>
                                <li><a href="#approved" data-toggle="tab">{translate('crm.customer.purchaseHistories.approved')}</a></li>
                                <li><a href="#waitingForTheGoods" data-toggle="tab">{translate('crm.customer.purchaseHistories.waitingForTheGoods')}</a></li>
                                <li><a href="#delivering" data-toggle="tab">{translate('crm.customer.purchaseHistories.delivering')}</a></li>
                                <li><a href="#finished" data-toggle="tab">{translate('crm.customer.purchaseHistories.finished')}</a></li>
                                <li><a href="#cancelled" data-toggle="tab">{translate('crm.customer.purchaseHistories.cancelled')}</a></li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane active" id="purchaseHistoriesAll">
                                    <table className="table table-hover table-striped table-bordered" >
                                        <thead>
                                            <tr>
                                                <th>Mã đơn hàng</th>
                                                <th>Ngày đặt đơn</th>
                                                <th>Số lượng mặt hàng</th>
                                                <th>Giá trị đơn hàng</th>
                                                <th>Hình thức thanh toán</th>
                                                <th>Trạng thái thanh toán</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_12040</a> </td>
                                                <td>22-10-2020 lúc 9:47:24 pm</td>
                                                <td className="align-center">10</td>
                                                <td>10,000,940 đ</td>
                                                <td>Chuyển khoản</td>
                                                <td>Đã thanh toán</td>
                                                <td style={{ color: `rgb(0, 166, 90)` }}>Đã hoàn thành</td>
                                            </tr>
                                            <tr>
                                                <td> <a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_12045</a></td>
                                                <td>22-10-2019 lúc 9:47:24 pm</td>
                                                <td>10</td>
                                                <td>400,000,940 đ</td>
                                                <td>Tiền mặt</td>
                                                <td>Chưa thanh toán</td>
                                                <td>Chờ lấy hàng</td>
                                            </tr>
                                            <tr>
                                                <td> <a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_23640</a></td>
                                                <td>11-10-2018 lúc 10:47:24 am</td>
                                                <td>5</td>
                                                <td>50,000,940 đ</td>
                                                <td>Chuyển khoản</td>
                                                <td >Đã thanh toán</td>
                                                <td>Đang giao hàng</td>
                                            </tr>
                                            <tr>
                                                <td> <a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_20459</a></td>
                                                <td>30-10-2020 lúc 8:46:24 PM</td>
                                                <td>109</td>
                                                <td>4,000,000,940 đ</td>
                                                <td>Tiền mặt</td>
                                                <td>Đã thanh toán</td>
                                                <td style={{ color: `rgb(0, 166, 90)` }}>Đã hoàn thành</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="tab-pane" id="waitingForApproval">
                                    <table className="table table-hover table-striped table-bordered" >
                                        <thead>
                                            <tr>
                                                <th>Mã đơn hàng</th>
                                                <th>Ngày đặt đơn</th>
                                                <th>Số lượng mặt hàng</th>
                                                <th>Giá trị đơn hàng</th>
                                                <th>Hình thức thanh toán</th>
                                                <th>Trạng thái thanh toán</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td> <a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_12045</a></td>
                                                <td>22-10-2019 lúc 9:47:24 pm</td>
                                                <td>10</td>
                                                <td>400,000,940 đ</td>
                                                <td>Tiền mặt</td>
                                                <td>Chưa thanh toán</td>
                                                <td>Chờ phê duyệt</td>
                                            </tr>
                                            <tr>
                                                <td> <a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_12045</a></td>
                                                <td>22-10-2019 lúc 9:47:24 pm</td>
                                                <td>10</td>
                                                <td>400,000,940 đ</td>
                                                <td>Tiền mặt</td>
                                                <td>Chưa thanh toán</td>
                                                <td>Chờ phê duyệt</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="tab-pane" id="approved">
                                    <table className="table table-hover table-striped table-bordered" >
                                        <thead>
                                            <tr>
                                                <th>Mã đơn hàng</th>
                                                <th>Ngày đặt đơn</th>
                                                <th>Số lượng mặt hàng</th>
                                                <th>Giá trị đơn hàng</th>
                                                <th>Hình thức thanh toán</th>
                                                <th>Trạng thái thanh toán</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td> <a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_12045</a></td>
                                                <td>22-10-2019 lúc 9:47:24 pm</td>
                                                <td>10</td>
                                                <td>400,000,940 đ</td>
                                                <td>Tiền mặt</td>
                                                <td>Chưa thanh toán</td>
                                                <td>Đã phê duyệt</td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                                <div className="tab-pane" id="waitingForTheGoods">
                                    <table className="table table-hover table-striped table-bordered" >
                                        <thead>
                                            <tr>
                                                <th>Mã đơn hàng</th>
                                                <th>Ngày đặt đơn</th>
                                                <th>Số lượng mặt hàng</th>
                                                <th>Giá trị đơn hàng</th>
                                                <th>Hình thức thanh toán</th>
                                                <th>Trạng thái thanh toán</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td> <a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_12045</a></td>
                                                <td>22-10-2019 lúc 9:47:24 pm</td>
                                                <td>10</td>
                                                <td>400,000,940 đ</td>
                                                <td>Tiền mặt</td>
                                                <td>Chưa thanh toán</td>
                                                <td>Chờ lấy hàng</td>
                                            </tr>
                                            <tr>
                                                <td> <a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_12045</a></td>
                                                <td>22-10-2019 lúc 9:47:24 pm</td>
                                                <td>10</td>
                                                <td>400,000,940 đ</td>
                                                <td>Tiền mặt</td>
                                                <td>Chưa thanh toán</td>
                                                <td>Chờ lấy hàng</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="tab-pane" id="delivering">
                                    <table className="table table-hover table-striped table-bordered" >
                                        <thead>
                                            <tr>
                                                <th>Mã đơn hàng</th>
                                                <th>Ngày đặt đơn</th>
                                                <th>Số lượng mặt hàng</th>
                                                <th>Giá trị đơn hàng</th>
                                                <th>Hình thức thanh toán</th>
                                                <th>Trạng thái thanh toán</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_12040</a> </td>
                                                <td>22-10-2020 lúc 9:47:24 pm</td>
                                                <td>10</td>
                                                <td>10,000,940 đ</td>
                                                <td>Chuyển khoản</td>
                                                <td>Đã thanh toán</td>
                                                <td>Đang giao hàng</td>
                                            </tr>
                                            <tr>
                                                <td> <a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_20459</a></td>
                                                <td>30-10-2020 lúc 8:46:24 PM</td>
                                                <td>109</td>
                                                <td>4,000,000,940 đ</td>
                                                <td>Tiền mặt</td>
                                                <td>Đã thanh toán</td>
                                                <td>Đang giao hàng</td>
                                            </tr>
                                            <tr>
                                                <td> <a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_20459</a></td>
                                                <td>30-10-2020 lúc 8:46:24 PM</td>
                                                <td>109</td>
                                                <td>4,000,000,940 đ</td>
                                                <td>Tiền mặt</td>
                                                <td>Đã thanh toán</td>
                                                <td>Đang giao hàng</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="tab-pane" id="finished">
                                    <table className="table table-hover table-striped table-bordered" >
                                        <thead>
                                            <tr>
                                                <th>Mã đơn hàng</th>
                                                <th>Ngày đặt đơn</th>
                                                <th>Số lượng mặt hàng</th>
                                                <th>Giá trị đơn hàng</th>
                                                <th>Hình thức thanh toán</th>
                                                <th>Trạng thái thanh toán</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_12040</a> </td>
                                                <td>22-10-2020 lúc 9:47:24 pm</td>
                                                <td>10</td>
                                                <td>10,000,940 đ</td>
                                                <td>Chuyển khoản</td>
                                                <td>Đã thanh toán</td>
                                                <td style={{ color: `rgb(0, 166, 90)` }}>Đã hoàn thành</td>
                                            </tr>
                                            <tr>
                                                <td> <a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_20459</a></td>
                                                <td>30-10-2020 lúc 8:46:24 PM</td>
                                                <td>109</td>
                                                <td>4,000,000,940 đ</td>
                                                <td>Tiền mặt</td>
                                                <td>Đã thanh toán</td>
                                                <td style={{ color: `rgb(0, 166, 90)` }}>Đã hoàn thành</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="tab-pane" id="cancelled">
                                    <table className="table table-hover table-striped table-bordered" >
                                        <thead>
                                            <tr>
                                                <th>Mã đơn hàng</th>
                                                <th>Ngày đặt đơn</th>
                                                <th>Số lượng mặt hàng</th>
                                                <th>Giá trị đơn hàng</th>
                                                <th>Hình thức thanh toán</th>
                                                <th>Trạng thái thanh toán</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><a href="" title={'Xem chi tiết đơn hàng'} className="codeOrder">SALES_12040</a> </td>
                                                <td>22-10-2020 lúc 9:47:24 pm</td>
                                                <td>10</td>
                                                <td>10,000,940 đ</td>
                                                <td>Chuyển khoản</td>
                                                <td>Đã thanh toán</td>
                                                <td style={{ color: 'rgb(222 40 40)' }}>Đã hủy đơn</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, null)(withTranslate(PurchaseHistoriesInfoForm));