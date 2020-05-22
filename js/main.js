'use strict'

const SMILINGFACEWITHOPENMOUTH = '&#128515'
const SMILINGFACEWITHSUNGLASSES = '&#128526'
const FACEWITHBLOWNHEAD = '&#129327'
const BLOWNBOMB = '💥'
const BOMB = '💣'
const REDFLAG = '🚩'
let gBoard;
var bombPos = [];
var counter = 0;
var gIsGameOn = false;
var elapsT = 0;;
var numOfMarked = 0;
var level = 16;
var numOfBomb = 2;
var flagVsBombLocation = 0;
var liveCount = 3;
var isHint1 = false;
var isHint2 = false;
var isHint3 = false;
var safeClick = 3;


document.getElementById("16").checked = 'True';


function setLevel1() {
    document.getElementById('16').checked = 'True';
    document.getElementById('64').checked = '';
    document.getElementById('144').checked = '';
    level = 16;
    numOfBomb = 2;
    init(16);
}

function setLevel2() {
    document.getElementById('64').checked = 'True';
    document.getElementById('16').checked = '';
    document.getElementById('144').checked = '';
    level = 64;
    numOfBomb = 12;
    init(64);
}

function setLevel3() {
    document.getElementById('144').checked = 'True';
    document.getElementById('64').checked = '';
    document.getElementById('16').checked = '';
    level = 144;
    numOfBomb = 30;
    init(144);
}
function init(matSize) {
    stop();
    gIsGameOn = false;
    elapsT = 0;
    counter = 0;
    var highestScore = document.querySelector('.highestScore');
    highestScore.innerText = `Highest Score: ${counter}`;
    var sto = document.querySelector('.setZero');
    sto.innerText = `Game Time: ${0}`;
    liveCount = 3;
    safeClick = 3;
    numOfMarked = 0
    flagVsBombLocation = 0;
    var elSpan = document.querySelector('.okTo1');
    elSpan.style.display = 'block'
    var elSpan = document.querySelector('span.okTo2');
    elSpan.style.display = 'block'
    var elSpan = document.querySelector('span.okTo3');
    elSpan.style.display = 'block'
    var elPlive = document.querySelector('.live');
    elPlive.innerHTML = '❤️️ ❤️ ❤️';
    var elSpanImoj = document.querySelector('.newGame');
    elSpanImoj.innerHTML = `${'&#128515'}`
    if (matSize === 16) numOfBomb = 2;
    if (matSize === 64) numOfBomb = 12;
    if (matSize === 144) numOfBomb = 30;
    gBoard = createBoard(matSize);
    renderBoard(gBoard);


}

function newGame() {
    init(level);
}
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
            var cell = ' ';
            strHTML += `<td data-i="${i}" data-j="${j}"
            onclick="cellClicked(this , ${i},${j})" 
            onmousedown="rightClick(event, ${i},${j}, this)" id="demo">${cell}</td>`
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
                if (neighborsSum === 0) neighborsSum = ' ';
                board[index][idx].minesAroundCount = neighborsSum;
                j = idx;
            }
        }
        i = index;
    }
}

function revealsBomb() {
    for (var i = 0; i < numOfBomb; i++) {
        gBoard[bombPos[i].posi][bombPos[i].posj].isShown = true;
        renderCell(bombPos[i].posi, bombPos[i].posj, BOMB);
    }
}

function revealsNegs(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (!(gBoard[i][j].isMine) && !(gBoard[i][j].isMarked) && !(gBoard[i][j].isShown)) {
                gBoard[i][j].isShown = true;
                counter++;
                numOfMarked++;
                checkGameOver();
                var highestScore = document.querySelector('.highestScore');
                highestScore.innerText = `Highest Score: ${counter}`;
                if (gBoard[i][j].minesAroundCount === 0) {
                    renderCell(i, j, ' ');
                }
                else {
                    renderCell(i, j, gBoard[i][j].minesAroundCount);;
                }
            }
        }
    }
}

function randizeBomb(level, numOfBomb, cellI, cellJ) {
    var sqrt = Math.sqrt(level);
    for (var i = 0; i < numOfBomb; i++) {
        var num1 = Math.floor(Math.random() * ((sqrt - 1) - 0 + 1) + 0);
        var num2 = Math.floor(Math.random() * ((sqrt - 1) - 0 + 1) + 0);
        if (num1 !== cellI || num2 !== cellJ) {
            gBoard[num1][num2].isMine = true;
            bombPos.push({ posi: num1, posj: num2 });
        }
    }
}

function rightClick(evevnt, i, j, elTd) {
    if (!(gBoard[i][j].isMarked) && !(gBoard[i][j].isShown) && evevnt.button === 2) {
        gBoard[i][j].isMarked = true;
        elTd.innerText = REDFLAG;
        flagVsBombLocation++;
        for (var idx = 0; idx < bombPos.length - 1; idx++) {
            if ((bombPos[idx].posi === i) && (bombPos[idx].posj === j)) {
                checkGameOver();
            }
        }
    } else if (!(gBoard[i][j].isShown) && evevnt.button === 2) {
        gBoard[i][j].isMarked = false;
        elTd.innerText = ' ';
        flagVsBombLocation--;
    }
}

function checkGameOver() {
    if (flagVsBombLocation === numOfBomb && numOfBomb + numOfMarked === level) {
        var elSpanImoj = document.querySelector('.newGame');
        elSpanImoj.innerHTML = `${'&#128526'}`
        stop();
    }
}


function renderCell(i, j, value) {
    var elTd = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elTd.innerHTML = value;
    elTd.style.backgroundColor = `#faf6`
}

function getRandomNums() {
    var nums = { num1: 0, num2: 0 };
    var sqrt = Math.sqrt(level);
    for (var i = 0; i < sqrt; i++) {
        var num1 = Math.floor(Math.random() * ((sqrt - 1) - 0 + 1) + 0);
        nums.num1 = num1;
        var num2 = Math.floor(Math.random() * ((sqrt - 1) - 0 + 1) + 0);
        nums.num2 = num2;
        return nums;
    }

}

function okTo(elSpan) {
    var check = false;
    while (!(check) && safeClick >= 1) {
        var nums = getRandomNums();
        if (!(gBoard[nums.num1][nums.num2].isMine) && !(gBoard[nums.num1][nums.num2].isShown)) {
            check = true;
        }
    }
    var res = revealForMoment(nums.num1, nums.num2);
    setTimeout(recover, 3000);
    function recover() {
        var buff;
        for (var i = 0; i < res.length; i++) {
            buff = res[i];
            gBoard[buff.posi][buff.posj].isShown = false;
            renderCellRecovery(buff.posi, buff.posj, ' ');
        }
    }
    safeClick--;
    elSpan.style.display = 'none';
}

function revealForMoment(cellI, cellJ) {
    var okToReveal = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (!(gBoard[i][j].isMine) && !(gBoard[i][j].isMarked)) {
                gBoard[i][j].isShown = true;
                if (gBoard[i][j].minesAroundCount === 0) {
                    renderCell(i, j, ' ');
                    okToReveal.push({ posi: i, posj: j });
                }
                else {
                    renderCell(i, j, gBoard[i][j].minesAroundCount);
                    okToReveal.push({ posi: i, posj: j });
                }
            }
        }
    }
    return okToReveal;
}

function renderCellRecovery(i, j, value) {
    var elTd = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elTd.innerText = value;
    elTd.style.backgroundColor = 'khaki'
}


function cellClicked(elTd, cellI, cellJ) {
    if (counter === 0) {
        start();
        gIsGameOn = true;
        randizeBomb(level, numOfBomb);
        setMinesNegsCount(gBoard);
        if (gBoard[cellI][cellJ].minesAroundCount !== ' ') {
            renderCell(cellI, cellJ, gBoard[cellI][cellJ].minesAroundCount);
            counter++;
            numOfMarked++;
        } else {
            revealsNegs(cellI, cellJ);
        }
        counter++;
        var highestScore = document.querySelector('.highestScore');
        highestScore.innerText = `Highest Score: ${counter}`;
    } else if (!(gBoard[cellI][cellJ].isMine) && !(gBoard[cellI][cellJ].isMarked) && !(gBoard[cellI][cellJ].isShown)) {
        if (gBoard[cellI][cellJ].minesAroundCount === ' ') {
            revealsNegs(cellI, cellJ);
        } else {
            gBoard[cellI][cellJ].isShown = true;
            renderCell(cellI, cellJ, gBoard[cellI][cellJ].minesAroundCount);
            numOfMarked++;
            checkGameOver();
            counter++;
            var highestScore = document.querySelector('.highestScore');
            highestScore.innerText = `Highest Score: ${counter}`;
        }
    } else {
        if (liveCount === 0) {
            revealsBomb(cellI, cellJ);
            renderCell(cellI, cellJ, BLOWNBOMB)
            var elSpanImoj = document.querySelector('.newGame');
            elSpanImoj.innerHTML = `${'&#129327'}`
            stop();
        } else if (liveCount === 3) {
            var elPlive = document.querySelector('.live');
            elPlive.innerHTML = '❤️️ ❤️';
            liveCount--;
        } else if (liveCount === 2) {
            var elPlive = document.querySelector('.live');
            elPlive.innerHTML = '❤️️';
            liveCount--;
        } else {
            var elPlive = document.querySelector('.live');
            elPlive.innerHTML = ' ';
            liveCount--;
        }
    }
}

var d1 = 0;
function changeValue() {
    gIsGameOn = true;
    var d2 = new Date();
    elapsT = (d2 - d1) / 1000;
    document.getElementById('demo1').innerHTML = `Game Time:\n${(elapsT).toFixed(0)}`;
}

var timerInterval = null;
function start() {
    d1 = new Date();
    stop(); // stoping the previous counting (if any)
    timerInterval = setInterval(changeValue, 30);
}
var stop = function () {
    clearInterval(timerInterval);
    gIsGameOn = false;
    elapsT = 0;
}
