var tool = 0;

function onLoad() {
    defaultMaze();
    addListeners();
}

function executeAlgorithm(){
    existingPath = document.querySelectorAll(".path");
    for (let i = 0; i < existingPath.length; i++){
        existingPath[i].classList.remove("path");
    }
    
    fetch('/endpoint', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: tableToJson()
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (data.hasOwnProperty("error")){
            console.log("No Path Found");
            toggleErrorMessage(1);
            return
        }
        toggleErrorMessage(0);
        path = []
        for (let i = 0; i < data.length; i++){
            path.push(data[i]);
        }
        showPath(path);
    })
}

function showPath(path) {
    for (let i = 0; i < path.length; i++) {
        var node = document.querySelector('.position-' + path[i][1] + 'x' + path[i][0]);
        node.classList.add('path');
    }
}

function toggleDiagonal(){
    diagonalElement = document.querySelector(".diag_button");
    if (diagonalElement.classList.contains("active_diag")){
        diagonalElement.classList.remove("active_diag")
    }
    else{
        diagonalElement.classList.add("active_diag");
    }
}

function tableToJson(){
    var maze = [];
    var rows = document.querySelectorAll(".maze_row");

    if (document.querySelector(".diag_button").classList.contains("active_diag")){
        maze.push("allow");
    }
    else {
        maze.push("deny");
    }

    for (let i = 0; i < rows.length; i++){
        var nodes = rows[i].querySelectorAll('td');
        var currentRow = [];
        for (let j = 0; j < nodes.length; j++){
            currentRow.push(nodes[j].innerHTML);
        }
        maze.push(currentRow);
    }
    console.log(JSON.stringify(maze));
    return JSON.stringify(maze);
}

function createMaze(){
    toggleErrorMessage(0);
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
            row.classList.add("maze_row");
            row.classList.add("row-" + i);

            for (var j = 0; j < width; j++){ //Creating Columns
                var node = row.insertCell(j);
                var nodeDiv = document.createElement("div");
                node.classList.add("node_wrapper");
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
    var tools = document.querySelectorAll(".tool_button");

    //Removes all tools from being currently active
    for (let j = 0; j < tools.length; j++){
        tools[j].classList.remove("active_tool");
    }
    tools[i].classList.add("active_tool"); //The tool that has been selected will now be active
}

function addListeners(){
    //Maze Listener
    const mazeTable = document.querySelector(".maze_table");
    var isMouseDown = false;

    mazeTable.addEventListener("mousedown", function(event) {
        isMouseDown = true;
        event.preventDefault();
        editNode(event.target);
    });

    window.addEventListener("mouseup", function(event) {
        isMouseDown = false;
        event.preventDefault();
    });

    mazeTable.addEventListener("mousemove", function(event) {
        event.preventDefault();
        if (isMouseDown) {
            editNode(event.target);
        }
    });
}

function clearMaze(){
    toggleErrorMessage(0);
    var nodes = document.querySelectorAll(".maze_node");
    for (let i = 0; i < nodes.length; i++){
        nodes[i].classList.remove("wall");
        nodes[i].classList.remove("start");
        nodes[i].classList.remove("end");
        nodes[i].classList.remove("path")

        if (!nodes[i].classList.contains("walkable")){
            nodes[i].classList.add("walkable");
        }
    }
}

function editNode(node){
    if (node.classList.contains("maze_table") || node.classList.contains("node_wrapper")){
        return 
    }
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

function toggleErrorMessage(toggle){
    errorBox = document.querySelector(".error_box");
    if (toggle == 1){
        errorBox.style.display = "block";
        errorBox.classList.remove("hidden");
    }
    else{
        errorBox.style.display = "none";
        errorBox.classList.add("hidden");
    }
}

function defaultMaze(){
    document.querySelector(".height_input").value = 5;
    document.querySelector(".width_input").value = 5;

    createMaze();

    document.querySelector(".height_input").value = "";
    document.querySelector(".width_input").value = "";
}