const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BankAccountSchema = new Schema({
    account: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    bank: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true,
})

module.exports = (db) => {
    if (db.models.BankAccount)
        return db.model('BankAccount', BankAccountSchema)
    return db.models.BankAccount
}