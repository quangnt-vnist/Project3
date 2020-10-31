import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti, ExportExcel } from '../../../../../../common-components';
import { AssetService } from '../../../asset-information/redux/services';
import { UserActions } from '../../../../../super-admin/user/redux/actions';
import { AssetTypeActions } from "../../../asset-type/redux/actions";

class AssetIsExpired extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listAssets: null,
            limit: 5,
        }
    }

    componentDidMount() {
        AssetService.getAll({
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            page: 0,
            limit: 0
        }).then(res => {
            if (res.data.success) {
                this.setState({ listAssets: res.data.content.data });
            }
        }).catch(err => {
            console.log(err);
        });

        this.props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        this.props.getUser();
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

    formatStatus = (status) => {
        const { translate } = this.props;
        switch (status) {
            case 'ready_to_use': return translate('asset.general_information.ready_use');
            case 'in_use': return translate('asset.general_information.using');
            case 'broken': return translate('asset.general_information.damaged');
            case 'lost': return translate('asset.general_information.lost');
            case 'disposed': return translate('asset.general_information.disposal');
            default: return 'Deleted'
        }
    }


    render() {
        const { translate } = this.props;
        const { user, assetType, setAssetIsExpiredExportData } = this.props;
        const { listAssets } = this.state;

        var userlist = user && user.list;
        let lists;
        var ExpiryDateAssets = [], willExpiryDateAssets = [];
        let nowDate = new Date();
        if (listAssets && !ExpiryDateAssets.length && !willExpiryDateAssets.length) {
            for (let i in listAssets) {
                let date = listAssets[i].purchaseDate.split("-")
                date[0] = String(Math.floor((Number(date[1]) + listAssets[i].usefulLife) / 12) + Number(date[0]));
                let month = String((Number(date[1]) + listAssets[i].usefulLife) % 12 - 1);
                date[1] = month ? month : '12';
                date[2] = date[2].slice(0, 2)
                let ExpiryDate = new Date(date[0], date[1], date[2])
                let expiry;
                let day = ExpiryDate - nowDate;
                if (day < 0) {
                    day = nowDate - ExpiryDateAssets;
                    let data = {
                        asset: listAssets[i],
                        day: translate('asset.dashboard.expired')
                    }
                    ExpiryDateAssets.push(data);
                } else {
                    expiry = Math.round(day / 1000 / 60 / 60 / 24);
                    if (expiry < 16) {
                        let data = {
                            asset: listAssets[i],
                            day: expiry
                        }
                        willExpiryDateAssets.push(data);
                    }
                }
            }
        }
        if (assetType && assetType.listAssetTypes)
            var assettypelist = assetType.listAssetTypes;
        if (listAssets)
            lists = listAssets;

        // Lấy dữ liệu để export
        if (ExpiryDateAssets && ExpiryDateAssets.length !== 0 || willExpiryDateAssets && willExpiryDateAssets.length !== 0) {
            if (ExpiryDateAssets && ExpiryDateAssets.length !== 0) {
                setAssetIsExpiredExportData(ExpiryDateAssets, assettypelist, userlist, false);
            } else if (willExpiryDateAssets && willExpiryDateAssets.length !== 0) {
                setAssetIsExpiredExportData(willExpiryDateAssets, assettypelist, userlist, true);
            }
        }

        return (
            <React.Fragment>
                <div className="qlcv">
                    {/* Biểu thống kê tài sản theo trạng thái */}
                    {/* Bảng các tài sản */}
                    {(ExpiryDateAssets && ExpiryDateAssets.length !== 0) || (willExpiryDateAssets && willExpiryDateAssets.length !== 0) ?
                        <table id="asset-table" className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: "8%" }}>{translate('asset.general_information.asset_code')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.asset_type')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.purchase_date')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.manager')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.user')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.organization_unit')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.status')}</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>{translate('asset.dashboard.remaining_time')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(willExpiryDateAssets && willExpiryDateAssets.length !== 0) &&
                                    willExpiryDateAssets.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.asset.code}</td>
                                            <td>{x.asset.assetName}</td>
                                            <td>{x.asset.assetType && x.asset.assetType.length ? x.asset.assetType.map((item, index) => { let suffix = index < x.asset.assetType.length - 1 ? ", " : ""; return item.typeName + suffix }) : 'Asset is deleted'}</td>
                                            <td>{this.formatDate(x.asset.purchaseDate)}</td>
                                            <td>{x.asset.managedBy && userlist.length && userlist.find(item => item._id === x.asset.managedBy) ? userlist.find(item => item._id === x.asset.managedBy).name : 'User is deleted'}</td>
                                            <td>{x.asset.assignedToUser ? (userlist.length && userlist.find(item => item._id === x.asset.assignedToUser) ? userlist.find(item => item._id === x.asset.assignedToUser).name : 'User is deleted') : ''}</td>
                                            <td>{x.asset.assignedToOrganizationalUnit ? x.asset.assignedToOrganizationalUnit : ''}</td>
                                            <td>{this.formatStatus(x.asset.status)}</td>
                                            <td>{x.day} {translate('annual_leave_personal.day')}</td>
                                        </tr>))
                                }
                                {(ExpiryDateAssets && ExpiryDateAssets.length !== 0) &&
                                    ExpiryDateAssets.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.asset.code}</td>
                                            <td>{x.asset.assetName}</td>
                                            <td>{x.asset.assetType && x.asset.assetType.length ? x.asset.assetType.map((item, index) => { let suffix = index < x.asset.assetType.length - 1 ? ", " : ""; return item.typeName + suffix }) : 'Asset is deleted'}</td>
                                            <td>{this.formatDate(x.asset.purchaseDate)}</td>
                                            <td>{x.asset.managedBy && userlist.length && userlist.find(item => item._id === x.asset.managedBy) ? userlist.find(item => item._id === x.asset.managedBy).name : 'User is deleted'}</td>
                                            <td>{x.asset.assignedToUser ? (userlist.length && userlist.find(item => item._id === x.asset.assignedToUser) ? userlist.find(item => item._id === x.asset.assignedToUser).name : 'User is deleted') : ''}</td>
                                            <td>{x.asset.assignedToOrganizationalUnit ? x.asset.assignedToOrganizationalUnit : ''}</td>
                                            <td>{this.formatStatus(x.asset.status)}</td>
                                            <td>{x.day}</td>
                                        </tr>))
                                }
                            </tbody>
                        </table> : translate('general.no_data')
                    }

                </div>
            </React.Fragment >
        );
    }
}

function mapState(state) {
    const { assetsManager, assetType, user } = state;
    return { assetsManager, assetType, user };
}

const actionCreators = {
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getUser: UserActions.get,
};

const AssetIsExpiredConnect = connect(mapState, actionCreators)(withTranslate(AssetIsExpired));
export { AssetIsExpiredConnect as AssetIsExpired };