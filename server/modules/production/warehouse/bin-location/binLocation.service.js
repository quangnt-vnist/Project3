const arrayToTree = require("array-to-tree");
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;

const { BinLocation } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

async function getBin(portal) {
    const list = await BinLocation(connect(DB_CONNECTION, portal)).find()
            .populate([
                { path: 'enableGoods.good', select: 'id name type baseUnit'}
            ]);
        const dataConverted = list.map(bin => {
            return {
                id: bin._id.toString(),
                key: bin._id.toString(),
                value: bin._id.toString(),
                lable: bin.name,
                title: bin.name,
                parent_id: bin.parent ? bin.parent.toString() : null,
                child_id: bin.child ? bin.child.toString() : null
            }
        });
        const tree = await arrayToTree(dataConverted, {});
        return { list, tree };
}

exports.getBinLocations = async (query, portal) => {
    const { stock } = query;
    if(stock){
        const list = await BinLocation(connect(DB_CONNECTION, portal)).find({ stock: stock })
            .populate([
                { path: 'enableGoods.good', select: 'id name type baseUnit'}
            ]);
        const dataConverted = list.map(bin => {
            return {
                id: bin._id.toString(),
                key: bin._id.toString(),
                value: bin._id.toString(),
                lable: bin.name,
                title: bin.name,
                parent_id: bin.parent ? bin.parent.toString() : null,
                child_id: bin.child ? bin.child.toString() : null
            }
        });
        const tree = await arrayToTree(dataConverted, {});
        return { list, tree };
    }
    else {
         return await getBin(portal);
    }
}

exports.getChildBinLocations = async (query, portal) => {
    let { page, limit, stock, good } = query;
    const arr = [];
    if(!page && !limit) {
        if(stock){
            return await BinLocation(connect(DB_CONNECTION, portal)).find({ child: arr, stock, good })
            .populate([
                { path: 'enableGoods.good', select: 'id name type baseUnit'}
            ]);
        } else {
            return await BinLocation(connect(DB_CONNECTION, portal)).find({ child: arr, good })
            .populate([
                { path: 'enableGoods.good', select: 'id name type baseUnit'}
            ]);
        }
    } else {
        if(stock) {
            let option = { child: [], stock, good };

            if(query.path) {
                option.path = new RegExp(query.path, "i")
            }

            if(query.status) {
                option.status = query.status
            }

            return await await BinLocation(connect(DB_CONNECTION, portal))
                .paginate(option, {
                    page,
                    limit,
                    populate: [
                        { path: 'enableGoods.good', select: 'id name type baseUnit'}
                    ]
                })
        }
        else {
            let option = { child: [], good };

            if(query.stock) {
                option.stock = query.stock
            }

            if(query.path) {
                option.path = new RegExp(query.path, "i")
            }

            if(query.status) {
                option.status = query.status
            }

            return await await BinLocation(connect(DB_CONNECTION, portal))
                .paginate(option, {
                    page,
                    limit,
                    populate: [
                        { path: 'enableGoods.good', select: 'id name type baseUnit'}
                    ]
                })
        }
    }
}

exports.getDetailBinLocation = async (id, portal) => {
    const binLocation = await BinLocation(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'enableGoods.good', select: 'id name type baseUnit'},
            { path: 'department', select: 'id name'},
            { path: 'users', select: 'id name'}
        ])
    return binLocation;
}

async function findPath(data, portal){
    let path = "";
    let arrParent =[];
    arrParent.push(data.code);
    if(data.parent && data.parent !== "#" && data.parent.toString() !== data.stock.toString()){
        let parent = data.parent;
        let stock = data.stock;
        while(parent && stock.toString() !== parent.toString()){
            let tmp = await BinLocation(connect(DB_CONNECTION, portal)).findById(parent);
            arrParent.push(tmp.code);
            parent = tmp.parent;
            stock = tmp.stock;
        }
    }
    const stock = data.stock;
    let stockPath = await BinLocation(connect(DB_CONNECTION, portal)).find({ stock: stock }).populate([{ path: 'stock', select: 'id code'}]);
    let nodePath = (stockPath && stockPath.length > 0) ? stockPath[0].stock.code : data.stock;
    arrParent.push(nodePath);
    path = arrParent.reverse().join("-");
    return path;
}

async function deleteNode(id, portal) {
    const binLocation = await BinLocation(connect(DB_CONNECTION, portal)).findById(id);
    if(!binLocation) throw ['bin_location_not_found'];
    let parent = binLocation.parent;
    let binLocations = await BinLocation(connect(DB_CONNECTION, portal)).find({ parent: id });

    if(binLocations.length) {
        for( let i = 0; i < binLocations.length; i++) {
            binLocations[i].parent = parent;
            binLocations[i].path = await findPath(binLocations[i], portal);
            await binLocations[i].save();
        }
    }

    let binChild = await BinLocation(connect(DB_CONNECTION, portal)).find({ child: id })
    if(binChild.length) {
       binChild[0].child = binChild[0].child.filter(x => x != id);
        if(binLocations.length){
            for( let i = 0; i < binLocations.length; i++) {
                binChild[0].child = [...binChild[0].child, binLocations[i]._id];
            }
        }
        await binChild[0].save();
    }

    await BinLocation(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
}

exports.createBinLocation = async (data, portal) => {
    let query = {
        code: data.code,
        name: data.name,
        status: data.status,
        description: data.description,
        stock: data.stock,
        users: data.users,
        child: data.child ? data.child : [],
        enableGoods: data.enableGoods.map(item => {
            return {
                good: item.good,
                contained: item.contained,
                capacity: item.capacity
            }
        }),
        capacity: data.capacity,
        contained: data.contained,
        unit: data.unit,
        department: data.department,
    }
    if(data.parent && data.parent.length){
        query.parent = data.parent
    }
    query.path = await findPath(data, portal)

    const bin = await BinLocation(connect(DB_CONNECTION, portal)).create(query);
    if(bin.parent){
        const binUpdate = await BinLocation(connect(DB_CONNECTION, portal)).findById(bin.parent);
        binUpdate.child = [...binUpdate.child, bin._id];
        await binUpdate.save();

    }
    
    return await getBin(portal);
}

exports.editBinLocation = async (id, data, portal) => {
    let array = data.array;
    const binLocation = await BinLocation(connect(DB_CONNECTION, portal)).findById(id);
    if(binLocation){
        if(data.parent != binLocation.parent) {
            const binParent = await BinLocation(connect(DB_CONNECTION, portal)).find({ child: id })
            if(binParent.length){
                binParent[0].child = binParent[0].child.filter(x => x != id);
                await binParent[0].save();
            }
            const newBinParent = await BinLocation(connect(DB_CONNECTION, portal)).find({ _id: data.parent});
            if(newBinParent.length){
                newBinParent[0].child = [...newBinParent[0].child, id];
                await newBinParent[0].save()
            }
        }
    }
    binLocation.code= data.code ? data.code : binLocation.code;
    binLocation.name= data.name ? data.name : binLocation.name;
    binLocation.status= data.status ? data.status : binLocation.status;
    binLocation.description= data.description ? data.description : binLocation.description;
    binLocation.stock= data.stock ? data.stock : binLocation.stock;
    binLocation.users= data.users ? data.users : binLocation.users;
    binLocation.enableGoods= data.enableGoods ? data.enableGoods.map(item => {
        return {
            good: item.good,
            contained: item.contained,
            capacity: item.capacity
        }
    }) : binLocation.enableGoods,
    binLocation.capacity= data.capacity ? data.capacity : binLocation.capacity;
    binLocation.contained= data.contained ? data.contained : binLocation.contained;
    binLocation.unit= data.unit ? data.unit : binLocation.unit;
    binLocation.parent = ObjectId.isValid(data.parent) ? data.parent : null;
    binLocation.department = data.department ? data.department : binLocation.department;
    binLocation.child = data.child ? data.child : binLocation.child;
    // binLocation.path = await findPath(data, portal)
    await binLocation.save();

    for( let i = 0; i < array.length; i++) {
        let binLocation = await BinLocation(connect(DB_CONNECTION, portal)).findById(array[i]);
        binLocation.path = await findPath(binLocation, portal);
        await binLocation.save();
    }

    return binLocation;
    
}

exports.deleteBinLocation = async (id, portal) => {
    await deleteNode(id, portal);

    return await getBin(portal);
}

exports.deleteManyBinLocations = async (array, portal) => {
    for( let i =0; i < array.length; i++) {
        await deleteNode(array[i], portal);
    }
    

    return await getBin(portal);
}