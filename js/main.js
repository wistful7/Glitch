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
    const backgroundAudio = document.getElementById('background-audio'); // Get the audio element

    // Get references for the game engine
    const storyTextElement = document.getElementById('story-text');
    const choicesContainer = document.getElementById('choices-container');
    const timeDisplay = document.getElementById('time-display');
    const certaintyDisplay = document.getElementById('certainty-display');
    const friendStatusContainer = document.getElementById('friend-status-container');

    // Bundle them into an object to pass to the engine
    const domElements = {
        storyTextElement,
        choicesContainer,
        timeDisplay,
        certaintyDisplay,
        friendStatusContainer
    };

    if (playButton) {
        playButton.addEventListener('click', () => {
            if (splashScreen) splashScreen.style.display = 'none';
            if (gameContainer) gameContainer.style.display = 'block';

            // Start playing the default background music
            if (backgroundAudio) {
                backgroundAudio.volume = 0.3; // Set a nice ambient volume
                backgroundAudio.play();
            }

            initializeEngine(allGameScenes, domElements, startGame);
        });
    }
});