import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AssetTypeActions } from '../../../admin/asset-type/redux/actions';
import { ApiImage } from '../../../../../common-components';

class GeneralTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.props.getAssetTypes();

    }
    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    convertGroupAsset = (group) => {
        if (group === 'building') {
            return 'Mặt bằng';
        } else if (group === 'vehicle') {
            return 'Xe cộ'
        } else if (group === 'machine') {
            return 'Máy móc'
        } else {
            return 'Khác'
        }

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                avatar: nextProps.avatar,
                code: nextProps.code,
                assetName: nextProps.assetName,
                serial: nextProps.serial,
                assetTypes: nextProps.assetTypes,
                group: nextProps.group,
                purchaseDate: nextProps.purchaseDate,
                warrantyExpirationDate: nextProps.warrantyExpirationDate,
                managedBy: nextProps.managedBy,
                assignedToUser: nextProps.assignedToUser,
                assignedToOrganizationalUnit: nextProps.assignedToOrganizationalUnit,
                handoverFromDate: nextProps.handoverFromDate,
                handoverToDate: nextProps.handoverToDate,
                location: nextProps.location,
                description: nextProps.description,
                status: nextProps.status,
                typeRegisterForUse: nextProps.typeRegisterForUse,
                detailInfo: nextProps.detailInfo,
                usageLogs: nextProps.usageLogs
            }
        } else {
            return null;
        }
    }
    formatStatus = (status) => {
        const { translate } = this.props;

        if (status === 'ready_to_use') {
            return translate('asset.general_information.ready_use')
        }
        else if (status === 'in_use') {
            return translate('asset.general_information.using')
        }
        else if (status === 'broken') {
            return translate('asset.general_information.damaged')
        }
        else if (status === 'lost') {
            return translate('asset.general_information.lost')
        }
        else if (status === 'disposed') {
            return translate('asset.general_information.disposal')
        }
        else {
            return 'Deleted';
        }
    }

    render() {
        const { id, translate, user, assetType, assetsManager, department } = this.props;
        var userlist = user.list, departmentlist = department.list;
        var assettype = assetType && assetType.administration;
        let assettypelist = assettype && assettype.types.list;
        let assetbuilding = assetsManager && assetsManager.buildingAssets;
        let assetbuildinglist = assetbuilding && assetbuilding.list;

        const {
            img, avatar, code, assetName, serial, assetTypes, group, purchaseDate, warrantyExpirationDate,
            managedBy, assignedToUser, assignedToOrganizationalUnit, handoverFromDate, handoverToDate, location,
            description, status, typeRegisterForUse, detailInfo, usageLogs
        } = this.state;
        return (
            <div id={id} className="tab-pane active">
                <div className="box-body" >
                    <div className="row" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                        {/* Anh tài sản */}
                        <div className="col-md-4 " style={{ textAlign: 'center', paddingLeft: '0px' }}>
                            <div>
                                {/* <a href={process.env.REACT_APP_SERVER + avatar} target="_blank">
                                    <img className="attachment-img avarta" src={process.env.REACT_APP_SERVER + avatar} alt="Attachment" />
                                </a> */}
                                {avatar && <ApiImage className="attachment-img avarta" id={`avater-imform-${id}`} src={`.${avatar}`} />}

                            </div>
                        </div>

                        {/* Thông tin cơ bản */}
                        <br />
                        <div className="col-md-8  " style={{ paddingRight: '0px', paddingLeft: '0px', minWidth: '350px' }}>
                            <div>
                                <div className="col-md-6">

                                    {/* Mã tài sản */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.asset_code')}&emsp; </strong>
                                        {code}
                                    </div>

                                    {/* Tên tài sản */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.asset_name')}&emsp; </strong>
                                        {assetName}
                                    </div>

                                    {/* Số serial */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.serial_number')}&emsp; </strong>
                                        {serial}
                                    </div>

                                    {/* Nhóm tài sản */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.asset_group')}&emsp; </strong>
                                        {this.convertGroupAsset(group)}
                                    </div>

                                    {/* Loại tài sản */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.asset_type')}&emsp; </strong>
                                        {assetTypes && assetTypes.length ? assetTypes.map((item, index) => { let suffix = index < assetTypes.length - 1 ? ", " : ""; return item.typeName + suffix }) : 'Asset type is deleted'}
                                    </div>

                                    {/* Ngày nhập */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.purchase_date')}&emsp; </strong>
                                        {this.formatDate(purchaseDate)}
                                    </div>

                                    {/* Ngày bảo hành */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.warranty_expiration_date')}&emsp; </strong>
                                        {this.formatDate(warrantyExpirationDate)}
                                    </div>

                                    {/* Người quản lý */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.manager')}&emsp; </strong>
                                        {managedBy && userlist.length && userlist.filter(item => item._id === managedBy).pop() ? userlist.filter(item => item._id === managedBy).pop().name : 'User is deleted'}
                                    </div>
                                </div>

                                <div className="col-md-6">

                                    {/* Người sử dụng */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.user')}&emsp; </strong>
                                        {assignedToUser ? (userlist.length && userlist.filter(item => item._id === assignedToUser).pop() ? userlist.filter(item => item._id === assignedToUser).pop().name : 'User is deleted') : ''}
                                    </div>

                                    {/* Đơn vị sử dụng */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.organization_unit')}&emsp; </strong>
                                        {assignedToOrganizationalUnit ? (departmentlist.length && departmentlist.filter(item => item._id === assignedToOrganizationalUnit).pop() ? departmentlist.filter(item => item._id === assignedToOrganizationalUnit).pop().name : 'User is deleted') : ''}
                                    </div>
                                    {/* Thời gian bắt đầu sử dụng */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.handover_from_date')}&emsp; </strong>
                                        {status == "in_use" && usageLogs ? this.formatDate(usageLogs[usageLogs.length - 1] && usageLogs[usageLogs.length - 1].startDate) : ''}
                                    </div>

                                    {/* Thời gian kết thúc sử dụng */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.handover_to_date')}&emsp; </strong>
                                        {status == "in_use" && usageLogs ? this.formatDate(usageLogs[usageLogs.length - 1] && usageLogs[usageLogs.length - 1].endDate) : ''}
                                    </div>

                                    {/* Vị trí */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.asset_location')}&emsp; </strong>
                                        {location && assetbuildinglist && assetbuildinglist.length && assetbuildinglist.filter(item => item._id === location).pop() ? assetbuildinglist.filter(item => item._id === location).pop().assetName : ''}
                                    </div>

                                    {/* Mô tả */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.description')}&emsp; </strong>
                                        {description}
                                    </div>

                                    {/* Trạng thái */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.status')}&emsp; </strong>
                                        {this.formatStatus(status)}
                                    </div>

                                    {/* Quyền đăng ký sử dụng */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.can_register_for_use')}&emsp; </strong>
                                        {typeRegisterForUse == 1 ? 'Không được đăng ký sử dụng' : (typeRegisterForUse == 2 ? "Đăng ký sử dụng theo giờ" : "Đăng ký sử dụng lâu dài")}
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin chi tiết */}
                            <div className="col-md-12">
                                <label>{translate('asset.general_information.asset_properties')}:<a title={translate('asset.general_information.asset_properties')}></a></label>
                                <div className="form-group">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.field_name')}</th>
                                                <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.value')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(!detailInfo || detailInfo.length === 0) ? <tr>
                                                <td colSpan={3}>
                                                    <center> {translate('table.no_data')}</center>
                                                </td>
                                            </tr> :
                                                detailInfo.map((x, index) => {
                                                    return <tr key={index}>
                                                        <td style={{ paddingLeft: '0px' }}>{x.nameField}</td>
                                                        <td style={{ paddingLeft: '0px' }}>{x.value}</td>
                                                    </tr>
                                                })}
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
};

function mapState(state) {
    const { user, assetType, assetsManager, department } = state;
    return { user, assetType, assetsManager, department };
};
const actions = {
    getAssetTypes: AssetTypeActions.getAssetTypes,
}
const tabGeneral = connect(mapState, actions)(withTranslate(GeneralTab));
export { tabGeneral as GeneralTab };
