import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, Errorstrong, ButtonModal } from '../../../../../../../common-components';
import { translate } from 'react-redux-multilingual/lib/utils';

class GoodIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    // static getDerivedStateFromProps(nextProps, prevState){
    //     if(nextProps.stockId !== prevState.stockId || nextProps.code !== prevState.code || nextProps.name !== prevState.name ||
    //         nextProps.status !== prevState.status || nextProps.address !== prevState.address || nextProps.goods !== prevState.goods ||
    //         nextProps.managementLocation !== prevState.managementLocation || nextProps.manageDepartment !== prevState.manageDepartment || nextProps.description !== prevState.description){
    //         return {
    //             ...prevState,
    //             stockId: nextProps.stockId,
    //             code: nextProps.code,
    //             name: nextProps.name,
    //             status: nextProps.status,
    //             address: nextProps.address,
    //             goods: nextProps.goodsManagement,
    //             managementLocation: nextProps.managementLocation,
    //             manageDepartment: nextProps.manageDepartment,
    //             description: nextProps.description,
    //         }
    //     }
    //     else {
    //         return null;
    //     }
    // }
    render() {
        const { translate } = this.props;
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-issue-id`}
                    formID={`form-detail-issue`}
                    title={"Chi tiết phiếu đề nghị xuất kho NVL"}
                    msg_success={translate('manage_warehouse.bin_location_management.add_success')}
                    msg_faile={translate('manage_warehouse.bin_location_management.add_faile')}
                    size={75}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-issue`} >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>Mã phiếu đề nghị:&emsp;</strong>
                                    BI012
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.creator')}:&emsp;</strong>
                                    Nguyễn Văn Thắng
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.approved')}:&emsp;</strong>
                                    Vũ Thị Hương Giang
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.date')}:&emsp;</strong>
                                    05-10-2020 7:30
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.description')}:&emsp;</strong>
                                    Phiếu đề nghị xuất kho NVL cho các lệnh sản xuất
                                </div>

                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">LSX001</legend>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                                <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                                <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                                <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                                <th title={translate('manage_warehouse.bill_management.note')}>{translate('manage_warehouse.bill_management.note')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-edit-manage-by-archive`}>
                                            <tr>
                                                <td>1</td>
                                                <td>Jucca Nước</td>
                                                <td>ml</td>
                                                <td>200</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>Propylen Glycon</td>
                                                <td>kg</td>
                                                <td>60</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>Vỏ bọc thuốc</td>
                                                <td>Chiếc</td>
                                                <td>10</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>ĐƯỜNG ACESULFAME K</td>
                                                <td>Thùng</td>
                                                <td>30</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </fieldset>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">LSX002</legend>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                                <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                                <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                                <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                                <th title={translate('manage_warehouse.bill_management.note')}>{translate('manage_warehouse.bill_management.note')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-edit-manage-by-archive`}>
                                            <tr>
                                                <td>1</td>
                                                <td>Jucca Nước</td>
                                                <td>ml</td>
                                                <td>200</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>Propylen Glycon</td>
                                                <td>kg</td>
                                                <td>60</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>Vỏ bọc thuốc</td>
                                                <td>Chiếc</td>
                                                <td>10</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>ĐƯỜNG ACESULFAME K</td>
                                                <td>Thùng</td>
                                                <td>30</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </fieldset>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">LSX003</legend>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                                <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                                <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                                <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                                <th title={translate('manage_warehouse.bill_management.note')}>{translate('manage_warehouse.bill_management.note')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-edit-manage-by-archive`}>
                                            <tr>
                                                <td>1</td>
                                                <td>Jucca Nước</td>
                                                <td>ml</td>
                                                <td>200</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>Propylen Glycon</td>
                                                <td>kg</td>
                                                <td>60</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>Vỏ bọc thuốc</td>
                                                <td>Chiếc</td>
                                                <td>10</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>ĐƯỜNG ACESULFAME K</td>
                                                <td>Thùng</td>
                                                <td>30</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </fieldset>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">LSX004</legend>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                                <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                                <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                                <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                                <th title={translate('manage_warehouse.bill_management.note')}>{translate('manage_warehouse.bill_management.note')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-edit-manage-by-archive`}>
                                            <tr>
                                                <td>1</td>
                                                <td>Jucca Nước</td>
                                                <td>ml</td>
                                                <td>200</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>Propylen Glycon</td>
                                                <td>kg</td>
                                                <td>60</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>Vỏ bọc thuốc</td>
                                                <td>Chiếc</td>
                                                <td>10</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>ĐƯỜNG ACESULFAME K</td>
                                                <td>Thùng</td>
                                                <td>30</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(GoodIssue));