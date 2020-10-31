const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfigurationSchema = new Schema({
    name: {
        type: String
    },
    backup: {
        auto: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            enum: ['weekly', 'monthly', 'yearly'],
            default: 'monthly'
        },
        time: {
            second: {
                type: String,
                default: '0'
            },
            minute: {
                type: String,
                default: '0'
            },
            hour: {
                type: String,
                default: '2'
            },
            date: {
                type: String,
                default: '*'
            },
            month: {
                type: String,
                default: '*'
            },
            day: {
                type: String,
                default: '*'
            }
        },
        limit: {
            type: Number,
            default: 10
        }
    }
}, {
    timestamps: true
});

module.exports = (db) => {
    if(!db.models.Configuraion)
        return db.model('Configuration', ConfigurationSchema);
    return db.models.Configuration;
}