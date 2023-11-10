const grid = document.getElementById("grid");
const rowInput = document.getElementById("row-input");
const columnInput = document.getElementById("column-input");
const toggleGrid = document.getElementById("toggle-grid");
const roomNameInput = document.getElementById("room-name-input");
const savedRooms = document.getElementById("saved-rooms");
const saveTemplate = document.getElementById("saved-room-template");


let rooms;
window.onload = () => {
    rooms = localStorage.getItem("rooms");
    if (rooms === null) {
        rooms = []
        localStorage.setItem("rooms", JSON.stringify(rooms));
    }

    rooms = JSON.parse(rooms);
    if (rooms.length > 0) {
        rooms.forEach(room => addSavedRoom(room))
    }
}


grid.state = {
    width: 30,
    height: 30,

    numRows: 20,
    numColumns: 40,
    
    currentName: "Room 1",

    redraw: () => {
        drawGrid(grid.state.numRows, grid.state.numColumns);
    },

    toString: () => {
        let gridString = "";
        grid.childNodes.forEach((child, index) => {
            if (index != 0 && index % grid.state.numColumns == 0) {
                gridString += "\n";
            }
            gridString += child.classList.contains("wall") ? 0 : 1;
        })
        return gridString;
    }
}


/*
    Remove all child elements parent 
*/
const removeChildren = parent => {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

/*
    Set all boxes in the grid back to the default (grey) state.
*/
const resetGrid = () => {
    grid.childNodes.forEach(child => {
        if (child.classList.contains("wall")) {
            child.classList.remove("wall")
        }
    })
}


const createGridBox = () => {
    let gridBox = document.createElement("div");
    gridBox.classList.add("grid-box", "bordered");

    let gridBoxWidth = grid.state.width / grid.state.numColumns;
    gridBox.style.width = `${gridBoxWidth}rem`;

    return gridBox;
}

/*
Scale the grid width and height with the number of
rows and columns up to a maximum of 30rem.

Grid elements will scale to fit in the grid.
*/ 
const resizeGrid = (rows, columns) => {
    grid.state.width = Math.min(3 * columns, 30);
    grid.state.height = Math.min(3 * rows, 30); 

    grid.style.width = `${grid.state.width}rem`;
    grid.style.height = `${grid.state.height}rem`;

    const columnWidth = grid.state.width / columns;
    grid.style.gridTemplateColumns = `repeat(${columns}, ${columnWidth}rem)`;

    const rowWidth = grid.state.height / rows;
    grid.style.gridTemplateRows = `repeat(${rows}, ${rowWidth}rem)`;
}


const drawGrid = (rows, columns) => {
    removeChildren(grid);
    resizeGrid(rows, columns);
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            grid.appendChild(createGridBox());
        }
    }
}

const toggleGridLines = () => {
    grid.childNodes.forEach(child => {
        child.classList.toggle("bordered");
    })
}

const toggleGridBox = (e) => {
    if (!e.target.classList.contains("wall")) {
        e.target.classList.add("wall");
    }
}


rowInput.addEventListener("change", () => {
    grid.state.numRows = rowInput.value;
    grid.state.redraw();
})  

columnInput.addEventListener("change", () => {
    grid.state.numColumns = columnInput.value;
    grid.state.redraw();
})

toggleGrid.addEventListener("change", () => {
    toggleGridLines();     
})


const downloadGrid = () => {
    const gridString = grid.state.toString();
    const fileName = `${grid.state.currentName}.txt`

    const file = new File([gridString], fileName, {
        type: 'text/plain',
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(file);
    link.href = url;
    link.download = file.name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}


const saveRooms = roomsList => {
    localStorage.setItem("rooms", JSON.stringify(roomsList))
    
    // Rerender saved room list on update
    removeChildren(savedRooms);
    roomsList.forEach(room => addSavedRoom(room));
}


const saveGrid = () => {
    const room = {
        name: grid.state.currentName,
        numRows: grid.state.numRows,
        numColumns: grid.state.numColumns,
        gridString: grid.state.toString() 
    }
    rooms.push(room);
    saveRooms(rooms);
}


const loadSavedRoom = (e, room) => {
    if (e.target.classList?.contains("delete"))
        return
     
    roomNameInput.value = room.name
    grid.state.currentName = room.name
    grid.state.numRows = room.numRows;
    grid.state.numColumns = room.numColumns;
    grid.state.redraw();
    
    const gridString = room.gridString.replace(/[\r\n]/gm, '');
    const gridBoxes = grid.childNodes
    for (let i = 0; i < gridString.length; i++) {
        if (gridString.charAt(i) === "0") {
            let box = gridBoxes[i]
            box.classList.add("wall")
        }      
    }

}


const addSavedRoom = room => {
    const roomSave = saveTemplate.cloneNode(true);
    roomSave.style.display = "flex"
    roomSave.querySelector("p").textContent = room.name;
    roomSave.addEventListener("click", (e) => loadSavedRoom(e, room))
    savedRooms.appendChild(roomSave);
}


const deleteSavedRoom = icon => {
    const savedRoom =  icon.parentElement;
    const roomName = savedRoom.querySelector("p").textContent;
    rooms = rooms.filter(room => room.name != roomName);
    saveRooms(rooms);
}


grid.addEventListener("click", (e) => {
    e.target.classList.toggle("wall");
})

grid.addEventListener("mousedown", () => {
    grid.addEventListener("mouseover", toggleGridBox)
})

window.addEventListener("mouseup", () => {
    grid.removeEventListener("mouseover", toggleGridBox)
})

roomNameInput.addEventListener("change", () => {
    grid.state.currentName = roomNameInput.value;
})


drawGrid(20, 40)






