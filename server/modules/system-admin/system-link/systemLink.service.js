const { SystemLink, Link, Component, Role, Privilege, Company } = require(`${SERVER_MODELS_DIR}`);
const {LINK_CATEGORY} = require(SERVER_SEED_DIR+'/terms');
const {connect} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách tất cả các system link 
 */
exports.getAllSystemLinks = async (query) => {
    let page = query.page;
    let limit = query.limit;
    
    if (!page && !limit) {
        return await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME))
            .find()
            .populate([
                { path: 'roles' },
                { path: 'components' }
            ]);
    } else {
        const option = (query.key && query.value)
            ? {[`${query.key}`]: new RegExp(query.value, "i")}
            : {};

        return await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME))
            .paginate(option, {
                page, 
                limit, 
                populate: [
                    { path: 'roles' },
                    { path: 'components' }
                ]
            });
    }
}

/**
 * Lấy tất cả các category của các system link
 * 
 */
exports.getAllSystemLinkCategories = async () => {
    
    return Object.keys(LINK_CATEGORY).map(key => LINK_CATEGORY[key]);
}

/**
 * Lấy 1 system link
 * @id id của system link
 */
exports.getSystemLink = async (systemLinkId) => {
    console.log("GET LINKS SÝYS")
    return await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME))
        .findById(systemLinkId)
        .populate({path: 'roles'});
}

/**
 * Tạo 1 system link mới
 * @url url của system link
 * @description mô tả
 * @roles mảng các role có quyền vào trang với link này
 * @category danh mục của system link
 */
exports.createSystemLink =  async (url, description, roles, category) => {
    const link = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME)).findOne({ url });
    if (link) throw ['system_link_url_exist'];

    const sysLink = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME)).create({ url, description, category, roles });
    const systemLink = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME)).findById(sysLink._id).populate({path: 'roles'})
    const companyList = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).find();

    for (let i = 0; i < companyList.length; i++) {
        console.log("company-item-portal", companyList[i].shortName)
        let link = await Link(connect(DB_CONNECTION, companyList[i].shortName))
            .create({ url, description, category });

        let roles = await Role(connect(DB_CONNECTION, companyList[i].shortName))
            .find({ name: { $in: systemLink.roles.map(role=>role.name)} });

        let privileges = roles.map(role=>{
            return {
                resourceId: link._id,
                resourceType: 'Link',
                roleId: role._id
            }
        });
        await Privilege(connect(DB_CONNECTION, companyList[i].shortName)).insertMany(privileges);
    }

    return systemLink;
}

/**
 * Chỉnh sửa 1 system link
 * @id id của system link
 * @url url của system link
 * @description mô tả
 * @roles mảng các role được truy cập
 * @category danh mục
 */
exports.editSystemLink = async (systemLinkId, url, description, roles, category) => {

    let link = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME)).findById(systemLinkId)
    
    link.url = url;
    link.description = description;
    link.roles = roles;
    link.category = category;

    await link.save();

    return link;
}

/**
 * Xóa 1 system link
 * @id id của system link
 */
exports.deleteSystemLink = async (systemLinkId) => {
    let systemLink = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME)).findById(systemLinkId);
    let companies = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).find();
    // 1. Xóa tất các link tương ứng của các công ty
    for (let index = 0; index < companies.length; index++) {
        let links = await Link(connect(DB_CONNECTION, companies[index].shortName)).find({url: systemLink.url});
        //xóa phân quyền
        await Privilege(connect(DB_CONNECTION, companies[index].shortName)).deleteMany({ 
            resourceType: 'Link',
            resourceId: { $in: links.map(link=>link._id) }
        });
        //links trong component tương ứng
        for (let i = 0; i < links.length; i++) {
            let components = await Link(connect(DB_CONNECTION, companies[i].shortName)).find({links: links[i]._id});
            for (let j = 0; j < components.length; j++) {
                let updateComponent = await Component(connect(DB_CONNECTION, companies[i].shortName)).findById(components[j]._id);
                let index = updateComponent.links.indexOf(links[i]._id);
                if(index !== -1) updateComponent.links.splice(index, 1);
                await updateComponent.save();
            }
        }
        await Link(connect(DB_CONNECTION, companies[index].shortName)).deleteMany({url: systemLink.url});
    }

    // 2. Xóa system link 
    return await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME)).deleteOne({ _id: systemLinkId });
}