'use strict'

const SMILINGFACEWITHOPENMOUTH = '&#128515'
const SMILINGFACEWITHSUNGLASSES = '&#128526'
const FACEWITHBLOWNHEAD = '&#129327'
const BLOWNBOMB = '💥'
const BOMB = '💣'
const ONE = '&#49'
const TWO = '&#50'
const THREE = '&#51'
const FOUR = '&#52'
const FIVE = '&#53'
const SIX = '&#54'
const SEVEN = '&#55'
const EIGHT = '&#56'
const REDFLAG = '🚩'

var gBoard;
var bombPos = [];
var counter = 0;
var gIsGameOn = false;
var elapsT = 0;
var currentElapsT = 0;
var stopCount = 0;
var level = 16;
var numOfBomb = 2;
document.getElementById("16").checked = 'True';

function init(matZise, numOfBomb) {
    stop();
    counter = 0;
    gIsGameOn = false;
    currentElapsT = 0;
    elapsT = 0;
    level = matZise
    var nextNum = document.querySelector('.highestScore');
    nextNum.innerText = `Highest Score:\n ${counter}`;
    var sto = document.querySelector('.setZero');
    sto.innerText = `Game Time:\n${0}`;
}

gBoard = createBoard(level);
setMinesNegsCount(gBoard);
renderBoard(gBoard);


function createBoard(size) {
    var sqrt = Math.sqrt(size);
    var board = [];
    for (var i = 0; i < sqrt; i++) {
        board.push([])
        for (var j = 0; j < sqrt; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false };
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isShown) {
                if (board[i][j].isMine) {
                    var cell = BOMB;
                } else {
                    var cell = board[i][j].minesAroundCount;
                }
            } else if (board[i][j].isMarked) {
                var cell = REDFLAG;
            } else {
                var cell = ' ';
            }
            strHTML += `<td data-i="${i}" data-j="${j}"
             onclick="cellClicked(this , ${i},${j})">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    var elTbody = document.querySelector('.board');
    elTbody.innerHTML = strHTML;

}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        var index = i;
        for (var j = 0; j < board[0].length; j++) {
            var idx = j;
            if (!(board[i][j].isMine)) {
                var neighborsSum = 0;
                for (var ii = index - 1; ii <= index + 1; ii++) {
                    if (ii < 0 || ii >= board.length) continue;
                    for (var jj = idx - 1; jj <= idx + 1; jj++) {
                        if (jj < 0 || jj >= board.length) continue;
                        if (ii === index && jj === idx) continue;
                        if (board[ii][jj].isMine) {
                            neighborsSum++;
                        }
                    }
                }
                board[index][idx].minesAroundCount = neighborsSum;
                j = idx;
            }
        }
        i = index;
    }
}

function cellClicked(elTd, cellI, cellJ) {
    if (counter === 0) {
        start();
        gBoard[cellI][cellJ].isShown = true;
        randizeBomb(level, numOfBomb);
        setMinesNegsCount(gBoard);
        renderBoard(gBoard);
        counter++;
        console.log(elTd)
    }
}
//     }else {
//         if (gBoard[cellI][cellJ].isMine === false){
//             gBoard[cellI][cellJ].isMine = true;
//             revealsNegs(cellI, cellJ);
//         }
//     }
//     if (gBoard[cellI][cellJ] === 1 && counter === 1) {
//         start();
//         elTd.style.backgroundColor = 'lightsalmon';
//         counter++;
//         var nextNum = document.querySelector('.nextNum');
//         nextNum.innerText = `Next Number:\n ${counter}`;
//     } else if (gIsGameOn) {
//         elTd.style.backgroundColor = 'lightsalmon';
//         counter++;
//         if (counter === stopCount) {
//             stop();
//         } else {
//             var nextNum = document.querySelector('.nextNum');
//             nextNum.innerText = `Next Number:\n ${counter}`;
//         }
//     }

// }

// function revealsNegs(cellI, cellJ){
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j >=gBoard.length) continue;
//             if (i === cellI && j === cellJ) continue;
//             if (!(gBoard[i][j].isMine)) {
//                 gBoard[i][j].isShown = true;
//                 elTd.innerText = 
//             }
//         }
//     }
// }

randizeBomb(level, numOfBomb)
function randizeBomb(level, numOfBomb) {
    var sqrt = Math.sqrt(level);
    for (var i = 0; i < numOfBomb; i++) {
        var num1 = Math.floor(Math.random() * ((sqrt - 1) - 0 + 1) + 0);
        var num2 = Math.floor(Math.random() * ((sqrt - 1) - 0 + 1) + 0);
        gBoard[num1][num2].isMine = true;
        bombPos.push({posi: num1, posj: num2});
    }
}


function newGame() {
    init(level);
}

function setlevel1() {
    document.getElementById('16').checked = 'True';
    document.getElementById('64').checked = '';
    document.getElementById('144').checked = '';
    level = 16;
    numOfBomb = 2;
    init(16, 2);
}

function setlevel2() {
    document.getElementById('64').checked = 'True';
    document.getElementById('16').checked = '';
    document.getElementById('144').checked = '';
    level = 64;
    numOfBomb = 12;
    init(64, 12);
}

function setlevel3() {
    document.getElementById('144').checked = 'True';
    document.getElementById('64').checked = '';
    document.getElementById('16').checked = '';
    level = 144;
    numOfBomb = 30;
    init(144, 30);
}


var d1 = 0;
function changeValue() {
    gIsGameOn = true;
    var d2 = new Date();
    elapsT = (d2 - d1) / 1000;
    document.getElementById('demo').innerHTML = `Game Time:\n${(elapsT + currentElapsT).toFixed(3)}`;
}

var timerInterval = null;
function start() {
    d1 = new Date();
    stop();
    timerInterval = setInterval(changeValue, 30);
}
var stop = function () {
    clearInterval(timerInterval);
    gIsGameOn = false;
    currentElapsT += elapsT;
    elapsT = 0;
}



