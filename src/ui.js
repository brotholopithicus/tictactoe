import { State } from './state';
export class UI {
    constructor(game) {
        this.game = game;
        this.cells = document.querySelectorAll('.cell');
        this.addClickListeners();
    }
    addClickListeners() {
        this.cells.forEach(cell => cell.addEventListener('mousedown', this.cellClickHandler.bind(this)));
    }
    cellClickHandler(e) {
        if (this.game.status === 'running' && this.game.currentState.turn === 'X' && !e.target.classList.contains('occupied')) {
            let index = parseFloat(e.target.dataset.index);
            let next = new State(this.game.currentState);
            next.board[index] = 'X';
            this.insertAt(index, 'X');
            next.advanceTurn();
            this.game.advanceState(next);
        }
    }
    switchViewTo(player) {
        let turn = document.querySelector('.turn');
        switch (player) {
            case 'human':
                turn.textContent = `It's your turn.`;
                console.log('human turn');
                break;
            case 'robot':
                turn.textContent = `AI player turn.`;
                console.log('robot turn');
                break;
            case 'won':
                turn.textContent = `You win! Play again?`;
                turn.style.color = 'blue';
                console.log('human wins');
                break;
            case 'lost':
                turn.textContent = `You lost! Play again?`;
                turn.style.color = 'red';
                console.log('human lost');
                break;
            case 'draw':
                turn.textContent = `It's a tie! Play again?`;
                turn.style.color = 'white';
                console.log('it\'s a draw...');
                break;
            default:
                turn.textContent = `Something is broken.`;
                console.log('something is broken');
                break;
        }
    }
    insertAt(position, player) {
        let cell = document.querySelector(`div[data-index="${position}"]`);
        let playerSymbol = player === 'X' ? '✖' : '⭗';
        cell.style.color = player === 'X' ? '#00f0ff' : '#ff53ba';
        cell.textContent = playerSymbol;
        cell.classList.add('occupied');
    }
    clearBoard() {
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('occupied');
        });
    }
}
