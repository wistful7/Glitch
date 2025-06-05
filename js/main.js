// File: js/main.js

import { gameState } from './game_state.js';
import { initializeEngine, renderScene as initialRender } from './game_engine.js';

// Import all the scene collections
import { introScenes } from './scenes/scenes_intro.js';
import { shiftingLensScenes } from './scenes/scenes_shifting_lens.js';
import { interventionScenes } from './scenes/scenes_intervention.js';
import { finalActScenes } from './scenes/scenes_final_act.js';
import { endingScenes } from './scenes/scenes_endings.js';

const allGameScenes = {
    ...introScenes,
    ...shiftingLensScenes,
    ...interventionScenes,
    ...finalActScenes,
    ...endingScenes
};

// Function to start the game, will be used as a callback
function startGame() {
    console.log("Attempting to start game and render initial scene...");
    if (typeof initialRender === 'function') {
        initialRender(gameState.currentSceneId); // Render the starting scene
    } else {
        console.error("Error: initialRender function not available from game_engine.js. Check exports.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const playButton = document.getElementById('play-button');
    const gameContainer = document.getElementById('game-container');

    // Get references to the HTML elements the game engine will need (once game starts)
    const storyTextElement = document.getElementById('story-text');
    const choicesContainer = document.getElementById('choices-container');
    const timeDisplay = document.getElementById('time-display');
    const certaintyDisplay = document.getElementById('certainty-display');
    const friendStatusContainer = document.getElementById('friend-status-container');

    const domElements = {
        storyTextElement,
        choicesContainer,
        timeDisplay,
        certaintyDisplay,
        friendStatusContainer
    };

    if (playButton) {
        playButton.addEventListener('click', () => {
            console.log("Play button clicked. Initializing engine and starting game...");
            if (splashScreen) splashScreen.style.display = 'none'; // Hide splash screen
            if (gameContainer) gameContainer.style.display = 'block'; // Show game container

            // Initialize the game engine with all scenes and the DOM elements
            // The startGame function will be called by initializeEngine once voices are ready (or immediately if no speech)
            initializeEngine(allGameScenes, domElements, startGame);
        });
    } else {
        // Fallback if splash screen somehow isn't there, try to start directly (might have audio issues)
        console.warn("Play button not found. Attempting to initialize engine directly.");
        initializeEngine(allGameScenes, domElements, startGame);
    }
});