import arrayToTree from 'array-to-tree';

export function convertArrayToTree(array, id="id", title="title") {
    const dataConverted = array.map( node => {
        return {
            ...node,
            [id]: node._id.toString(),
            key: node._id.toString(),
            value: node._id.toString(),
            label: node.name,
            [title]: node.name,
            parent_id: node.parent ? node.parent.toString() : null
        }
    });
    const tree = arrayToTree(dataConverted, {});

    return tree;
}