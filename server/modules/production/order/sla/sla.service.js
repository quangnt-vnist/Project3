const {
    ServiceLevelAgreement
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);


exports.createNewSLA = async (data, portal) => {
    let newSLA = await ServiceLevelAgreement(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        goods: data.goods.map((item) => {
            return item;
        }),
        title: data.title,
        descriptions: data.descriptions.map((item) => {
            return item;
        }),
        creator: data.creator,
        version: 1,//default create = version 1
        status: true, // default create status = true
    })
    let sla = await ServiceLevelAgreement(connect(DB_CONNECTION, portal)).findById({ _id: newSLA._id })
    return { sla };
}

//Tạo ra 1 version (document) khác có code như cũ
exports.editSLAByCode = async (id, data, portal) => {
    let oldSLA = await ServiceLevelAgreement(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldSLA) {
        throw Error("SLA is not existing")
    }
    
    //Tạo ra 1 phiên bản sla mới có code giống phiên bản cũ
    let newVersionSLA = await ServiceLevelAgreement(connect(DB_CONNECTION, portal)).create({
        code: oldSLA.code,
        goods: data.goods.map((item) => {
            return item;
        }),
        title: data.title,
        descriptions: data.descriptions.map((item) => {
            return item;
        }),
        creator: data.creator,
        version: oldSLA.version + 1,
        status: true,
    })

    oldSLA.status = false;
    oldSLA.save();
    
    let sla = await ServiceLevelAgreement(connect(DB_CONNECTION, portal)).findById({ _id: newVersionSLA._id });
    
    return { sla }
}

exports.getAllSLAs = async (query, portal) => {
    let { page, limit } = query;
    console.log(query);
    let option = {};
    if (query.code) {
        option.code = new RegExp(query.code, "i")
    }
    if(query.title) {
        option.title = new RegExp(query.title, "i")
    }

    //Chỉ lấy những sla đang có hiệu lực
    option.status = true;

    if ( !page || !limit ){
        let allSLAs = await ServiceLevelAgreement(connect(DB_CONNECTION, portal))
        .find(option)
        .populate([{
            path: "goods", select: "code name"
        },
        {
            path: "creator", select: "name"
        }])
        return { allSLAs }
    } else {
        let allSLAs = await ServiceLevelAgreement(connect(DB_CONNECTION, portal)) .paginate(option, {
            page,
            limit,
            populate: [{
                path: "goods", select: "code name"
            },{
                path: "creator", select: "name"
            }]
        })
        return { allSLAs }
    }
}

exports.getSLAById = async (id, portal) => {
    let sla = await ServiceLevelAgreement(connect(DB_CONNECTION, portal))
    .findById(id)
    .populate([{
        path: "goods", select: "code name"
    },{
        path: "creator", select: "name"
    }])

    if (!sla) {
        throw Error("SLA is not existing")
    }

    return { sla }
}

//Vô hiệu hóa SLA này, là vô hiệu hóa version cuối
exports.disableSLAById = async (id, portal) => {
    let sla = await ServiceLevelAgreement(connect(DB_CONNECTION, portal))
    .findById(id)

    if (!sla) {
        throw Error("SLA is not existing")
    }

    sla.status = false;
    sla.save();

    return { sla }
}


exports.checkAvailabledCode = async (query, portal) => {
    let sla = await ServiceLevelAgreement(connect(DB_CONNECTION, portal))
    .find({code: query.code})
    if (!sla || sla.length === 0) {
        return false
    }
    //Code này đã có sẵn
    return true;
}

exports.getSLAByCode = async (query, portal) => {
    let sla = await ServiceLevelAgreement(connect(DB_CONNECTION, portal))
    .find({code: query.code})

    if (!sla) {
        throw Error("SLA is not existing")
    }
    //code này đã có sẵn trong db
    return { sla };
}
