(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.Action=void 0;var _createClass=function(){function e(e,n){for(var a=0;a<n.length;a++){var t=n[a];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(n,a,t){return a&&e(n.prototype,a),t&&e(n,t),n}}(),_state=require("./state"),Action=exports.Action=function(){function e(n){_classCallCheck(this,e),this.pos=n,this.minimaxVal=0}return _createClass(e,[{key:"applyTo",value:function(e){var n=new _state.State(e);return n.board[this.pos]=e.turn,"O"===e.turn&&n.aiMovesCount++,n.advanceTurn(),n}}],[{key:"sortAscending",value:function(e,n){return e.minimaxVal<n.minimaxVal?-1:e.minimaxVal>n.minimaxVal?1:0}},{key:"sortDescending",value:function(e,n){return e.minimaxVal>n.minimaxVal?-1:e.minimaxVal<n.minimaxVal?1:0}}]),e}();

},{"./state":5}],2:[function(require,module,exports){
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.AI=void 0;var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),_action=require("./action"),_game=require("./game"),AI=exports.AI=function(){function e(t){_classCallCheck(this,e),this.intelligence=t,this.game={}}return _createClass(e,[{key:"minimaxValue",value:function(e){var t=this;if(e.isTerminal())return _game.Game.score(e);var a=void 0;a="X"===e.turn?-1e3:1e3;var n=e.emptyCells(),i=n.map(function(t){var a=new _action.Action(t),n=a.applyTo(e);return n});return i.forEach(function(n){var i=t.minimaxValue(n);"X"===e.turn?i>a&&(a=i):i<a&&(a=i)}),a}},{key:"randomMove",value:function(e){var t=this.game.currentState.emptyCells(),a=t[Math.floor(Math.random()*t.length)],n=new _action.Action(a),i=n.applyTo(this.game.currentState);setTimeout(function(){this.game.ui.insertAt(a,e),this.game.advanceState(i)}.bind(this),400)}},{key:"noobMove",value:function(e){var t=this,a=this.game.currentState.emptyCells(),n=a.map(function(e){var a=new _action.Action(e),n=a.applyTo(t.game.currentState);return a.minimaxVal=t.minimaxValue(n),a}),i="X"===e?_action.Action.sortDescending:_action.Action.sortAscending;n.sort(i);var r=void 0;r=Math.random()>=.5?n[0]:n.length>=2?n[1]:n[0];var o=r.applyTo(this.game.currentState);setTimeout(function(){this.game.ui.insertAt(r.pos,e),this.game.advanceState(o)}.bind(this),400)}},{key:"masterMove",value:function(e){var t=this,a=this.game.currentState.emptyCells(),n=a.map(function(e){var a=new _action.Action(e),n=a.applyTo(t.game.currentState);return a.minimaxVal=t.minimaxValue(n),a}),i="X"===e?_action.Action.sortDescending:_action.Action.sortAscending;n.sort(i);var r=n[0],o=r.applyTo(this.game.currentState);setTimeout(function(){this.game.ui.insertAt(r.pos,e),this.game.advanceState(o)}.bind(this),400)}},{key:"plays",value:function(e){this.game=e}},{key:"notify",value:function(e){switch(this.intelligence){case"easy":this.randomMove(e);break;case"normal":this.noobMove(e);break;case"hard":this.masterMove(e)}}}]),e}();

},{"./action":1,"./game":3}],3:[function(require,module,exports){
"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.Game=void 0;var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}(),_state=require("./state"),_ai=require("./ai"),_ui=require("./ui"),Game=exports.Game=function(){function t(e){_classCallCheck(this,t),"string"!=typeof e&&(e=e.toString()),["easy","normal","hard"].includes(e)||(e="easy"),this.aiPlayer=new _ai.AI(e),this.aiPlayer.plays(this),this.currentState=new _state.State,this.currentState.board=["E","E","E","E","E","E","E","E","E"],this.currentState.turn="X",this.status="start",this.ui=new _ui.UI(this)}return _createClass(t,[{key:"advanceState",value:function(t){this.currentState=t,t.isTerminal()?(this.status="gameover","X-wins"===t.result?this.ui.switchViewTo("won"):"O-wins"===t.result?this.ui.switchViewTo("lost"):this.ui.switchViewTo("draw")):"X"===this.currentState.turn?this.ui.switchViewTo("human"):(this.ui.switchViewTo("robot"),this.aiPlayer.notify("O"))}},{key:"start",value:function(){"start"===this.status&&(this.advanceState(this.currentState),this.status="running")}}],[{key:"score",value:function(t){if("running"!==t.result)return"X-wins"===t.result?10-t.aiMovesCount:"O-wins"===t.result?-10+t.aiMovesCount:0}}]),t}();

},{"./ai":2,"./state":5,"./ui":6}],4:[function(require,module,exports){
"use strict";function startGame(){document.querySelectorAll(".cell").forEach(function(t){t.classList.remove("occupied"),t.textContent=""});var t="hard",e=new _game.Game(t);e.start()}var _game=require("./game");window.onload=startGame();var restartButton=document.querySelector("#restart");restartButton.addEventListener("click",startGame);

},{"./game":3}],5:[function(require,module,exports){
"use strict";function _classCallCheck(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function t(t,r){for(var e=0;e<r.length;e++){var s=r[e];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(r,e,s){return e&&t(r.prototype,e),s&&t(r,s),r}}(),State=exports.State=function(){function t(r){if(_classCallCheck(this,t),this.turn="",this.aiMovesCount=0,this.result="running",this.board=[],r){this.board=new Array(r.board.length);for(var e=0;e<r.board.length;e++)this.board[e]=r.board[e];this.aiMovesCount=r.aiMovesCount,this.result=r.result,this.turn=r.turn}}return _createClass(t,[{key:"advanceTurn",value:function(){this.turn="X"===this.turn?"O":"X"}},{key:"emptyCells",value:function(){for(var t=[],r=0;r<9;r++)"E"===this.board[r]&&t.push(r);return t}},{key:"isTerminal",value:function(){for(var t=0;t<=6;t+=3)if("E"!==this.board[t]&&this.board[t]===this.board[t+1]&&this.board[t+1]===this.board[t+2])return this.result=this.board[t]+"-wins",!0;for(var r=0;r<=2;r++)if("E"!==this.board[r]&&this.board[r]===this.board[r+3]&&this.board[r+3]===this.board[r+6])return this.result=this.board[r]+"-wins",!0;for(var e=0,s=4;e<=2;e+=2,s-=2)if("E"!==this.board[e]&&this.board[e]==this.board[e+s]&&this.board[e+s]===this.board[e+2*s])return this.result=this.board[e]+"-wins",!0;var a=this.emptyCells();return 0===a.length&&(this.result="draw",!0)}}]),t}();

},{}],6:[function(require,module,exports){
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.UI=void 0;var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),_state=require("./state"),UI=exports.UI=function(){function e(t){_classCallCheck(this,e),this.game=t,this.cells=document.querySelectorAll(".cell"),this.addClickListeners()}return _createClass(e,[{key:"addClickListeners",value:function(){var e=this;this.cells.forEach(function(t){return t.addEventListener("mousedown",e.cellClickHandler.bind(e))})}},{key:"cellClickHandler",value:function(e){if("running"===this.game.status&&"X"===this.game.currentState.turn&&!e.target.classList.contains("occupied")){var t=parseFloat(e.target.dataset.index),a=new _state.State(this.game.currentState);a.board[t]="X",this.insertAt(t,"X"),a.advanceTurn(),this.game.advanceState(a)}}},{key:"switchViewTo",value:function(e){var t=document.querySelector(".turn"),a=document.querySelector(".board");switch(a.style.opacity=1,"won"!==e&&"lost"!==e&&"draw"!==e||(a.style.opacity=.2),e){case"human":t.textContent="It's your turn.",t.style.color="#00f0ff";break;case"robot":t.textContent="AI player turn.",t.style.color="#ff53ba";break;case"won":t.textContent="You win! Play again?",t.style.color="blue";break;case"lost":t.textContent="You lost! Play again?",t.style.color="red";break;case"draw":t.textContent="It's a tie! Play again?",t.style.color="white";break;default:t.textContent="Something is broken.",console.log("something is broken")}}},{key:"insertAt",value:function(e,t){var a=document.querySelector('div[data-index="'+e+'"]'),n="X"===t?"✖":"⭗";a.style.color="X"===t?"#00f0ff":"#ff53ba",a.textContent=n,a.classList.add("occupied")}},{key:"clearBoard",value:function(){this.cells.forEach(function(e){e.textContent="",e.classList.remove("occupied")})}}]),e}();

},{"./state":5}]},{},[4]);
