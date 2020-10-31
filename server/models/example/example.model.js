const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExampleSchema = new Schema({
    exampleName: { // Tên Ví dụ
        type: String,
        required: true
    },
    description: { // Mô tả Ví dụ
        type: String
    }
});

module.exports = (db) => {
    if (!db.models.Example)
        return db.model('Example', ExampleSchema);
    return db.models.Example;
} 