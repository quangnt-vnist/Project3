const {Privilege, Link, Role} = require(`${SERVER_MODELS_DIR}`);

/**
 * Thêm quyền truy cập tới Link cho một Role truyền vào
 */
exports.addLinkThatRoleCanAccess = async (idLink, arrRole) => {
    const check = await Privilege.findOne({ resource: idLink });

    if (!check) {
        // Chua co privilege cho link hien tai
        const privilege = await Privilege.create({
            resource: idLink,
            resource_type: 'Link',
            role: arrRole
        });

        return privilege;
    } else {
        // Privilege cho link hien tai da ton tai
        check.role = check.role.concat(arrRole);
        check.save();

        return check;
    }
    
}

/**
 * Thêm quyền truy cập tới Link cho một MẢNG Roles truyền vào
 */
exports.addLinkThatRolesCanAccess = async (linkId, roleArr) => {
    var data = roleArr.map( role => {
        return {
            roleId: role,
            resourceId: linkId,
            resourceType: 'Link'
        }
    });
    const privilege = await Privilege.insertMany(data);

    return privilege;
}


