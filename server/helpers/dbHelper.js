const exec = require('child_process').exec;
const fs = require('fs');

const versionName = () => {
    const time = new Date(),
        month = time.getMonth() + 1,
        date = time.getDate(),
        year = time.getFullYear(),
        hour = time.getHours(),
        minute = time.getMinutes(),
        second = time.getSeconds();

    return  `${year}.${month}.${date}.${hour}.${minute}.${second}`;
}

const checkDirectory = (path, description=undefined) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {
            recursive: true
        });
    };
    fs.appendFile(path+'/README.txt', description ? description :'', err => { 
        if(err) throw err;
    });

    return true;
}

/**
 * Hàm kiểm tra và chuyển kết nối cơ sở dữ liệu
 * @param {*} db kết nối đang được sử dụng đến cơ sở dữ liệu 
 * @param {*} portal db muốn chuyển
 */
exports.connect = (db, portal) => {
    if(db.name !== portal){
        return db.useDb(portal, { useCache: true });
    }else{
        return db;
    }
}

/**
 * Hàm khởi tạo models nếu chưa tồn tại
 * @param {*} db kết nối đến cơ sở dữ liệu nào đó 
 * @param {*} models các models được khai báo trong thư mục models
 */
exports.initModels = (db, models) => {
    for (const [key, model] of Object.entries(models)) {
        if(!db.models[key]) model(db)
    }
}

/**
 * Khôi phục dữ liệu
 * @param {*} options Tùy chọn khôi phục dữ liệu { host, port, db, version }
 */
exports.restore = async (options) => {
    const commandRestoreDB = (options) => {
        if(!options.db){
            return `mongorestore --drop --host="${options.host}" --port="${options.port}" ${SERVER_BACKUP_DIR}/all/${options.version}/database`;
        } else {
            return `mongorestore --drop --host="${options.host}" --port="${options.port}" -d ${options.db} ${SERVER_BACKUP_DIR}/${options.db}/${options.version}/database/${options.db}`;
        }
    }

    const commandRestoreFile = (options) => {
        if(options.db){
            return {
                delete: `rm -rf ${SERVER_DIR}/upload/private/${options.db}/* && rm -rf ${SERVER_DIR}/upload/avatars/${options.db}/*`,
                new: `cp -r ${SERVER_BACKUP_DIR}/${options.db}/${options.version}/private/* ${SERVER_DIR}/upload/private/${options.db} && cp -r ${SERVER_BACKUP_DIR}/${options.db}/${options.version}/avatars/* ${SERVER_DIR}/upload/avatars/${options.db}`
            }
        }
        else 
            return {
                delete: `rm -rf ${SERVER_DIR}/upload`,
                new: `cp -r ${SERVER_BACKUP_DIR}/all/${options.version}/upload ${SERVER_DIR}` 
            }
    }
    
    // 1. Khôi phục databse
    const command = commandRestoreDB(options);
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    })

    // 2.Khôi phục các file ( image, video, file, doc, excel, v.v. )
    const command2 = commandRestoreFile(options);
    exec(command2.delete, function (err) { 
        exec(command2.new, function (err) { });
    });
}

/**
 * Sao lưu dữ liệu
 * @param options các option cho việc sao lưu { host, port, db, version }
 */
exports.backup = async (options) => {
    let limit = options.db ? BACKUP[options.db].limit : BACKUP['all'].limit;
    const version = versionName();
    const dbBackupPath = (options) => {
        const path = `${SERVER_BACKUP_DIR}/${options.db}/${version}`;
        checkDirectory(path);
    
        return path;
    }

    const backupPath = options.db ? dbBackupPath(options) : null;
    const description = `Backup database ${options.db ? options.db : 'all'}`;
    const commandBackupDB = (options) => {
        if(options.db) {
            fs.appendFile(backupPath+'/README.txt', description, err => { 
                if(err) throw err;
            });
            return `mongodump --host="${options.host}" --port="${options.port}" --out="${backupPath}/database" --db="${options.db}"`;
        }else{
            checkDirectory(`${SERVER_BACKUP_DIR}/all/${version}`, description);

            return `mongodump --host="${options.host}" --port="${options.port}" --out="${SERVER_BACKUP_DIR}/all/${version}/database"`;
        }
    }
    const command = commandBackupDB(options);
    
    // 1. Backup database
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    });

    const getCommandBackupFile = (options) => {
        if(options.db) {
            checkDirectory(`${SERVER_DIR}/upload/private/${options.db}`);
            checkDirectory(`${backupPath}/private`);
            checkDirectory(`${SERVER_DIR}/upload/avatars/${options.db}`);
            checkDirectory(`${backupPath}/avatars`);

            return `cp -r ${SERVER_DIR}/upload/private/${options.db}/* ${backupPath}/private && cp -r ${SERVER_DIR}/upload/avatars/${options.db}/* ${backupPath}/avatars`;
        }else{
            checkDirectory(`${SERVER_DIR}/upload`);
            checkDirectory(`${SERVER_BACKUP_DIR}/all/${version}/upload`);

            return `cp -r ${SERVER_DIR}/upload/* ${SERVER_BACKUP_DIR}/all/${version}/upload`;
        }
    }

    // 2. Backup file dữ liệu trong thư mục upload
    const commandBackupFile  = getCommandBackupFile(options);
    await exec(commandBackupFile, (error, stdout, stderr) => {
        if(error !== null) console.log("co loi roif", error);
    });
    const folderInfo = options.db ?
    fs.statSync(backupPath) :
    fs.statSync(`${SERVER_BACKUP_DIR}/all/${version}`);

    // 3. Kiểm tra giới hạn số lượng backup
    if(limit){
        const list = options.db ? fs.readdirSync(`${SERVER_BACKUP_DIR}/${options.db}`) : fs.readdirSync(`${SERVER_BACKUP_DIR}/all`);
        const newList = list.map( folder => {
            const folderInfo = options.db ? 
                fs.statSync(`${SERVER_BACKUP_DIR}/${options.db}/${folder}`) : 
                fs.statSync(`${SERVER_BACKUP_DIR}/all/${folder}`);
            return {
                version: folder,
                createdAt: folderInfo.ctime
            }
        });
        newList.sort(function(a, b){
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            if(dateA > dateB) return -1;
            if(dateA < dateB) return 1;
            return 0;
        });
        if(limit > 0 && newList.length > limit){
            for (let i = 0; i < newList.length; i++) {
                if(i > limit - 1){ //phiên bản cũ vượt quá số lượng backup lưu trữ (limit)
                    // xóa version backup cũ
                    if(options.db) exec(`rm -rf ${SERVER_BACKUP_DIR}/${options.db}/${newList[i].version}`, function (err) { }); 
                    else exec(`rm -rf ${SERVER_BACKUP_DIR}/all/${newList[i].version}`, function (err) { }); 
                }
            }
        }
    }

    return {
        version,
        description: description,
        path: options.db ? backupPath : `${SERVER_BACKUP_DIR}/all/${version}`,
        createdAt: folderInfo.ctime
    }
}