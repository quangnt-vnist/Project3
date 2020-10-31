const mongoose = require("mongoose");
const Models = require(`${SERVER_MODELS_DIR}`);
const { Asset, User } = Models;
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);
const arrayToTree = require('array-to-tree');


/**
 * Lấy thông tin tài sản theo id
 * @id : id thông tin tài sản cần lấy
 */
exports.getAssetInforById = async (portal, id) => {
    return await Asset(connect(DB_CONNECTION, portal)).findById(id);
}


/**
 * Lấy danh sách tài sản theo key tìm kiếm
 * @params : dữ liệu key tìm kiếm
 */
exports.searchAssetProfiles = async (portal, company, params) => {
    let keySearch = {};
    if (company) {
        keySearch = { ...keySearch, company: company };
    }
    // Bắt sựu kiện MSTS tìm kiếm khác ""
    if (params.code) {
        keySearch = { ...keySearch, code: { $regex: params.code, $options: "i" } }
    }

    // Bắt sựu kiện Tên tài sản tìm kiếm khác ""
    if (params.assetName) {
        keySearch = { ...keySearch, assetName: { $regex: params.assetName, $options: "i" } }
    }

    // Thêm key tìm kiếm tài sản theo trạng thái hoạt động vào keySearch
    if (params.status) {
        keySearch = { ...keySearch, status: { $in: params.status } };
    }

    // Thêm key tìm kiếm tài sản theo nhóm vào keySearch
    if (params.group) {
        keySearch = { ...keySearch, group: { $in: params.group } };
    }

    // Thêm key tìm kiếm theo loại tài sản vào keySearch
    if (params.assetType) {
        keySearch = { ...keySearch, assetType: { $in: params.assetType } };
    }

    // Thêm key tìm kiếm tài sản theo trạng thái hoạt động vào keySearch
    if (params.typeRegisterForUse) {
        keySearch = { ...keySearch, typeRegisterForUse: { $in: params.typeRegisterForUse } };
    }

    // Thêm key tìm kiếm tài sản theo nhóm tài sản
    if (params.group) {
        keySearch = { ...keySearch, group: { $in: params.group } };
    }

    // Thêm key tìm kiếm tài sản theo đơn vị
    if (params.handoverUnit) {
        keySearch = { ...keySearch, assignedToOrganizationalUnit: { $in: params.handoverUnit } };
    }

    // Thêm key tìm kiếm tài sản theo id người quản lý
    if (params.managedBy) {
        keySearch = { ...keySearch, managedBy: { $in: params.managedBy } };
    }

    // Thêm key tìm kiếm tài sản theo id người dùng
    if (params.handoverUser) {
        let user = await User(connect(DB_CONNECTION, portal)).find({ name: { $regex: params.handoverUser, $options: "i" } }).select('_id');
        let userIds = [];
        user.map(x => {
            userIds.push(x._id)
        })
        keySearch = { ...keySearch, handoverUser: { $in: userIds } };
    }

    // Thêm key tìm kiếm tài sản theo loại khấu hao
    if (params.depreciationType) {
        keySearch = { ...keySearch, depreciationType: { $in: params.depreciationType } };
    }

    // Thêm key tìm kiếm tài sản theo vai trò
    if (params.currentRole) {
        keySearch = { ...keySearch, readByRoles: { $in: params.currentRole } };
    }

    // Thêm key tìm kiếm tài sản theo ngày bắt đầu khấu hao
    if (params.startDepreciation) {
        let date = params.startDepreciation.split("-");
        let start = new Date(date[1], date[0] - 1, 1);
        let end = new Date(date[1], date[0], 1);

        keySearch = {
            ...keySearch,
            startDepreciation: {
                $gt: start,
                $lte: end
            }
        }
    }

    // Thêm key tìm kiếm tài sản theo ngày nhập tài sản
    if (params.purchaseDate) {
        let date = params.purchaseDate.split("-");
        let start = new Date(date[1], date[0] - 1, 1);
        let end = new Date(date[1], date[0], 1);

        keySearch = {
            ...keySearch,
            purchaseDate: {
                $gt: start,
                $lte: end
            }
        }
    }

    // Thêm key tìm kiếm tài sản theo ngày thanh lý tài sản
    if (params.disposalDate) {
        let date = params.disposalDate.split("-");
        let start = new Date(date[1], date[0] - 1, 1);
        let end = new Date(date[1], date[0], 1);

        keySearch = {
            ...keySearch,
            disposalDate: {
                $gt: start,
                $lte: end
            }
        }
    }

    // TÌM KIẾM TRONG BẢO TRÌ

    // Thêm key tìm kiếm tài sản theo phiếu bảo trì
    if (params.maintainanceCode) {
        keySearch = { ...keySearch, "maintainanceLogs.maintainanceCode": { $regex: params.maintainanceCode, $options: "i" } }
    }

    // Thêm key tìm kiếm tài sản theo loại bảo trì
    if (params.maintainType) {
        keySearch = { ...keySearch, "maintainanceLogs.type": { $in: params.maintainType } };
    }

    // Thêm key tìm kiếm tài sản theo trạng thái bảo trì
    if (params.maintainStatus) {
        keySearch = { ...keySearch, "maintainanceLogs.status": { $in: params.maintainStatus } };
    }

    // Thêm key tìm kiếm tài sản theo ngày lập phiếu bảo trì
    if (params.maintainCreateDate) {
        let date = params.maintainCreateDate.split("-");
        let start = new Date(date[1], date[0] - 1, 1);
        let end = new Date(date[1], date[0], 1);
        keySearch = {
            ...keySearch,
            "maintainanceLogs.createDate": {
                $gt: start,
                $lte: end
            }
        }
    }

    // TÌM KIẾM TRONG SỰ CỐ

    // Thêm key tìm kiếm tài sản theo mã sự cố
    if (params.incidentCode) {
        keySearch = { ...keySearch, "incidentLogs.incidentCode": { $regex: params.incidentCode, $options: "i" } }
    }

    // Thêm key tìm kiếm tài sản theo loại sự cố
    if (params.incidentType) {
        keySearch = { ...keySearch, "incidentLogs.type": { $in: params.incidentType } };
    }

    // Thêm key tìm kiếm tài sản theo trạng thái sự cố
    if (params.incidentStatus) {
        keySearch = { ...keySearch, "incidentLogs.statusIncident": { $in: params.incidentStatus } };
    }

    // Lấy danh sách tài sản
    let totalList = await Asset(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let listAssets = await Asset(connect(DB_CONNECTION, portal)).find(keySearch).populate({ path: 'assetType' })
        .sort({ 'createdAt': 'desc' }).skip(params.page).limit(params.limit);
    return { data: listAssets, totalList }
}

/**
 * Danh sách mặt bằng dạng cây
 */
exports.getListBuildingAsTree = async (portal, company) => {
    let keySearch = { group: "building" };

    if (company) {
        keySearch = { ...keySearch, company: company };
    }

    const list = await Asset(connect(DB_CONNECTION, portal)).find(keySearch).populate({ path: 'assetType' });
    const dataConverted = list.map(building => {
        return {
            id: building._id.toString(),
            key: building._id.toString(),
            value: building._id.toString(),
            label: building.assetName,
            title: building.assetName,
            location: building.location ? building.location.toString() : null
        }
    });
    const tree = await arrayToTree(dataConverted, {});
    return { list, tree };
}

/**
 * Function merge urlFile upload với object
 * @arrayFile : mảng chứa các file
 * @arrayObject :mảng chứa các object
 */
exports.mergeUrlFileToObject = (arrayFile, arrayObject) => {
    if (arrayFile) {
        arrayObject.forEach(x => {
            arrayFile.forEach(y => {
                x.files.forEach(item => {
                    if (item.fileName === y.originalname) {
                        let path = y.destination + '/' + y.filename
                        item.fileName = y.originalname;
                        item.url = path;
                    }
                })
            })
        });
        return arrayObject;
    } else {
        return arrayObject;
    }
}

/**
 * Thêm mới tài sản
 * @data : Dữ liệu thông tin tài sản
 * @fileInfo : Thông tin file đính kèm
 */
exports.createAsset = async (portal, company, data, fileInfo) => {

    let avatar = fileInfo && fileInfo.avatar === "" ? data.avatar : fileInfo.avatar,
        file = fileInfo && fileInfo.file;
    let { maintainanceLogs, usageLogs, incidentLogs, locationLogs, files } = data;
    files = files && this.mergeUrlFileToObject(file, files);

    data.purchaseDate = new Date(data.purchaseDate);

    data.warrantyExpirationDate = new Date(data.warrantyExpirationDate);

    data.startDepreciation = new Date(data.startDepreciation);

    data.disposalDate = new Date(data.disposalDate);

    usageLogs = usageLogs.map(item => {
        return {
            ...item,
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate)
        }
    })

    incidentLogs = incidentLogs.map(item => {
        return {
            ...item,
            dateOfIncident: new Date(item.dateOfIncident)
        }
    })

    maintainanceLogs = maintainanceLogs.map(item => {
        return {
            ...item,
            createDate: new Date(item.createDate),
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate)
        }
    })

    let createAsset = await Asset(connect(DB_CONNECTION, portal)).create({
        company: company,
        avatar: avatar,
        assetName: data.assetName,
        code: data.code,
        serial: data.serial,
        group: data.group,
        assetType: data.assetType,
        readByRoles: data.readByRoles,
        purchaseDate: data.purchaseDate,
        warrantyExpirationDate: data.warrantyExpirationDate,
        managedBy: data.managedBy,
        assignedToUser: data.assignedToUser ? data.assignedToUser : null,
        assignedToOrganizationalUnit: data.assignedToOrganizationalUnit ? data.assignedToOrganizationalUnit : null,

        location: data.location,
        status: data.status,
        typeRegisterForUse: data.typeRegisterForUse,
        description: data.description,
        detailInfo: data.detailInfo,

        // Khấu hao
        cost: data.cost,
        usefulLife: data.usefulLife,
        residualValue: data.residualValue,
        startDepreciation: data.startDepreciation,
        depreciationType: data.depreciationType,

        // Sửa chữa - bảo trì
        maintainanceLogs: maintainanceLogs,

        // Cấp phát - sử dụng
        usageLogs: usageLogs,

        // Sự cố tài sản
        incidentLogs: incidentLogs,

        // Lịch sử vị trí tài sản
        locationLogs: locationLogs,

        // Thông tin thanh lý
        disposalDate: data.disposalDate,
        disposalType: data.disposalType,
        disposalCost: data.disposalCost,
        disposalDesc: data.disposalDesc,

        // Tài liệu đính kèm
        files: files,
    });

    // Lấy thông tin nhân viên vừa thêm vào
    let assets = await Asset(connect(DB_CONNECTION, portal)).find({ _id: createAsset._id });

    return { assets };
}


/**
 * Cập nhât thông tin tài sản theo id
 */
exports.updateAssetInformation = async (portal, company, id, data, fileInfo) => {
    let {
        createMaintainanceLogs,
        deleteMaintainanceLogs,
        editMaintainanceLogs,
        createUsageLogs,
        editUsageLogs,
        deleteUsageLogs,
        createIncidentLogs,
        editIncidentLogs,
        deleteIncidentLogs,
        createFiles,
        editFiles,
        deleteFiles
    } = data;
    let avatar = fileInfo.avatar === "" ? data.avatar : fileInfo.avatar,
        file = fileInfo.file;
    let oldAsset = await Asset(connect(DB_CONNECTION, portal)).findById(id);

    deleteEditCreateObjectInArrayObject = (arrObject, arrDelete, arrEdit, arrCreate, fileInfor = undefined) => {
        if (arrDelete) {
            for (let n in arrDelete) {
                arrObject = arrObject.filter(x => x._id.toString() !== arrDelete[n]._id);
            }
        }

        if (arrEdit) {
            if (fileInfor) {
                arrEdit = this.mergeUrlFileToObject(fileInfor, arrEdit);
            }
            for (let n in arrEdit) {
                arrObject = arrObject.map(x => (x._id.toString() !== arrEdit[n]._id) ? x : arrEdit[n])
            }
        }

        if (arrCreate) {
            if (fileInfor) {
                arrCreate = this.mergeUrlFileToObject(fileInfor, arrCreate);
            }
            arrCreate.forEach(x => arrObject.push(x));
        }

        return arrObject;
    }

    oldAsset.usageLogs = deleteEditCreateObjectInArrayObject(oldAsset.usageLogs, deleteUsageLogs, editUsageLogs, createUsageLogs);
    oldAsset.maintainanceLogs = deleteEditCreateObjectInArrayObject(oldAsset.maintainanceLogs, deleteMaintainanceLogs, editMaintainanceLogs, createMaintainanceLogs);
    oldAsset.incidentLogs = deleteEditCreateObjectInArrayObject(oldAsset.incidentLogs, deleteIncidentLogs, editIncidentLogs, createIncidentLogs);
    oldAsset.documents = deleteEditCreateObjectInArrayObject(oldAsset.documents, deleteFiles, editFiles, createFiles, file);

    oldAsset.avatar = avatar;
    oldAsset.assetName = data.assetName;
    oldAsset.code = data.code;
    oldAsset.serial = data.serial;
    oldAsset.assetType = data.assetType;
    oldAsset.group = data.group;
    oldAsset.purchaseDate = data.purchaseDate;
    oldAsset.warrantyExpirationDate = data.warrantyExpirationDate;
    oldAsset.managedBy = data.managedBy;
    oldAsset.assignedToUser = data.assignedToUser !== '' ? data.assignedToUser : null;
    oldAsset.assignedToOrganizationalUnit = data.assignedToOrganizationalUnit !== '' ? data.assignedToOrganizationalUnit : null;
    oldAsset.readByRoles = data.readByRoles
    oldAsset.location = data.location;
    oldAsset.status = data.status;
    oldAsset.typeRegisterForUse = data.typeRegisterForUse;
    oldAsset.description = data.description;
    oldAsset.detailInfo = data.detailInfo;
    // Khấu hao
    oldAsset.cost = data.cost;
    oldAsset.usefulLife = data.usefulLife;
    oldAsset.residualValue = data.residualValue;
    oldAsset.startDepreciation = data.startDepreciation;
    oldAsset.depreciationType = data.depreciationType;
    oldAsset.estimatedTotalProduction = data.estimatedTotalProduction;
    oldAsset.unitsProducedDuringTheYears = data.unitsProducedDuringTheYears && data.unitsProducedDuringTheYears.map((x) => {
        let time = x.month.split("-");
        let date = new Date(time[1], time[0], 0)

        return ({
            month: date,
            unitsProducedDuringTheYear: x.unitsProducedDuringTheYear
        })
    });
    // Thanh lý
    oldAsset.disposalDate = data.disposalDate;
    oldAsset.disposalType = data.disposalType;
    oldAsset.disposalCost = data.disposalCost;
    oldAsset.disposalDesc = data.disposalDesc;

    // Edit  thông tin tài sản
    oldAsset.save();

    // Function edit, create, Delete Document of collection
    queryEditCreateDeleteDocumentInCollection = async (portal, company, assetId, collection, arrDelete, arrEdit, arrCreate) => {
        let queryDelete = arrDelete ? arrDelete.map(x => {
            return { deleteOne: { "filter": { "_id": x._id } } }
        }) : [];
        let queryEdit = arrEdit ? arrEdit.map(x => {
            return { updateOne: { "filter": { "_id": x._id }, "update": { $set: x } } }
        }) : [];
        let queryCrete = arrCreate ? arrCreate.map(x => {
            return { insertOne: { "document": { ...x, asset: assetId, company: company } } }
        }) : [];
        let query = [...queryDelete, ...queryEdit, ...queryCrete];
        if (query.length !== 0) {
            await collection.bulkWrite(query);
        }
    };

    // Lấy thông tin tài sản vừa thêm vào
    let assets = await Asset(connect(DB_CONNECTION, portal)).find({ _id: oldAsset._id });

    return { assets };
}

/**
 * Xoá thông tin tài sản
 * @id : Id tài sản cần xoá
 */
exports.deleteAsset = async (portal, id) => {
    let asset = await Asset(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });

    return asset;
}

/**
 * Chỉnh sửa thông tin khấu hao tài sản
 */
exports.updateDepreciation = async (portal, id, data) => {
    return await Asset(connect(DB_CONNECTION, portal)).update({ _id: id }, {
        cost: data.cost,
        residualValue: data.residualValue,
        usefulLife: data.usefulLife,
        startDepreciation: data.startDepreciation,
        depreciationType: data.depreciationType,
        estimatedTotalProduction: data.estimatedTotalProduction,
        unitsProducedDuringTheYears: data.unitsProducedDuringTheYears && data.unitsProducedDuringTheYears.map((x) => {
            let time = x.month.split("-");
            let date = new Date(time[1], time[0], 0)

            return ({
                month: date,
                unitsProducedDuringTheYear: x.unitsProducedDuringTheYear
            })
        }),
    });
}


/*
 * Thêm mới phiếu bảo trì cho sự cố
 */
exports.createMaintainanceForIncident = async (portal, incidentId, data) => {
    return await Asset(connect(DB_CONNECTION, portal)).update({ _id: data.assetId, "incidentLogs._id": incidentId }, {
        $addToSet: { maintainanceLogs: data },
        $set: {
            "incidentLogs.$.statusIncident": data.statusIncident,
        }
    });
}

//******************************** Chức năng quản lý bảo trì ****************************************/


/*
 * Lấy danh sách tất cả các phiếu bảo trì của tất cả tài sản hoặc có thể lấy ra danh sách các phiếu bảo trì gần nhất của tất cả tài sản
 */
exports.searchMaintainances = async (portal, company, id, data) => {

}

/**
 * Lấy danh sách thông tin bảo trì tài sản
 */
exports.getMaintainances = async (portal, params) => {
    let maintainances;
    let { code, maintainanceCode, maintainCreateDate, type, status } = params;
    let page = parseInt(params.page);
    let limit = parseInt(params.limit);

    console.log(code, maintainanceCode, maintainCreateDate, type, status, page, limit);
    let assetSearch = [];
    if (code) {
        assetSearch = [...assetSearch, { code: { "$regex": code, "$options": "i" } }]
    }

    let maintainanceSearch = [];
    if (maintainanceCode) {
        maintainanceSearch = [...maintainanceSearch, { maintainanceCode: { "$regex": maintainanceCode, "$options": "i" } }]
    }

    if (maintainCreateDate) {
        let date = maintainCreateDate.split("-");
        let start = new Date(date[1], date[0] - 1, 1);
        let end = new Date(date[1], date[0], 1);

        maintainanceSearch = [...maintainanceSearch, { createDate: { $gt: start, $lte: end } }]
    }

    if (type) {
        maintainanceSearch = [...maintainanceSearch, { type: { $in: type } }]
    }

    if (status) {
        maintainanceSearch = [...maintainanceSearch, { status: { $in: status } }]
    }

    let aggregateQuery = [];
    if (assetSearch && assetSearch.length !== 0) {
        aggregateQuery = [...aggregateQuery, { $match: { $and: assetSearch } }]
    }
    aggregateQuery = [...aggregateQuery, { $unwind: "$maintainanceLogs" }, { $replaceRoot: { newRoot: "$maintainanceLogs" } }]

    if (maintainanceSearch && maintainanceSearch.length !== 0) {
        aggregateQuery = [...aggregateQuery, { $match: { $and: maintainanceSearch } }]
    }

    // Đếm số sự cố
    let mintainanceLength = 0;
    let aggregateLengthQuery = [...aggregateQuery, { $count: "mintainance_Length" }]
    let count = await Asset(connect(DB_CONNECTION, portal)).aggregate(aggregateLengthQuery);
    mintainanceLength = count[0].mintainance_Length;

    // Tìm kiếm câc danh sách sự cố
    aggregateListQuery = [...aggregateQuery, { $sort: { 'createdAt': 1 } }, { $skip: (page - 1) * limit }, { $limit: limit }]
    maintainances = await Asset(connect(DB_CONNECTION, portal)).aggregate(aggregateListQuery);


    // Tìm tài sản ứng với sự cố tài sản
    for (let i = 0; i < maintainances.length; i++) {
        let item = maintainances[i];

        let asset = await Asset(connect(DB_CONNECTION, portal)).findOne(
            { "maintainanceLogs": { $elemMatch: { "_id": mongoose.Types.ObjectId(item._id) } } }
        );

        maintainances[i].asset = asset;
    }

    return {
        mintainanceList: maintainances,
        mintainanceLength: mintainanceLength,
    };
}

/*
 * Thêm mới phiếu bảo trì
 */
exports.createMaintainance = async (portal, id, data, incident_id) => {
    if (incident_id) {
        return await Asset(connect(DB_CONNECTION, portal)).update({ _id: id, "incidentLogs._id": incident_id }, {
            $set: {
                "incidentLogs.$.statusIncident": "Đã xử lý"
            },
            $addToSet: { maintainanceLogs: data }
        });
    } else {
        return await Asset(connect(DB_CONNECTION, portal)).update({ _id: id }, { $addToSet: { maintainanceLogs: data } });
    }
};

/**
 * Chỉnh sửa phiếu bảo trì
 */
exports.updateMaintainance = async (portal, maintainanceId, data) => {
    return await Asset(connect(DB_CONNECTION, portal)).update({ _id: data.assetId, "maintainanceLogs._id": maintainanceId }, {
        $set: {
            "maintainanceLogs.$.maintainanceCode": data.maintainanceCode,
            "maintainanceLogs.$.createDate": data.createDate,
            "maintainanceLogs.$.type": data.type,
            "maintainanceLogs.$.description": data.description,
            "maintainanceLogs.$.startDate": data.startDate,
            "maintainanceLogs.$.endDate": data.endDate,
            "maintainanceLogs.$.expense": data.expense,
            "maintainanceLogs.$.status": data.status,
        }
    })
}

/**
 * Xóa thông tin phiếu bảo trì
 */
exports.deleteMaintainance = async (portal, assetId, maintainanceId) => {
    return await Asset(connect(DB_CONNECTION, portal)).update({ _id: assetId }, { "$pull": { "maintainanceLogs": { "_id": maintainanceId } } });
}

//******************************** Chức năng quản lý sử dụng ****************************************/
/*
 * Lấy danh sách tất cả lịch sử sử dụng của tất cả tài sản hoặc có thể lấy ra danh sách các lịch sử sử dụng gần nhất của tất cả tài sản
 */
exports.searchUsages = async (portal, company, id, data) => {

}

/**
 * Thêm mới thông tin sử dụng
 */
exports.createUsage = async (portal, id, data) => {
    let assignedToUser = (data.assignedToUser && data.assignedToUser !== 'null') ? data.assignedToUser : null;
    let assignedToOrganizationalUnit = (data.assignedToOrganizationalUnit && data.assignedToOrganizationalUnit !== 'null') ? data.assignedToOrganizationalUnit : null
    await Asset(connect(DB_CONNECTION, portal)).update({ _id: id }, {
        $addToSet: { usageLogs: data.usageLogs },
        assignedToUser: assignedToUser,
        assignedToOrganizationalUnit: assignedToOrganizationalUnit,
        status: data.status,
    });

    let asset = await Asset(connect(DB_CONNECTION, portal)).findById(id);

    return asset;
}

/**
 * Chỉnh sửa thông tin sử dụng
 */
exports.updateUsage = async (portal, assetId, data) => {
    let asset = await Asset(connect(DB_CONNECTION, portal)).update({ _id: assetId }, {
        $set: {
            assignedToUser: data.assignedToUser,
            assignedToOrganizationalUnit: data.assignedToOrganizationalUnit,
        }
    })

    return await Asset(connect(DB_CONNECTION, portal)).update({ _id: assetId, "usageLogs._id": data._id }, {
        $set: {
            "usageLogs.$.usedByUser": data.usedByUser,
            "usageLogs.$.usedByOrganizationalUnit": data.usedByOrganizationalUnit,
            "usageLogs.$.description": data.description,
            "usageLogs.$.endDate": data.endDate,
            "usageLogs.$.startDate": data.startDate,
        }
    })
}

/** 
 * Thu hồi tài sản
 */
exports.recallAsset = async (portal, assetId, data) => {
    let nowDate = new Date();
    let asset = await Asset(connect(DB_CONNECTION, portal)).findById(assetId);
    let usageLogs = asset.usageLogs[asset.usageLogs.length - 1];
    let updateUsageLogs = await Asset(connect(DB_CONNECTION, portal)).update({ _id: assetId, "usageLogs.usedByUser": usageLogs._id }, {
        $set: {
            "usageLogs.$.endDate": nowDate,
        }
    })
    let updateAsset = await Asset(connect(DB_CONNECTION, portal)).update({ _id: assetId }, {
        $set: {
            assignedToUser: null,
            assignedToOrganizationalUnit: null,
            status: "ready_to_use",
        }
    })
    return updateAsset;
}
/**
 * Xóa thông tin sử dụng
 */
exports.deleteUsage = async (portal, assetId, usageId) => {
    return await Asset(connect(DB_CONNECTION, portal)).update({ _id: assetId }, { "$pull": { "usageLogs": { "_id": usageId } } });
}

/**
 * Lấy danh sách thông tin sự cố
 */
exports.getIncidents = async (portal, params) => {
    let incidents;
    let { code, assetName, incidentCode, incidentType, incidentStatus } = params;
    let page = parseInt(params.page);
    let limit = parseInt(params.limit);

    let assetSearch = [];
    if (code) {
        assetSearch = [...assetSearch, { code: { "$regex": code, "$options": "i" } }]
    }
    if (assetName) {
        assetSearch = [...assetSearch, { assetName: { "$regex": assetName, "$options": "i" } }]
    }

    let incidentSearch = [];
    if (incidentCode) {
        incidentSearch = [...incidentSearch, { incidentCode: { "$regex": incidentCode, "$options": "i" } }]
    }
    if (incidentType) {
        incidentSearch = [...incidentSearch, { type: { $in: incidentType } }]
    }

    if (incidentStatus) {
        incidentSearch = [...incidentSearch, { statusIncident: { $in: incidentStatus } }]
    }

    let aggregateQuery = [];
    if (assetSearch && assetSearch.length !== 0) {
        aggregateQuery = [...aggregateQuery, { $match: { $and: assetSearch } }]
    }
    aggregateQuery = [...aggregateQuery, { $unwind: "$incidentLogs" }, { $replaceRoot: { newRoot: "$incidentLogs" } }]

    if (incidentSearch && incidentSearch.length !== 0) {
        aggregateQuery = [...aggregateQuery, { $match: { $and: incidentSearch } }]
    }

    // Đếm số sự cố
    let incidentLength = 0;
    let aggregateLengthQuery = [...aggregateQuery, { $count: "incident_length" }]
    let count = await Asset(connect(DB_CONNECTION, portal)).aggregate(aggregateLengthQuery);
    incidentLength = count[0].incident_length;

    // Tìm kiếm câc danh sách sự cố
    let aggregateListQuery = [...aggregateQuery, { $sort: { 'createdAt': 1 } }, { $skip: (page - 1) * limit }, { $limit: limit }]
    incidents = await Asset(connect(DB_CONNECTION, portal)).aggregate(aggregateListQuery);

    // Tìm tài sản ứng với sự cố tài sản
    for (let i = 0; i < incidents.length; i++) {
        let item = incidents[i];

        let asset = await Asset(connect(DB_CONNECTION, portal)).findOne(
            { "incidentLogs": { $elemMatch: { "_id": mongoose.Types.ObjectId(item._id) } } }
        );

        incidents[i].asset = asset;
    }

    return {
        incidentList: incidents,
        incidentLength: incidentLength,
    };
}

/**
 * Thêm mới thông tin sự cố tài sản
 */
exports.createIncident = async (portal, id, data) => {
    return await Asset(connect(DB_CONNECTION, portal)).update({ _id: id }, {
        status: data.status,
        $addToSet: { incidentLogs: data }
    });
}

/**
 * Chỉnh sửa thông tin sự cố tài sản
 */
exports.updateIncident = async (portal, incidentId, data) => {
    return await Asset(connect(DB_CONNECTION, portal)).update({ _id: data.assetId, "incidentLogs._id": incidentId }, {
        $set: {
            "incidentLogs.$.incidentCode": data.incidentCode,
            "incidentLogs.$.type": data.type,
            "incidentLogs.$.reportedBy": data.reportedBy,
            "incidentLogs.$.dateOfIncident": data.dateOfIncident,
            "incidentLogs.$.description": data.description,
            "incidentLogs.$.statusIncident": data.statusIncident,
            status: data.status
        }
    })
}

/**
 * Xóa thông tin sự cố tài sản
 */
exports.deleteIncident = async (portal, assetId, incidentId) => {
    console.log(assetId, incidentId);
    return await Asset(connect(DB_CONNECTION, portal)).update({ _id: assetId }, { "$pull": { "incidentLogs": { "_id": incidentId } } });
}