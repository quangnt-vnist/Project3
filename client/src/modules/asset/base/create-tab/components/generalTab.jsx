import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, ErrorLabel, SelectBox, TreeSelect, SelectMulti, ApiImage } from '../../../../../common-components';

import "./addAsset.css";
import { AssetCreateValidator } from './combinedContent';
import { RoleActions } from '../../../../super-admin/role/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { AssetTypeActions } from '../../../admin/asset-type/redux/actions';
import { string2literal } from '../../../../../helpers/handleResponse';

class GeneralTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailInfo: [],
            isObj: true,
            // status: "ready_to_use",
            // typeRegisterForUse: "Được phép đăng ký sử dụng",
        };
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

    // Function upload avatar
    handleUpload = (e) => {
        var file = e.target.files[0];

        if (file) {
            var fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                this.setState({
                    img: fileLoad.result
                });
                this.props.handleUpload(fileLoad.result, file)
            };
        }
    }

    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        })
        this.props.handleChange(name, value);
    }

    /**
     * Bắt sự kiện thay đổi mã tài sản
     */
    handleCodeChange = (e) => {
        const { value } = e.target;
        this.validateCode(value, true);
    }
    validateCode = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateCode(value, this.props.translate)
        if (willUpdateState) {
            this.setState({
                errorOnCode: msg,
                code: value,
            });
            this.props.handleChange("code", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi tên tài sản
     */
    handleAssetNameChange = (e) => {
        const { value } = e.target;
        this.validateAssetName(value, true);
    }
    validateAssetName = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateAssetName(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnAssetName: msg,
                    assetName: value,
                }
            });
            this.props.handleChange("assetName", value);
        }
        return msg === undefined;
    };

    /**
     * Bắt sự kiện thay đổi số serial
     */
    handleSerialChange = (e) => {
        const { value } = e.target;
        this.validateSerial(value, true);
    }
    validateSerial = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateSerial(value, this.props.translate)

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnSerial: msg,
                    serial: value,
                }
            });
            this.props.handleChange("serial", value);
        }
        return msg === undefined;
    };

    /**
     * Bắt sự kiện thay đổi nhóm tài sản
     */
    handleGroupChange = (value) => {
        this.setState({
            group: value[0]
        })
        this.props.handleChange('group', value[0]);
    }

    /**
     * Bắt sự kiện thay đổi loại tài sản
     */

    handleAssetTypeChange = async (value) => {
        let { assetType } = this.props;
        let { detailInfo } = this.state;
        let arr = [...detailInfo];

        if (value && value.length !== 0) {
            let assetTypeList = assetType.listAssetTypes;
            let currentAssetType = assetTypeList.filter((element) => element._id === value[0])[0];
            let defaultInformation = currentAssetType ? currentAssetType.defaultInformation : [];

            // Thêm trường thông tin mặc định ở nhóm tài sản vào thông tin chi tiết
            for (let i in defaultInformation) {
                let check = true;
                for (let j in detailInfo) {
                    if (defaultInformation[i].nameField === detailInfo[j].nameField) {
                        check = false;
                    }
                }

                if (check) {
                    arr.push({
                        ...defaultInformation[i],
                        value: '',
                    });
                }
            }
        }

        await this.setState(state => {
            return {
                ...state,
                assetTypes: value,
                detailInfo: arr,
                isObj: false
            }
        });
        this.props.handleChange("assetType", value);
        this.props.handleChange("detailInfo", this.state.detailInfo);
    }

    /**
     * Bắt sự kiện thay đổi ngày nhập
     */
    handlePurchaseDateChange = (value) => {
        this.validatePurchaseDate(value, true)
    }
    validatePurchaseDate = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validatePurchaseDate(value, this.props.translate)

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnPurchaseDate: msg,
                    purchaseDate: value,
                }
            });
            this.props.handleChange("purchaseDate", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi ngày bảo hành
     */
    handleWarrantyExpirationDateChange = (value) => {
        this.validateWarrantyExpirationDate(value, true)
    }
    validateWarrantyExpirationDate = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateWarrantyExpirationDate(value, this.props.translate)

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnWarrantyExpirationDate: msg,
                    warrantyExpirationDate: value,
                }
            });
            this.props.handleChange("warrantyExpirationDate", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi người quản lý
     */
    handleManagedByChange = (value) => {
        this.setState({
            managedBy: value[0]
        });
        this.props.handleChange("managedBy", value[0]);
    }



    /**
     * Bắt sự kiện thay đổi người sử dụng
     */
    handleAssignedToUserChange = (value) => {
        this.setState({
            assignedToUser: string2literal(value[0])
        });
        this.props.handleChange("assignedToUser", string2literal(value[0]));
    }

    handleAssignedToOrganizationalUnitChange = (value) => {
        this.setState({
            assignedToOrganizationalUnit: string2literal(value[0])
        });
        this.props.handleChange("assignedToOrganizationalUnit", string2literal(value[0]));
    }

    /**
     * Bắt sự kiện thay đổi ngày bắt đầu sử dụng
     */
    handleHandoverFromDateChange = (value) => {
        this.validateHandoverFromDate(value, true)
    }
    validateHandoverFromDate = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateHandoverFromDate(value, this.props.translate)

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnHandoverFromDate: msg,
                    handoverFromDate: value,
                }
            });
            this.props.handleChange("handoverFromDate", value);
        }
        return msg === undefined;
    }

    /**
     * Function bắt sự kiện thay đổi ngày kết thúc sử dụng
     */
    handleHandoverToDateChange = (value) => {
        this.validateHandoverToDate(value, true)
    }
    validateHandoverToDate = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateHandoverToDate(value, this.props.translate)

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnHandoverToDate: msg,
                    handoverToDate: value,
                }
            });
            this.props.handleChange("handoverToDate", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi vị trí tài sản
     */
    handleLocationChange = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                location: value[0],
            }
        });

        this.props.handleChange("location", value[0]);
    }

    /**
     * Bắt sự kiện thay đổi mô tả
     */
    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                description: value
            }
        });
        this.props.handleChange("description", value);
    }

    /**
     * Bắt sự kiện thay đổi trạng thái tài sản
     */
    handleStatusChange = (value) => {
        this.setState({
            status: value[0]
        })
        this.props.handleChange('status', value[0]);
    }

    handleRoles = (value) => {
        this.setState(state => {
            return {
                ...state,
                readByRoles: value
            }
        });
        this.props.handleChange("readByRoles", value);
    }
    /**
     * Bắt sự kiện thay đổi quyền đăng ký sử dụng
     */
    handleTypeRegisterForUseChange = (value) => {
        this.setState({
            typeRegisterForUse: value[0]
        })
        this.props.handleChange('typeRegisterForUse', value[0]);
    }

    /**
     * Bắt sự kiện click thêm Thông tin chi tiết
     */
    handleAddDetailInfo = () => {
        var detailInfo = this.state.detailInfo;

        if (detailInfo.length !== 0) {
            let result;

            for (let n in detailInfo) {
                result = this.validateNameField(detailInfo[n].nameField, n) && this.validateValue(detailInfo[n].value, n);
                if (!result) {
                    this.validateNameField(detailInfo[n].nameField, n);
                    this.validateValue(detailInfo[n].value, n)
                    break;
                }
            }

            if (result) {
                this.setState({
                    detailInfo: [...detailInfo, { nameField: "", value: "" }]
                })
            }
        } else {
            this.setState({
                detailInfo: [...detailInfo, { nameField: "", value: "" }]
            })
        }

    }

    /**
     * Bắt sự kiện chỉnh sửa tên trường dữ liệu thông tin chi tiết
     */
    handleChangeNameField = (e, index) => {
        var { value } = e.target;
        this.validateNameField(value, index);
    }
    validateNameField = (value, className, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateNameField(value, this.props.translate);
        if (willUpdateState) {
            var { detailInfo } = this.state;
            detailInfo[className] = { ...detailInfo[className], nameField: value }
            this.setState(state => {
                return {
                    ...state,
                    errorOnNameField: msg,
                    errorOnNameFieldPosition: msg ? className : null,
                    detailInfo: detailInfo
                }
            });
            this.props.handleChange("detailInfo", detailInfo);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện chỉnh sửa giá trị trường dữ liệu thông tin chi tiết
     */
    handleChangeValue = (e, index) => {
        var { value } = e.target;
        this.validateValue(value, index);
    }
    validateValue = (value, className, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateValue(value, this.props.translate);
        if (willUpdateState) {
            var { detailInfo } = this.state;
            detailInfo[className] = { ...detailInfo[className], value: value }
            this.setState(state => {
                return {
                    ...state,
                    errorOnValue: msg,
                    errorOnValuePosition: msg ? className : null,
                    detailInfo: detailInfo
                }
            });
            this.props.handleChange("detailInfo", detailInfo);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện xóa thông tin chi tiết
     */
    delete = (index) => {
        var { detailInfo } = this.state;
        detailInfo.splice(index, 1);
        this.setState({
            detailInfo: detailInfo
        })
        if (detailInfo.length !== 0) {
            for (let n in detailInfo) {
                this.validateNameField(detailInfo[n].nameField, n);
                this.validateValue(detailInfo[n].value, n)
            }
        } else {
            this.setState({
                errorOnValue: undefined,
                errorOnNameField: undefined
            })
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || nextProps.assignedToUser !== prevState.assignedToUser || nextProps.assignedToOrganizationalUnit !== prevState.assignedToOrganizationalUnit) {
            return {
                ...prevState,
                id: nextProps.id,
                img: nextProps.img,
                avatar: nextProps.avatar,
                code: nextProps.code,
                assetName: nextProps.assetName,
                serial: nextProps.serial,
                assetTypes: nextProps.assetTypes,
                group: nextProps.group,
                location: nextProps.location,
                purchaseDate: nextProps.purchaseDate,
                warrantyExpirationDate: nextProps.warrantyExpirationDate,
                managedBy: nextProps.managedBy,
                assignedToUser: nextProps.assignedToUser,
                assignedToOrganizationalUnit: nextProps.assignedToOrganizationalUnit,
                handoverFromDate: nextProps.handoverFromDate,
                handoverToDate: nextProps.handoverToDate,
                description: nextProps.description,
                status: nextProps.status,
                typeRegisterForUse: nextProps.typeRegisterForUse,
                detailInfo: nextProps.detailInfo,
                usageLogs: nextProps.usageLogs,
                readByRoles: nextProps.readByRoles,

                errorOnCode: undefined,
                errorOnAssetName: undefined,
                errorOnSerial: undefined,
                errorOnAssetType: undefined,
                errorOnLocation: undefined,
                errorOnPurchaseDate: undefined,
                errorOnWarrantyExpirationDate: undefined,
                errorOnManagedBy: undefined,

                errorOnNameField: undefined,
                errorOnValue: undefined,
            }
        } else {
            return null;
        }
    }

    getAssetTypes = () => {
        let { assetType } = this.props;
        let assetTypeName = assetType && assetType.listAssetTypes;
        let typeArr = [];
        assetTypeName.map(item => {
            typeArr.push({
                _id: item._id,
                id: item._id,
                name: item.typeName,
                parent: item.parent ? item.parent._id : null
            })
        })
        return typeArr;
    }

    render() {
        const { id } = this.props;
        const { translate, user, assetType, assetsManager, role, department } = this.props;
        const {
            img, code, assetName, assetTypes, group, serial, purchaseDate, warrantyExpirationDate, managedBy, isObj,
            assignedToUser, assignedToOrganizationalUnit, handoverFromDate, handoverToDate, location, description, status, typeRegisterForUse, detailInfo,
            errorOnCode, errorOnAssetName, errorOnSerial, errorOnAssetType, errorOnLocation, errorOnPurchaseDate,
            errorOnWarrantyExpirationDate, errorOnManagedBy, errorOnNameField, errorOnValue, usageLogs, readByRoles, errorOnNameFieldPosition, errorOnValuePosition
        } = this.state;

        var userlist = user.list, departmentlist = department.list;
        let startDate = status == "in_use" && usageLogs && usageLogs.length ? this.formatDate(usageLogs[usageLogs.length - 1].startDate) : '';
        let endDate = status == "in_use" && usageLogs && usageLogs.length ? this.formatDate(usageLogs[usageLogs.length - 1].endDate) : '';
        var assettypelist = assetType.listAssetTypes;
        let typeInTreeSelect = [];

        if (assetTypes) {
            isObj ? assetTypes.map(item => {
                typeInTreeSelect.push(item._id)
            }) : typeInTreeSelect = assetTypes;
        }

        let assetbuilding = assetsManager && assetsManager.buildingAssets;
        let assetbuildinglist = assetbuilding && assetbuilding.list;
        let buildingList = assetbuildinglist && assetbuildinglist.map(node => {
            return {
                ...node,
                id: node._id,
                name: node.assetName,
                parent: node.location,
            }
        })
        let typeArr = this.getAssetTypes();

        return (
            <div id={id} className="tab-pane active">
                <div className="row">
                    {/* Ảnh tài sản */}
                    <div className="col-md-4" style={{ textAlign: 'center', paddingLeft: '0px' }}>
                        <div>
                            {/* <a href={img} target="_blank">
                                <img className="attachment-img avarta" src={img} alt="Attachment" />
                            </a> */}
                            {img && <ApiImage className="attachment-img avarta" id={`avater-imform-${id}`} src={img} />}
                        </div>
                        <div className="upload btn btn-default ">
                            {translate('manage_asset.upload')}
                            <input className="upload" type="file" name="file" onChange={this.handleUpload} />
                        </div>
                    </div>

                    <br />
                    {/* Thông tin cơ bản */}
                    <div className="col-md-8" style={{ paddingLeft: '0px' }}>
                        <div>
                            <div id="form-create-asset-type" className="col-md-6">
                                {/* Mã tài sản */}
                                <div className={`form-group ${!errorOnCode ? "" : "has-error"} `}>
                                    <label htmlFor="code">{translate('asset.general_information.asset_code')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="code" value={code} onChange={this.handleCodeChange} placeholder={translate('asset.general_information.asset_code')}
                                        autoComplete="off" />
                                    <ErrorLabel content={errorOnCode} />
                                </div>

                                {/* Tên tài sản */}
                                <div className={`form-group ${!errorOnAssetName ? "" : "has-error"} `}>
                                    <label htmlFor="assetName">{translate('asset.general_information.asset_name')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="assetName" value={assetName} onChange={this.handleAssetNameChange} placeholder={translate('asset.general_information.asset_name')}
                                        autoComplete="off" />
                                    <ErrorLabel content={errorOnAssetName} />
                                </div>

                                {/* Số serial */}
                                <div className={`form-group ${!errorOnSerial ? "" : "has-error"} `}>
                                    <label htmlFor="serial">{translate('asset.general_information.serial_number')}</label>
                                    <input type="text" className="form-control" name="serial" value={serial} onChange={this.handleSerialChange} placeholder={translate('asset.general_information.serial_number')}
                                        autoComplete="off" />
                                    <ErrorLabel content={errorOnSerial} />
                                </div>

                                {/* Nhóm tài sản */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.asset_group')}<span className="text-red">*</span></label>
                                    <SelectBox
                                        id={`group${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={group}
                                        items={[
                                            { value: null, text: `---${translate('asset.asset_info.select_group')}---` },
                                            { value: 'building', text: translate('asset.asset_info.building') },
                                            { value: 'vehicle', text: translate('asset.asset_info.vehicle') },
                                            { value: 'machine', text: translate('asset.asset_info.machine') },
                                            { value: 'other', text: translate('asset.asset_info.other') },
                                        ]}
                                        onChange={this.handleGroupChange}
                                    />
                                </div>

                                {/* Loại tài sản */}
                                <div className={`form-group ${!errorOnAssetType ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.asset_type')}<span className="text-red">*</span></label>
                                    <TreeSelect
                                        data={typeArr}
                                        value={typeInTreeSelect}
                                        handleChange={this.handleAssetTypeChange}
                                        mode="hierarchical"
                                    />
                                </div>

                                {/* Ngày nhập */}
                                <div className={`form-group ${!errorOnPurchaseDate ? "" : "has-error"}`}>
                                    <label htmlFor="purchaseDate">{translate('asset.general_information.purchase_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`purchaseDate${id}`}
                                        value={purchaseDate ? this.formatDate(purchaseDate) : ''}
                                        onChange={this.handlePurchaseDateChange}
                                    />
                                    <ErrorLabel content={errorOnPurchaseDate} />
                                </div>

                                {/* Ngày bảo hành */}
                                <div className={`form-group ${!errorOnWarrantyExpirationDate ? "" : "has-error"}`}>
                                    <label htmlFor="warrantyExpirationDate">{translate('asset.general_information.warranty_expiration_date')}</label>
                                    <DatePicker
                                        id={`warrantyExpirationDate${id}`}
                                        value={warrantyExpirationDate ? this.formatDate(warrantyExpirationDate) : ''}
                                        onChange={this.handleWarrantyExpirationDateChange}
                                    />
                                    <ErrorLabel content={errorOnPurchaseDate} />
                                </div>

                                {/* Người quản lý */}
                                <div className={`form-group${!errorOnManagedBy ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.manager')}</label>
                                    <div id="managedByBox">
                                        <SelectBox
                                            id={`managedBy${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={userlist.map(x => { return { value: x.id, text: x.name + " - " + x.email } })}
                                            onChange={this.handleManagedByChange}
                                            value={managedBy}
                                            multiple={false}
                                        />
                                    </div>
                                    <ErrorLabel content={errorOnManagedBy} />
                                </div>
                                {/* Quyền xem tài sản theo role */}
                                <div className="form-group">
                                    <label>{translate('system_admin.system_link.table.roles')}</label>
                                    <div>
                                        <SelectBox
                                            id={`select-link-default-roles-${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={role.list.map(role => { return { value: role ? role._id : null, text: role ? role.name : "Role is deleted" } })}
                                            value={readByRoles}
                                            onChange={this.handleRoles}
                                            multiple={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">

                                {/* Vị trí tài sản */}
                                <div className={`form-group ${!errorOnLocation ? "" : "has-error"}`}>
                                    <label htmlFor="location">{translate('asset.general_information.asset_location')}</label>
                                    <TreeSelect data={buildingList} value={[location]} handleChange={this.handleLocationChange} mode="radioSelect" />
                                    <ErrorLabel content={errorOnLocation} />
                                </div>

                                {/* Trạng thái */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.status')}<span className="text-red">*</span></label>
                                    <SelectBox
                                        id={`status${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={status}
                                        items={[
                                            { value: '', text: '---Chọn trạng thái---' },
                                            { value: 'ready_to_use', text: translate('asset.general_information.ready_use') },
                                            { value: 'in_use', text: translate('asset.general_information.using') },
                                            { value: 'broken', text: translate('asset.general_information.damaged') },
                                            { value: 'lost', text: translate('asset.general_information.lost') },
                                            { value: 'disposed', text: translate('asset.general_information.disposal') },
                                        ]}
                                        onChange={this.handleStatusChange}
                                    />
                                </div>

                                {/* Quyền đăng ký sử dụng */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.can_register_for_use')}<span className="text-red">*</span></label>
                                    <SelectBox
                                        id={`typeRegisterForUse${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={typeRegisterForUse}
                                        items={[
                                            { value: '', text: translate('asset.general_information.select_role_to_use') },
                                            { value: 1, text: translate('asset.general_information.not_for_registering') },
                                            { value: 2, text: translate('asset.general_information.register_by_hour') },
                                            { value: 3, text: translate('asset.general_information.register_for_long_term') },
                                        ]}
                                        onChange={this.handleTypeRegisterForUseChange}
                                    />
                                </div>

                                {/* Người sử dụng */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.general_information.user')}&emsp; </label>
                                    <div id="assignedToUserBox">
                                        <SelectBox
                                            id={`assignedToUserBox${assignedToUser}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={assignedToUser ? assignedToUser : ""}
                                            items={[{ value: 'null', text: 'Chưa có người được giao sử dụng' }, ...userlist.map(x => { return { value: x.id, text: x.name + " - " + x.email } })]}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* Đơn vị sử dụng */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.organization_unit')}&emsp; </label>
                                    <div id="assignedToOrganizationalUnitBox">
                                        <SelectBox
                                            id={`assignedToOrganizationalUnitBox${assignedToOrganizationalUnit}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[{ value: 'null', text: 'Chưa có đơn vị được giao sử dụng' }, ...departmentlist.map(x => { return { value: x._id, text: x.name } })]}
                                            value={assignedToOrganizationalUnit ? assignedToOrganizationalUnit : ""}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* Thời gian bắt đầu sử dụng */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.handover_from_date')}&emsp; </label>
                                    < DatePicker
                                        id={`start-date${assignedToUser}-${assignedToOrganizationalUnit}`}
                                        value={startDate}
                                        disabled
                                    />
                                </div>

                                {/* Thời gian kết thúc sử dụng */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.handover_to_date')}&emsp; </label>
                                    < DatePicker
                                        id={`end-date${assignedToUser}-${assignedToOrganizationalUnit}`}
                                        value={endDate}
                                        disabled
                                    />
                                </div>

                                {/* Mô tả */}
                                <div className="form-group">
                                    <label htmlFor="description">{translate('asset.general_information.description')}</label>
                                    <textarea className="form-control" rows="3" name="description" value={description} onChange={this.handleDescriptionChange} placeholder="Enter ..." autoComplete="off" ></textarea>
                                </div>

                            </div>
                        </div>

                        {/* Thông tin chi tiết */}
                        <div className="col-md-12">
                            <label>{translate('asset.general_information.asset_properties')}:<a style={{ cursor: "pointer" }} title={translate('asset.general_information.asset_properties')}><i className="fa fa-plus-square" style={{ color: "#00a65a", marginLeft: 5 }}
                                onClick={this.handleAddDetailInfo} /></a></label>

                            {/* Bảng thông tin chi tiết */}
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.field_name')}</th>
                                        <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.value')}</th>
                                        <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
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
                                                <td style={{ paddingLeft: '0px' }}>
                                                    <div className={`form-group ${(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) ? "has-error" : ""}`}>
                                                        <input className="form-control" type="text" value={x.nameField} name="nameField" style={{ width: "100%" }} onChange={(e) => this.handleChangeNameField(e, index)} />
                                                        {(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) && <ErrorLabel content={errorOnNameField} />}
                                                    </div>
                                                </td>

                                                <td style={{ paddingLeft: '0px' }}>
                                                    <div className={`form-group ${(parseInt(errorOnValuePosition) === index && errorOnValue) ? "has-error" : ""}`}>
                                                        <input className="form-control" type="text" value={x.value} name="value" style={{ width: "100%" }} onChange={(e) => this.handleChangeValue(e, index)} />
                                                        {(parseInt(errorOnValuePosition) === index && errorOnValue) && <ErrorLabel content={errorOnValue} />}
                                                    </div>
                                                </td>

                                                <td style={{ textAlign: "center" }}>
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                                </td>
                                            </tr>
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { assetType, user, assetsManager, role, department } = state;
    return { assetType, user, assetsManager, role, department };
};

const actionCreators = {
    getUser: UserActions.get,
    getAssetType: AssetTypeActions.searchAssetTypes,
};
const generalTab = connect(mapState, actionCreators)(withTranslate(GeneralTab));
export { generalTab as GeneralTab };
