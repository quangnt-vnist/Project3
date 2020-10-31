const {
    ModuleConfiguration
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy cấu hình chức năng quản lý nhân sự
 * @param {*} portal : Tên ngắn của công ty
 */
exports.getHumanResourceConfiguration = async (portal) => {
    let config = await ModuleConfiguration(connect(DB_CONNECTION, portal)).findOne();
    return config.humanResource;
}

/**
 * Tạo cấu hình mặc định cho công ty (được gọi khi tạo công ty)
 * @param {*} portal : Tên ngắn của công ty
 */
exports.createHumanResourceConfiguration = async (portal) => {
    return await ModuleConfiguration(connect(DB_CONNECTION, portal)).create({
        humanResource: {
            contractNoticeTime: 15,
            timekeepingType: "shift",
            timekeepingByShift: {
                shift1Time: 4,
                shift2Time: 4,
                shift3Time: 4,
            },
        },
    });
}

/**
 * Chỉnh sửa cấu hình chức năng quản lý nhân sự
 * @param {*} portal : Tên ngắn của công ty
 * @param {*} data : dữ liệu cấu hình chức năng quản lý nhân sự
 */
exports.editHumanResourceConfiguration = async (portal, data) => {
    let config = await ModuleConfiguration(connect(DB_CONNECTION, portal)).findOne();
    config.humanResource = data.humanResource
    await config.save();

    return config.humanResource;
};