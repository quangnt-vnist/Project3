const {backup, restore} = require(SERVER_HELPERS_DIR+'/dbHelper');
const {connect} = require(SERVER_HELPERS_DIR+'/dbHelper');
const {time} = require('cron');
const fs = require('fs');
const exec = require('child_process').exec;
const {Configuration} = require(`${SERVER_MODELS_DIR}`);

exports.getBackups = async() => {
    if (!fs.existsSync(`${SERVER_BACKUP_DIR}/all`)) {
        fs.mkdirSync(`${SERVER_BACKUP_DIR}/all`, {
            recursive: true
        });
    };
    const list = await fs.readdirSync(`${SERVER_BACKUP_DIR}/all`);
    const backupedList = list.map( dir => {
        const folderInfo = fs.statSync(`${SERVER_BACKUP_DIR}/all/${dir}`);
        const subPath = `${SERVER_BACKUP_DIR}/all/${dir}/README.txt`;
        const description = fs.readFileSync(subPath, {encoding:'utf8', flag:'r'});
        
        return {
            version: dir,
            path: `${SERVER_BACKUP_DIR}/all/${dir}`,
            description,
            createdAt: folderInfo.ctime
        }
    })

    return backupedList;
}

exports.configBackup = async(query, data) => {
    const {auto, schedule} = query;
    let configDB = await Configuration(connect(DB_CONNECTION, process.env.DB_NAME)).findOne({name: 'all'});

    switch(auto) {
        case 'on':
            switch(schedule) {
                case 'weekly':
                    let timeWeekly = `${data.second} ${data.minute} ${data.hour} * * ${data.day}`;

                    if(configDB !== null){
                        configDB.backup.time.second = data.second;
                        configDB.backup.time.minute = data.minute;
                        configDB.backup.time.hour = data.hour;
                        configDB.backup.time.date = '*';
                        configDB.backup.time.month = '*';
                        configDB.backup.time.day = data.day;
                        configDB.backup.auto = true;
                        configDB.backup.type = schedule;
                        configDB.backup.limit = data.limit;
                        await configDB.save();
                    }

                    BACKUP['all'].limit = data.limit;
                    BACKUP['all'].job.setTime(time(timeWeekly));
                    break;

                case 'monthly':
                    let timeMonthly = `${data.second} ${data.minute} ${data.hour} ${data.date} * *`;

                    if(configDB !== null){
                        configDB.backup.time.second = data.second;
                        configDB.backup.time.minute = data.minute;
                        configDB.backup.time.hour = data.hour;
                        configDB.backup.time.date = data.date;
                        configDB.backup.time.month = '*';
                        configDB.backup.time.day = '*';
                        configDB.backup.auto = true;
                        configDB.backup.type = schedule;
                        configDB.backup.limit = data.limit;
                        await configDB.save();
                    }

                    BACKUP['all'].limit = data.limit;
                    BACKUP['all'].job.setTime(time(timeMonthly));
                    break;

                case 'yearly':
                    let timeYearly = `${data.second} ${data.minute} ${data.hour} ${data.date} ${data.month} *`;

                    if(configDB !== null){
                        configDB.backup.time.second = data.second;
                        configDB.backup.time.minute = data.minute;
                        configDB.backup.time.hour = data.hour;
                        configDB.backup.time.date = data.date;
                        configDB.backup.time.month = data.month;
                        configDB.backup.time.day = '*';
                        configDB.backup.auto = true;
                        configDB.backup.type = schedule;
                        configDB.backup.limit = data.limit;
                        await configDB.save();
                    }

                    BACKUP['all'].limit = data.limit;
                    BACKUP['all'].job.setTime(time(timeYearly));
                    break;

                default:
                    break;
            }
            BACKUP['all'].job.start();
            break;
            
        default:
            configDB.backup.auto = false;
            await configDB.save();
            BACKUP['all'].job.stop();
            break;
    }
}

exports.getConfigBackup = async() => {
    console.log("get config backup system admin")
    return await Configuration(connect(DB_CONNECTION, process.env.DB_NAME)).findOne({name: 'all'});
}

exports.createBackup = async () => {
    return await backup({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || '27017'
    });
};

exports.deleteBackup = async (version) => {
    const path = `${SERVER_BACKUP_DIR}/all/${version}`;
    if (fs.existsSync(path)) {
        exec("rm -rf " + path, function (err) { });
        return version;
    }
    return null;
}

exports.restore = async (backupVersion) => {
    await restore(backupVersion, {
        host: process.env.DB_HOST,
        dbName: process.env.DB_NAME,
        dbPort: process.env.DB_PORT || '27017',
        store: SERVER_BACKUP_DIR,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    });
}
