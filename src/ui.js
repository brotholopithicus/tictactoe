import { State } from './state';
export class UI {
    constructor(game, cells) {
        this.game = game;
        this.cells = cells;
        this.addClickListeners();
    }
    addClickListeners() {
        this.cells.forEach(cell => cell.addEventListener('click', this.cellClickHandler.bind(this)));
        this.cells.forEach(cell => cell.addEventListener('touchstart', this.cellTouchHandler.bind(this)));
    }
    cellTouchHandler(e) {
        e.preventDefault();
        this.cellClickHandler(e);
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
        let board = document.querySelector('.board');
        let restartButton = document.querySelector('#restart');
        board.style.opacity = 1;
        if (player === 'won' || player === 'lost' || player === 'draw') {
            board.style.opacity = 0.2;
            restartButton.disabled = false;
        }
        switch (player) {
            case 'human':
                turn.textContent = `It's your turn.`;
                turn.style.color = '#00f0ff';
                break;
            case 'robot':
                turn.textContent = `AI player turn.`;
                turn.style.color = '#ff53ba';
                break;
            case 'won':
                turn.textContent = `You win! Play again?`;
                turn.style.color = 'blue';
                break;
            case 'lost':
                turn.textContent = `You lost! Play again?`;
                turn.style.color = 'red';
                break;
            case 'draw':
                turn.textContent = `It's a tie! Play again?`;
                turn.style.color = 'white';
                break;
            default:
                turn.textContent = `Something is broken.`;
                console.log('something is broken');
                break;
        }
    }
    insertAt(position, player) {
        let cell = document.querySelector(`div[data-index="${position}"]`);
        let playerSymbol = player === 'X' ? this.game.playerSymbol : this.game.aiSymbol;
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
