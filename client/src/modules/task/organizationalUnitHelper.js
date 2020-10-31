var getEmployeeSelectBoxItems = (usersOfChildrenOrganizationalUnit, includeDean=true, includeViceDean=true, includeEmployee=true)=>{
    let unitMembers;
    let structEmployee=[];

    if(usersOfChildrenOrganizationalUnit){
        let units={}; // // Map: key-id nhân viên, value-phòng/ban nhân viên
        let employees={}; // Map: key-id nhân viên, value-tên nhân viên
        let roles={}; // Map: key-id nhân viên, value-các chức danh của nhân viên
          
        for (let  i=0;i< usersOfChildrenOrganizationalUnit.length;i++){
            var unit = usersOfChildrenOrganizationalUnit[i];

            if (includeDean && unit){
                for (let key in unit.deans){ // Xử lý deans
                    let value = unit.deans[key];
                    for (let j=0; j<value.members.length; j++){
                        let member = value.members[j];
                        if(employees[member._id]){
                            roles[member._id] += ", " + value.name;
                        } else{
                            employees[member._id]=member.name;
                            roles[member._id]=value.name;                        
                            units[member._id]= units[member._id] ? units[member._id]:unit.department;
                        }
                    }
                }
            }

            if (includeViceDean){
                for (let key in unit.viceDeans){ // Xử lý viceDeans
                    let value = unit.viceDeans[key];
                    for (let j=0; j<value.members.length; j++){
                        let member = value.members[j];
                        if(employees[member._id]){
                            roles[member._id] += ", " + value.name;
                        } else{
                            employees[member._id]=member.name;
                            roles[member._id]=value.name;                        
                            units[member._id]= units[member._id] ? units[member._id]:unit.department;
                        }
                    }
                }
            }
            

            if (includeEmployee){
                for (let key in unit.employees){ // Xử lý employees
                    let value = unit.employees[key];
                    for (let j=0; j<value.members.length; j++){
                        let member = value.members[j];
                        if(employees[member._id]){
                            roles[member._id] += ", " + value.name;
                        } else{
                            employees[member._id]=member.name;
                            roles[member._id]=value.name;                        
                            units[member._id]= units[member._id] ? units[member._id]:unit.department;
                        }
                    }
                }
            }
        }

        for (let item in employees){
            structEmployee.push({
                id : item,
                name : employees[item],
                role: roles[item],
                department: units[item]
            });
        }
    }

    if(usersOfChildrenOrganizationalUnit){
        unitMembers=usersOfChildrenOrganizationalUnit.map(unitMember=>{
            var temp=[];
            for(let i=0;i<structEmployee.length;i++){
                let item=structEmployee[i];
                if(item.department === unitMember.department){
                    temp.push({
                        text: item.name +" ("+item.role+")",
                        value : item.id
                    });
                }
            }
            var unit ={
                text : unitMember && unitMember.department,
                value : temp
            };

            return unit;                
        });
    }

    return unitMembers;
}

export default getEmployeeSelectBoxItems;