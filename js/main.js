// File: js/main.js

import { gameState } from './game_state.js';
import { initializeEngine, renderScene as initialRender } from './game_engine.js';

// Import all the scene collections
import { introScenes } from './scenes/scenes_intro.js';
import { shiftingLensScenes } from './scenes/scenes_shifting_lens.js';
import { interventionScenes } from './scenes/scenes_intervention.js';
import { finalActScenes } from './scenes/scenes_final_act.js';
import { endingScenes } from './scenes/scenes_endings.js';

// Combine all imported scene objects into one comprehensive object
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

// Ensure DOM is loaded before getting elements and initializing
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded. Initializing engine...");
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

    // Pass startGame as the onReadyCallback to initializeEngine
    initializeEngine(allGameScenes, domElements, startGame);
});