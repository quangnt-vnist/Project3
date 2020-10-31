const { CareType } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);


exports.getCareTypes = async (portal, companyId, query) => {
    const { page, limit } = query;
    let keySearch = {};
    const listDocsTotal = await CareType(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    const careTypes = await CareType(connect(DB_CONNECTION, portal)).find(keySearch)
    return { listDocsTotal, careTypes };
}

