import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../../common-components';

class QuantityCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity:''
        }
    }

    handleAddLotInfo = async () => {
        this.setState(state => {
            return {
                ...state,
                quantity: 2
            }
        })
    }

    render() {
        const { translate } = this.props;
        const { quantity } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-add-quantity`}
                    formID={`form-add-quantity`}
                    title="Thêm số lượng theo lô"
                    msg_success={translate('manage_warehouse.stock_management.add_success')}
                    msg_faile={translate('manage_warehouse.stock_management.add_faile')}
                    size={50}
                >
                    <form id={`form-add-quantity`}>
                    <div className="col-md-12">
                            <label>Số lượng từng lô:<a style={{ cursor: "pointer" }} title={translate('asset.general_information.asset_properties')}><i className="fa fa-plus-square" style={{ color: "#00a65a", marginLeft: 5 }}
                                onClick={this.handleAddLotInfo} /></a></label>

                            {/* Bảng thông tin chi tiết */}
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ paddingLeft: '0px' }}>Số lô</th>
                                        <th style={{ paddingLeft: '0px' }}>Số lượng</th>
                                        <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(!quantity) ? <tr>
                                        <td colSpan={3}>
                                            <center> {translate('table.no_data')}</center>
                                        </td>
                                    </tr> :
                                             <tr>
                                                <td style={{ paddingLeft: '0px' }}>
                                                <SelectBox
                                                    id={`select-good-quantity-issue-create`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    value=""
                                                    items={[
                                                        { value: "", text: "Chọn lô"},
                                                        { value: "1", text: "L001 (60)"},
                                                        { value: "2", text: "L002 (70)"}
                                                    ]}
                                                    onChange={this.handleGoodChange}    
                                                    multiple={false}
                                                />    
                                                </td>

                                                <td style={{ paddingLeft: '0px' }}>
                                                <div className={`form-group`}>
                                                    <input type="number" className="form-control" value="" onChange={this.handleNameChange} />
                                                </div>
                                                </td>

                                                <td style={{ textAlign: "center" }}>
                                                    <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditMaterial()}><i className="material-icons"></i></a>
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete()}><i className="material-icons"></i></a>
                                                </td>
                                            </tr>
                                        }
                                </tbody>
                            </table>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}
export default connect(null, null)(withTranslate(QuantityCreateForm));