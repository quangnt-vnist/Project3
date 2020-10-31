import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../../common-components';

class PurchaseRequestDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                recommendNumber: nextProps.recommendNumber,
                dateCreate: nextProps.dateCreate,
                proponent: nextProps.proponent,
                equipmentName: nextProps.equipmentName,
                equipmentDescription: nextProps.equipmentDescription,
                supplier: nextProps.supplier,
                total: nextProps.total,
                unit: nextProps.unit,
                estimatePrice: nextProps.estimatePrice,
                approver: nextProps.approver,
                status: nextProps.status,
                note: nextProps.note,
            }
        } else {
            return null;
        }
    }


    render() {
        const { translate, recommendProcure } = this.props;
        const { recommendNumber, dateCreate, proponent, equipmentName, equipmentDescription, supplier, total, unit, estimatePrice, approver, status, note } = this.state;

        var formater = new Intl.NumberFormat();

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-view-recommendprocure" isLoading={recommendProcure}
                    formID="form-view-recommendprocure"
                    title={translate('asset.manage_recommend_procure.view_recommend_card')}
                    hasSaveButton={false}
                >
                    {/* Form xem chi tiết phiếu đăng ký mua sắm tài sản */}
                    <form className="form-group" id="form-view-recommendprocure">
                        <div className="col-md-12">

                            {/* Mã phiếu */}
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <strong>{translate('asset.general_information.form_code')}&emsp; </strong>
                                    {recommendNumber}
                                </div>

                                {/* Ngày lập */}
                                <div className="form-group">
                                    <strong>{translate('asset.general_information.create_date')}&emsp; </strong>
                                    {dateCreate}
                                </div>

                                {/* Người đề nghị */}
                                <div className="form-group">
                                    <strong>{translate('asset.usage.proponent')}&emsp; </strong>
                                    {proponent ? proponent.name : 'User is deleted'}
                                </div>

                                {/* Thiết bị đề nghị mua */}
                                <div className={`form-group`}>
                                    <strong>{translate('asset.manage_recommend_procure.asset_recommend')}&emsp; </strong>
                                    {equipmentName}
                                </div>

                                {/* Mô tả thiết bị đề nghị mua */}
                                <div className={`form-group`}>
                                    <strong>{translate('asset.manage_recommend_procure.equipment_description')}&emsp; </strong>
                                    {equipmentDescription}
                                </div>

                                {/* Nhà cung cấp */}
                                <div className="form-group">
                                    <strong>{translate('asset.manage_recommend_procure.supplier')}&emsp; </strong>
                                    {supplier}
                                </div>

                                {/* Số lượng */}
                                <div className={`form-group `}>
                                    <strong>{translate('asset.general_information.number')}&emsp; </strong>
                                    {total}
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Đơn vị tính */}
                                <div className={`form-group `}>
                                    <strong>{translate('asset.manage_recommend_procure.unit')}&emsp; </strong>
                                    {unit}
                                </div>

                                {/* Giá trị dự tính */}
                                <div className="form-group">
                                    <strong>{translate('asset.manage_recommend_procure.expected_value')}&emsp; </strong>
                                    {estimatePrice ? formater.format(parseInt(estimatePrice)) : ''} VNĐ
                                </div>

                                {/* Người phê duyệt */}
                                <div className="form-group">
                                    <strong>{translate('asset.usage.accountable')}&emsp; </strong>
                                    {approver ? approver.name : 'User is deleted'}
                                </div>

                                {/* Trạng thái */}
                                <div className="form-group">
                                    <strong>{translate('asset.general_information.status')}&emsp; </strong>
                                    {status}
                                </div>

                                {/* Ghi chú */}
                                <div className="form-group">
                                    <strong>{translate('asset.usage.note')}&emsp; </strong>
                                    {note}
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { recommendProcure } = state;
    return { recommendProcure };
};

const actionCreators = {

};

const detailRecommendProcure = connect(null, null)(withTranslate(PurchaseRequestDetailForm));
export { detailRecommendProcure as PurchaseRequestDetailForm };