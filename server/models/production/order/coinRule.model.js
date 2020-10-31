const  mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoinRuleSchema = new Schema({
    coinToDiscountMoney: {
        type: Number,
        required: true
    }, 
    minCoin: {
        type: Number,
        required: Number
    }
}, {
    timestamps: true,
})

module.exports = (db) =>{
    if (!db.models.CoinRule) 
        return db.model('CoinRule', CoinRuleSchema)
    return db.models.CoinRule
}