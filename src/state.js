export class State {
    // use old state to initialize new state
    constructor(prevState) {
        this.turn = '';
        this.aiMovesCount = 0;
        this.result = 'running';
        this.board = [];
        // if state is constructed from a copy of another state
        if (prevState) {
            this.board = new Array(prevState.board.length);
            for (let i = 0; i < prevState.board.length; i++) {
                this.board[i] = prevState.board[i];
            }
            this.aiMovesCount = prevState.aiMovesCount;
            this.result = prevState.result;
            this.turn = prevState.turn;
        }
    }
    // advance turn
    advanceTurn() {
        this.turn = this.turn === 'X' ? 'O' : 'X';
    }
    // returns indices of empty cells in current state
    emptyCells() {
        let freeCells = [];
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === 'E') {
                freeCells.push(i);
            }
        }
        return freeCells;
    }
    // determine whether current state is terminal
    isTerminal() {
        // check rows
        for (let i = 0; i <= 6; i = i + 3) {
            if (this.board[i] !== "E" && this.board[i] === this.board[i + 1] && this.board[i + 1] === this.board[i + 2]) {
                this.result = `${this.board[i]}-wins`;
                return true;
            }
        }
        // check columns
        for (let i = 0; i <= 2; i++) {
            if (this.board[i] !== "E" && this.board[i] === this.board[i + 3] && this.board[i + 3] === this.board[i + 6]) {
                this.result = `${this.board[i]}-wins`;
                return true;
            }
        }
        // check diagonals
        for (let i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
            if (this.board[i] !== "E" && this.board[i] == this.board[i + j] && this.board[i + j] === this.board[i + 2 * j]) {
                this.result = `${this.board[i]}-wins`;
                return true;
            }
        }
        // check for draw
        let freeCells = this.emptyCells();
        if (freeCells.length === 0) {
            this.result = 'draw';
            return true;
        } else {
            return false;
        }
    }
}
