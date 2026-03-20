// selecting element
let gameBoard = document.querySelector('#gameboard');

// size of each block inside game board
let blockWidth = 48;
let blockHeight = 48;

// total number of element is rows x cols 
let cols = Math.floor(gameBoard.clientWidth / blockWidth); // total rows
let rows = Math.floor(gameBoard.clientHeight / blockHeight); // total cols
console.log(cols);
console.log(rows);

for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
        let div = document.createElement('div');
        div.classList.add('block');
        div.style.height = `${blockHeight}px`;
        div.style.width = `${blockWidth}px`;
        div.textContent= `(${i}, ${j})`;
        
        gameBoard.appendChild(div);
    }
}