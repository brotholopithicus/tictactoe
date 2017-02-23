import { Game } from './game';
import { UI } from './ui';

let symbol;
let symbols = document.querySelectorAll('.symbols span');
symbols.forEach(symbol => symbol.addEventListener('click', symbolClickHandler));
symbols.forEach(symbol => symbol.addEventListener('touchstart', symbolTouchHandler));

function symbolTouchHandler(e) {
    e.preventDefault();
    symbolClickHandler(e);
}

function symbolClickHandler(e) {
    // symbol = e.target.dataset.symbol === 'X' ? '✖' : '⭗';
    symbol = e.target.dataset.symbol === 'X' ? 'X' : 'O';
    document.body.removeChild(document.querySelector('.chooseSymbol'));
    startGame(symbol);
}

function startGame(symbol) {
    let main = document.querySelector('.main');
    let difficulty = 'hard';
    let game = new Game(difficulty, symbol);
    if (!main) game.initializeBoard();
    let cells = document.querySelectorAll('.cell');
    game.ui = new UI(game, cells);
    let restartButton = document.querySelector('#restart');
    restartButton.addEventListener('click', restartGame);
    restartButton.addEventListener('touchstart', restartGame);
    document.querySelector('#restart').disabled = true;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('occupied');
        cell.textContent = '';
    });
    game.start();
}

function restartGame() {
    startGame(symbol);
}
