const {
    OrganizationalUnit,
    UserRole,
    Notification,
    ManualNotification,
    Role,
    User
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy tất cả thông báo mà admin, giám đốc... đã tạo - get manual notification
 */
exports.getAllManualNotifications = async (portal, creator) => { //id cua cong ty do
    return await ManualNotification(connect(DB_CONNECTION, portal)).find({
            creator
        })
        .populate([{
                path: 'users',
            },
            {
                path: 'organizationalUnits',
            }
        ]).sort({
            createdAt: -1
        });
}

/**
 * Phân trang danh sách các thông báo đã được tạo bởi admin, giám đốc ..
 */
exports.paginateManualNotifications = async (portal, creator, data) => {
    var info = Object.assign({
        creator
    }, data.content);

    return await ManualNotification(connect(DB_CONNECTION, portal))
        .paginate(info, {
            page: data.page,
            limit: data.limit,
            sort: {
                createdAt: -1
            },
            populate: [{
                    path: 'users',
                },
                {
                    path: 'organizationalUnits',
                }
            ]
        });
}

/**
 * Tạo thông báo manual notification
 * @company id của công ty
 * @data thông tin về thông báo muốn tạo
 */
exports.createManualNotification = async (portal, data) => {

    const notify = await ManualNotification(connect(DB_CONNECTION, portal)).create({
        creator: data.creator,
        sender: data.sender,
        title: data.title,
        level: data.level,
        content: data.content,
        users: data.users,
        organizationalUnits: data.organizationalUnits
    });

    return await ManualNotification(connect(DB_CONNECTION, portal)).findById(notify._id).populate([{
            path: 'users',
        },
        {
            path: 'organizationalUnits',
        }
    ]);
}

/**
 * Lấy danh sách các user của organizationalUnit để gửi thông báo
 * @return trả về một mảng các id các user
 */
exports.getAllUsersInOrganizationalUnit = async (portal, departmentId) => {
    var department = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findById(departmentId)
        .populate([{
                path: 'deans',
                populate: {
                    path: 'users',
                }
            },
            {
                path: 'viceDeans',
                populate: {
                    path: 'users',
                }
            },
            {
                path: 'employees',
                populate: {
                    path: 'users',
                }
            }
        ]);
    var users = [];
    for (let i = 0; i < department.deans.length; i++) {
        users = [...users, ...department.deans[i].users.map(user => user.userId)]
    }
    for (let j = 0; j < department.viceDeans.length; j++) {
        users = [...users, ...department.viceDeans[j].users.map(user => user.userId)]
    }
    for (let k = 0; k < department.employees.length; k++) {
        users = [...users, ...department.employees[k].users.map(user => user.userId)]
    }

    return users;
}

/**
 * Taọ thông báo gửi đến cho các user
 * @param {*} company 
 * @param {*} data 
 * @param {*} manualNotification 
 */
exports.createNotification = async (portal, company, data, manualNotification = undefined) => {
    let usersArr = data.users;
    for (let i = 0; i < data.organizationalUnits.length; i++) {
        let organizationalUnit = data.organizationalUnits[i]; // id đơn vị hiện tại
        let userArr = await this.getAllUsersInOrganizationalUnit(portal, organizationalUnit);
        usersArr = await usersArr.concat(userArr);
    }

    // Loại bỏ các giá trị trùng nhau
    usersArr = usersArr.map(user => user.toString());
    for (let i = 0, max = usersArr.length; i < max; i++) {
        if (usersArr.indexOf(usersArr[i]) != usersArr.lastIndexOf(usersArr[i])) {
            usersArr.splice(usersArr.indexOf(usersArr[i]), 1);
            i--;
        }
    }

    // Gửi thông báo cho các user
    for (let i = 0; i < usersArr.length; i++) {
        const notify = await Notification(connect(DB_CONNECTION, portal))
            .create({
                company,
                title: data.title,
                level: data.level,
                content: data.content,
                creator: data.creator,
                sender: data.sender,
                user: usersArr[i],
                manualNotification
            });

        const arr = CONNECTED_CLIENTS.filter(client => client.userId === usersArr[i]);

        if(arr.length === 1) SOCKET_IO.to(arr[0].socketId).emit('new notifications', notify);
    }
    return true;
}

/**
 * Lấy tất cả thông báo mà một user nhận được
 * @user id của user đó
 */
exports.getAllNotifications = async (portal, user) => {
    return await Notification(connect(DB_CONNECTION, portal)).find({
        user
    }).sort({
        createdAt: -1
    });
}

/**
 * Phân trang danh sách các thông báo của người dùng nhận được
 */
exports.paginateNotifications = async (portal, user, data) => {
    if (typeof data.readed === "boolean") {
        var info = Object.assign({user}, data.content, {readed: false});
    }
    else {
        var info = Object.assign({user}, data.content);
    }

    return await Notification(connect(DB_CONNECTION, portal))
        .paginate(info, {
            page: data.page,
            limit: data.limit,
            sort: {
                createdAt: -1
            }
        });
}

/**
 * Đánh dấu thông báo nhận đã được đọc
 */
exports.changeNotificationStateToReaded = async (portal, user, id, readAll) => {
    let notification;
    if (!readAll) {
        notification = await Notification(connect(DB_CONNECTION, portal)).findById(id);
        notification.readed = true;
        await notification.save();
    } else {
        notification = await Notification(connect(DB_CONNECTION, portal)).find({ readed: false, user: user});
        let listId = notification.map(x => x._id);
        for (let i in notification){
            notification[i].readed = true;
        }
        await Notification(connect(DB_CONNECTION, portal)).updateMany({ _id: listId }, { $set: { readed: true } });
    }
    console.log(notification);
    return notification;
}

/**
 * Xóa manual notification
 */
exports.deleteManualNotification = async (portal, notificationId) => {
    return await ManualNotification(connect(DB_CONNECTION, portal)).deleteOne({
        _id: notificationId
    });
}

/**
 * Xóa notification của user
 */
exports.deleteNotification = async (portal, notificationId) => {
    return await Notification(connect(DB_CONNECTION, portal)).deleteOne({
        _id: notificationId
    });
}