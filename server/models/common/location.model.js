const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const LocationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    districts: [{
        name: {
            type: String
        },
        communes: [
            {
                name: {
                    type: String
                }
            }
        ]
    }]
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

LocationSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Location)
        return db.model('Location', LocationSchema);
    return db.models.Location;
}