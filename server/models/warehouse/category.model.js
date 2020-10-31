const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CategorySchema = new Schema ({

    parent: {
        type: Schema.Types.ObjectId,
        replies: this
    },

    path: {
        type: String
    },

    code: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["product", "material", "equipment", "asset"]
    },

    description: {
        type: String
    }
});

CategorySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Category)
        return db.model('Category', CategorySchema);
    return db.models.Category;
}