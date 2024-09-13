const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('statusDisplay');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const computerBtn = document.getElementById('computerBtn');
const resetBtn = document.getElementById('resetBtn');

const winnerModal = document.getElementById('winnerModal');
const winnerMessage = document.getElementById('winnerMessage');
const closeModalBtn = document.getElementById('closeModalBtn');

let currentPlayer = 'X';
let gameMode = 'twoPlayer'; // Default mode is two players
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Display status message
const updateStatus = () => {
    if (isGameActive) {
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }
};

// Show the modal popup with the winner or tie message
const showWinnerModal = (message) => {
    winnerMessage.textContent = message;
    winnerModal.style.display = 'flex';
};

// Close the modal and reset the game
closeModalBtn.addEventListener('click', () => {
    winnerModal.style.display = 'none';
    resetGame();
});

// Check if there's a winner
const checkWin = () => {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
};

// Check if the board is full (tie)
const checkTie = () => {
    return board.every(cell => cell !== '');
};

// Handle click events for each cell
const handleCellClick = (event) => {
    const clickedCellIndex = event.target.getAttribute('data-index');

    if (board[clickedCellIndex] === '' && isGameActive) {
        board[clickedCellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;
        const winner = checkWin();
        
        if (winner) {
            showWinnerModal(`Player ${winner} wins!`);
            isGameActive = false;
            return;
        }
        
        if (checkTie()) {
            showWinnerModal(`It's a tie!`);
            isGameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        if (gameMode === 'computer' && currentPlayer === 'O' && isGameActive) {
            setTimeout(computerPlay, 500);
        }
        
        updateStatus();
    }
};

// AI for computer's move
const computerPlay = () => {
    const emptyCells = board.map((val, index) => (val === '' ? index : null)).filter(val => val !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    if (randomIndex !== undefined) {
        board[randomIndex] = 'O';
        cells[randomIndex].textContent = 'O';
        const winner = checkWin();
        
        if (winner) {
            showWinnerModal(`Player ${winner} wins!`);
            isGameActive = false;
            return;
        }
        
        if (checkTie()) {
            showWinnerModal(`It's a tie!`);
            isGameActive = false;
            return;
        }

        currentPlayer = 'X';
        updateStatus();
    }
};

// Reset the game
const resetGame = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => (cell.textContent = ''));
    updateStatus();
};

// Set game mode to two-player
twoPlayerBtn.addEventListener('click', () => {
    gameMode = 'twoPlayer';
    resetGame();
});

// Set game mode to play against computer
computerBtn.addEventListener('click', () => {
    gameMode = 'computer';
    resetGame();
});

// Reset game on button click
resetBtn.addEventListener('click', resetGame);

// Add event listeners to cells
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Initialize status display
updateStatus();
