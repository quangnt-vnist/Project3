const Models = require(`${SERVER_MODELS_DIR}`);
const { OrganizationalUnit, OrganizationalUnitKpiSet } = Models;
const arrayToTree = require('array-to-tree');
const EvaluationDashboardService = require('../../evaluation/dashboard/dashboard.service');
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);
 
/**
 * Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @id Id công ty
 * @role Id của role ứng với đơn vị cần lấy đơn vị con
 */
exports.getChildrenOfOrganizationalUnitsAsTree = async (portal, company, role) => {
    let organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .findOne({
            $or: [
                {'deans': { $in: role }}, 
                {'viceDeans':{ $in: role }}, 
                {'employees':{ $in: role }}
            ]
        });
    const data = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find(); //{company: company}
    
    const newData = data.map( department => {return {
            id: department._id.toString(),
            name: department.name,
            description: department.description,
            deans: department.deans.map(item => item.toString()),
            viceDeans: department.viceDeans.map(item => item.toString()),
            employees: department.employees.map(item => item.toString()),
            parent_id: department.parent !== null ? department.parent.toString() : null
        }
    });
    
    const tree = await arrayToTree(newData);

    if (organizationalUnit) {
        for(let j = 0; j < tree.length; j++){
            let queue = [];
            if(organizationalUnit.name === tree[j].name){
                return tree[j];
            }
            queue.push(tree[j]);
            while(queue.length > 0){
                v = queue.shift();
                if(v.children !== undefined){
                    for(let i = 0; i < v.children.length; i++){
                        let u = v.children[i];
                        if(organizationalUnit.name === u.name){                        
                            return u;
                        }
                        else{
                            queue.push(u);
                        }
                    }
                }
            }
        }
    } 
    
    return null;
}