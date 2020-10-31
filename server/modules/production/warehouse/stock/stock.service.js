const { Stock } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getAllStocks = async (company, query, portal) => {
    var { page, limit } = query;
    if(!company) throw['company_invalid'];
    if(!page && !limit){
        return await Stock(connect(DB_CONNECTION, portal))
            .find({ company })
            .populate([
                { path: 'goods.good', select: 'id name'}
            ])
    }
    else{
        let option = { company: company }

        if(query.code){
            option.code = new RegExp(query.code, "i")
        }

        if(query.name){
            option.name = new RegExp(query.name, "i")
        }

        if(query.status){
            option.status = query.status
        }

        return await Stock(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [
                    { path: 'goods.good', select: 'id name'}
                ]
            })
    }
}

exports.getStock = async (id, portal) => {
    return await Stock(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'goods.good', select: 'id name'}
        ])
}

exports.createStock = async (company, data, portal) => {
    let stock = await Stock(connect(DB_CONNECTION, portal)).create({
        company: company,
        code: data.code,
        name: data.name,
        status: data.status,
        description: data.description,
        address: data.address,
        goods: data.goods.map(item => {
            return {
                good: item.good,
                maxQuantity: item.maxQuantity,
                minQuantity: item.minQuantity
            }
        }),
        managementLocation: data.managementLocation,
        manageDepartment: data.manageDepartment
    })
    return await Stock(connect(DB_CONNECTION, portal))
        .findById(stock._id)
        .populate([
            { path: 'goods.good', select: 'id name'}
        ])
}

exports.editStock = async (id, data, portal) => {
    let stock = await Stock(connect(DB_CONNECTION, portal)).findById(id);

    stock.code = data.code,
    stock.name = data.name,
    stock.status = data.status,
    stock.description = data.description,
    stock.address = data.address,
    stock.goods = data.goods.map(item => {
        return {
            good: item.good,
            maxQuantity: item.maxQuantity,
            minQuantity: item.minQuantity
        }
    }),
    stock.managementLocation = data.managementLocation,
    stock.manageDepartment = data.manageDepartment

    await stock.save();

    return await Stock(connect(DB_CONNECTION, portal))
        .findById(stock._id)
        .populate([
            { path: 'goods.good', select: 'id name'}
        ])
}

exports.deleteStock = async (id, portal) => {
    await Stock(connect(DB_CONNECTION, portal)).deleteOne({_id: id});
    return id;
}