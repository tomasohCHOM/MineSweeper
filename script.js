const grid = document.getElementById('grid');
let lockGame = false;
// Set test mode to true if you want to see the mines' locations
const testMode = false;

generateGrid();

function generateGrid() {
    lockGame = false;
    grid.innerHTML = '';
    for (let r = 0; r < 10; r++) {
        row = grid.insertRow(r);
        for (let c = 0; c < 10; c++) {
            cell = row.insertCell(c);
            cell.onclick = function() { init(this); }
            let mine = document.createAttribute('mine');
            mine.value = false;
            cell.setAttributeNode(mine);
        }
    }
    generateMines();
}

// Generate random mines
function generateMines() {
    // Add 20 mines
    for (let i = 0; i < 20; i++) {
        let row = Math.floor(Math.random() * 10);
        let col = Math.floor(Math.random() * 10);
        let cell = grid.rows[row].cells[col];
        cell.setAttribute('mine', 'true');
        if (testMode) {
            cell.innerHTML = 'X';
        }
    }
}

// Highlight all mines
function revealMines() {
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            let cell = grid.rows[r].cells[c];
            if (cell.getAttribute('mine') == 'true') {
                cell.className = 'mine';
            }
        }
    }
}

function checkGameComplete() {
    let gameComplete = true;
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            if ((grid.rows[r].cells[c].getAttribute('mine') == 'false') && (grid.rows[r].cells[c].innerHTML = '')) {
                gameComplete = false;
            }
        }
    }
    if (gameComplete) {
        alert("You found all the mines!");
        revealMines();
    }
}

function init(cell) {
    // Check if the game was completed or not
    if (lockGame) {
        return;
    } else {
        // Check if user clicked on mine
        if (cell.getAttribute('mine') == 'true') {
            revealMines();
            lockGame = true;
        } else {
            cell.className = 'active';
            // Display the number of mines around the cell
            let mineCount = 0;
            var cellRow = cell.parentNode.rowIndex;
            var cellCol = cell.cellIndex;
            for (let r = Math.max(cellRow - 1, 0); r <= Math.min(cellRow + 1, 9); r++) {
                for (let c = Math.max(cellCol - 1, 0); c <= Math.min(cellCol + 1, 9); c++) {
                    if (grid.rows[r].cells[c].getAttribute('mine') == 'true') {
                        mineCount++;
                    }
                }
            }
            cell.innerHTML = mineCount;
            if (mineCount == 0) {
                // If the cell doesn't have a mine
                for (let r = Math.max(cellRow - 1, 0); r <= Math.min(cellRow + 1, 9); r++) {
                    for (let c = Math.max(cellCol - 1, 0); c <= Math.min(cellCol + 1, 9); c++) {
                        if (grid.rows[r].cells[c].innerHTML = '') {
                            init(grid.rows[r].cells[c]);
                        }
                    }
                }
            }
            checkGameComplete();
        }
    }

}