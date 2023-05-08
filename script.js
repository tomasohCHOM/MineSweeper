const grid = document.getElementById('grid');
const difficultyTable = {
    'beginner': {rows: 9, columns: 9, mines: 10},
    'intermediate': {rows: 16, columns: 16, mines: 40},
    'expert': {rows: 16, columns: 30, mines: 99}
}

let lockGame = false; // Set test mode to true if you want to see the mines' locations
const testMode = true;

// Initialize the dimensions and number of mines to Intermediate Difficulty for now and render the grid
let rowDimensions = 16;
let colDimensions = 16;
let numberOfMines = 40;
generateGrid();

const optionSelect = document.getElementById('option-select');
optionSelect.addEventListener('click', function(e) {
    const difficulty = e.target.id.replace('-difficulty', '');
    const dimensions = difficultyTable[difficulty];
    initGame(dimensions.rows, dimensions.columns, dimensions.mines);
}, false);

// Initialize game dimensions according to its difficulty
function initGame(rowDim, colDim, numMines) {
    rowDimensions = rowDim;
    colDimensions = colDim;
    numberOfMines = numMines;
    generateGrid();
}

// Generate a grid with given row and column dimensions, and the number of mines
function generateGrid() {
    lockGame = false;
    grid.innerHTML = '';

    for (let r = 0; r < rowDimensions; r++) {
        row = grid.insertRow(r);
        for (let c = 0; c < colDimensions; c++) {
            cell = row.insertCell(c);
            cell.onclick = function() { initCell(this); }
            let mine = document.createAttribute('mine');
            mine.value = 'false';
            cell.setAttributeNode(mine);
        }
    }
    generateMines();
}

// Generate random mines
function generateMines() {
    // Add the mines in a random order.
    for (let i = 0; i < numberOfMines; i++) {
        // This is to make sure that some mines aren't "eaten up" by RNG.
        let cell;
        do {
            let row = Math.floor(Math.random() * rowDimensions);
            let col = Math.floor(Math.random() * colDimensions);
            cell = grid.rows[row].cells[col];

        } while (cell.getAttribute('mine') === 'true')
        cell.setAttribute('mine', 'true');

        if (testMode) {
            cell.innerHTML = 'X';
        }
    }
}

// Highlight all mines
function revealMines() {
    for (let r = 0; r < rowDimensions; r++) {
        for (let c = 0; c < colDimensions; c++) {
            let cell = grid.rows[r].cells[c];
            if (cell.getAttribute('mine') === 'true') {
                cell.className = 'mine';
            }
        }
    }
}

function checkGameComplete() {
    let gameComplete = true;
    for (let r = 0; r < rowDimensions; r++) {
        for (let c = 0; c < colDimensions; c++) {
            if ((grid.rows[r].cells[c].getAttribute('mine') === 'false') && (grid.rows[r].cells[c].innerHTML === '')) {
                gameComplete = false;
            }
        }
    }
    if (gameComplete) {
        alert("You found all the mines!");
        let gameCompleteMessage = document.createElement('div');
        gameCompleteMessage.innerHTML = 'You found all the mines! Nice!';
        gameCompleteMessage.className = 'game-over-message';
        document.appendChild(gameCompleteMessage);
        revealMines();
    }
}

function initCell(cell) {
    // Check if the game was completed or not
    if (lockGame) {
        return;
    } else {
        // Check if user clicked on mine
        if (cell.getAttribute('mine') === 'true') {
            revealMines();
            lockGame = true;
        } else {
            cell.className = 'active';
            // Display the number of mines around the cell
            let mineCount = 0;
            var cellRow = cell.parentNode.rowIndex;
            var cellCol = cell.cellIndex;
            for (let r = Math.max(cellRow - 1, 0); r <= Math.min(cellRow + 1, rowDimensions - 1); r++) {
                for (let c = Math.max(cellCol - 1, 0); c <= Math.min(cellCol + 1, colDimensions - 1); c++) {
                    if (grid.rows[r].cells[c].getAttribute('mine') === 'true') {
                        mineCount++;
                    }
                }
            }
            cell.innerHTML = mineCount;
            if (mineCount === 0) {
                // If the cell doesn't have a mine
                for (let r = Math.max(cellRow - 1, 0); r <= Math.min(cellRow + 1, rowDimensions - 1); r++) {
                    for (let c = Math.max(cellCol - 1, 0); c <= Math.min(cellCol + 1, colDimensions - 1); c++) {
                        if (grid.rows[r].cells[c].innerHTML === '') {
                            initCell(grid.rows[r].cells[c]);
                        }
                    }
                }
            }
            checkGameComplete();
        }
    }

}