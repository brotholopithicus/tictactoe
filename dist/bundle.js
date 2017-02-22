(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Action = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _state = require('./state');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Action = exports.Action = function () {
    function Action(pos) {
        _classCallCheck(this, Action);

        this.pos = pos;
        this.minimaxVal = 0;
    }

    _createClass(Action, [{
        key: 'applyTo',
        value: function applyTo(state) {
            var next = new _state.State(state);
            next.board[this.pos] = state.turn;
            if (state.turn === 'O') {
                next.aiMovesCount++;
            }
            next.advanceTurn();
            return next;
        }
    }], [{
        key: 'sortAscending',
        value: function sortAscending(firstAction, secondAction) {
            if (firstAction.minimaxVal < secondAction.minimaxVal) {
                return -1;
            } else if (firstAction.minimaxVal > secondAction.minimaxVal) {
                return 1;
            } else {
                return 0;
            }
        }
    }, {
        key: 'sortDescending',
        value: function sortDescending(firstAction, secondAction) {
            if (firstAction.minimaxVal > secondAction.minimaxVal) {
                return -1;
            } else if (firstAction.minimaxVal < secondAction.minimaxVal) {
                return 1;
            } else {
                return 0;
            }
        }
    }]);

    return Action;
}();

},{"./state":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _action = require('./action');

var _game = require('./game');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AI = exports.AI = function () {
    function AI(intelligence) {
        _classCallCheck(this, AI);

        this.intelligence = intelligence;
        this.game = {};
    }
    // computes minimax value of a game state


    _createClass(AI, [{
        key: 'minimaxValue',
        value: function minimaxValue(state) {
            var _this = this;

            if (state.isTerminal()) {
                // set terminal game state to base case
                return _game.Game.score(state);
            } else {
                var stateScore = void 0;
                if (state.turn === 'X') {
                    // X maximizes --> initialize to value smaller than any possible score
                    stateScore = -1000;
                } else {
                    // O minimizes --> initialize to value larger than any possible score
                    stateScore = 1000;
                }
                var availablePositions = state.emptyCells();
                // iterate over next available states using
                var availableNextStates = availablePositions.map(function (pos) {
                    var action = new _action.Action(pos);
                    var nextState = action.applyTo(state);
                    return nextState;
                });
                // calculate minimax value for all available next states and return current state's value
                availableNextStates.forEach(function (nextState) {
                    var nextScore = _this.minimaxValue(nextState);
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
    }, {
        key: 'randomMove',
        value: function randomMove(turn) {
            var freeCells = this.game.currentState.emptyCells();
            var randomCell = freeCells[Math.floor(Math.random() * freeCells.length)];
            var action = new _action.Action(randomCell);
            var next = action.applyTo(this.game.currentState);
            setTimeout(function () {
                this.game.ui.insertAt(randomCell, turn);
                this.game.advanceState(next);
            }.bind(this), 400);
        }
    }, {
        key: 'noobMove',
        value: function noobMove(turn) {
            var _this2 = this;

            var freeCells = this.game.currentState.emptyCells();
            var availableActions = freeCells.map(function (pos) {
                var action = new _action.Action(pos);
                var next = action.applyTo(_this2.game.currentState);
                action.minimaxVal = _this2.minimaxValue(next);
                return action;
            });
            var sortMethod = turn === 'X' ? _action.Action.sortDescending : _action.Action.sortAscending;
            availableActions.sort(sortMethod);
            var nextAction = void 0;
            if (Math.random() >= 0.5) {
                nextAction = availableActions[0];
            } else {
                if (availableActions.length >= 2) {
                    nextAction = availableActions[1];
                } else {
                    nextAction = availableActions[0];
                }
            }
            var nextState = nextAction.applyTo(this.game.currentState);
            setTimeout(function () {
                this.game.ui.insertAt(nextAction.pos, turn);
                this.game.advanceState(nextState);
            }.bind(this), 400);
        }
    }, {
        key: 'masterMove',
        value: function masterMove(turn) {
            var _this3 = this;

            var freeCells = this.game.currentState.emptyCells();
            // iterate over available moves and calculate the score
            var availableActions = freeCells.map(function (pos) {
                var action = new _action.Action(pos);
                // apply action to get next state
                var next = action.applyTo(_this3.game.currentState);
                // calculate action's minimax value and store
                action.minimaxVal = _this3.minimaxValue(next);
                return action;
            });
            // sort available actions by score
            var sortMethod = turn === 'X' ? _action.Action.sortDescending : _action.Action.sortAscending;
            // X maximizes --> sort in descending order
            // O minimizes --> sort in ascending order
            availableActions.sort(sortMethod);
            var optimalAction = availableActions[0];
            var nextState = optimalAction.applyTo(this.game.currentState);
            setTimeout(function () {
                // insert X or O at chosen position in the UI
                this.game.ui.insertAt(optimalAction.pos, turn);
                // advance game to next state
                this.game.advanceState(nextState);
            }.bind(this), 400);
        }
    }, {
        key: 'plays',
        value: function plays(game) {
            this.game = game;
        }
    }, {
        key: 'notify',
        value: function notify(turn) {
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
    }]);

    return AI;
}();

},{"./action":1,"./game":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Game = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _state = require('./state');

var _ai = require('./ai');

var _ui = require('./ui');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = exports.Game = function () {
    // constructs the game object ot be played
    function Game(difficulty) {
        _classCallCheck(this, Game);

        if (typeof difficulty !== 'string') difficulty = difficulty.toString();
        if (!['easy', 'normal', 'hard'].includes(difficulty)) difficulty = 'easy';
        this.aiPlayer = new _ai.AI(difficulty);
        this.aiPlayer.plays(this);
        this.currentState = new _state.State();
        this.currentState.board = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'];
        this.currentState.turn = 'X';
        this.status = 'start';
        this.ui = new _ui.UI(this);
    }
    // advance game to new state


    _createClass(Game, [{
        key: 'advanceState',
        value: function advanceState(nextState) {
            this.currentState = nextState;
            if (nextState.isTerminal()) {
                // the game is over
                this.status = 'gameover';
                document.querySelector('#restart').style.display = '';
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

    }, {
        key: 'start',
        value: function start() {
            if (this.status === 'start') {
                // advance to current state
                this.advanceState(this.currentState);
                this.status = 'running';
            }
        }
        // static method to calculate player score in terminal state

    }], [{
        key: 'score',
        value: function score(state) {
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
    }]);

    return Game;
}();

},{"./ai":2,"./state":5,"./ui":6}],4:[function(require,module,exports){
'use strict';

var _game = require('./game');

window.onload = startGame();

var restartButton = document.querySelector('#restart');
restartButton.addEventListener('click', startGame);

function startGame() {
    document.querySelectorAll('.cell').forEach(function (cell) {
        cell.classList.remove('occupied');
        cell.textContent = '';
    });
    // let difficulty = 'easy';
    var difficulty = 'normal';
    // let difficulty = 'hard';
    var game = new _game.Game(difficulty);
    game.start();
}

},{"./game":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = exports.State = function () {
    // use old state to initialize new state
    function State(prevState) {
        _classCallCheck(this, State);

        this.turn = '';
        this.aiMovesCount = 0;
        this.result = 'running';
        this.board = [];
        // if state is constructed from a copy of another state
        if (prevState) {
            this.board = new Array(prevState.board.length);
            for (var i = 0; i < prevState.board.length; i++) {
                this.board[i] = prevState.board[i];
            }
            this.aiMovesCount = prevState.aiMovesCount;
            this.result = prevState.result;
            this.turn = prevState.turn;
        }
    }
    // advance turn


    _createClass(State, [{
        key: 'advanceTurn',
        value: function advanceTurn() {
            this.turn = this.turn === 'X' ? 'O' : 'X';
        }
        // returns indices of empty cells in current state

    }, {
        key: 'emptyCells',
        value: function emptyCells() {
            var freeCells = [];
            for (var i = 0; i < 9; i++) {
                if (this.board[i] === 'E') {
                    freeCells.push(i);
                }
            }
            return freeCells;
        }
        // determine whether current state is terminal

    }, {
        key: 'isTerminal',
        value: function isTerminal() {
            // check rows
            for (var i = 0; i <= 6; i = i + 3) {
                if (this.board[i] !== "E" && this.board[i] === this.board[i + 1] && this.board[i + 1] === this.board[i + 2]) {
                    this.result = this.board[i] + '-wins';
                    return true;
                }
            }
            // check columns
            for (var _i = 0; _i <= 2; _i++) {
                if (this.board[_i] !== "E" && this.board[_i] === this.board[_i + 3] && this.board[_i + 3] === this.board[_i + 6]) {
                    this.result = this.board[_i] + '-wins';
                    return true;
                }
            }
            // check diagonals
            for (var _i2 = 0, j = 4; _i2 <= 2; _i2 = _i2 + 2, j = j - 2) {
                if (this.board[_i2] !== "E" && this.board[_i2] == this.board[_i2 + j] && this.board[_i2 + j] === this.board[_i2 + 2 * j]) {
                    this.result = this.board[_i2] + '-wins';
                    return true;
                }
            }
            // check for draw
            var freeCells = this.emptyCells();
            if (freeCells.length === 0) {
                this.result = 'draw';
                return true;
            } else {
                return false;
            }
        }
    }]);

    return State;
}();

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _state = require('./state');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UI = exports.UI = function () {
    function UI(game) {
        _classCallCheck(this, UI);

        this.game = game;
        this.cells = document.querySelectorAll('.cell');
        this.addClickListeners();
    }

    _createClass(UI, [{
        key: 'addClickListeners',
        value: function addClickListeners() {
            var _this = this;

            this.cells.forEach(function (cell) {
                return cell.addEventListener('mousedown', _this.cellClickHandler.bind(_this));
            });
        }
    }, {
        key: 'cellClickHandler',
        value: function cellClickHandler(e) {
            if (this.game.status === 'running' && this.game.currentState.turn === 'X' && !e.target.classList.contains('occupied')) {
                var index = parseFloat(e.target.dataset.index);
                var next = new _state.State(this.game.currentState);
                next.board[index] = 'X';
                this.insertAt(index, 'X');
                next.advanceTurn();
                this.game.advanceState(next);
            }
        }
    }, {
        key: 'switchViewTo',
        value: function switchViewTo(player) {
            var turn = document.querySelector('.turn');
            switch (player) {
                case 'human':
                    turn.textContent = 'It\'s your turn.';
                    console.log('human turn');
                    break;
                case 'robot':
                    turn.textContent = 'AI player turn.';
                    console.log('robot turn');
                    break;
                case 'won':
                    turn.textContent = 'You win! Play again?';
                    turn.style.color = 'blue';
                    console.log('human wins');
                    break;
                case 'lost':
                    turn.textContent = 'You lost! Play again?';
                    turn.style.color = 'red';
                    console.log('human lost');
                    break;
                case 'draw':
                    turn.textContent = 'It\'s a tie! Play again?';
                    turn.style.color = 'white';
                    console.log('it\'s a draw...');
                    break;
                default:
                    turn.textContent = 'Something is broken.';
                    console.log('something is broken');
                    break;
            }
        }
    }, {
        key: 'insertAt',
        value: function insertAt(position, player) {
            var cell = document.querySelector('div[data-index="' + position + '"]');
            var playerSymbol = player === 'X' ? '✖' : '⭗';
            cell.style.color = player === 'X' ? '#00f0ff' : '#ff53ba';
            cell.textContent = playerSymbol;
            cell.classList.add('occupied');
        }
    }, {
        key: 'clearBoard',
        value: function clearBoard() {
            this.cells.forEach(function (cell) {
                cell.textContent = '';
                cell.classList.remove('occupied');
            });
        }
    }]);

    return UI;
}();

},{"./state":5}]},{},[4]);
