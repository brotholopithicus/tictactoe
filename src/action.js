import {State} from './state';

export class Action {
    constructor(pos) {
        this.pos = pos;
        this.minimaxVal = 0;
    }
    applyTo(state) {
        let next = new State(state);
        next.board[this.pos] = state.turn;
        if (state.turn === 'O') {
            next.aiMovesCount++;
        }
        next.advanceTurn();
        return next;
    }
    static sortAscending(firstAction, secondAction) {
        if (firstAction.minimaxVal < secondAction.minimaxVal) {
            return -1;
        } else if (firstAction.minimaxVal > secondAction.minimaxVal) {
            return 1;
        } else {
            return 0;
        }
    }
    static sortDescending(firstAction, secondAction) {
        if (firstAction.minimaxVal > secondAction.minimaxVal) {
            return -1;
        } else if (firstAction.minimaxVal < secondAction.minimaxVal) {
            return 1;
        } else {
            return 0;
        }
    }
}
