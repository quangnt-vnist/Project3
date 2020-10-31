const {
    Discount
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);


exports.createNewDiscount = async (data, portal) => {
    let newData = {
        code: data.code,
        name: data.name,
        description: data.description ? data.description : "",
        effectiveDate: data.effectiveDate,
        expirationDate: data.expirationDate,
        type: data.type,
        creator: data.creator,
        discountVariances: {
            money: data.discountVariances.money ? data.discountVariances.money : undefined,
            percent: data.discountVariances.percent ? data.discountVariances.percent : undefined,
            coin: data.discountVariances.coin ? data.discountVariances.coin : undefined,
            delivery: data.discountVariances.delivery ? data.discountVariances.delivery : undefined,
            maxMoney: data.discountVariances.maxMoney ? data.discountVariances.maxMoney : undefined,
            goodQuantity: data.discountVariances.goodQuantity ? data.discountVariances.goodQuantity :undefined,
            numberOfDelaydDays: data.discountVariances.numberOfDelaydDays ? data.discountVariances.numberOfDelaydDays : undefined
        },
        discounts: data.discounts ? data.discounts.map((item) =>{
            return{
                money: item.money,
                percent: item.percent,
                coin: item.coin,
                delivery: item.delivery,
                maxMoney: item.maxMoney,
                minium: item.minium,
                maximum: item.maximum,
                customerType: item.customerType,
                gooosBonus: item.gooosBonus.map((good) => {
                    return {
                        good: good.good,
                        quantity: good.quantity
                    }
                }),
                goods: item.goods.map((good) => {
                    return {
                        good: good.good,
                        expirationDate: good.expirationDate
                    }
                }),
            }
        }) : undefined,
        version: 1,//default create = version 1
        status: true, // default create status = true
    };


    let newDiscount = await Discount(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        name: data.name,
        description: data.description ? data.description : "",
        effectiveDate: data.effectiveDate,
        expirationDate: data.expirationDate,
        type: data.type,
        creator: data.creator,
        discountVariances: {
            money: data.discountVariances.money ? data.discountVariances.money : undefined,
            percent: data.discountVariances.percent ? data.discountVariances.percent : undefined,
            coin: data.discountVariances.coin ? data.discountVariances.coin : undefined,
            delivery: data.discountVariances.delivery ? data.discountVariances.delivery : undefined,
            maxMoney: data.discountVariances.maxMoney ? data.discountVariances.maxMoney : undefined,
            goodQuantity: data.discountVariances.goodQuantity ? data.discountVariances.goodQuantity :undefined,
            numberOfDelaydDays: data.discountVariances.numberOfDelaydDays ? data.discountVariances.numberOfDelaydDays : undefined
        },
        discounts: data.discounts ? data.discounts.map((item) =>{
            return{
                money: item.money,
                percent: item.percent,
                coin: item.coin,
                delivery: item.delivery,
                maxMoney: item.maxMoney,
                minium: item.minium,
                maximum: item.maximum,
                customerType: item.customerType,
                gooosBonus: item.gooosBonus.map((good) => {
                    return {
                        good: good.good,
                        quantity: good.quantity
                    }
                }),
                goods: item.goods.map((good) => {
                    return {
                        good: good.good,
                        expirationDate: good.expirationDate
                    }
                }),
            }
        }) : undefined,
        version: 1,//default create = version 1
        status: true, // default create status = true
    })
    console.log("New",newDiscount);
    let discount = await Discount(connect(DB_CONNECTION, portal))
    .findById({ _id: newDiscount._id })
    .populate([{
        path: 'creator', select: 'name'
    }])
    return { discount };
}



