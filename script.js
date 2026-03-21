// selecting element
let gameBoard = document.querySelector('#gameboard');


// size of each block inside game board
let blockWidth = 48;
let blockHeight = 48;


// total number of element is rows x cols
// calculating how many blocks can fit in width & height
let cols = Math.floor(gameBoard.clientWidth / blockWidth);   // horizontal blocks
let rows = Math.floor(gameBoard.clientHeight / blockHeight); // vertical blocks

// empty 2d array which will store each block (grid)
let grid = [];

let isGameOver = false;


// render board (create grid)
for (let i = 0; i < rows; i++) {

    grid[i] = []; // creating new row

    for (let j = 0; j < cols; j++) {

        // creating each block
        let div = document.createElement('div');

        div.classList.add('block');

        // setting size of block
        div.style.height = `${blockHeight}px`;
        div.style.width = `${blockWidth}px`;

        // optional dataset (not using currently)
        // div.dataset.row = i;
        // div.dataset.col = j;

        // showing index for understanding grid
        div.textContent = `(${i}, ${j})`;

        // storing block in grid
        grid[i][j] = div;

        // adding block to dom
        gameBoard.appendChild(div);
    }
}


// snake (array of objects → each object is one segment)
let snake = [
    { x: 6, y: 6 },
];


// direction of snake movement
let direction = "right";


// move snake
function moveSnake(direction) {

    // only handling right direction for now
    if (direction == "right") {

        // creating new head (move 1 step right → y + 1)
        let newHead = {
            x: snake[0].x,
            y: snake[0].y + 1
        };

        // checking boundary → if snake goes outside grid
        if (
            newHead.x < 0 ||
            newHead.y < 0 ||
            newHead.x >= rows ||
            newHead.y >= cols
        ) {
            console.log("Game Over");

            isGameOver = true;

            // stopping game loop
            clearInterval(GameLoop);

            return;
        }

        // getting tail (last element)
        let tail = snake[snake.length - 1];

        // adding new head at start
        snake.unshift(newHead);

        // removing tail from ui
        grid[tail.x][tail.y].classList.remove('snake');

        // removing last element from array
        snake.pop();
    }
}


// initial move
moveSnake(direction);


// render snake
function renderSnake() {

    // loop through each segment and add class
    snake.forEach(segment => {
        grid[segment.x][segment.y].classList.add('snake');
    });
}


// initial render
renderSnake();


// game loop → runs every 400ms
let GameLoop = setInterval(() => {

    moveSnake(direction);   // update position
    renderSnake();          // update ui

}, 400);