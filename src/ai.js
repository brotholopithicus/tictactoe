import { Action } from './action';
import { Game } from './game';

export class AI {
    constructor(intelligence) {
        this.intelligence = intelligence;
        this.game = {};
    }
    // computes minimax value of a game state
    minimaxValue(state) {
        if (state.isTerminal()) {
            // set terminal game state to base case
            return Game.score(state);
        } else {
            let stateScore;
            if (state.turn === 'X') {
                // X maximizes --> initialize to value smaller than any possible score
                stateScore = -1000;
            } else {
                // O minimizes --> initialize to value larger than any possible score
                stateScore = 1000;
            }
            let availablePositions = state.emptyCells();
            // iterate over next available states using
            let availableNextStates = availablePositions.map(pos => {
                let action = new Action(pos);
                let nextState = action.applyTo(state);
                return nextState;
            });
            // calculate minimax value for all available next states and return current state's value
            availableNextStates.forEach(nextState => {
                let nextScore = this.minimaxValue(nextState);
                if (state.turn === 'X') {
                    // X wants to maximize --> update stateScore if nextScore is larger
                    if (nextScore > stateScore) {
                        stateScore = nextScore;
                    }
                } else {
                    // O wants to minimize --> update stateScore if nextScore is smaller
                    if (nextScore < stateScore) {
                        stateScore = nextScore;
                    }
                }
            });
            // store minimax value
            return stateScore;
        }
    }
    randomMove(turn) {
        let freeCells = this.game.currentState.emptyCells();
        let randomCell = freeCells[Math.floor(Math.random() * freeCells.length)];
        let action = new Action(randomCell);
        let next = action.applyTo(this.game.currentState);
        setTimeout(function() {
            this.game.ui.insertAt(randomCell, turn);
            this.game.advanceState(next);
        }.bind(this), 400);
    }
    noobMove(turn) {
        let freeCells = this.game.currentState.emptyCells();
        let availableActions = freeCells.map(pos => {
            let action = new Action(pos);
            let next = action.applyTo(this.game.currentState);
            action.minimaxVal = this.minimaxValue(next);
            return action;
        });
        let sortMethod = turn === 'X' ? Action.sortDescending : Action.sortAscending;
        availableActions.sort(sortMethod);
        let nextAction;
        if (Math.random() >= 0.5) {
            nextAction = availableActions[0];
        } else {
            if (availableActions.length >= 2) {
                nextAction = availableActions[1];
            } else {
                nextAction = availableActions[0];
            }
        }
        let nextState = nextAction.applyTo(this.game.currentState);
        setTimeout(function() {
            this.game.ui.insertAt(nextAction.pos, turn);
            this.game.advanceState(nextState);
        }.bind(this), 400);
    }
    masterMove(turn) {
        let freeCells = this.game.currentState.emptyCells();
        // iterate over available moves and calculate the score
        let availableActions = freeCells.map(pos => {
            let action = new Action(pos);
            // apply action to get next state
            let next = action.applyTo(this.game.currentState);
            // calculate action's minimax value and store
            action.minimaxVal = this.minimaxValue(next);
            return action;
        });
        // sort available actions by score
        let sortMethod = turn === 'X' ? Action.sortDescending : Action.sortAscending;
        // X maximizes --> sort in descending order
        // O minimizes --> sort in ascending order
        availableActions.sort(sortMethod);
        let optimalAction = availableActions[0];
        let nextState = optimalAction.applyTo(this.game.currentState);
        setTimeout(function() {
            // insert X or O at chosen position in the UI
            this.game.ui.insertAt(optimalAction.pos, turn);
            // advance game to next state
            this.game.advanceState(nextState);
        }.bind(this), 400);
    }
    plays(game) {
        this.game = game;
    }
    notify(turn) {
        switch (this.intelligence) {
            case 'easy':
                this.randomMove(turn);
                break;
            case 'normal':
                this.noobMove(turn);
                break;
            case 'hard':
                this.masterMove(turn);
                break;
        }
    }
}
