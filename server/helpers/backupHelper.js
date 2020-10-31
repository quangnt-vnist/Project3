const exec = require('child_process').exec;
const CronJob = require('cron').CronJob;
require('dotenv').config('../.env');
const fs = require('fs');

const option = {
    host: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT || '27017',
    store: SERVER_BACKUP_DIR,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
};

/**
 * Lấy string đặt tên cho thư mục backup từ date hiện tại
 */
getTimeMDY = () => {
    const time = new Date(),
    month = time.getMonth() + 1,
    date = time.getDate(),
    year = time.getFullYear(),
    hour = time.getHours(),
    minute = time.getMinutes(),
    second = time.getSeconds();

    return `DMY${date}${month}${year}HMS${hour}${minute}${second}`;
}


/**
 * Tạo đường dẫn lưu dữ liệu backup
 */
createServerBackupDatabasePath = (portal) => {
    const time = getTimeMDY();
    const path = `${SERVER_BACKUP_DIR}/${portal}/${time}`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {
            recursive: true
        });
    };

    return path;
}

/**
 * Restore dữ liệu
 */
exports.restore = async (backupVersion, option) => {

    // 1. Restore database
    const command = `mongorestore --drop --host="${option.host}" --port="${option.dbPort}" -d ${option.dbName} ${SERVER_BACKUP_DIR}/${option.dbName}/${backupVersion}/database`;
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    })

    // 2.Restore file data
    const uploadPathServer = `${SERVER_DIR}/upload/private/${option.dbName}`;
    const uploadRestore = `${SERVER_BACKUP_DIR}/${option.dbName}/${backupVersion}/upload`;
    if (fs.existsSync(uploadPathServer)) {
        exec(`rm -rf ${uploadPathServer}`, function (err) { });
        if(fs.existsSync(uploadRestore)){
            exec(`cp -r ${uploadRestore} ${SERVER_DIR}`, function (err) { });
        }
    }
}

/**
 * Backup dữ liệu
 */
exports.backup = async (option) => {
    const serverBackupStorePath = createServerBackupDatabasePath(option.dbName);
    const versionTime = getTimeMDY();
    const descriptionBackupDB = `Backup database ${option.dbName}`;
    const command = `mongodump --host="${option.host}" --port="${option.dbPort}" --out="${serverBackupStorePath}/database" --db="${option.dbName}"`;
    
    // 1. Backup database
    await exec(command, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    });
    fs.appendFile(serverBackupStorePath+'/README.txt', descriptionBackupDB, err => { 
        if(err) throw err;
    });

    // 2. Backup file dữ liệu trong thư mục upload
    console.log("PATH:", serverBackupStorePath)
    const commandBackupDataUpload  = `cp -r "${SERVER_DIR}/upload/private/${option.dbName}" "${serverBackupStorePath}/upload"`
    await exec(commandBackupDataUpload, (error, stdout, stderr) => {
        if(error !== null) console.log(error);
    });
    const folderInfo = fs.statSync(`${SERVER_BACKUP_DIR}/${option.dbName}/${versionTime}`);

    return {
        version: versionTime,
        description: descriptionBackupDB,
        path: serverBackupStorePath,
        createdAt: folderInfo.ctime
    }
}

