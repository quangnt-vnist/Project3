import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ApiImage, SelectBox, ErrorLabel, DateTimeConverter } from '../../../../common-components';
import { CrmCustomerActions } from '../redux/actions';
import GeneralTabInfoForm from './generalTabInfoForm';
import HistoryOfStateTransitionsTabInfoForm from './historyOfStateTransitionsTabInfoForm';
import FileTabInfoForm from './fileTabInfoForm';
import PurchaseHistoriesInfoForm from './purchaseHistoriesInfoForm';
import './customer.css'

class CrmCustomerInformation extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            customerInfomation: {}
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.customerId != state.customerId) {
            props.getCustomer(props.customerId);
            return {
                dataStatus: 1,
                customerId: props.customerId,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        let { dataStatus, customerInfomation } = this.state;

        if (dataStatus === this.DATA_STATUS.QUERYING && !nextProps.crm.customers.isLoading) {
            const getCustomer = nextProps.crm.customers.customerById;
            if (getCustomer.avatar) {
                customerInfomation = { ...getCustomer, img: `.${getCustomer.avatar}` };
            } else {
                customerInfomation = { ...getCustomer };
            }

            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
                customerInfomation,
            })
            return false
        }

        if (dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.setState({
                dataStatus: this.DATA_STATUS.FINISHED,
            });
            return false;
        }
        return true;
    }

    handleUpload = (e) => {
        let { customerInfomation } = this.state;
        const file = e.target.files[0];
        if (file) {
            let fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                this.setState({
                    customerInfomation: {
                        ...customerInfomation,
                        img: fileLoad.result,
                        avatar: file,
                    }
                });
            };
        }

    }

    save = () => {
        const { customerInfomation, customerId } = this.state;
        let formData = new FormData();

        if (customerInfomation.avatar) {
            formData.append('avatar', customerInfomation.avatar);
        }
        this.props.editCustomer(customerId, formData);
    }

    render() {
        const { translate, crm } = this.props;
        const { customerInfomation, dataStatus, customerId } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-crm-customer-info" isLoading={crm.customers.isLoading}
                    formID={`form-crm-customer-info-${customerId}`}
                    title="Thông tin chi tiết khách hàng"
                    func={this.save} size={100}
                >
                    {/* Form xem thông tin khách hàng */}
                    <form id={`form-crm-customer-info-${customerId}`}>
                        <div className="row">
                            <div className="col-xs-12 col-sm-5 col-md-3 col-lg-3">
                                <div style={{
                                    padding: '20px',
                                    border: '1px solid #D2D6DE',
                                    backgroundColor: 'rgb(251 251 251)',
                                    marginBottom: '20px',
                                    borderRadius: '5px',
                                }}>
                                    <div className="text-center ">
                                        {customerInfomation.img ?
                                            <ApiImage className="customer-avatar" src={customerInfomation.img} /> :
                                            <img className="customer-avatar" src="/image/crm-customer.png" />
                                        }
                                    </div>

                                    <h6 className="text-muted" style={{ textAlign: 'center' }}>Tải lên một ảnh khác...</h6>

                                    <div style={{ display: 'flex' }}>
                                        <div style={{ position: 'relative', cursor: 'pointer', margin: '0 auto' }} className="btn btn-default image-wrapper">
                                            Chọn ảnh
                                            <input type="file" name="file" onChange={this.handleUpload}
                                                style={{
                                                    opacity: 0,
                                                    position: 'absolute',
                                                    width: '100%',
                                                    top: 0,
                                                    left: 0,
                                                    padding: '5px'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <hr style={{ borderTop: 'solid 1px #c3c7d0' }} />

                                    <div>
                                        <strong><i className="fa fa-user margin-r-5" /> {translate('crm.customer.name')}</strong>
                                        <p className="text-muted">{customerInfomation.name ? customerInfomation.name : ''}</p>


                                        <strong><i className="fa fa-barcode margin-r-5" /> {translate('crm.customer.code')}</strong>
                                        <p className="text-muted">{customerInfomation.code ? customerInfomation.code : ''}</p>

                                        <strong><i className="fa fa-phone margin-r-5" /> {translate('crm.customer.mobilephoneNumber')}</strong>
                                        <p className="text-muted">{customerInfomation.mobilephoneNumber ? customerInfomation.mobilephoneNumber : ''}</p>

                                        <strong><i className="fa fa-envelope margin-r-5" /> {translate('crm.customer.email')}</strong>
                                        <p className="text-muted">{customerInfomation.email ? customerInfomation.email : ''}</p>

                                        <strong><i className="fa fa-map-marker margin-r-5" /> {translate('crm.customer.address')}</strong>
                                        <p className="text-muted">{customerInfomation.address ? customerInfomation.address : ''}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
                                <div className="nav-tabs-custom">
                                    <ul className="nav nav-tabs">
                                        <li className="active"><a href={`#generalInfo-${customerId}`} data-toggle="tab">Thông tin chi tiết</a></li>
                                        <li ><a href={`#purchaseHistories-${customerId}`} data-toggle="tab">Lịch sử mua hàng</a></li>
                                        <li><a href="#sale" data-toggle="tab">Công nợ</a></li>
                                        <li><a href="#note" data-toggle="tab">Ghi chú</a></li>
                                        <li><a href={`#fileAttachment-${customerId}`} data-toggle="tab">File đính kèm</a></li>
                                        <li><a href={`#historyOfStateTransitions-${customerId}`} data-toggle="tab">Lịch sử thay đổi trạng thái</a></li>
                                    </ul>
                                    <div className="tab-content">
                                        {/* Tab thông tin chi tiết */}
                                        {
                                            customerInfomation && dataStatus === 3 &&
                                            <GeneralTabInfoForm
                                                id={`generalInfo-${customerId}`}
                                                customerInfomation={customerInfomation}
                                                customerId={customerId}
                                            />
                                        }


                                        {/* Tab lịch sử mua hàng */}
                                        <PurchaseHistoriesInfoForm
                                            id={`purchaseHistories-${customerId}`}
                                        />

                                        <div className="tab-pane" id="sale">
                                            Công nợ
                                             {/* id={`table-customer-liabilities-${customer._id}`} */}
                                            <table className="table table-hover table-striped table-bordered" >
                                                <thead>
                                                    <tr>
                                                        <th>Mã phiếu</th>
                                                        <th>Người tạo</th>
                                                        <th>Ngày tạo</th>
                                                        <th>Tổng công nợ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="tab-pane" id="note">
                                            Ghi chú
                                        </div>

                                        {/* Tab file đính kèm của khách hàng */}
                                        {
                                            customerInfomation && dataStatus === 3 &&
                                            <FileTabInfoForm
                                                id={`fileAttachment-${customerId}`}
                                                files={customerInfomation.files}
                                                customerId={customerId}
                                            />
                                        }

                                        {
                                            customerInfomation && dataStatus === 3 &&
                                            <HistoryOfStateTransitionsTabInfoForm
                                                id={`historyOfStateTransitions-${customerId}`}
                                                customerInfomation={customerInfomation}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    getCustomer: CrmCustomerActions.getCustomer,
    editCustomer: CrmCustomerActions.editCustomer,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerInformation));