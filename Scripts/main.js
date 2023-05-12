var tool = 0;

function onLoad() {
    defaultMaze();
    addListeners()
}

function executeAlgorithm(){
    //TODO add functionality
}

function createMaze(){
    //maze values and reference
    const height = document.querySelector(".height_input").value;
    const width = document.querySelector(".width_input").value;
    const mazeTable = document.querySelector(".maze_table");

    if (height && width && width > 1 && height > 1){

        var rowCount = mazeTable.rows.length - 1; //Resetting Maze
        for (let i = rowCount; i >= 0; i--){
            mazeTable.deleteRow(i);
        }

        for (let i = 0; i < height; i++){ //Creating rows
            var row = mazeTable.insertRow(i);
            row.classList.add("row-" + i);

            for (var j = 0; j < width; j++){ //Creating Columns
                var node = row.insertCell(j);
                var nodeDiv = document.createElement("div");
                nodeDiv.classList.add("maze_node");
                nodeDiv.classList.add("position-" + j + "x" + i);
                nodeDiv.classList.add("walkable");
                node.appendChild(nodeDiv);
            }
        }
    }
    addListeners();
}

function selectTool(i){
    tool = i;
}

function addListeners(){
    var nodes = document.querySelectorAll(".maze_node");
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].addEventListener("click", ()=> {
            var loc = nodes[i].getAttribute("class").match(/position-[0-9]+x[0-9]+/gm)[0].substring(9).split("x");
            var column = loc[0];
            var row = loc[1];   
            editNode(row, column);

        });
    }
}

function editNode(row, column){
    var node = document.querySelector(".position-" + column + "x" + row);
    
    node.classList.remove("walkable");
    node.classList.remove("wall");
    node.classList.remove("start");
    node.classList.remove("end");

    if (tool == 0){
        node.classList.add("walkable")
    }
    else if (tool == 1){
        node.classList.add("wall");
    }
    else if (tool == 2){
        existing = document.querySelector(".start");
        if (existing){
            existing.classList.remove("start");
            existing.classList.add("walkable");
        }
        node.classList.add("start");
    }
    else if (tool == 3){
        existing = document.querySelector(".end");
        if (existing){
            existing.classList.remove("end");
            existing.classList.add("walkable");
        }
        node.classList.add("end");
    }
}

function defaultMaze(){
    document.querySelector(".height_input").value = 5;
    document.querySelector(".width_input").value = 5;

    createMaze();

    document.querySelector(".height_input").value = "";
    document.querySelector(".width_input").value = "";
}