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


// aditional varibales
let isGameOver = false;
let isPaused = true;
let score = 0;
let highScore = Number(localStorage.getItem("highscore")) || 0;

// // set highscore in local storage
// localStorage.setItem("highscore", highScore);


// only these keys are allowed for movement
const allowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']

// current direction of snake
let direction = "ArrowRight";

// next direction which user presses (used to avoid instant reverse bugs)
let nextDirection = "ArrowRight";


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

// food (one at a time.)
let food = [];

// genrate food at random position in the game board
function generateFood() {
    let randomFood = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
    food.push(randomFood);
}

// render food on grid
function renderFood() {
    if (food.length > 0) {
        grid[food[0].x][food[0].y].classList.add('food');
    }
}



generateFood();
renderFood();
// handling key press for direction change
document.addEventListener("keydown", (e) => {
    if (e.key === ' ') {
        if (isGameOver) {
            restartGame();
            startGame();
            isPaused = false;
            return;
        }
        else if (!isPaused) {
            clearInterval(GameLoop);
            isPaused = true;
            return;
        } else {
            startGame();
            isPaused = false;
            return;
        }
    }


    // ignore if key is not arrow key
    if (!allowedKeys.includes(e.key)) return;

    // prevent reverse movement (snake cannot go directly opposite)
    if (e.key === "ArrowLeft" && direction === "ArrowRight") return;
    if (e.key === "ArrowRight" && direction === "ArrowLeft") return;
    if (e.key === "ArrowUp" && direction === "ArrowDown") return;
    if (e.key === "ArrowDown" && direction === "ArrowUp") return;

    // store next direction (will apply in game loop)
    nextDirection = e.key;
});


// game over on self collision
function selfCollision(newHead) {
    let segment = snake.slice(1, snake.length)
    for (let i = 0; i < segment.length; i++) {
        if (newHead.x === segment[i].x && newHead.y === segment[i].y) {
            handleOver();
            return true;
        }
    }
    return false;
};


// move snake
function moveSnake(direction) {

    // new head will be calculated based on direction
    let newHead;

    // moving right → increase y
    if (direction == "ArrowRight") {
        newHead = {
            x: snake[0].x,
            y: snake[0].y + 1
        };
        // moving left → decrease y
    } else if (direction == "ArrowLeft") {
        newHead = {
            x: snake[0].x,
            y: snake[0].y - 1
        };
        // moving up → decrease x
    } else if (direction == "ArrowUp") {
        newHead = {
            x: snake[0].x - 1,
            y: snake[0].y
        };
        // moving down → increase x
    } else if (direction == "ArrowDown") {
        newHead = {
            x: snake[0].x + 1,
            y: snake[0].y
        };
    }

    // safety check → if for some reason newHead is not created
    if (!newHead) return;
    if (selfCollision(newHead)) return;

    // checking boundary → if snake goes outside grid
    if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= rows ||
        newHead.y >= cols
    ) {
        handleOver();

        return;
    }
    // update snake on eating food..
    if (newHead.x === food[0].x && newHead.y === food[0].y) {
        ++score;
        snake.unshift(newHead);
        grid[food[0].x][food[0].y].classList.remove('food');
        food.pop();
        generateFood();
        renderFood();
    }
    else {
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
let GameLoop;
function startGame() {
    clearInterval(GameLoop);
    GameLoop = setInterval(() => {
        // get highscore from storage at the start of game
        // update direction once per frame (smooth control)
        direction = nextDirection;

        // move snake
        moveSnake(direction);

        // update ui
        renderSnake();


    }, 400);
}

function restartGame() {
    clearInterval(GameLoop);
    isGameOver = false;
    isPaused = true;
    direction = "ArrowRight";
    nextDirection = "ArrowRight";
    score = 0;
    snake.forEach(segment => {
        grid[segment.x][segment.y].classList.remove('snake');
    });
    if (food.length > 0) {
        grid[food[0].x][food[0].y].classList.remove('food');
    }
    snake = [
        { x: 6, y: 6 },
    ];
    food = [];
    generateFood();
    renderSnake();
    renderFood();
}

function handleOver() {
    console.log("Game Over");
    console.log(`your score is ${score}`);
    isGameOver = true;
    if (highScore < score) {
        highScore = score;
        localStorage.setItem("highscore", highScore);
    }
    console.log(`high score is: ${highScore}`);
    clearInterval(GameLoop);
}

