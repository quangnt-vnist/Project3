import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { AssetManagerActions } from '../redux/actions';

import { AssetImportTab } from './assetImportTab';

import {
    configurationGeneralInformationOfAsset,
    configurationUsageInformationOfAssetTemplate,
    configurationIncidentInformationOfAssetTemplate,
    configurationMaintainanceInformationOfAssetTemplate,
    configurationDepreciationInformationOfAssetTemplate,
    configurationDisposalInformationOfAssetTemplate,
    importAssetTemplate
} from './fileConfigurationImportAsset';

import { DialogModal } from '../../../../../common-components';

class AssetImportForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            importGeneralInformationData: [],
            importDepreciationInformationData: [],
            importDisposalInformationData: [],
            importIncidentInformationData: [],
            importMaintainanceInformationData: [],
            importUsageInformationData: []
        }
    }

    componentDidMount() {
        this.props.getAllUsers();
    }

    save = () => {
        const {
            importGeneralInformationData,
            importDepreciationInformationData,
            importDisposalInformationData,
            importIncidentInformationData,
            importMaintainanceInformationData,
            importUsageInformationData
        } = this.state;

        let asset = {
            ...importGeneralInformationData[0],
            ...importDepreciationInformationData[0],
            ...importDisposalInformationData[0],
            maintainanceLogs: importMaintainanceInformationData,
            usageLogs: importUsageInformationData,
            incidentLogs: importIncidentInformationData,
        }

        this.props.addNewAsset(asset)
    }

    isFormValidated = () => {
        const {
            errorGeneralInformationData,
            errorDepreciationInformationData,
            errorDisposalInformationData,
            errorIncidentInformationData,
            errorMaintainanceInformationData,
            errorUsageInformationData
        } = this.state;

        return errorGeneralInformationData && errorDepreciationInformationData && errorDisposalInformationData && errorIncidentInformationData && errorMaintainanceInformationData && errorUsageInformationData;
    }

    // Xử lý dữ liệu export file mẫu import tài sản
    convertAssetTemplate = (dataTemplate) => {
        const { user, assetsManager, role, assetType, department } = this.props;
        let userList = [], departmentList = [], assetTypes = [], roles = [], assetLocations = [], assetGroups = [], status = [], typeRegisterForUse = [];
        let depreciationType = [];
        let incidentType = [], incidentStatus = [];
        let maintainanceType = [], maintainanceStatus = [];
        let disposalType = [];

        if (user) {
            userList = user.list.map(item => item.name + " - " + item.email);
            if (!userList) userList = [];
        }
        if (assetType) {
            assetTypes = assetType.listAssetTypes.map(item => item.typeName);
            if (!assetTypes) assetTypes = [];
        }
        if (role) {
            roles = role.list.map(item => item.name);
            if (!roles) roles = [];
        }
        if (assetsManager) {
            assetLocations = assetsManager.buildingAssets && assetsManager.buildingAssets.list.map(item => item.assetName);
            if (!assetLocations) assetLocations = [];
        }
        if (department) {
            departmentList = department.list.map(item => item.name);
            if (!departmentList) departmentList = [];
        }

        // Thông tin chung
        assetGroups = ["Mặt bằng", "Xe cộ", "Máy móc", "Khác"];
        status = ["Sẵn sàng sử dụng", "Đang sử dụng", "Hỏng hóc", "Mất", "Thanh lý"];
        typeRegisterForUse = ["Không đươc đăng ký sử dụng", "Đăng ký sử dụng theo giờ", "Đăng ký sử dụng lâu dài"];

        depreciationType = ["Đường thẳng", "Số dư giảm dần", "Sản lượng"];

        // Sự cố tài sản
        incidentType = ["Hỏng hóc", "Mất"];
        incidentStatus = ["Chờ xử lý", "Đấ xử lý"];

        // Bảo trì tài sản
        maintainanceType = ["Sửa chữa", "Thay thế", "Nâng cấp"];
        maintainanceStatus = ["Đã thực hiện", "Đang thực hiện", "Chưa thực hiện"];

        // Thanh lý tài sản
        disposalType = ["Tiêu hủy", "Nhượng bán", "Tặng"];

        for (let i = 0; i < dataTemplate.dataSheets.length; i++) {
            switch (dataTemplate.dataSheets[i].type) {
                case "General":
                    dataTemplate.dataSheets[i] = this.convertImportGeneralInformationOfAssetTemplate(dataTemplate.dataSheets[i], userList, assetTypes, roles, assetLocations, assetGroups, status, typeRegisterForUse);
                    break;
                case "Depreciation":
                    dataTemplate.dataSheets[i] = this.convertImportDepreciationInformationOfAssetTemplate(dataTemplate.dataSheets[i], depreciationType);
                    break;
                case "Usage":
                    dataTemplate.dataSheets[i] = this.convertImportUsageInformationOfAssetTemplate(dataTemplate.dataSheets[i], userList, departmentList);
                    break;
                case "Incident":
                    dataTemplate.dataSheets[i] = this.convertImportIncidentInformationOfAssetTemplate(dataTemplate.dataSheets[i], userList, incidentType, incidentStatus);
                    break;
                case "Maintainance":
                    dataTemplate.dataSheets[i] = this.convertImportMaintainanceInformationOfAssetTemplate(dataTemplate.dataSheets[i], maintainanceType, maintainanceStatus);
                    break;
                case "Disposal":
                    dataTemplate.dataSheets[i] = this.convertImportDisposalInformationOfAssetTemplate(dataTemplate.dataSheets[i], disposalType);
                    break;
            }
        }

        let data = [], sheetData;
        let length = Math.max(userList.length, departmentList.length, assetTypes.length,
            roles.length, assetLocations.length, assetGroups.length, status.length,
            typeRegisterForUse.length, depreciationType.length, incidentType.length,
            incidentStatus.length, maintainanceType.length, maintainanceStatus.length, disposalType.length);
        
        for (let i = 0; i < length; i++) {
            data.push({
                userList: userList[i] ? userList[i] : "",
                assetTypes: assetTypes[i] ? assetTypes[i] : "",
                roles: roles[i] ? roles[i] : "",
                assetLocations: assetLocations[i] ? assetLocations[i] : "",
                departmentList: departmentList[i] ? departmentList[i] : "",
                assetGroups: assetGroups[i] ? assetGroups[i] : "",
                status: status[i] ? status[i] : "",
                typeRegisterForUse: typeRegisterForUse[i] ? typeRegisterForUse[i] : "",
                depreciationType: depreciationType[i] ? depreciationType[i] : "",
                incidentType: incidentType[i] ? incidentType[i] : "",
                incidentStatus: incidentStatus[i] ? incidentStatus[i] : "",
                maintainanceType: maintainanceType[i] ? maintainanceType[i] : "",
                maintainanceStatus: maintainanceStatus[i] ? maintainanceStatus[i] : "",
                disposalType: disposalType[i] ? disposalType[i] : ""
            })
        }

        sheetData = {
            sheetName: "Các trường thông tin",
            tables: [{
                rowHeader: 1,
                columns: [
                    { key: "userList", value: "Người quản lý" },
                    { key: "assetTypes", value: "Loại tài sản" },
                    { key: "roles", value: "Role" },
                    { key: "assetLocations", value: "Vị trí tài sản" },
                    { key: "departmentList", value: "Đơn vị" },
                    { key: "assetGroups", value: "Nhóm tài sản" },
                    { key: "status", value: "Trạng thái tài sản" },
                    { key: "typeRegisterForUse", value: "Quyền đăng ký sử dụng" },
                    { key: "depreciationType", value: "Phương pháp khấu hao" },
                    { key: "incidentType", value: "Loại sự cố" },
                    { key: "incidentStatus", value: "Trạng thái sự cố" },
                    { key: "maintainanceType", value: "Phân loại bảo trì" },
                    { key: "maintainanceStatus", value: "Trạng thái bảo trì" },
                    { key: "disposalType", value: "Hình thức thanh lý" }
                ],
                data: data
            }]
        }

        if (dataTemplate.dataSheets.filter(item => item.sheetName === "Các trường thông tin").length === 0) {
            dataTemplate.dataSheets.push(sheetData);
        } else {
            dataTemplate.dataSheets.pop();
            dataTemplate.dataSheets.push(sheetData);
        }

        return dataTemplate;
    }

    // Xử lý dữ liệu export file mẫu thông tin chung 
    convertImportGeneralInformationOfAssetTemplate = (dataTemplate, userList, assetTypes, roles, assetLocations, assetGroups, status, typeRegisterForUse) => {
        for (let j = 0; j < dataTemplate.tables.length; j++) {
            let datas = [];
            let data = dataTemplate.tables[j].data;

            for (let index = 0; index < data.length; index++) {
                let dataTemporary = data[index];

                let out = {
                    code: dataTemporary.code,
                    assetName: dataTemporary.assetName,
                    serial: dataTemporary.serial,
                    group: assetGroups[0],
                    assetType: assetTypes && assetTypes[0] ? (assetTypes[1] ? assetTypes[0] + ", " + assetTypes[1] : assetTypes[0]) : "",
                    purchaseDate: dataTemporary.purchaseDate,
                    warrantyExpirationDate: dataTemporary.warrantyExpirationDate,
                    managedBy: userList && userList[0] ? userList[0] : "",
                    readByRoles: roles && roles[0] ? (roles[1] ? roles[0] + ", " + roles[1] : roles[0]) : "",
                    location: assetLocations && assetLocations[0] ? assetLocations[0] : "",
                    status: status[0],
                    typeRegisterForUse: typeRegisterForUse[0],
                    description: dataTemporary.description
                }
                datas = [...datas, out];
            }
            dataTemplate.tables[j].data = datas;
        }

        return dataTemplate;
    }

    // Xử lý dữ liệu export file mẫu khấu hao tài sản 
    convertImportDepreciationInformationOfAssetTemplate = (dataTemplate, depreciationType) => {
        for (let j = 0; j < dataTemplate.tables.length; j++) {
            let datas = [];
            let data = dataTemplate.tables[j].data;

            for (let index = 0; index < data.length; index++) {
                let dataTemporary = data[index];

                let out = {
                    cost: Number(dataTemporary.cost),
                    residualValue: Number(dataTemporary.residualValue),
                    usefulLife: Number(dataTemporary.usefulLife),
                    startDepreciation: dataTemporary.startDepreciation,
                    depreciationType: depreciationType[0]
                }
                datas = [...datas, out];
            }
            dataTemplate.tables[j].data = datas;
        }

        return dataTemplate;
    }

    // Xử lý dữ liệu export file mẫu sử dụng tài sản 
    convertImportUsageInformationOfAssetTemplate = (dataTemplate, userList, departmentList) => {
        for (let j = 0; j < dataTemplate.tables.length; j++) {
            let datas = [];
            let data = dataTemplate.tables[j].data;

            for (let index = 0; index < data.length; index++) {
                let dataTemporary = data[index];

                let out = {
                    usedByUser: userList && userList[0] ? userList[0] : "",
                    usedByOrganizationalUnit: departmentList && departmentList[0] ? departmentList[0] : "",
                    startDate: dataTemporary.startDate,
                    endDate: dataTemporary.endDate,
                    description: dataTemporary.description
                }
                datas = [...datas, out];
            }
            dataTemplate.tables[j].data = datas;
        }

        return dataTemplate;
    }

    // Xử lý dữ liệu export file mẫu sự cố tài sản 
    convertImportIncidentInformationOfAssetTemplate = (dataTemplate, userList, incidentType, status) => {
        for (let j = 0; j < dataTemplate.tables.length; j++) {
            let datas = [];
            let data = dataTemplate.tables[j].data;

            for (let index = 0; index < data.length; index++) {
                let dataTemporary = data[index];

                let out = {
                    incidentCode: dataTemporary.incidentCode,
                    type: incidentType[0],
                    reportedBy: userList && userList[0] ? userList[0] : "",
                    dateOfIncident: dataTemporary.dateOfIncident,
                    description: dataTemporary.description,
                    statusIncident: status[0]
                }
                datas = [...datas, out];
            }
            dataTemplate.tables[j].data = datas;
        }

        return dataTemplate;
    }

    // Xử lý dữ liệu export file mẫu bảo trì tài sản 
    convertImportMaintainanceInformationOfAssetTemplate = (dataTemplate, maintainanceType, status) => {
        for (let j = 0; j < dataTemplate.tables.length; j++) {
            let datas = [];
            let data = dataTemplate.tables[j].data;

            for (let index = 0; index < data.length; index++) {
                let dataTemporary = data[index];

                let out = {
                    maintainanceCode: dataTemporary.maintainanceCode,
                    createDate: dataTemporary.createDate,
                    type: maintainanceType[0],
                    description: dataTemporary.description,
                    startDate: dataTemporary.startDate,
                    endDate: dataTemporary.endDate,
                    expense: Number(dataTemporary.expense),
                    status: status[0]
                }
                datas = [...datas, out];
            }
            dataTemplate.tables[j].data = datas;
        }

        return dataTemplate;
    }

    // Xử lý dữ liệu export file mẫu thanh lý tài sản 
    convertImportDisposalInformationOfAssetTemplate = (dataTemplate, disposalType) => {
        for (let j = 0; j < dataTemplate.tables.length; j++) {
            let datas = [];
            let data = dataTemplate.tables[j].data;

            for (let index = 0; index < data.length; index++) {
                let dataTemporary = data[index];

                let out = {
                    disposalDate: dataTemporary.disposalDate,
                    disposalType: disposalType[0],
                    disposalCost: Number(dataTemporary.disposalCost),
                    disposalDesc: dataTemporary.disposalDesc,
                }
                datas = [...datas, out];
            }
            dataTemplate.tables[j].data = datas;
        }

        return dataTemplate;
    }

    // Xử lý file import thông tin chung
    handleImportExcelGeneralInformation = (value, checkFileImport) => {
        const { user, assetsManager, role, assetType } = this.props;
        let importGeneralInformationData = [];
        let managers = {}, assetTypes = {}, roles = {}, assetLocations = {};
        let rowError = [];

        if (user) {
            user.list.map(item => {
                managers[item.name + " - " + item.email] = item._id;
            })
        }
        if (assetType) {
            assetType.listAssetTypes.map(item => {
                assetTypes[item.typeName] = item._id;
            })
        }
        if (role) {
            role.list.map(item => {
                roles[item.name] = item._id
            })
        }
        if (assetsManager) {
            assetsManager.buildingAssets && assetsManager.buildingAssets.list.map(item => {
                assetLocations[item.assetName] = item._id
            })
        }

        if (checkFileImport) {
            let assetTypeArray = [], roleArray = [], assetGroups, status, typeRegisterForUse, checkAssetType = false, checkRole = false;

            assetGroups = { "Mặt bằng": "building", "Xe cộ": "vehicle", "Máy móc": "machine", "Khác": "other" };
            status = { "Sẵn sàng sử dụng": "ready_to_use", "Đang sử dụng": "in_use", "Hỏng hóc": "broken", "Mất": "lost", "Thanh lý": "disposed" };
            typeRegisterForUse = { "Không đươc đăng ký sử dụng": 1, "Đăng ký sử dụng theo giờ": 2, "Đăng ký sử dụng lâu dài": 3 };

            value = value.map((item, index) => {
                let errorAlert = [];

                assetTypeArray = item.assetType && item.assetType.split(", ");
                roleArray = item.readByRoles && item.readByRoles.split(", ");
                assetTypeArray.map(item => {
                    if (!assetTypes[item]) {
                        checkAssetType = true;
                    }
                })
                roleArray.map(item => {
                    if (!roles[item]) {
                        checkRole = true;
                    }
                })

                if (!item.code || !item.assetName || !item.group || !item.assetType || !item.purchaseDate || !item.status || !item.typeRegisterForUse
                    || (item.group && !assetGroups[item.group])
                    || (item.assetType && checkAssetType)
                    || (item.typeRegisterForUse && !typeRegisterForUse[item.typeRegisterForUse])
                    || (item.status && !status[item.status])
                    || (item.managedBy && !managers[item.managedBy])
                    || (item.readByRoles && checkRole)
                    || (item.location && !assetLocations[item.location])
                ) {
                    rowError = [...rowError, index + 1];
                    item = { ...item, error: true };
                }

                if (!item.code) {
                    errorAlert = [...errorAlert, 'Mã tài sản không được để trống'];
                }

                if (!item.assetName) {
                    errorAlert = [...errorAlert, 'Tên tài sản không được để trống'];
                }

                if (!item.group) {
                    errorAlert = [...errorAlert, 'Nhóm tài sản không được để trống'];
                } else if (item.group && !assetGroups[item.group]) {
                    errorAlert = [...errorAlert, 'Nhóm tài sản không chính xác'];
                }

                if (!item.assetType) {
                    errorAlert = [...errorAlert, 'Loại tài sản không được để trống'];
                } else if (item.assetType && checkAssetType) {
                    errorAlert = [...errorAlert, 'Loại tài sản không chính xác'];
                }

                if (!item.status) {
                    errorAlert = [...errorAlert, 'Trạng thái không được để trống'];
                } else if (item.status && !status[item.status]) {
                    errorAlert = [...errorAlert, 'Trạng thái không chính xác'];
                }

                if (!item.typeRegisterForUse) {
                    errorAlert = [...errorAlert, 'Quyền đăng ký sử dụng không được để trống'];
                } else if (item.typeRegisterForUse && !typeRegisterForUse[item.typeRegisterForUse]) {
                    errorAlert = [...errorAlert, 'Quyền đăng ký sử dụng không chính xác'];
                }

                if (!item.purchaseDate) {
                    errorAlert = [...errorAlert, 'Ngày nhập không được để trống'];
                }

                if (item.managedBy && !managers[item.managedBy]) {
                    errorAlert = [...errorAlert, 'Người quản lý không chính xác'];
                }

                if (item.readByRoles && checkRole) {
                    errorAlert = [...errorAlert, 'Những roles có quyèn không chính xác'];
                }

                if (item.location && !assetLocations[item.location]) {
                    errorAlert = [...errorAlert, 'Vị trí tài sản không chính xác'];
                }

                item = { ...item, errorAlert: errorAlert };
                importGeneralInformationData = [...importGeneralInformationData,
                    {
                        ...item,
                        assetType: assetTypeArray.map(type => assetTypes[type]),
                        readByRoles: roleArray.map(role => roles[role]),
                        managedBy: managers[item.manager],
                        location: assetLocations[item.location],
                        group: assetGroups[item.group],
                        typeRegisterForUse: typeRegisterForUse[item.typeRegisterForUse],
                        status: status[item.status]
                    }
                ];

                return item;

            });

            this.setState(state => {
                return {
                    ...state,
                    importGeneralInformationData: importGeneralInformationData,
                    errorGeneralInformationData: rowError.length === 0
                }
            })

            return { importData: value, rowError: rowError }
        } else {
            this.setState(state => {
                return {
                    ...state,
                    checkFileImport: checkFileImport,
                }
            })

            return { checkFileImport: checkFileImport }
        }
    }

    // Xử lý file import khấu hao tài sản
    handleImportExcelDepreciationInformation = (value, checkFileImport) => {
        let rowError = [], importDepreciationInformationData = [];

        if (checkFileImport) {
            value = value.map((item, index) => {
                let errorAlert = [];
                let depreciationType = { "Đường thẳng": "straight_line", "Số dư giảm dần": "declining_balance", "Sản lượng": "units_of_production" };

                if (!item.cost || !item.usefulLife || !item.startDepreciation || !item.depreciationType || !depreciationType[item.depreciationType]) {
                    rowError = [...rowError, index + 1];
                    item = { ...item, error: true };
                }

                if (!item.cost) {
                    errorAlert = [...errorAlert, 'Nguyên giá không được để trống'];
                }

                if (!item.usefulLife) {
                    errorAlert = [...errorAlert, 'Thời gian sử dụng không được để trống'];
                }

                if (!item.startDepreciation) {
                    errorAlert = [...errorAlert, 'Thời gian bắt đầu trích khấu hao không được để trống'];
                }

                if (!item.depreciationType) {
                    errorAlert = [...errorAlert, 'Phương pháp khấu hao không được để trống'];
                }
                else if (!depreciationType[item.depreciationType]) {
                    errorAlert = [...errorAlert, 'Phương pháp khấu hao không chính xác'];
                }

                item = { ...item, errorAlert: errorAlert };
                importDepreciationInformationData = [...importDepreciationInformationData,
                    {
                        ...item,
                        depreciationType: depreciationType[item.depreciationType]
                    }
                ]
                return item;
            });

            this.setState(state => {
                return {
                    ...state,
                    importDepreciationInformationData: importDepreciationInformationData,
                    errorDepreciationInformationData: rowError.length === 0
                }
            })

            return { importData: value, rowError: rowError }
        } else {
            this.setState(state => {
                return {
                    ...state,
                    checkFileImport: checkFileImport,
                }
            })

            return { checkFileImport: checkFileImport }
        }
    }

    // Xử lý file import sử dụng tài sản
    handleImportExcelUsageInformation = (value, checkFileImport) => {
        const { user, department } = this.props;
        let userList = {}, departmentList = {};
        let rowError = [], importUsageInformationData = [];

        if (user) {
            user.list.map(item => {
                userList[item.name + " - " + item.email] = item._id;
            })
        }
        if (department) {
            department.list.map(item => {
                departmentList[item.name] = item._id;
            })
        }

        if (checkFileImport) {
            value = value.map((item, index) => {
                let errorAlert = [];

                if (!item.usedByUser || !item.startDate || !userList[item.usedByUser] || (item.usedByOrganizationalUnit && !departmentList[item.usedByOrganizationalUnit])) {
                    rowError = [...rowError, index + 1];
                    item = { ...item, error: true };
                }

                if (!item.usedByUser) {
                    errorAlert = [...errorAlert, 'Người sử dụng không được để trống'];
                }
                else if (!userList[item.usedByUser]) {
                    errorAlert = [...errorAlert, 'Người sử dụng không chính xác'];
                }

                if (!item.startDate) {
                    errorAlert = [...errorAlert, 'Ngày bắt đầu sử dụng không được để trống'];
                }

                if (item.usedByOrganizationalUnit && !departmentList[item.usedByOrganizationalUnit]) {
                    errorAlert = [...errorAlert, 'Đơn vị sử dụng không chính xác'];
                }

                importUsageInformationData = [...importUsageInformationData,
                    {
                        ...item,
                        usedByUser: item.usedByUser && userList[item.usedByUser],
                        usedByOrganizationalUnit: item.usedByOrganizationalUnit && departmentList[item.usedByOrganizationalUnit]
                    }
                ];
                item = { ...item, errorAlert: errorAlert };
                return item;
            });

            this.setState(state => {
                return {
                    ...state,
                    importUsageInformationData: importUsageInformationData,
                    errorUsageInformationData: rowError.length === 0
                }
            })

            return { importData: value, rowError: rowError }
        } else {
            this.setState(state => {
                return {
                    ...state,
                    checkFileImport: checkFileImport,
                }
            })

            return { checkFileImport: checkFileImport }
        }
    }

    // Xử lý file import sự cố tài sản
    handleImportExcelIncidentInformation = (value, checkFileImport) => {
        const { user } = this.props;
        let userList = {};
        let rowError = [], importIncidentInformationData = [];

        if (user) {
            user.list.map(item => {
                userList[item.name + " - " + item.email] = item._id;
            })
        }

        if (checkFileImport) {
            value = value.map((item, index) => {
                let errorAlert = [];
                let incidentType = ["Hỏng hóc", "Mất"];
                let status = ["Chờ xử lý", "Đấ xử lý"];

                if (!item.dateOfIncident || !item.description || (item.reportedBy && !userList[item.reportedBy])
                    || (item.type && !incidentType.includes(item.type))
                    || (item.statusIncident && !status.includes(item.statusIncident))
                ) {
                    rowError = [...rowError, index + 1];
                    item = { ...item, error: true };
                }

                if (item.reportedBy && !userList[item.reportedBy]) {
                    errorAlert = [...errorAlert, 'Người báo cáo không chính xác'];
                }

                if (!item.dateOfIncident) {
                    errorAlert = [...errorAlert, 'Ngày phát hiện không được để trống'];
                }

                if (!item.description) {
                    errorAlert = [...errorAlert, 'Nội dung không được để trống'];
                }

                if (item.type && !incidentType.includes(item.type)) {
                    errorAlert = [...errorAlert, 'Loại sự cố không chính xác'];
                }

                if (item.statusIncident && !status.includes(item.statusIncident)) {
                    errorAlert = [...errorAlert, 'Trạng thái không chính xác'];
                }

                importIncidentInformationData = [...importIncidentInformationData,
                    {
                        ...item,
                        reportedBy: item.reportedBy && userList[item.reportedBy],
                    }
                ]
                item = { ...item, errorAlert: errorAlert };
                return item;
            });

            this.setState(state => {
                return {
                    ...state,
                    importIncidentInformationData: importIncidentInformationData,
                    errorIncidentInformationData: rowError.length === 0
                }
            })

            return { importData: value, rowError: rowError }
        } else {
            this.setState(state => {
                return {
                    ...state,
                    checkFileImport: checkFileImport,
                }
            })

            return { checkFileImport: checkFileImport }
        }
    }

    // Xử lý file import bảo trì tài sản
    handleImportExcelMaintainanceInformation = (value, checkFileImport) => {
        let rowError = [], importMaintainanceInformationData = [];

        if (checkFileImport) {
            value = value.map((item, index) => {
                let errorAlert = [];
                let maintainanceType = ["Sửa chữa", "Thay thế", "Nâng cấp"];
                let status = ["Đã thực hiện", "Đang thực hiện", "Chưa thực hiện"];

                if ((item.type && !maintainanceType.includes(item.type)) || (item.status && !status.includes(item.status))) {
                    rowError = [...rowError, index + 1];
                    item = { ...item, error: true };
                }

                if (item.type && !maintainanceType.includes(item.maintainanceType)) {
                    errorAlert = [...errorAlert, 'Phân loại không chính xác'];
                }

                if (item.status && !status.includes(item.status)) {
                    errorAlert = [...errorAlert, 'Trạng thái không chính xác'];
                }

                importMaintainanceInformationData = [...importMaintainanceInformationData, item]
                item = { ...item, errorAlert: errorAlert };
                return item;
            });

            this.setState(state => {
                return {
                    ...state,
                    importMaintainanceInformationData: importMaintainanceInformationData,
                    errorMaintainanceInformationData: rowError.length === 0
                }
            })

            return { importData: value, rowError: rowError }
        } else {
            this.setState(state => {
                return {
                    ...state,
                    checkFileImport: checkFileImport,
                }
            })

            return { checkFileImport: checkFileImport }
        }
    }

    // Xử lý file import thanh lý tài sản
    handleImportExcelDisposalInformation = (value, checkFileImport) => {
        let rowError = [], importDisposalInformationData = [];

        if (checkFileImport) {
            value = value.map((item, index) => {
                let errorAlert = [];
                let disposalType = ["Tiêu hủy", "Nhượng bán", "Tặng"];

                if ((item.disposalType && !disposalType.includes(item.disposalType))) {
                    rowError = [...rowError, index + 1];
                    item = { ...item, error: true };
                }

                if (item.disposalType && !disposalType.includes(item.disposalType)) {
                    errorAlert = [...errorAlert, 'Hình thức thanh lý không chính xác'];
                }

                importDisposalInformationData = [...importDisposalInformationData, item]
                item = { ...item, errorAlert: errorAlert };
                return item;
            });

            this.setState(state => {
                return {
                    ...state,
                    importDisposalInformationData: importDisposalInformationData,
                    errorDisposalInformationData: rowError.length === 0
                }
            })

            return { importData: value, rowError: rowError }
        } else {
            this.setState(state => {
                return {
                    ...state,
                    checkFileImport: checkFileImport,
                }
            })

            return { checkFileImport: checkFileImport }
        }
    }

    render() {
        const { translate } = this.props;

        let importAssetTemplateData = this.convertAssetTemplate(importAssetTemplate);

        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-import-asset"
                    formID="form-import-asset"
                    title={translate('menu.add_asset')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <div className="nav-tabs-custom row" style={{ marginTop: '-15px' }}>
                        <ul className="nav nav-tabs">
                            <li className="active"><a title="Thông tin chung" data-toggle="tab" href="#import_create_general">Thông tin chung</a></li>
                            <li><a title="Thông tin khấu hao" data-toggle="tab" href="#import_depreciation">Thông tin khấu hao</a></li>
                            <li><a title="Thông tin sử dụng" data-toggle="tab" href="#import_usage">Thông tin sử dụng</a></li>
                            <li><a title="Thông tin sự cố" data-toggle="tab" href="#import_incident">Thông tin sự cố</a></li>
                            <li><a title="Thông tin bảo trì" data-toggle="tab" href="#import_maintainance">Thông tin bảo trì</a></li>
                            <li><a title="Thông tin thanh lý" data-toggle="tab" href="#import_disposal">Thông tin thanh lý</a></li>

                        </ul>
                        <div className="tab-content">
                            <AssetImportTab
                                id="import_create_general"
                                scrollTable={true}
                                className="tab-pane active"
                                configuration={configurationGeneralInformationOfAsset}
                                importDataTemplate={importAssetTemplateData}
                                handleCheckImportData={this.handleImportExcelGeneralInformation}
                            />
                            <AssetImportTab
                                id="import_depreciation"
                                className="tab-pane"
                                configuration={configurationDepreciationInformationOfAssetTemplate}
                                importDataTemplate={importAssetTemplateData}
                                handleCheckImportData={this.handleImportExcelDepreciationInformation}
                            />
                            <AssetImportTab
                                id="import_usage"
                                className="tab-pane"
                                configuration={configurationUsageInformationOfAssetTemplate}
                                importDataTemplate={importAssetTemplateData}
                                handleCheckImportData={this.handleImportExcelUsageInformation}
                            />
                            <AssetImportTab
                                id="import_incident"
                                className="tab-pane"
                                configuration={configurationIncidentInformationOfAssetTemplate}
                                importDataTemplate={importAssetTemplateData}
                                handleCheckImportData={this.handleImportExcelIncidentInformation}
                            />
                            <AssetImportTab
                                id="import_maintainance"
                                className="tab-pane"
                                configuration={configurationMaintainanceInformationOfAssetTemplate}
                                importDataTemplate={importAssetTemplateData}
                                handleCheckImportData={this.handleImportExcelMaintainanceInformation}
                            />
                            <AssetImportTab
                                id="import_disposal"
                                className="tab-pane"
                                configuration={configurationDisposalInformationOfAssetTemplate}
                                importDataTemplate={importAssetTemplateData}
                                handleCheckImportData={this.handleImportExcelDisposalInformation}
                            />
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { user, department, assetsManager, role, assetType } = state;
    return { user, department, assetsManager, role, assetType };
};

const actions = {
    addNewAsset: AssetManagerActions.addNewAsset,
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getAllUsers: UserActions.get
};

const connectedAssetImportForm = connect(mapState, actions)(withTranslate(AssetImportForm));
export { connectedAssetImportForm as AssetImportForm };
