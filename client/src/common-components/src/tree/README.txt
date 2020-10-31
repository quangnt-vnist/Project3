Ví dụ sử dụng tree:

<Tree id="abcdef" 
    onChanged={(e, data)=> console.log(data)}
    checkNode={(e, data)=> console.log(data)}   
    unCheckNode={(e, data)=> console.log(data)}
    data={[
        {
        text : "Root node",
        id: "001",
        state : {"opened" : true },
        icon : "glyphicon glyphicon-flash",
        children : [
            {
                text : "Child node 1",
                id: "001.001",
                state : { "selected" : true },
            },
            { text : "Child node 2", id: "001.002"}
        ]}
    ]}/>