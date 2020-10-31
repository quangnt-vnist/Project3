const { Category } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);
const arrayToTree = require('array-to-tree');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;

async function findPath(data, portal){
    let path = "";
    let arrParent =[];
    arrParent.push(data.code);
    if(data.parent && data.parent !== "#"){
        let parent = data.parent;
        while(parent){
            let tmp = await Category(connect(DB_CONNECTION, portal)).findById(parent);
            arrParent.push(tmp.code);
            parent = tmp.parent;
        }
    }
    path = arrParent.reverse().join("-");
    return path;
}

async function deleteNode(id, portal) {
    const category = await Category(connect(DB_CONNECTION, portal)).findById(id);
    if(!category) throw ['bin_location_not_found'];
    let parent = category.parent;
    let categorys = await Category(connect(DB_CONNECTION, portal)).find({ parent: id });

    if(categorys.length) {
        for( let i = 0; i < categorys.length; i++) {
            categorys[i].parent = parent;
            categorys[i].path = await findPath(categorys[i], portal);
            await categorys[i].save();
        }
    }

    await Category(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
}

exports.getCategories = async (query, portal) => {
    var { page, limit } = query;
    if(!page && !limit) {
        return await Category(connect(DB_CONNECTION, portal)).find();
    }
    else {
        const option = ( query.key && query.value ) ?
            Object.assign({ }, {[ `${query.key}`]: new RegExp(query.value, "i")}) :
            {};
        return await Category(connect(DB_CONNECTION, portal))
            .paginate( option, {
                page,
                limit
            })
    }
}

exports.getCategoryToTree = async (portal) => {
    const list = await Category(connect(DB_CONNECTION, portal)).find();

    const dataConverted = list.map(category => {
        return {
            id: category._id.toString(),
            key: category._id.toString(),
            value: category._id.toString(),
            label: category.name,
            title: category.name,
            parent_id: category.parent !== null ? category.parent.toString() : null
        }
    });
    const tree = await arrayToTree(dataConverted, {});
    return { list, tree };
}

exports.getCategoriesByType = async (query, portal) => {
    let { type } = query;
    return await Category(connect(DB_CONNECTION, portal)).find({ type: type });
}

exports.createCategory = async (data, portal) => {
    let category = await Category(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        name: data.name,
        type: data.type,
        parent: (data.parent && data.parent.length) ? data.parent : null,
        description: data.description
    });
    return await this.getCategoryToTree(portal);
}

exports.getCategory = async (id, portal) => {
    return await Category(connect(DB_CONNECTION, portal)).findById(id);
}

exports.editCategory = async (id, data, portal) => {
    const category = await Category(connect(DB_CONNECTION, portal)).findById(id);

    category.code = data.code;
    category.name = data.name;
    category.parent = ObjectId.isValid(data.parent) ? data.parent : null;
    category.type = data.type;
    category.path = await findPath(data, portal)
    category.description = data.description;
    await category.save();

    return category;
}

exports.deleteCategory = async (id, portal) => {
    await deleteNode(id, portal);

    return await this.getCategoryToTree(portal);
}

exports.deleteManyCategories = async (array, portal) => {
    for( let i = 0; i < array.length; i++) {
        await deleteNode(array[i], portal);
    }
    
    return await this.getCategoryToTree(portal);
}