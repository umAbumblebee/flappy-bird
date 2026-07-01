# Flappy Bird Clone

A simple browser-based Flappy Bird clone built using HTML5, CSS3, and Vanilla JavaScript.

## Features

- **Physics Engine:** Implements gravity and jump mechanics using `requestAnimationFrame`.
- **Dynamic Spawning:** Pipes and ground decorations are procedurally generated.
- **Collision Detection:** Precise hitbox logic to check for bird/pipe interactions.
- **Game State Management:** Reset, Start, and End states with score tracking.
- **TRIM Image TOOL:** I created a custom c++ trim property to the tag 'image'

## Technical Stack

- **Languages:** HTML, CSS, JavaScript (ES6+).
- **Architecture:** Object-Oriented approach for game entities (Columns, Decorations).
- **Rendering:** DOM-based element manipulation with CSS absolute positioning.

## How to Play

1. Open `game-page.html` in any modern web browser.
2. Press **Enter** to start the game.
3. Press **Enter** again to make the bird jump.

## Future Improvements

- [ ] Add a high-score system using `localStorage`.
- [ ] Add a "Game Over" UI screen.
- [ ] Make the exe available via chrome webstore as exe
- [ ] Incorporate sound effects for jumping and collisions.
