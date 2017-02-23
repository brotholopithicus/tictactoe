import { createComponent } from './libs/component';
import { State } from './state';
import { AI } from './ai';
import { UI } from './ui';

export class Game {
    // constructs the game object ot be played
    constructor(difficulty, playerSymbol) {
        if (typeof difficulty !== 'string') difficulty = difficulty.toString();
        if (!['easy', 'normal', 'hard', 'impossible'].includes(difficulty)) difficulty = 'easy';
        this.aiPlayer = new AI(difficulty, this);
        this.currentState = new State();
        this.currentState.board = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'];
        this.currentState.turn = 'X';
        this.status = 'start';
        this.playerSymbol = playerSymbol;
        // this.aiSymbol = playerSymbol === '✖' ? '⭗' : '✖';
        this.aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
        // this.ui = new UI(this);
    }
    // create game board
    initializeBoard() {
        let main = document.createElement('div');
        main.classList.add('main');
        let board = createComponent('div', main, { classes: ['board'], styles: [{ key: 'opacity', value: 1 }] });
        for (let i = 0; i < 9; i++) {
            createComponent('div', board, { classes: ['cell'], data: [{ key: 'index', value: i }] });
        }
        let turn = createComponent('div', main, { classes: ['turn'] });
        let button = createComponent('button', main, { id: 'restart', attributes: [{ key: 'disabled', value: true }], text: 'Restart' });
        document.body.appendChild(main);
    }
    // advance game to new state
    advanceState(nextState) {
        this.currentState = nextState;
        if (nextState.isTerminal()) {
            // the game is over
            this.status = 'gameover';
            if (nextState.result === 'X-wins') {
                // X wins
                this.ui.switchViewTo('won');
            } else if (nextState.result === 'O-wins') {
                // O wins
                this.ui.switchViewTo('lost');
            } else {
                // draw
                this.ui.switchViewTo('draw');
            }
        } else {
            // the game is still going
            if (this.currentState.turn === 'X') {
                // X turn
                this.ui.switchViewTo('human');
            } else {
                // Y turn
                this.ui.switchViewTo('robot');
                this.aiPlayer.notify('O');
            }
        }
    }
    // starts game
    start() {
        if (this.status === 'start') {
            // advance to current state
            this.advanceState(this.currentState);
            this.status = 'running';
        }

    }
    // static method to calculate player score in terminal state
    static score(state) {
        if (state.result !== 'running') {
            if (state.result === 'X-wins') {
                // x player wins
                return 10 - state.aiMovesCount;
            } else if (state.result === 'O-wins') {
                // o player wins
                return -10 + state.aiMovesCount;
            } else {
                // draw
                return 0;
            }
        }
    }
}
