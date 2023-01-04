'use strict';
var WINNING_TRIADS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
var X_TOKEN = -1;
var OPEN_TOKEN = 0;
var O_TOKEN = 1;
var MARKERS = ['X', '', 'O'];
var board;
var currentToken;
var depth;
var alphaBetaValuation = function(
  board,
  depth,
  player,
  nextPlayer,
  alpha,
  beta
) {
  var wnnr = winner(board);
  if (depth === 0 || wnnr !== OPEN_TOKEN) {
    return wnnr;
  } else if (!legalMoveLeft(board)) {
    return 0;
  }
  for (var i = 0; i < board.length; i++) {
    if (board[i] === OPEN_TOKEN) {
      board[i] = player;
      var val = alphaBetaValuation(
        board,
        depth - 1,
        nextPlayer,
        player,
        alpha,
        beta
      );
      board[i] = OPEN_TOKEN;
      if (player === O_TOKEN) {
        if (val > alpha) {
          alpha = val;
        }
        if (alpha >= beta) {
          return beta;
        }
      } else {
        if (val < beta) {
          beta = val;
        }
        if (alpha >= beta) {
          return alpha;
        }
      }
    }
  }
  return player === O_TOKEN ? alpha : beta;
};
var legalMoveLeft = function(board) {
  var i = board.length;
  while (i--) {
    if (board[i] === OPEN_TOKEN) {
      return true;
    }
  }
  return false;
};
var winner = function(board) {
  for (var i = 0; i < WINNING_TRIADS.length; i++) {
    var triadSum =
      board[WINNING_TRIADS[i][0]] +
      board[WINNING_TRIADS[i][1]] +
      board[WINNING_TRIADS[i][2]];
    if (triadSum === 3 || triadSum === -3) {
      return board[WINNING_TRIADS[i][0]];
    }
  }
  return 0;
};
var determineMove = function(board) {
  var bestVal = -2;
  var myMoves = [];
  for (var i = 0; i < board.length; i++) {
    if (board[i] === OPEN_TOKEN) {
      board[i] = O_TOKEN;
      var val = alphaBetaValuation(board, depth, X_TOKEN, O_TOKEN, -2, 2);
      board[i] = OPEN_TOKEN;
      console.log('Move: ' + i + ' Val: ' + val);
      if (val > bestVal) {
        bestVal = val;
        myMoves = [i];
      } else if (val === bestVal) {
        myMoves.push(i);
      }
    }
  }
  return myMoves[Math.floor(Math.random() * myMoves.length)];
};
var boxes = $('.box');
var displayBoard = function() {
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].innerHTML = MARKERS[board[i] + 1];
  }
};
for (var i = 0; i < boxes.length; i++) {
  boxes.eq(i).click(
    (function(i) {
      return function() {
        if (
          typeof board === 'undefined' ||
          board[i] !== OPEN_TOKEN ||
          winner(board) !== OPEN_TOKEN
        ) {
          return;
        }
        board[i] = currentToken;
        displayBoard(board);
        currentToken *= -1;
        var move = determineMove(board);
        board[move] = currentToken;
        displayBoard(board);
        currentToken *= -1;
      };
    })(i)
  );
}
$('#start').click(function() {
  var computerFirst = $('input[name=first]:checked').val() === 'computer';
  currentToken = computerFirst ? O_TOKEN : X_TOKEN;
  depth = parseInt(document.getElementById('depth').value, 10);
  board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  displayBoard(board);
  if (computerFirst) {
    var move = determineMove(board);
    board[move] = currentToken;
    displayBoard(board);
    currentToken *= -1;
  }
});
$(document).on('touchstart', $.noop);
