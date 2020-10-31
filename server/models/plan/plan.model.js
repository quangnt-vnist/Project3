const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    code: { // Mã kế hoạch
        type: String,
        required: true
    },
    planName: { // Tên kế hoạch
        type: String,
        required: true
    },
    description: { // Mô tả kế hoạch
        type: String
    }
});

module.exports = (db) => {
    if(!db.models.Plan)
        return db.model('Plan', PlanSchema);
    return db.models.Plan;
}