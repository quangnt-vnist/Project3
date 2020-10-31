const Models = require(`${SERVER_MODELS_DIR}`);
const { Link, Privilege, Role } = Models;
const { LINK_CATEGORY } = require(`${SERVER_SEED_DIR}/terms.js`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách tất cả các link của 1 công ty
 * @company id của công ty
 */
exports.getLinks = async (portal, query) => {
    let {type, page, limit} = query;
    
    let options = (type === 'active') ? {deleteSoft: false} : {};

    if (!page && !limit) {
        let links = await Link(connect(DB_CONNECTION, portal))
            .find(options)
            .populate({ 
                path: 'roles', 
                model: Privilege(connect(DB_CONNECTION, portal)) 
            });

        return links;
    } else {
        let option = (query.key && query.value)
            ? Object.assign(options, {[`${query.key}`]: new RegExp(query.value, "i")})
            : options;

        return await Link(connect(DB_CONNECTION, portal))
        .paginate( option , { 
            page, 
            limit,
            populate: [
                { 
                    path: 'roles', 
                    model: Privilege(connect(DB_CONNECTION, portal)), 
                    populate: { 
                        path: 'roleId', 
                        model: Role(connect(DB_CONNECTION, portal)) 
                    }
                }
            ]
        });
    }
}

/**
 * Lấy thông tin link theo id
 * @id id link
 */
exports.getLink = async (portal, id) => {
    return await Link(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate({ path: 'roles', populate: {path: 'roleId'}});
}

/**
 * Tạo link mới 
 * @data dữ liệu về link
 * @portal portal tương ứng với database cần sửa
 */
exports.createLink = async(portal, data) => {
    if (data.url === '/system') {
        throw ['cannot_create_this_url', 'this_url_cannot_be_use'];
    }

    let check = await Link(connect(DB_CONNECTION, portal))
        .findOne({url: data.url});

    if(check !== null) {
        throw ['url_exist'];
    }

    return await Link(connect(DB_CONNECTION, portal))
        .create({
            url: data.url,
            description: data.description,
            deleteSoft: false
        });
}

/**
 * Chỉnh sửa link
 * @portal portal tương ứng với db
 * @id id link
 * @data dữ liệu về link
 */
exports.editLink = async(portal, id, data) => {
    console.log("EDIT link")
    let link = await Link(connect(DB_CONNECTION, portal))
        .findById(id);

    link.url = data.url;
    link.description = data.description;
    await link.save();

    return link;
}

/**
 * Xóa link (chỉ xóa tạm thời - không xóa hẳn)
 * @id id link
 */
exports.deleteLink = async(portal, id, type) => {
    if(type === 'soft') {
        let link = await Link(connect(DB_CONNECTION, portal))
            .findById(id);
        link.deleteSoft = true;
        await link.save();
    } else {
        await Privilege(connect(DB_CONNECTION, portal))
            .deleteMany({
                resourceId: id,
                resourceType: 'Link'
            });
        await Link(connect(DB_CONNECTION, portal))
            .deleteOne({ _id: id});
    }

    return id;

}

/**
 * Thiếp lập mới quan hệ cho role và link
 * @portal portal của db
 * @linkId id của link
 * @roleArr mảng id các role
 */
exports.relationshipLinkRole = async(portal, linkId, roleArr) => {
    await Privilege(connect(DB_CONNECTION, portal))
        .deleteMany({
            resourceId: linkId,
            resourceType: 'Link'
        });
    let data = roleArr.map( role => {
        return {
            resourceId: linkId,
            resourceType: 'Link',
            roleId: role
        };
    });
    let privilege = await Privilege(connect(DB_CONNECTION, portal)).insertMany(data);

    return privilege;
}

/**
 * Thêm component vào 1 trang
 * @portal portal của db
 * @id id link
 * @componentId id component
 */
exports.addComponentOfLink = async(portal, id, componentId) => {
    let link = await Link(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate({ path: 'roles' });

    link.components.push(componentId);
    await link.save();

    return link;
}

/**
 * Lấy thông tin LINK_CATEGORY
 */
exports.getLinkCategories = async () => {
    return LINK_CATEGORY;
}

exports.updateCompanyLinks = async (portal, data) => {
    for (let i = 0; i < data.length; i++) {
        await Link(connect(DB_CONNECTION, portal))
            .updateOne({_id: data[i]._id}, {deleteSoft: data[i].deleteSoft});
    }

    return true;
}