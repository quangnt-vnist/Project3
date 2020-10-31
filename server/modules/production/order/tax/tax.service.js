const {
    Tax
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);



exports.createNewTax = async (data, portal) => {
    // console.log("data:", data);
    let newTax = await Tax(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        name: data.name,
        description: data.description ? data.description : "",
        creator: data.creator,
        goods: data.goods.map((item) => {
            return {
                good: item.good,
                percent: item.percent
            }
        }),
        version: 1,//default create = version 1
        status: true, // default create status = true
    })
    let tax = await Tax(connect(DB_CONNECTION, portal)).findById({ _id: newTax._id })
    return { tax };
}

//Tạo ra 1 version (document) khác có code như cũ
exports.editTaxByCode = async (id, data, portal) => {
    let oldTax = await Tax (connect(DB_CONNECTION, portal)).findById(id);
    if (!oldTax) {
        throw Error("Tax is not existing")
    }
    
    //Tạo ra 1 phiên bản tax mới có code giống phiên bản cũ
    let newVersionTax = await Tax(connect(DB_CONNECTION, portal)).create({
        code: oldTax.code,
        name: data.name,
        description: data.description,
        creator: data.creator,
        goods: data.goods.map((item) => {
            return {
                good: item.good,
                percent: item.percent
            }
        }),
        version: oldTax.version + 1,
        status: true,
    })

    oldTax.status = false;
    oldTax.save();
    
    let tax = await Tax(connect(DB_CONNECTION, portal)).findById({ _id: newVersionTax._id });
    
    return { tax }
}

exports.getAllTaxs = async (query, portal) => {
    let { page, limit } = query;
    console.log(query);
    let option = {};
    if (query.code) {
        option.code = new RegExp(query.code, "i")
    }
    if(query.name) {
        option.name = new RegExp(query.name, "i")
    }

    //Chỉ lấy những tax đang có hiệu lực
    option.status = true;

    if ( !page || !limit ){
        let allTaxs = await Tax(connect(DB_CONNECTION, portal))
        .find(option)
        .populate([{
            path: "goods.good", select: "code name"
        },
        {
            path: "creator", select: "name"
        }])
        return { allTaxs }
    } else {
        let allTaxs = await Tax(connect(DB_CONNECTION, portal)) .paginate(option, {
            page,
            limit,
            populate: [{
                path: "goods.good", select: "code name"
            },{
                path: "creator", select: "name"
            }]
        })
        return { allTaxs }
    }
}

exports.getTaxById = async (id, portal) => {
    let tax = await Tax(connect(DB_CONNECTION, portal))
    .findById(id)
    .populate([{
        path: "goods.good", select: "code name"
    },{
        path: "creator", select: "name"
    }])

    if (!tax) {
        throw Error("Tax is not existing")
    }

    return { tax }
}

//Vô hiệu hóa loại thuế này, là vô hiệu hóa version cuối
exports.disableTaxById = async (id, portal) => {
    let tax = await Tax(connect(DB_CONNECTION, portal))
    .findById(id)

    if (!tax) {
        throw Error("Tax is not existing")
    }

    tax.status = false;
    tax.save();

    return { tax }
}


exports.checkAvailabledCode = async (query, portal) => {
    let tax = await Tax(connect(DB_CONNECTION, portal))
    .find({code: query.code})
    if (!tax || tax.length === 0) {
        return false
    }
    //Code này đã có sẵn
    return true;
}

exports.getTaxByCode = async (query, portal) => {
    let taxs = await Tax(connect(DB_CONNECTION, portal))
    .find({code: query.code})

    if (!taxs) {
        throw Error("Tax is not existing")
    }
    //code này đã có sẵn trong db
    return { taxs };
}


