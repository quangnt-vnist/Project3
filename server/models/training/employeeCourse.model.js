const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeCourseSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    result: { //pass: Đạt, failed: Không đạt
        type: String,
        enum: ['pass', 'failed']
    }

})

module.exports = (db) => {
    if(!db.models.EmployeeCourse)
        return db.model('EmployeeCourse', EmployeeCourseSchema);
    return db.models.EmployeeCourse;
}
