const Terms = require(`${SERVER_SEED_DIR}/terms`);
const { OrganizationalUnit, Role, RoleType, UserRole, Privilege } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách tất cả các role của 1 công ty
 * @portal portal của db
 */
exports.getRoles = async (portal, query) => {
    var page = query.page;
    var limit = query.limit;
    var roleId = query.roleId;
    var type = query.type;

    
    if (!page && !limit && !roleId) {
        return await Role(connect(DB_CONNECTION, portal))
            .find()
            .populate([
                { path: 'users' , populate: {path: 'userId' }},
                { path: 'parents' },
                { path: 'type' }
            ]);
    } else if (page && limit && !roleId) {
        const option = (query.key !== undefined && query.value !== undefined)
            ? Object.assign({}, {[`${query.key}`]: new RegExp(query.value, "i")})
            : {};
        return await Role(connect(DB_CONNECTION, portal))
            .paginate( option , { 
                page, 
                limit,
                populate: [
                    { path: 'users', populate: {path: 'userId'}},
                    { path: 'parents' },
                    { path: 'type' }
                ]
            });
    } else if (!page && !limit && roleId) {
        const roles = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findOne({ 
                $or:[
                    { 'deans': roleId }, 
                    { 'viceDeans': roleId }, 
                    { 'employees': roleId }
                ]  
            }).populate([
                { path: 'deans' }, 
                { path: 'viceDeans' }, 
                { path: 'employees' },
            ]);
        
        if(type === 'same'){
            let roleOrg = [...roles.deans, ...roles.viceDeans, ...roles.employees]; //mảng các role cùng phòng bạn với role truyền vào

            let roleParents = await Role(connect(DB_CONNECTION, portal)).find({
                parents: roleId
            });

            let roleParentInOrg = [];
            for (let i = 0; i < roleOrg.length; i++) {
                for (let j = 0; j < roleParents.length; j++) {
                    if(roleOrg[i]._id.toString() === roleParents[j]._id.toString()){
                        roleParentInOrg.push(roleOrg[i])
                    }
                }
            }

            return roleParentInOrg;
        }

        return roles;
    }
}


/**
 * Lấy thông tin của 1 role
 * @roleId id role
 */
exports.getRole = async (portal, roleId) => {
    return await Role(connect(DB_CONNECTION, portal))
        .findById(roleId)
        .populate([
            { path: 'users', populate:{ path: 'userId' }},
            { path: 'parents' },
            { path: 'type' }
        ]);
}

/**
 * Tạo role do công ty tự định nghĩa
 * @data dữ liệu tạo
 * @companyId id công ty
 */
exports.createRole = async(portal, data) => {
    console.log("create-role")
    const checkRoleCreated = await Role(connect(DB_CONNECTION, portal))
        .findOne({name: data.name});
        console.log("create-role",checkRoleCreated)
    if (checkRoleCreated) {
        throw ['role_name_exist'];
    }

    const roleTuTao = await RoleType(connect(DB_CONNECTION, portal))
        .findOne({ name: Terms.ROLE_TYPES.COMPANY_DEFINED });
    const role = await Role(connect(DB_CONNECTION, portal)).create({
        name: data.name,
        parents: data.parents,
        type: roleTuTao._id
    });

    return role;
}

/**
 * Tạo root role cho công ty
 * @data dữ liệu tạo
 * @companyID id công ty
 */
exports.createRootRole = async(portal, data) => {
    const rootRole = await RoleType(connect(DB_CONNECTION, portal))
        .findOne({ name: Terms.ROLE_TYPES.ROOT });
    const check = await Role(connect(DB_CONNECTION, portal))
        .findOne({name: data.name}); 

    if (check !== null) throw ["role_name_exist"];

    const role = await Role(connect(DB_CONNECTION, portal))
        .create({
            name: data.name,
            type: rootRole._id,
            parents: data.parents
        });

    return role;
}

/**
 * Tạo các role chức danh của đơn vị
 * @companyID id công ty
 * @data dữ liệu tạo
 */
exports.createRolesForOrganizationalUnit = async(portal, data) => {
    const filterValidRoleArray = async (array) => {
        let resArray= [];
        if (array.length > 0) {
            let checkRoleValid = await Role(connect(DB_CONNECTION, portal))
                .findOne({name: {$in: data.deans}});

            if (checkRoleValid) throw ['role_name_exist'];

            for (let i = 0; i < array.length; i++) {
                if(array[i]) resArray = [...resArray, array[i]];
            }

            return resArray;
        } else {
            return [];
        }
    }

    const roleChucDanh = await RoleType(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROLE_TYPES.POSITION });
    const deanAb = await Role(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROOT_ROLES.DEAN.name });
    const viceDeanAb = await Role(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROOT_ROLES.VICE_DEAN.name });
    const employeeAb = await Role(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROOT_ROLES.EMPLOYEE.name });

    const employeeArr = await filterValidRoleArray(data.employees);

    const dataEmployee = employeeArr.map(em=>{
        return {
            name: em,
            type: roleChucDanh._id,
            parents: [employeeAb._id]
        }
    }); 
    const employees = dataEmployee.length > 0? 
        await Role(connect(DB_CONNECTION, portal)).insertMany(dataEmployee) : [];

    const viceDeanArr = await filterValidRoleArray(data.viceDeans);

    const dataViceDean = viceDeanArr.map(vice=>{
        return {
            name: vice,
            type: roleChucDanh._id,
            parents: [...employees.map(em=>em._id), viceDeanAb._id]
        }
    }); 
    const viceDeans = dataViceDean.length > 0 ? 
        await Role(connect(DB_CONNECTION, portal)).insertMany(dataViceDean) : [];

    const deanArr = await filterValidRoleArray(data.deans);

    const dataDean = deanArr.map(dean=>{
        return {
            name: dean,
            type: roleChucDanh._id,
            parents: [...employees.map(em=>em._id), ...viceDeans.map(vice=>vice._id), deanAb._id]
        }
    }); 
    const deans = dataDean.length > 0 ? 
        await Role(connect(DB_CONNECTION, portal)).insertMany(dataDean): [];

    return {
        deans, viceDeans, employees // danh sách các mảng các chức danh đã tạo
    }
}

/**
 * Tạo mối quan hệ cho user và role
 * @userId id user
 * @roleId id role
 */
exports.createRelationshipUserRole = async (portal, userId, roleId) => { 
    const relationship = await UserRole(connect(DB_CONNECTION, portal))
        .create({
            userId,
            roleId
        });
    
    return relationship;
}

/**
 * Chỉnh sửa thông tin role
 * @id id role
 * @data dữ liệu chỉnh sửa, mặc định không truyền vào thì là {}
 */
exports.editRole = async(portal, id, data={}) => {
    const role = await Role(connect(DB_CONNECTION, portal)).findById(id);
    const check = await Role(connect(DB_CONNECTION, portal)).findOne({name: data.name});
    if(check && check._id !== role._id) throw ['role_name_exist'];

    if(data.name && data.name !== ''){
        role.name = data.name;
    }

    if(data.parents && data.parents !== ''){
        role.parents = data.parents;
    }

    await role.save();

    return role;
}

/**
 * Chỉnh sửa mối quan hệ giữa user và role
 * @roleId id role
 * @userArr mảng id các user
 */
exports.editRelationshipUserRole = async( portal, roleId, userArr=[] ) => {
    const check = await Role(connect(DB_CONNECTION, portal)).findById(roleId);
    if(!check) throw ['role_not_found'];

    await UserRole(connect(DB_CONNECTION, portal)).deleteMany({
        roleId: roleId
    });
    if(userArr.length > 0){
        const user_role = userArr.map( user => {
            return {
                roleId: roleId,
                userId: user
            };
        })
        return await UserRole(connect(DB_CONNECTION, portal)).insertMany(user_role);
    }
}


/**
 * Xóa role theo id
 * @id id role
 * 1. Xóa role
 * 2. Xóa thông tin liên quan của các role kế thừa role hiện tại
 * 3. Xóa thông tin trong UserRole
 * 4. Xóa thông tin trong Privilege
 * 5. Xóa thông tin trong OrganizationalUnit (nếu có)
 */
exports.deleteRole = async(portal, id) => {
    await Role(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    const roles = await Role(connect(DB_CONNECTION, portal)).find({parents: id});

    for (let i = 0; i < roles.length; i++) {
        const role = await Role(connect(DB_CONNECTION, portal)).findById(roles[i]._id);
        role.parents.splice(role.parents.indexOf(roles[i]._id),1);
        await role.save();
    }
    await UserRole(connect(DB_CONNECTION, portal)).deleteMany({roleId: id});
    await Privilege(connect(DB_CONNECTION, portal)).deleteMany({roleId: id});
    const organD = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({deans: id});
    if (organD) {
        organD.deans.splice(organD.deans.indexOf(id));
        await organD.save();
    }

    const organV = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({viceDeans: id});
    if (organV) {
        organV.viceDeans.splice(organV.viceDeans.indexOf(id));
        await organV.save();
    }

    const organE = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({employees: id});
    if (organE) {
        organE.employees.splice(organE.employees.indexOf(id));
        await organE.save();
    }

    return id; // trả về id của role vừa xóa
    
}


