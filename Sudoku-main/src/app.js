import { puzzles } from './puzzles/puzzles.js';

let puzzleFirstIndex = getRandomPuzzle(0, puzzles.length);
let puzzle = puzzles[puzzleFirstIndex][0];
let solvedPuzzle = puzzles[puzzleFirstIndex][1];

let buttonSelected;
let squareSelected;
let solved;
let isPaused = false;
let minutes = 0;
let seconds = 0;
let timerDiv;

window.addEventListener('DOMContentLoaded', run);

function run() {
    displayBoard();
    displayPuzzle();
    displayNumpad();
    attachListeners();
    startTimer();
    timerDiv = document.getElementById('sudoku-timer');
}

function displayBoard() {
    solved = false;

    for (let row = 0; row < 9; row++) {
        let rowUlElement = document.createElement('ul');
        for (let col = 0; col < 9; col++) {

            let square = document.createElement('li');
            square.id = row.toString() + '-' + col.toString();
            square.classList.add('squares');

            

            square.addEventListener('click', selectSquare);
            square.addEventListener('click', enterNumber);


            rowUlElement.appendChild(square);
            
        }
        

        document.getElementById('board').appendChild(rowUlElement);
        
    }
}

function displayPuzzle() {
    const cells = getCells();

    cells.forEach((cell) => {
        const cellId = cell.id;
        const coords = getCoordinates(cell);

        if (puzzle[coords.row][coords.col] != 0) {
            document.getElementById(cellId).textContent = puzzle[coords.row][coords.col];
            cell.classList.add('displayPuzzleSquares');
        } else {
            document.getElementById(cellId).textContent = '';
        }
    });
}

function displayNumpad() {
    for (let num = 1; num <= 10; num++) {
        const button = document.createElement('button');

        if (num == 10) {
            button.textContent = 'X';
            button.id = 'deleteBtn';
        } else {
            button.textContent = num;
            button.id = `${num}-button`;
        }
        button.classList.add('numpadButtons');
        button.addEventListener('click', selectNumber);
        document.getElementById('numpad').appendChild(button);
    }
}

function attachListeners() {
    const listItems = document.getElementsByClassName('option-list-items');
    listItems[0].addEventListener('click', getNewPuzzle);
    listItems[1].addEventListener('click', cehekSolution);
    listItems[2].addEventListener('click', displayPuzzle);
    listItems[2].addEventListener('click', resetTimer);
    listItems[3].addEventListener('click', solvePuzzle);

    document.getElementById('timer-pause').addEventListener('click', () => { isPaused = true });
    document.getElementById('timer-resume').addEventListener('click', () => { isPaused = false });
}

function getNewPuzzle() {
    solved = false;
    resetTimer();

    puzzleFirstIndex = getRandomPuzzle(0, puzzles.length);
    puzzle = puzzles[puzzleFirstIndex][0];
    solvedPuzzle = puzzles[puzzleFirstIndex][1];

    const cells = getCells();

    cells.forEach((cell) => {
        cell.classList.remove('displayPuzzleSquares');
    });

    displayPuzzle();
}

function startTimer() {
    setInterval(updateTimer, 1000);

    function updateTimer() {
        if (!isPaused) {
            seconds++;

            if (seconds > 59) {
                seconds = 0;
                minutes++;
            }
            if (minutes > 59) {
                alert('Sorry, you wasn\'t able to solve the puzzle.');
                isPaused = true;
                minutes = 0;
                seconds = '00';
                timerDiv.textContent = `${minutes}:${seconds}`;
                return;
            }
            seconds = seconds < 10 ? '0' + seconds : seconds;
            timerDiv.textContent = `${minutes}:${seconds}`;
        }
    }
}

function selectNumber() {
    if (buttonSelected != null) {
        buttonSelected.classList.remove('numSelected');
    }
    buttonSelected = this;
    buttonSelected.classList.add('numSelected');
}

function selectSquare() {
    if (squareSelected != this) {
        if (squareSelected != null) {
            squareSelected.classList.remove('cell-color');
        }
        squareSelected = this;
    }
    squareSelected.classList.add('cell-color');
}

function enterNumber() {
    if (buttonSelected && !solved && !isPaused) {
        const coords = getCoordinates(this);

        if (puzzle[coords.row][coords.col] == 0) {
            if (buttonSelected.textContent == 'X') {
                this.innerText = '';
                this.classList.remove('entered-numbers');
            } else {
                this.innerText = Number(buttonSelected.textContent);
                this.classList.add('entered-numbers');
            }
        }
    }
}

function solvePuzzle() {
    const cells = getCells();

    cells.forEach((cell) => {
        const coords = getCoordinates(cell);
        document.getElementById(cell.id).textContent = solvedPuzzle[coords.row][coords.col];
        cell.classList.remove('entered-numbers');
    });

    solved = true;
}

function cehekSolution() {
    const cells = getCells();

    for (const cell of cells) {
        const coords = getCoordinates(cell);

        if (document.getElementById(cell.id).textContent != solvedPuzzle[coords.row][coords.col]) {
            alert('The solution is incorrect. Try again.');
            return;
        }
    }

    solved = true;
    isPaused = true;
    alert('Congratulations, you solved the puzzle! :)');
}

function resetTimer() {
    minutes = 0;
    seconds = '00';
    isPaused = false
    solved = false;
}

function getCoordinates(input) {
    const coords = input.id.split('-');
    return {
        row: Number(coords[0]),
        col: Number(coords[1])
    }
}

function getCells() {
    return document.querySelectorAll('.squares');
}

function getRandomPuzzle(minNumber, maxNumber) {
    minNumber = Math.ceil(minNumber);
    maxNumber = Math.floor(maxNumber);

    return Math.floor(Math.random() * (maxNumber - minNumber) + minNumber);
}
