import { Game } from './game';

window.onload = startGame();

let restartButton = document.querySelector('#restart');
restartButton.addEventListener('click', startGame);

function startGame() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('occupied');
        cell.textContent = '';
    });
    // let difficulty = 'easy';
    let difficulty = 'normal';
    // let difficulty = 'hard';
    let game = new Game(difficulty);
    game.start();
}
