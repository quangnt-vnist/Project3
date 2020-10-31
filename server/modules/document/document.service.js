const { DocumentCategory, DocumentDomain, DocumentArchive, Role, UserRole, OrganizationalUnit, Document } = require(`${SERVER_MODELS_DIR}`);
const arrayToTree = require('array-to-tree');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách tất cả các tài liệu văn bản
 * @company id của công ty
 */
exports.getDocuments = async (portal, query, company) => {
    let page = query.page;
    let limit = query.limit;

    if (!(page || limit)) {
        return await Document(connect(DB_CONNECTION, portal))
            .find({ company })
            .select("id name archives category domains numberOfDownload numberOfView ");
    }
    else {
        let option = {
            company: company,
        };

        if (query.category) {
            option.category = query.category;
        }
        if (query.domains && query.domains.length) {
            option.domains = { $in: query.domains };
        }
        if (query.archives && query.archives.length) {
            let allArchive = [];
            for (let i in query.archives) {
                const archive = await DocumentArchive(connect(DB_CONNECTION, portal))
                    .find({ path: new RegExp('^' + query.archives[i]) })
                allArchive = allArchive.concat(archive);
            }
            // remove duplicate element 
            let allArchives = allArchive.filter((item, index) => { return allArchive.indexOf(item) === index })
            const arrId = allArchives.map(archive => {
                return archive.id;
            })

            option.archives = { $in: arrId }
        }
        if (query.name) {
            option.name = new RegExp(query.name, "i")
        }
        return await Document(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [
                    { path: 'category', select: 'name id' },
                    { path: 'domains', select: 'name id' },
                    { path: 'archives', select: 'name id path' },
                    { path: 'views.viewer', select: 'name id' },
                    { path: "downloads.downloader", select: 'name id' },
                    { path: "archivedRecordPlaceOrganizationalUnit", select: "name id" },
                    { path: "logs.creator", select: 'name id' },
                    { path: "relationshipDocuments", select: "name id" },

                ]
            });
    }
}

/**
 * Lấy thông tin về một tài liệu văn bản
 */
exports.showDocument = async (id, viewer) => {
    const doc = await Document(connect(DB_CONNECTION, portal))
        .findById(id).populate([
            { path: 'category', select: 'name id' },
            { path: 'archives', select: 'name id path' },

        ]);
    doc.numberOfView += 1;
    const getIndex

        = (array, value) => {
            let res = -1;
            for (let i = 0; i < array.length; i++) {
                if (array[i].viewer.toString() === value.toString()) {
                    res = i;
                    break;
                }
            }

            return res;
        }
    let index = getIndex(doc.views, viewer);
    if (index !== -1) doc.views.splice(index, 1);
    doc.views.push({ viewer });
    await doc.save();

    return doc;
}

exports.increaseNumberView = async (id, viewer, portal) => {
    const doc = await Document(connect(DB_CONNECTION, portal))
        .findById(id);
    doc.numberOfView += 1;
    const getIndex = (array, value) => {
        let res = -1;
        for (let i = 0; i < array.length; i++) {
            if (array[i].viewer.toString() === value.toString()) {
                res = i;
                break;
            }
        }

        return res;
    }
    let index = getIndex(doc.views, viewer);
    if (index !== -1) doc.views.splice(index, 1);
    doc.views.push({ viewer });
    await doc.save();

    return doc;
}


/**
 * Tạo một tài liệu văn bản mới
 */
exports.createDocument = async (portal, data, company) => {
    const newDoc = {
        company,
        name: data.name,
        domains: data.domains,
        archives: data.archives,
        category: data.category,
        description: data.description,
        issuingBody: data.issuingBody,
        signer: data.signer,
        officialNumber: data.officialNumber,
        relationshipDocuments: data.relationshipDocuments,
        versions: [{
            versionName: data.versionName,
            issuingDate: data.issuingDate,
            effectiveDate: data.effectiveDate,
            expiredDate: data.expiredDate,
            file: data.file,
            scannedFileOfSignedDocument: data.scannedFileOfSignedDocument,
        }],
        roles: data.roles,
        relationshipDescription: data.relationshipDescription,
        archivedRecordPlaceOrganizationalUnit: data.archivedRecordPlaceOrganizationalUnit,
    }

    const doc = await Document(connect(DB_CONNECTION, portal)).create(newDoc);

    return await Document(connect(DB_CONNECTION, portal))
        .findById(doc._id)
        .populate([
            { path: 'category', select: 'name id' },
            { path: 'domains', select: 'name id' },
            { path: 'archives', select: 'name id path' },
        ]);
}

/**
 * Chỉnh sửa thông tin tài liệu văn bản
 */
exports.editDocument = async (id, data, query = undefined, portal) => {
    let { creator, title, descriptions } = data;
    let createdAt = Date.now();
    let log = {
        createdAt: createdAt,
        creator: creator,
        title: title,
        description: descriptions,
    }

    let document = await Document(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(
            id,
            {
                $push: { logs: log }
            },
            { new: true }
        )
    // chỉnh sửa
    if (query !== undefined && Object.keys(query).length > 0) {

        const doc = await Document(connect(DB_CONNECTION, portal))
            .findById(id);
        switch (query.option) {
            case 'ADD_VERSION':
                doc.versions.push(data);
                await doc.save();

                return doc;

            case 'EDIT_VERSION':
                let index = doc.versions.findIndex(obj => obj._id == data.versionId);
                doc.versions[index].versionName = data.versionName ? data.versionName : doc.versions[index].versionName;
                doc.versions[index].issuingDate = data.issuingDate ? data.issuingDate : doc.versions[index].issuingDate;
                doc.versions[index].effectiveDate = data.effectiveDate ? data.effectiveDate : doc.versions[index].effectiveDate;
                doc.versions[index].expiredDate = data.expiredDate ? data.expiredDate : doc.versions[index].expiredDate;
                doc.versions[index].file = data.file ? data.file : doc.versions[index].file;
                doc.versions[index].scannedFileOfSignedDocument = data.fileScan ? data.fileScan : doc.versions[index].scannedFileOfSignedDocument;
                await doc.save();

                return doc;

            case 'DELETE_VERSION':
                //let index = doc.versions.findIndex(obj => obj._id == data.versionId);
                const version = doc.versions.filter(v => v._id != data.versionId);
                doc.versions = version;
                await doc.save();
                return doc;

            default:
                return doc;
        }
    } else {
        const doc = await Document(connect(DB_CONNECTION, portal))
            .findById(id);
        if (doc.name !== data.name) {
            doc.name = data.name
        }
        if (data.domains) {
            doc.domains = data.domains
        }
        if (data.archives) {
            doc.archives = data.archives
        }
        if (data.category) {
            doc.category = data.category
        }
        if (data.description) {
            doc.description = data.description
        }
        if (data.issuingBody) {
            doc.issuingBody = data.issuingBody
        }
        if (data.officialNumber) {
            doc.officialNumber = data.officialNumber
        }
        if (data.signer) {
            doc.signer = data.signer
        }

        if (data.relationshipDescription) {
            doc.relationshipDescription = data.relationshipDescription
        }
        if (data.relationshipDocuments) {
            doc.relationshipDocuments = data.relationshipDocuments
        }

        if (data.roles) {
            doc.roles = data.roles
        }

        if (data.archivedRecordPlaceOrganizationalUnit && data.archivedRecordPlaceOrganizationalUnit !== "[object Object]") {
            doc.archivedRecordPlaceOrganizationalUnit = data.archivedRecordPlaceOrganizationalUnit
        }
        if (data.archivedRecordPlaceManagerd)
            doc.archivedRecordPlaceManager = data.archivedRecordPlaceManager

        await doc.save();
        return doc;
    }
}

exports.deleteDocument = async (id, portal) => {
    const doc = await Document(connect(DB_CONNECTION, portal))
        .findById(id);

    for (let i = 0; i < doc.versions.length; i++) {
        if (fs.existsSync(doc.versions[i].file)) fs.unlinkSync(doc.versions[i].file);
        if (fs.existsSync(doc.versions[i].scannedFileOfSignedDocument)) fs.unlinkSync(doc.versions[i].scannedFileOfSignedDocument);
    }
    await Document(connect(DB_CONNECTION, portal))
        .deleteOne({ _id: id });

    return doc;
}

// exports.addDocumentLog = async (params, body) => {
//     let { creator, title, description } = body;
//     let log = {
//         creator: creator,
//         title: title,
//         description: description,
//         createdAt: Date.now,
//     }
//     let document = await Document.findByIdAndUpdate(
//         params.id,
//         {
//             $push: { logs: log }
//         },
//         { new: true }
//     ).populate({ path: "logs.creator", model: User, select: "name id" })
//     let documentLog = document.logs.reserve();
//     return documentLog;
// }

/**
 * Download File and File Scan
 * @param {} data: id(document), numberofVersion, downloaderId (id of user, who downloaded this document)
 *  
 */
exports.downloadDocumentFile = async (data, portal) => {
    const doc = await Document(connect(DB_CONNECTION, portal)).findById(data.id);
    if (doc.versions.length < data.numberVersion) throw ['cannot_download_doc_file', 'version_not_found'];
    await downloadFile(doc, data.downloaderId)
    return {
        path: doc.versions[data.numberVersion].file ? doc.versions[data.numberVersion].file : "",
        name: doc.name
    };
}

exports.downloadDocumentFileScan = async (data, portal) => {
    const doc = await Document(connect(DB_CONNECTION, portal)).findById(data.id);
    if (doc.versions.length < data.numberVersion) throw ['cannot_download_doc_file_scan', 'version_scan_not_found'];
    await downloadFile(doc, data.downloaderId)
    return {
        path: doc.versions[data.numberVersion].scannedFileOfSignedDocument ? doc.versions[data.numberVersion].scannedFileOfSignedDocument : "",
        name: doc.name
    };
}
// hàm thực hiện download 
async function downloadFile(doc, downloaderId) {
    doc.numberOfDownload += 1;
    const getIndex = (array, value) => {
        let res = -1;
        for (let i = 0; i < array.length; i++) {
            if (array[i].downloader.toString() === value.toString()) {
                res = i;
                break;
            }
        }

        return res;
    }
    let index = getIndex(doc.downloads, downloaderId);
    if (index !== -1) doc.downloads.splice(index, 1);
    doc.downloads.push({ downloader: downloaderId });
    await doc.save();
}

exports.importDocument = async (portal, data, company) => {

    for (let i in data) {
        let document = {
            name: data[i].name,
            description: data[i].description,
            issuingBody: data[i].issuingBody,
            signer: data[i].signer,
            officialNumber: data[i].officialNumber,
            versionName: data[i].versionName,
            issuingDate: data[i].issuingDate,
            effectiveDate: data[i].effectiveDate,
            expiredDate: data[i].expiredDate,
            relationshipDescription: data[i].relationshipDescription,
        }

        // find category
        if (data[i].category) {
            const category = await DocumentCategory(connect(DB_CONNECTION, portal)).findOne({ name: data[i].category });
            if (category) {
                document.category = category.id;
            }
        }

        // find archivedRecordPlaceOrganizationalUnit
        if (data[i].organizationUnitManager) {
            const unit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({
                $and: [
                    { company: company },
                    { name: data[i].organizationUnitManager },
                ]
            })
            if (unit) {
                document.archivedRecordPlaceOrganizationalUnit = unit.id;
            }
        }

        // find domain
        if (data[i].domains && data[i].domains.length) {
            let domains = [];
            for (let j in data[i].domains) {
                const domain = await DocumentDomain(connect(DB_CONNECTION, portal)).findOne({ name: data[i].domains[j] });
                if (domain) {
                    domains.push(domain.id);
                }
            }
            document.domains = domains;
        }

        // find archive
        if (data[i].archives && data[i].archives[0] && data[i].archives.length) {
            let archives = [];
            for (let j in data[i].archives) {
                let path = data[i].archives[j].split('-').map(x => { return x.trim() }).join(" - ");
                const Archive = await DocumentArchive(connect(DB_CONNECTION, portal)).findOne({ path: path });
                if (Archive) {
                    archives.push(Archive.id);
                }
            }
            document.archives = archives;
        }

        // file role

        if (data[i].roles && data[i].roles.length && data[i].roles[0]) {
            let roles = [];
            for (let j in data[i].roles) {
                const role = await Role(connect(DB_CONNECTION, portal)).findOne({
                    name: data[i].roles[j]
                });
                console.log('rrrrrrrr', role, data[i].roles)
                roles.push(role._id);
            }
            document.roles = roles;
        }

        // find document relation ship
        if (data[i].relationshipDocuments && data[i].relationshipDescription.length) {
            let relationshipDocuments = [];
            for (let j in relationshipDocuments) {
                let document = await Document(connect(DB_CONNECTION, portal)).findOne({ name: data[i].relationshipDocuments[j] });
                relationshipDocuments.push(document.id);
            }
            document.relationshipDocuments = relationshipDocuments;
        }

        let res = await this.createDocument(portal, document, company);


    }
    let query = { page: null, limit: null }
    let documents = await this.getDocuments(portal, query, company);
    return documents;
}


/**
 * Lấy tất cả các loại văn bản
 */
exports.getDocumentCategories = async (portal, query, company) => {

    let page = query.page;
    let limit = query.limit;

    if (page === undefined && limit === undefined) {

        return await DocumentCategory(connect(DB_CONNECTION, portal)).find({ company });
    } else {
        const option = (query.key !== undefined && query.value !== undefined)
            ? Object.assign({ company }, { [`${query.key}`]: new RegExp(query.value, "i") })
            : { company };
        return await DocumentCategory(connect(DB_CONNECTION, portal)).paginate(option, { page, limit });
    }
}

exports.createDocumentCategory = async (portal, data, company) => {
    return await DocumentCategory(connect(DB_CONNECTION, portal)).create({
        company,
        name: data.name,
        description: data.description
    });
}

exports.editDocumentCategory = async (id, data, portal) => {

    const category = await DocumentCategory(connect(DB_CONNECTION, portal)).findById(id);
    category.name = data.name;
    category.description = data.description;
    await category.save();

    return category;
}

exports.deleteDocumentCategory = async (id, portal) => {
    const docs = await Document(connect(DB_CONNECTION, portal)).find({ category: id });
    if (docs.length > 0) throw ['category_used_to_document', 'cannot_delete_category'];
    await DocumentCategory(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });

    return id;
}

/**
 * import các loại tài liệu từ file excel
 * company: mã cty lấy từ auth
 * data: mảng dữ liệu được import từ file excel
 */

exports.importDocumentCategory = async (portal, data, company) => {
    for (let i in data) {
        description = data[i].description;
        let category = {
            name: data[i].name,
            description: data[i].description,
        }

        let res = await this.createDocumentCategory(portal, category, company);

    }
    let query = {
        limit: 5,
        page: 1,
    }
    return await this.getDocumentCategories(portal, query, company);
}

/**
 * Danh mục văn bản
 */
exports.getDocumentDomains = async (portal, company) => {
    const list = await DocumentDomain(connect(DB_CONNECTION, portal)).find({ company });
    const dataConverted = list.map(domain => {
        return {
            id: domain._id.toString(),
            key: domain._id.toString(),
            value: domain._id.toString(),
            label: domain.name,
            title: domain.name,
            parent_id: domain.parent !== undefined ? domain.parent.toString() : null
        }
    });
    const tree = await arrayToTree(dataConverted, {});

    return { list, tree };
}

exports.createDocumentDomain = async (portal, data, company) => {
    let query = {
        company,
        name: data.name,
        description: data.description,
        parent: data.parent
    }
    await DocumentDomain(connect(DB_CONNECTION, portal)).create(query);

    return await this.getDocumentDomains(portal, company);
}

exports.getDocumentsThatRoleCanView = async (portal, query, company) => {
    let page = query.page;
    let limit = query.limit;
    let role = await Role(connect(DB_CONNECTION, portal)).findById(query.roleId);
    let roleArr = [role._id].concat(role.parents);

    if (page === undefined && limit === undefined) {

        return await Document(connect(DB_CONNECTION, portal)).find({
            company,
            roles: { $in: roleArr }
        }).select("id name archives category domains numberOfDownload numberOfView ");
    } else {

        let option = {
            company: company,
            roles: { $in: roleArr }
        };

        if (query.category) {
            option.category = query.category;
        }
        if (query.domains && query.domains.length) {
            option.domains = { $in: query.domains };
        }
        if (query.archives && query.archives.length) {
            let allArchive = [];
            for (let i in query.archives) {
                const archive = await DocumentArchive(connect(DB_CONNECTION, portal))
                    .find({ path: new RegExp('^' + query.archives[i]) })
                allArchive = allArchive.concat(archive);
            }
            // remove duplicate element 
            let allArchives = allArchive.filter((item, index) => { return allArchive.indexOf(item) === index })
            const arrId = allArchives.map(archive => {
                return archive.id;
            })
            option.archives = { $in: arrId }
        }
        if (query.name) {
            option.name = new RegExp(query.name, "i")
        }

        return await Document(connect(DB_CONNECTION, portal)).paginate(option, {
            page,
            limit,
            populate: [
                { path: 'category', select: 'name id' },
                { path: 'domains', select: 'name id' },
                { path: 'archives', select: 'name id path' },
                { path: 'relationshipDocuments', select: 'name id' },
                { path: 'views.viewer', select: 'name id' },
                { path: "downloads.downloader", select: 'name id' },
                { path: "archivedRecordPlaceOrganizationalUnit", select: "name id" },
                { path: "logs.creator", select: 'name id' },
                { path: "relationshipDocuments", select: "name id" },
            ]
        });
    }
}

exports.getDocumentsUserStatistical = async (userId, query, portal) => {
    const roles = await UserRole(connect(DB_CONNECTION, portal)).find({ userId: userId }).populate({
        path: 'roleId',
    });
    let userRole = [];
    let condition = {};
    let page = query.page;
    let limit = query.limit;
    for (let i in roles) {
        userRole.push(roles[i].roleId._id);
        userRole = userRole.concat(roles[i].roleId.parents);

    }
    if (query.category) {
        condition.category = query.category;
    }
    if (query.domains && query.domains.length) {
        condition.domains = { $in: query.domains };
    }
    if (query.archives && query.archives.length) {
        let allArchive = [];
        for (let i in query.archives) {
            const archive = await DocumentArchive(connect(DB_CONNECTION, portal))
                .find({ path: new RegExp('^' + query.archives[i]) })
            allArchive = allArchive.concat(archive);
        }
        // remove duplicate element 
        let allArchives = allArchive.filter((item, index) => { return allArchive.indexOf(item) === index })
        const arrId = allArchives.map(archive => {
            return archive.id;
        })
        condition.archives = { $in: arrId }
    }
    if (query.name) {
        condition.name = new RegExp(query.name, "i")
    }
    let { option } = query;
    switch (option) {
        case 'downloaded': //những tài liệu văn bản mà người dùng đã tải xuống
            condition = { ...condition, "downloads.downloader": userId };
            return await Document(connect(DB_CONNECTION, portal)).paginate(condition, {
                page,
                limit,
                populate: [
                    { path: 'category', select: 'name id' },
                    { path: 'domains', select: 'name id' },
                    { path: 'archives', select: 'name id path' },
                    { path: 'relationshipDocuments', select: 'name id' },
                    { path: 'views.viewer', select: 'name id' },
                    { path: "downloads.downloader", select: 'name id' },
                    { path: "archivedRecordPlaceOrganizationalUnit", select: "name id" },
                    { path: "logs.creator", select: 'name id' },
                    { path: "relationshipDocuments", select: "name id" },
                ]
            });
        case 'common': //những tài liệu phổ biến - được xem và tải nhiều nhất gần đây
            condition = { ...condition, roles: { $in: userRole } };
            const list = await Document(connect(DB_CONNECTION, portal)).paginate(condition, {
                page,
                limit,
                populate: [
                    { path: 'category', select: 'name id' },
                    { path: 'domains', select: 'name id' },
                    { path: 'archives', select: 'name id path' },
                    { path: 'relationshipDocuments', select: 'name id' },
                    { path: 'views.viewer', select: 'name id' },
                    { path: "downloads.downloader", select: 'name id' },
                    { path: "archivedRecordPlaceOrganizationalUnit", select: "name id" },
                    { path: "logs.creator", select: 'name id' },
                    { path: "relationshipDocuments", select: "name id" },
                ]
            });
            list.docs.sort((a, b) => {
                if (a.numberOfView > b.numberOfView)
                    return -1;
                else if (a.numberOfView < b.numberOfView)
                    return 1;
                else return 0;
            });
            return list;
        case 'latest': //những tài liệu văn bản mà người dùng chưa xem qua lần nào
            condition = { ...condition, roles: { $in: userRole }, "views.viewer": { "$ne": userId } };
            return await Document(connect(DB_CONNECTION, portal)).paginate(condition, {
                page,
                limit,
                populate: [
                    { path: 'category', select: 'name id' },
                    { path: 'domains', select: 'name id' },
                    { path: 'archives', select: 'name id path' },
                    { path: 'relationshipDocuments', select: 'name id' },
                    { path: 'views.viewer', select: 'name id' },
                    { path: "downloads.downloader", select: 'name id' },
                    { path: "archivedRecordPlaceOrganizationalUnit", select: "name id" },
                    { path: "logs.creator", select: 'name id' },
                    { path: "relationshipDocuments", select: "name id" },
                ]
            });
        default:
            return null;
    }

}

exports.editDocumentDomain = async (id, data, portal) => {
    const domain = await DocumentDomain(connect(DB_CONNECTION, portal)).findById(id);
    domain.name = data.name,
        domain.description = data.description,
        domain.parent = ObjectId.isValid(data.parent) ? data.parent : undefined
    await domain.save();

    return domain;
}

exports.deleteDocumentDomain = async (portal, id) => {
    const domain = await DocumentDomain(connect(DB_CONNECTION, portal)).findById(id);
    if (domain === null) throw ['document_domain_not_found']
    await DocumentDomain(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });

    return await this.getDocumentDomains(portal);
}


exports.deleteManyDocumentDomain = async (array, portal, company) => {
    await DocumentDomain(connect(DB_CONNECTION, portal)).deleteMany({ _id: { $in: array } });

    return await this.getDocumentDomains(portal, company);
}
/**
 * import các danh mục từ file excel
 * company: mã cty lấy từ auth
 * data: mảng dữ liệu được import từ file excel
 */

exports.importDocumentDomain = async (portal, data, company) => {
    let results = [];
    for (let i in data) {
        description = data[i].description;
        let domain = {
            name: data[i].name,
            description: data[i].description,
        }
        if (data[i].parent) {
            const parentDomain = await DocumentDomain(connect(DB_CONNECTION, portal)).findOne({ name: data[i].parent });
            if (parentDomain) {
                domain.parent = parentDomain.id;
            }
        }
        let res = await this.createDocumentDomain(portal, domain, company);

    }
    return await this.getDocumentDomains(portal, company);
}

/**
 * Kho lưu trữ vật lí 
 */

exports.getDocumentArchives = async (portal, company) => {
    const list = await DocumentArchive(connect(DB_CONNECTION, portal)).find({ company });

    const dataConverted = list.map(archive => {
        return {
            id: archive._id.toString(),
            key: archive._id.toString(),
            value: archive._id.toString(),
            label: archive.name,
            title: archive.name,
            parent_id: archive.parent ? archive.parent.toString() : null,
        }
    });
    const tree = await arrayToTree(dataConverted, {});
    return { list, tree };
}

exports.createDocumentArchive = async (portal, data, company) => {
    let query = {
        company,
        name: data.name,
        description: data.description,
    }
    if (data.parent && data.parent.length) {
        query.parent = data.parent;
    }
    query.path = await findPath(data, portal);
    const check = await DocumentArchive(connect(DB_CONNECTION, portal)).findOne({ name: data.name });
    if (check) throw ['name_exist'];
    await DocumentArchive(connect(DB_CONNECTION, portal)).create(query);
    return await this.getDocumentArchives(portal, company);
}

exports.deleteDocumentArchive = async (portal, id) => {
    const archive = await DocumentArchive(connect(DB_CONNECTION, portal)).findById(id);
    await deleteNode(id, portal);
    return await this.getDocumentArchives(portal, archive.company);
}

exports.deleteManyDocumentArchive = async (array, portal, company) => {
    for (let i = 0; i < array.length; i++) {
        deleteNode(array[i]);
    }

    return await this.getDocumentArchives(portal, company);
}

exports.editDocumentArchive = async (id, data, portal, company) => {
    const archive = await DocumentArchive(connect(DB_CONNECTION, portal)).findById(id);
    let array = data.array;
    archive.name = data.name;
    archive.description = data.description;
    archive.parent = ObjectId.isValid(data.parent) ? data.parent : undefined
    archive.path = await findPath(data, portal)
    await archive.save();
    for (let i = 0; i < array.length; i++) {

        const archive = await DocumentArchive(connect(DB_CONNECTION, portal)).findById(array[i]);
        archive.path = await findPath(archive, portal);
        await archive.save();
    }
    const document = await this.getDocumentArchives(portal, company)
    return document;
}

/**
 * Lấy đường dẫn chi tiết đến lưu trữ hiện tại
 */
findPath = async (data, portal) => {
    let path = "";
    let arrayParent = [];
    arrayParent.push(data.name);
    if (data.parent && data.parent !== "#") {

        let parent = data.parent;
        while (parent) {
            let tmp = await DocumentArchive(connect(DB_CONNECTION, portal)).findById(parent);
            console.log(tmp);
            arrayParent.push(tmp.name);
            parent = tmp.parent;
        }

    }
    path = arrayParent.reverse().join(" - ");
    return path;
}

/**
 * Xóa một node
 */
deleteNode = async (id, portal) => {
    const archive = await DocumentArchive(connect(DB_CONNECTION, portal)).findById(id);
    if (!archive) throw ['document_archive_not_found'];
    let parent = archive.parent;
    let archives = await DocumentArchive(connect(DB_CONNECTION, portal)).find({ parent: id });
    if (archives.length) {
        for (let i = 0; i < archives.length; i++) {
            archives[i].parent = parent;
            archives[i].path = await findPath(archives[i]);
            await archives[i].save();
        }
    }
    await DocumentArchive(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
}


/**
 * import các danh mục từ file excel
 * company: mã cty lấy từ auth
 * data: mảng dữ liệu được import từ file excel
 */

exports.importDocumentArchive = async (portal, data, company) => {

    for (let i in data) {
        description = data[i].description;
        let archive = {
            name: data[i].name,
            description: data[i].description,
        }
        if (data[i].pathParent) {
            let path = data[i].pathParent.split('-').map(x => { return x.trim() }).join(" - ");
            const parentArchive = await DocumentArchive(connect(DB_CONNECTION, portal)).findOne({ path: path });
            if (parentArchive) {
                archive.parent = parentArchive.id;
            }
        }
        let res = await this.createDocumentArchive(portal, archive, company);

    }
    return await this.getDocumentArchives(portal, company);
}
