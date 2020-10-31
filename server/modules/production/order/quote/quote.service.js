const {
    Quote
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.createNewQuote = async (data, portal) => {
    console.log("Data:", data);
    let newQuote = await Quote(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        status: data.status,
        creator: data.creator,
        effectiveDate: data.effectiveDate,
        expirationDate: data.expirationDate,
        customer: data.customer,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        goods: data.goods.length ? data.goods.map((item) => {
            return {
                good: item.good,
                returnRule: item.returnRule.map((rr) => {
                    return rr;
                }),
                serviceLevelAgreements: item.serviceLevelAgreements.map((sla) => {
                    return sla;
                }),
                price: item.price,
                quantity: item.quantity,
                baseUnit: item.baseUnit,
                taxs: item.taxs.map((tax)=> {
                    return tax;
                }),
                discounts: item.discounts.map((disc) => {
                    return disc;
                }),
                note: item.note
            }
        }) :  null,
        discounts: data.discounts.map((disc) => {
            return disc;
        }),
        totalDiscounts: {
            money: data.totalDiscounts.money ? data.totalDiscounts.money : null,
            goods: data.totalDiscounts.goods ? data.totalDiscounts.goods.map((item) => {
                return {
                    good: item.good,
                    quantity: item.quantity,
                    percent: item.percent,
                    price: item.price
                }
            }) : null,
            coin: data.totalDiscounts.coin ? data.totalDiscounts.coin : null
        },
        amount: data.amount,
        totalTax: data.totalTax,
        paymentAmount: data.paymentAmount,
        note: data.note
    });

    let quote = await Quote(connect(DB_CONNECTION, portal)).findById({ _id: newQuote._id });
    return quote
}

exports.getAllQuotes = async (query, portal) => {
    let { page, limit} = query;
    let option = {};
    if (query.code) {
        option.code = new RegExp(query.code, "i")
    }
    if (query.status) {
        option.status = query.status
    }

    page = Number(page);
    limit = Number(limit);

    if (!page || !limit) {
        let allQuotes = await Quote(connect(DB_CONNECTION, portal)).find(option);
        return { allQuotes }
    } else {
        let allQuotes = await Quote(connect(DB_CONNECTION, portal)).paginate(option, {
                page,
                limit,
            })
        return { allQuotes }    
    }
}