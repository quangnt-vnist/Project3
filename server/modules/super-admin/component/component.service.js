const { Privilege, Role, Link, Component } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);
/**
 * Lấy danh sách các component của công ty
 * @id id của công ty
 */
exports.getComponents = async (portal, query) => {
    let {page, limit, currentRole, linkId, type} = query;
    
    let optionExpression = (type === 'active') ? {deleteSoft: false} : {};


    if (!page && !limit && !currentRole && !linkId){
        return await Component(connect(DB_CONNECTION, portal))
            .find(optionExpression)
            .populate([
                { path: 'roles', populate: { path: 'roleId' } },
                { path: 'links', },
            ]);
    } else if (page && limit && !currentRole && !linkId) {
        let option = (query.key && query.value)
            ? Object.assign(optionExpression, {[`${query.key}`]: new RegExp(query.value, "i")})
            : optionExpression;
        
        return await Component(connect(DB_CONNECTION, portal))
            .paginate( option , { 
                page, 
                limit,
                populate: [
                    { path: 'roles', populate: { path: 'roleId' }},
                    { path: 'links' },
                ]
            });
    } else if (!page && !limit && currentRole && linkId) {
        let role = await Role(connect(DB_CONNECTION, portal))
            .findById(currentRole);
        let roleArr = [role._id];
        roleArr = roleArr.concat(role.parents);
        
        let link = await Link(connect(DB_CONNECTION, portal))
            .findOne({_id: linkId, deleteSoft: false})
            .populate([
                { path: 'components' }
            ]);
        if(link === null) throw ['link_access_invalid'];
            
        let data = await Privilege(connect(DB_CONNECTION, portal))
            .find({
                roleId: { $in: roleArr },
                resourceType: 'Component',
                resourceId: { $in: link.components }
            }).distinct('resourceId');

        let components = await Component(connect(DB_CONNECTION, portal))
            .find({ _id: { $in: data }, deleteSoft: false });

        return components;
    }
}

/**
 * Lấy component theo id
 * @id id component
 */
exports.getComponent = async (portal, id) => {
    return await Component(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'roles', populate: { path: 'roleId' } },
            { path: 'links' },
        ]);
}

/**
 * Tạo component
 * @data dữ liệu component
 */
exports.createComponent = async(portal, data) => {
    let check = await Component(connect(DB_CONNECTION, portal))
        .findOne({name: data.name});
    if(check) throw ['component_name_exist'];

    return await Component(connect(DB_CONNECTION, portal))
        .create({
            name: data.name,
            description: data.description,
            deleteSoft: false
        });
}

/**
 * Sửa component
 * @id id component
 * @data dữ liệu
 */
exports.editComponent = async(portal, id, data) => {
    let component = await Component(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'roles', populate: {path: 'roleId' } },
            { path: 'links' },
        ]);

    component.name = data.name;
    component.link = data.link;
    component.description = data.description;
    await component.save();

    return component;
}

/**
 * Xóa component
 * @id id component
 */
exports.deleteComponent = async(portal, id, type) => {
    if(type === 'soft'){
        let component = await Component(connect(DB_CONNECTION, portal))
            .findById(id);
        component.deleteSoft = true;
        await component.save();
    } else {
        await Privilege(connect(DB_CONNECTION, portal))
            .deleteMany({
                resourceId: id,
                resourceType: 'Component'
            });
        await Component(connect(DB_CONNECTION, portal))
            .deleteOne({ _id: id });
    }

    return id;
}

/**
 * Thiết lập mối quan hệ component - role
 * @componentId id component
 * @roleArr mảng id các role
 */
exports.relationshipComponentRole = async(portal, componentId, roleArr) => {
    await Privilege(connect(DB_CONNECTION, portal))
        .deleteMany({
            resourceId: componentId,
            resourceType: 'Component'
        });

    let data = roleArr.map( role => {
        return {
            resourceId: componentId,
            resourceType: 'Component',
            roleId: role
        };
    });

    let privilege = await Privilege(connect(DB_CONNECTION, portal))
        .insertMany(data);

    return privilege;
}

exports.updateCompanyComponents = async (portal, data) => {
    for (let i = 0; i < data.length; i++) {
        await Component(connect(DB_CONNECTION, portal))
            .updateOne({_id: data[i]._id}, {deleteSoft: data[i].deleteSoft});
    }

    return true;
}