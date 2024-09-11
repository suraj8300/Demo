let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isBotGame = false;

const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const game = document.getElementById('game');
const options = document.getElementById('options');
const menuButton = document.getElementById('menu');

document.getElementById('friend').addEventListener('click', () => {
    game.style.display = 'block';
    options.style.display = 'none';
    menuButton.style.display = 'none';
    isBotGame = false;
});

document.getElementById('bot').addEventListener('click', () => {
    game.style.display = 'block';
    options.style.display = 'none';
    menuButton.style.display = 'none';
    isBotGame = true;
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
document.getElementById('reset').addEventListener('click', resetGame);
menuButton.addEventListener('click', () => {
    game.style.display = 'none';
    options.style.display = 'flex';
    menuButton.style.display = 'none';
    resetGame();
});

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex);
    checkResult();

    if (isBotGame && gameActive) {
        botMove();
    }
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.innerText = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkResult() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    let roundWon = false;
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerText = `Player ${currentPlayer === 'X' ? 'O' : 'X'} has won!`;
        gameActive = false;
        menuButton.style.display = 'block';
        return;
    }

    if (!board.includes('')) {
        statusDisplay.innerText = 'Game ended in a draw!';
        gameActive = false;
        menuButton.style.display = 'block';
        return;
    }
}

function botMove() {
    // Generate a random delay between 500 ms and 3000 ms
    const delay = Math.floor(Math.random() * 2500) + 500;

    // Set a timeout with the random delay
    setTimeout(() => {
        const winningMove = findBestMove('O');
        if (winningMove !== null) {
            board[winningMove] = 'O';
            cells[winningMove].innerText = 'O';
            currentPlayer = 'X';
            checkResult();
            return;
        }

        const blockingMove = findBestMove('X');
        if (blockingMove !== null) {
            board[blockingMove] = 'O';
            cells[blockingMove].innerText = 'O';
            currentPlayer = 'X';
            checkResult();
            return;
        }

        let availableCells = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);
        let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        board[randomIndex] = 'O';
        cells[randomIndex].innerText = 'O';
        currentPlayer = 'X';
        checkResult();
    }, delay);
}

function findBestMove(player) {
    const opponent = player === 'X' ? 'O' : 'X';
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = player;
            if (checkWin()) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }
    return null;
}

function checkWin() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.innerText = '');
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.innerText = '';
}
