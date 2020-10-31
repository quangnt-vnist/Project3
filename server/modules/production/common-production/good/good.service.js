const { Good } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getGoodsByType = async (company, query, portal) => {
    var { page, limit, type } = query;
    if (!company) throw ['company_invaild'];
    if (!page && !limit) {
        return await Good(connect(DB_CONNECTION, portal))
            .find({ company, type })
            .populate([
                { path: 'materials.good', select: 'id name' }
            ])
    } else {
        let option = {
            company: company,
            type: type
        }

        if (query.category) {
            option.category = query.category;
        }

        if (query.name) {
            option.name = new RegExp(query.name, "i");
        }

        if (query.code) {
            option.code = new RegExp(query.code, "i");
        }

        return await Good(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [
                    { path: 'materials.good', select: 'id name' }
                ]
            })
    }
}

exports.getAllGoodsByType = async (query, portal) => {
    let { type } = query;
    console.log(type);
    console.log("xx");
    return await Good(connect(DB_CONNECTION, portal))
        .find({ type })
        .populate([
            { path: 'materials.good', select: 'id code name baseUnit' }
        ])
}

exports.getAllGoodsByCategory = async (company, categoryId, portal) => {
    return await Good(connect(DB_CONNECTION, portal))
        .find({ company, category: categoryId })
        .populate([
            { path: 'materials.good', select: 'id name' }
        ])
}

exports.createGoodByType = async (company, data, portal) => {
    let good = await Good(connect(DB_CONNECTION, portal)).create({
        company: company,
        category: data.category,
        code: data.code,
        name: data.name,
        type: data.type,
        baseUnit: data.baseUnit,
        units: data.units.map(item => {
            return {
                name: item.name,
                conversionRate: item.conversionRate,
                description: item.description
            }
        }),
        materials: data.materials.map(item => {
            return {
                good: item.good,
                quantity: item.quantity
            }
        }),
        description: data.description,
        quantity: data.quantity ? data.quantity : 0
    });

    return await Good(connect(DB_CONNECTION, portal))
        .findById(good._id)
        .populate([
            { path: 'materials.good', select: 'id name' }
        ])
}

exports.getGoodDetail = async (id, portal) => {
    return await Good(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'materials.good', select: 'id name' }
        ])
}

exports.editGood = async (id, data, portal) => {
    let good = await Good(connect(DB_CONNECTION, portal)).findById(id);
    good.category = data.category,
        good.code = data.code,
        good.name = data.name,
        good.type = data.type,
        good.baseUnit = data.baseUnit,
        good.units = data.units.map(item => {
            return {
                name: item.name,
                conversionRate: item.conversionRate,
                description: item.description
            }
        }),
        good.materials = data.materials.map(item => {
            return {
                good: item.good,
                quantity: item.quantity
            }
        }),
        good.description = data.description,
        good.quantity = data.quantity
    await good.save();

    return await Good(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'materials.good', select: 'id name' }
        ])

}

exports.deleteGood = async (id, portal) => {
    await Good(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    return id;
}

exports.getAllGoods = async (company, portal) => {
    return await Good(connect(DB_CONNECTION, portal))
        .find({ company })
        .populate([
            { path: 'materials.good', select: 'id name' },
        ])
}