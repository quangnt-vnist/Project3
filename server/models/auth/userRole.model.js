const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserRoleSchema = new Schema({ // Liên kết nhiều nhiều giữa User và Role
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
});

module.exports = (db) => {
    if(!db.models.UserRole)
        return db.model('UserRole', UserRoleSchema);
    return db.models.UserRole;
}