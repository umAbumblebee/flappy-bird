// --- Configuration ---
const bird = document.querySelector('.bird');
const columnsContainer = document.getElementById('columns');
const groundContainer=document.getElementById('ground')
let score = 0;
let highScore=0

let all_pairs = [];
let animatedFrameId = null;
let game_started = false;
let game_over = false;

let position = 150;
let velocity = 0;

let decorations = [];
let decoSpawnCount = 0;

const spawnRate = 120;
let frameCount = 0;
const gameHeight = 600;
const birdX = 50;
const gravity = 0.5;
const jumpForce = -8;
const pipeSpeed = 5;
const roof=50
const floor=500

class ColumnPair {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'pair';
        this.scored = false;

        this.gapSize = 160; // Increased gap slightly for easier passing
        const minHeight = 50;

        this.topHeight = Math.floor(Math.random() * (gameHeight - this.gapSize - 2 * minHeight)) + minHeight;
        this.bottomHeight = gameHeight - this.topHeight - this.gapSize;

        this.element.innerHTML = `
            <div class="top-pipe" style="height: ${this.topHeight}px"></div>
            <div class="bottom-pipe" style="height: ${this.bottomHeight}px"></div>
        `;

        this.x = window.innerWidth;
        this.element.style.left = this.x + 'px';
        columnsContainer.appendChild(this.element);
    }
    
    /**returns if it went out of the page 
     * @returns {boolean} if element left the page
    */
    update() {
        this.x -= pipeSpeed;
        this.element.style.left = this.x + 'px';
        return this.x < -60;
    }
    

    isColliding(birdElement) {
        const birdRect = birdElement.getBoundingClientRect();
        const pipeRect = this.element.getBoundingClientRect();

        // Shrink the bird's hitbox by 4px on all sides so it feels "fair"
        const bLeft = birdRect.left + 6;
        const bRight = birdRect.right - 6;
        const bTop = birdRect.top + 6;
        const bBottom = birdRect.bottom - 6;

        // Check if bird is within the pipe's horizontal range
        if (bRight > pipeRect.left && bLeft < pipeRect.right) {
            // Check if bird is hitting top pipe OR bottom pipe
            if (bTop < pipeRect.top + this.topHeight || bBottom > pipeRect.top + this.topHeight + this.gapSize) {
                return true;
            }
        }
        return false;
    }
}

class GroundDecorator {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'ground'; // New CSS class
        
        // Randomize the shape/type of the decoration
        this.element.style.width = (Math.random() * 40 + 20) + 'px';
        this.element.style.height = (Math.random() * 30 + 10) + 'px';
        
        
       this.x = window.innerWidth;
       this.element.style.left = this.x + 'px';
       this.element.style.bottom = '100px'; // Set this to match your ground height
       this.element.style.position = 'absolute';
        
       scoreContainer.appendChild(this.element)
        
    }

    update() {
        this.x -= pipeSpeed; // Use the same speed as pipes for perfect sync
        this.element.style.left = this.x + 'px';
        return this.x < -100; // Remove when off-screen
    }
}

/**
 * removes all columns from the page,and empties all_pairs
 */
function resetGame() {
    if (animatedFrameId) cancelAnimationFrame(animatedFrameId);
    all_pairs.forEach(pair => pair.element.remove());
    all_pairs = [];

    score = 0;
    position = 150;
    velocity = 0;
    frameCount = 0;
    game_started = true;
    game_over = false;

    bird.style.top = position + 'px';
    bird.style.transform = 'rotate(0deg)';
}

function game_loop() {
    if (!game_started || game_over) return;

    velocity += gravity;
    position += velocity;
    bird.style.top = position + 'px';
    bird.style.transform = `rotate(${velocity * 3}deg)`;

    // Ground/Ceiling Check
    if (position < 0 || position > gameHeight - 40) {
        endGame();
        //display the game over overlay or change it's display property to visible by setting it 
        //initially none
        return;
    }

    frameCount++;
    if (frameCount >= spawnRate) {
        all_pairs.push(new ColumnPair());
        frameCount = 0;
    }

    decoSpawnCount++;
    if (decoSpawnCount >= 200) {
        decorations.push(new GroundDecorator());
        decoSpawnCount = 0;
    }

    // Update Decorations
    for (let i = decorations.length - 1; i >= 0; i--) {
        if (decorations[i].update()) {
            decorations[i].element.remove();
            decorations.splice(i, 1);
        }
    }

    for (let i = all_pairs.length - 1; i >= 0; i--) {
        const pair = all_pairs[i];
        
        if (pair.update()) {
            pair.element.remove();
            all_pairs.splice(i, 1);
            continue;
        }

        if (pair.isColliding(bird)) {
            endGame();
            return;
        }

        // Score check (Bird has passed the pipe)
        if (birdX > pair.x + 60 && !pair.scored) {
            score += 1;
            pair.scored = true;
            console.log('Score:', score);

            if (score>highScore){
                highScore=score
                document.querySelector('.score > h1').innerHTML=`${highScore}`
            }
            //get the score class and make the innner HTML to this score
            document.querySelector('.score>h2').innerHTML=`${score}`
            
        }
    }

    animatedFrameId = requestAnimationFrame(game_loop);
}

function stopGame() {
    if (animatedFrameId) {
        cancelAnimationFrame(animatedFrameId);
        animatedFrameId = null;
    }
    game_over = true;
    game_started = false;
    console.log('Game stopped');
}

/**
 * stops the game,and resets the values back
 */
function endGame() {
    stopGame();
    console.log('Final Score:', score);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (!game_started || game_over) {
            resetGame();
            game_loop();
        } else {
            velocity = jumpForce;
        }
    }
    if (e.key === 'Escape') {
        stopGame();
    }
});