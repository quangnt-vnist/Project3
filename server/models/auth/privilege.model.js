const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivilegeSchema = new Schema({
    resourceId: {
        type: Schema.Types.ObjectId,
        refPath: 'resourceType',
        required: true
    },
    resourceType: {
        type: String,
        enum: ['Link', 'TaskTemplate', 'Component', 'ProcessTemplate'], // tên model tương ứng - không đổi về dạng chữ thường
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    actions: [{
        type: String,
        enum: ['see', 'open', 'edit', 'delete'],
    }]
});

module.exports = (db) => {
    if(!db.models.Privilege) 
        return db.model('Privilege', PrivilegeSchema);
    return db.models.Privilege;
}