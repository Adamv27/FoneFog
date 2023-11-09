const grid = document.getElementById("grid");
const rowInput = document.getElementById("row-input");
const columnInput = document.getElementById("column-input");
const toggleGrid = document.getElementById("toggle-grid");


grid.state = {
    width: 30,
    height: 30,

    numRows: 10,
    numColumns: 10,
    
    currentName: "Floor 1",

    redraw: () => {
        drawGrid(grid.state.numRows, grid.state.numColumns);
    },

    toString: () => {
        //gridArray = Array(grid.state.numRows)
        //  .fill().map(() => Array(grid.state.numColumns).fill(0));
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


const clearGrid = () => {
    while (grid.firstChild) {
        grid.removeChild(grid.lastChild);
    }
}

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
    clearGrid();
    resizeGrid(rows, columns);

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            box = createGridBox();
            grid.appendChild(box);
        }
    }
}

const toggleGridLines = () => {
    grid.childNodes.forEach(child => {
        child.classList.toggle("bordered");
    })
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


const toggleGridBox = (e) => {
    if (!e.target.classList.contains("wall")) {
        e.target.classList.add("wall");
    }
}


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


grid.addEventListener("click", (e) => {
    e.target.classList.toggle("wall");
})

grid.addEventListener("mousedown", () => {
    grid.addEventListener("mouseover", toggleGridBox)
})

window.addEventListener("mouseup", () => {
    grid.removeEventListener("mouseover", toggleGridBox)
})


drawGrid(10, 10)


