// --- Configuration ---
const bird = document.querySelector('.bird');
const columnsContainer = document.getElementById('columns');

let all_pairs = [];
let animatedFrameId = null;
let game_started = false;
let game_over = false;
let score = 0;
let position = 150;
let velocity = 0;

const spawnRate = 120;
let frameCount = 0;
const gameHeight = 600;
const birdX = 50;
const gravity = 0.5;
const jumpForce = -8;
const pipeSpeed = 5;

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
        return;
    }

    frameCount++;
    if (frameCount >= spawnRate) {
        all_pairs.push(new ColumnPair());
        frameCount = 0;
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
        }
    }
    animatedFrameId = requestAnimationFrame(game_loop);
}

function endGame() {
    game_over = true;
    game_started = false;
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
});