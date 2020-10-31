import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../../common-components';
import QuantityCreateForm from './quantityCreateForm';

class IssueCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            good: '',
            list: []
        }
    }

    getAllGoods = () => {
        let { translate } = this.props;
        let goodArr = [{ value: '', text: translate('manage_warehouse.good_management.choose_category') }];

        this.props.goods.listALLGoods.map(item => {
            goodArr.push({
                value: item._id,
                text: item.code + " -- " + item.name
            })
        })

        return goodArr;
    }

    handleGoodChange = async (value) => {
        this.setState(state => {
            return {
                ...state,
                good: value[0]
            }
        })
    }

    addQuantity = async () => {
        window.$('#modal-add-quantity').modal('show');
    }

    render() {
        const { translate } = this.props;
        const { list, good } = this.state;
        const listGoods = this.getAllGoods();

        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-good-issue`} button_name={translate('manage_warehouse.good_management.add')} title={translate('manage_warehouse.good_management.add_title')} />
        
                <DialogModal
                    modalID={`modal-create-good-issue`}
                    formID={`form-create-good-issue-2`}
                    title={translate('manage_warehouse.stock_management.add_title')}
                    msg_success={translate('manage_warehouse.stock_management.add_success')}
                    msg_faile={translate('manage_warehouse.stock_management.add_faile')}
                    size={75}
                >
                    <form id={`form-create-good-issue-2`}>
                    <QuantityCreateForm />
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.code')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" onChange={this.handleCodeChange}/>
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.type')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-type-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value=""
                                        items={[
                                            { value: '1', text: "Phiếu xuất bán hàng"},
                                            { value: '2', text: "Phiếu xuất sử dụng"},
                                            { value: '3', text: "Phiếu xuất sản xuất"},
                                        ]}
                                        onChange={this.handleDepartmentChange}    
                                        multiple={false}
                                    />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.proposal')}</label>
                                    <SelectBox
                                        id={`select-proposal-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value=""
                                        items={[
                                            { value: '', text: "Chọn phiếu đề nghị"},
                                            { value: '1', text: "BP023"},
                                            { value: '2', text: "BP024"},
                                            { value: '3', text: "BP025"},
                                        ]}
                                        onChange={this.handleDepartmentChange}    
                                        multiple={false}
                                    />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.stock')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value="Tạ Quang Bửu" disabled onChange={this.handleAddressChange} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.creator')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value="Nguyễn Văn Thắng" disabled onChange={this.handleNameChange} />
                                </div>
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bill_management.approved')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-approved-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value=""
                                        items={[
                                            { value: '', text: "Chọn người phê duyệt"},
                                            { value: '1', text: "Nguyễn Văn Thắng"},
                                            { value: '2', text: "Phạm Đại Tài"},
                                            { value: '3', text: "Nguyễn Anh Phương"},
                                        ]}
                                        onChange={this.handleDepartmentChange}    
                                        multiple={false}
                                    />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.customer')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-customer-issue-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value=""
                                        items={[
                                            { value: '', text: "Chọn khách hàng"},
                                            { value: '1', text: "Công ty TNHH ABC"},
                                            { value: '2', text: "Công ty Việt Anh"},
                                            { value: '3', text: "Công ty A"},
                                        ]}
                                        onChange={this.handleManagementLocationtChange}    
                                        multiple={false}
                                    />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bill_management.receiver')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value="" onChange={this.handleNameChange} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.bill_management.goods')}</legend>
                                    <div className="form-group">
                                        <label>{translate('manage_warehouse.bill_management.choose_good')} :</label>
                                        <SelectBox
                                            id={`select-good-issue-create`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value=""
                                            items={listGoods}
                                            onChange={this.handleGoodChange}    
                                            multiple={false}
                                        />
                                    </div>
                                    <div className={`form-group`}>
                                        {/* Bảng thông tin chi tiết */}
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th style={{width: "5%"}} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.good_code')}>{translate('manage_warehouse.bill_management.good_code')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.note')}>{translate('manage_warehouse.bill_management.note')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {(!good) ? <tr>
                                                <td colSpan={6}>
                                                    <center> {translate('table.no_data')}</center>
                                                </td>
                                            </tr> :
                                        
                                                            <tr>
                                                                {/* Tên trường dữ liệu */}
                                                                <td>1</td>
                                                                <td>PR001</td>
                                                                <td>ĐƯỜNG ACESULFAME K</td>
                                                                <td>Thùng</td>
                                                                <td><div style={{display: "flex"}}><input className="form-control" type="number" name="nameField" style={{ width: "50%" }} /><i style={{ cursor: "pointer" }} onClick={() => this.addQuantity()} className="material-icons">list</i></div></td>

                                                                {/* Hành động */}
                                                                <td>
                                                                    <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditMaterial()}><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteMaterial()}><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                        }
                                            </tbody>
                                        </table>
                                    </div>
                                </fieldset>
                                
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bill_management.description')}</label>
                                    <textarea type="text" className="form-control" value="Nơi lưu trữ kho số 1" onChange={this.handleDescriptionChange} />
                                </div>
                            </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}
export default connect(mapStateToProps, null)(withTranslate(IssueCreateForm));