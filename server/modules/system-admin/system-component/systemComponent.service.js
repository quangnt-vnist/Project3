const { SystemComponent, SystemLink, RootRole, Company, Link, Component, Role, Privilege } = require(`${SERVER_MODELS_DIR}`);
const {connect} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getAllSystemComponents = async (query) => {
    let page = query.page;
    let limit = query.limit;
    
    if (!page && !limit) {
        return await SystemComponent(connect(DB_CONNECTION, process.env.DB_NAME))
            .find()
            .populate([
                { path: 'roles' },
                { path: 'links' },
            ]);
    } else {
        const option = (query.key && query.value)
            ? {[`${query.key}`]: new RegExp(query.value, "i")}
            : {};

        return await SystemComponent(connect(DB_CONNECTION, process.env.DB_NAME))
            .paginate(option, { 
                page, 
                limit,
                populate: [
                    { path: 'roles' },
                    { path: 'links' },
                ]
            });
    }
}

exports.getSystemComponent = async (systemComponentId) => {

    return await SystemComponent(connect(DB_CONNECTION, process.env.DB_NAME))
        .findById(systemComponentId)
        .populate([
            { path: 'roles' },
            { path: 'links' }
        ]);
}

exports.createSystemComponent = async (name, description, links, roles) => {
    const systemCom = await SystemComponent(connect(DB_CONNECTION, process.env.DB_NAME)).findOne({ name });
    if (systemCom) throw ['system_component_name_exist'];

    // 1. Tạo system component và liên kết tương ứng với các system link
    const sysComponent = await SystemComponent(connect(DB_CONNECTION, process.env.DB_NAME)).create({ name, description, links, roles });
    for (let i = 0; i < links.length; i++) {
        let link = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME)).findById(links[i]);
        if(link){
            link.components.push(sysComponent._id);
            await link.save();
        }
    }
    const systemComponent = await SystemComponent(connect(DB_CONNECTION, process.env.DB_NAME)).findById(sysComponent._id).populate({path: 'roles'});

    //  2. Tạo các component tương ứng cho các công ty
    const systemLinks = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME)).find({_id: { $in: links}});
    const companyList = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).find();
    for (let i = 0; i < companyList.length; i++) {
        let companyLinks = await Link(connect(DB_CONNECTION, companyList[i].shortName))
            .find({ 
                url: { $in: systemLinks.map(link=>link.url)}
            });
        let companyComponent = await Component(connect(DB_CONNECTION, companyList[i].shortName))
            .create({
                name, 
                description, 
                links: companyLinks.map(link=>link._id)
            });
        for (let i = 0; i < companyLinks.length; i++) {
            let companyLink = await Link(connect(DB_CONNECTION, companyList[i].shortName))
                .findById(companyLinks[i]._id);
            if(companyLink) {
                companyLink.components.push(companyComponent._id);
                await companyLink.save();
            }
        }
        let roles = await Role(connect(DB_CONNECTION, companyList[i].shortName)).find({
            name: { $in: systemComponent.roles.map(role=>role.name)}
        });
        let privileges = roles.map(role=>{
            return {
                resourceId: companyComponent._id,
                resourceType: 'Component',
                roleId: role._id
            }
        });
        await Privilege(connect(DB_CONNECTION, companyList[i].shortName)).insertMany(privileges);
    }

    return systemComponent;
}

exports.editSystemComponent = async (systemComponentId, name, description, links, roles) => {
    // 1.Edit system component
    const component = await SystemComponent(connect(DB_CONNECTION, process.env.DB_NAME)).findById(systemComponentId);
    const oldLinks = component.links.map(link=>link.toString());
    const newLinks = links.map(link=>link.toString());
    if(component.name !== name){
        const checkComponent = await SystemComponent(connect(DB_CONNECTION, process.env.DB_NAME)).findOne({ name });
        if(checkComponent) throw ['system_component_name_invalid', 'system_component_name_exist'];
    }
    component.name = name;
    component.description = description;
    component.links = links;
    component.roles = roles;
    await component.save();

    let deleteLinkRelationship = oldLinks.filter(value=>newLinks.indexOf(value) === -1);
    for (let i = 0; i < deleteLinkRelationship.length; i++) {
        let sysLinkUpdate = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME)).findById(deleteLinkRelationship[i]);
        let index = sysLinkUpdate.components.indexOf(systemComponentId);
        if(index !== -1) sysLinkUpdate.components.splice(index, 1);
        await sysLinkUpdate.save();
    }
    let createLinkRelationship = newLinks.filter(value=>oldLinks.indexOf(value) === -1);
    for (let i = 0; i < createLinkRelationship.length; i++) {
        let sysLinkUpdate = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME)).findById(createLinkRelationship[i]);
        sysLinkUpdate.components.push(systemComponentId);
        await sysLinkUpdate.save();
    }

    // 2.Edit component cho các công ty
    // let companies = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).find();
    // for (let i = 0; i < companies.length; i++) {
        // let systemLinks = await SystemLink(connect(DB_CONNECTION, process.env.DB_NAME)).find({_id: {$in: links}});
        // let rootRoles = await RootRole.find({_id: {$in: roles}});

        // let companyComponent = await Component.findOne({company: companies[i]._id, name: component.name});
        // let companyLinks = await Link.find({ company: companies[i]._id, url: {$in: systemLinks.map(link=>link.url)}});
        // let companyRoles = await Role.find({company: companies[i]._id, name: {$in: rootRoles.map(role=>role.name)}});

        // let oldCompanyLinks = companyComponent.links.map(link=>link.toString()); //các link cũ
        // let newCompanyLinks = companyLinks.map(link=>link._id.toString()); //các link chuẩn bị update
        
        // Cập nhật link-component
        // companyComponent.links = companyLinks.map(link=>link._id);
        // await companyComponent.save();

        // for (let j = 0; j < oldCompanyLinks.length; j++) {
        //     let updateCompanyLink = await Link.findById(oldCompanyLinks[i]);
        //     let index = updateCompanyLink.components.indexOf(component._id);
        //     if(index !== -1) updateCompanyLink.components.splice(index, 1);
        //     await updateCompanyLink.save();
        // }

        // for (let j = 0; j < newCompanyLinks.length; j++) {
        //     let updateCompanyLink = await Link.findById(newCompanyLinks[i]);
        //     updateCompanyLink.components.push(component._id);
        //     await updateCompanyLink.save();
        // }

        // Cập nhật role-component - chưa biết có nên setup lại giống mặc định hay giữ nguyên cho công ty như ban đầu
        // await Privilege.deleteMany({
        //     resourceType: 'Component',
        //     resourceId: component._id
        // });
        // let roleComponentPrivilege = companyRoles.map(role=>{
        //     return {
        //         roleId: role._id,
        //         resourceType: 'Component',
        //         resourceId: componentId
        //     }
        // });
        // await Privilege.insertMany(roleComponentPrivilege);
    // }

    return component;
}

exports.deleteSystemComponent = async (systemComponentId) => {
    let systemComponent = await SystemComponent(connect(DB_CONNECTION, process.env.DB_NAME)).findById(systemComponentId);
    // 1. Xóa tất các component tương ứng của các công ty
    let companies = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).find();
    for (let i = 0; i < companies.length; i++) {
        let components = await Component(connect(DB_CONNECTION, companies[i].shortname)).find({name: systemComponent.name});
        //phân quyền
        await Privilege(connect(DB_CONNECTION, companies[i].shortname)).deleteMany({ 
            resourceType: 'Component',
            resourceId: { $in: components.map(com=>com._id) }
        });
        //components trong link tương ứng
        for (let i = 0; i < components.length; i++) {
            let links = await Link(connect(DB_CONNECTION, companies[i].shortname)).find({components: components[i]._id});
            for (let j = 0; j < links.length; j++) {
                let updateLink = await Link(connect(DB_CONNECTION, companies[i].shortname)).findById(links[j]._id);
                let index = updateLink.components.indexOf(components[i]._id);
                if(index !== -1) updateLink.components.splice(index, 1);
                await updateLink.save();
            }
        }
        //xóa component
        await Component(connect(DB_CONNECTION, companies[i].shortname)).deleteMany({name: systemComponent.name});
    }

    // 2. Xóa system component
    return await SystemComponent(connect(DB_CONNECTION, process.env.DB_NAME)).deleteOne({ _id: systemComponentId });
}



