// File: js/game_engine.js

import { gameState, advanceTime } from './game_state.js';

let allScenes = {};
let uiElements = {};
let availableVoices = [];
let voicesLoadedCallback = null;
let voicesEnsured = false; // Flag to ensure the initial ready callback is only triggered once

function loadAndProcessVoices() {
    availableVoices = window.speechSynthesis.getVoices();
    // For debugging, uncomment the next line to see available voices on your system:
    // console.log("Available voices:", availableVoices.map(v => ({ name: v.name, lang: v.lang, default: v.default })));
    
    if (!voicesEnsured && availableVoices.length > 0) {
        voicesEnsured = true;
        if (voicesLoadedCallback) {
            voicesLoadedCallback();
        }
    } else if (!voicesEnsured && !('onvoiceschanged' in window.speechSynthesis) && voicesLoadedCallback) {
        // Fallback for browsers that might not support onvoiceschanged well but might load voices synchronously (or not at all)
        // This ensures the callback fires even if onvoiceschanged doesn't, allowing the game to start.
        voicesEnsured = true;
        voicesLoadedCallback();
    }
}

function speakText(textToSpeak) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any currently playing speech
        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        if (availableVoices.length === 0) { // If voices array is still empty, try to populate it
            loadAndProcessVoices();
        }

        if (availableVoices.length > 0) {
            let femaleVoice = availableVoices.find(voice =>
                (voice.lang.startsWith('en-') || voice.lang.startsWith('en_')) && // English language
                (voice.name.toLowerCase().includes('female') ||
                 voice.name.toLowerCase().includes('woman') ||
                 voice.name.toLowerCase().includes('zira') || // Common on Windows
                 voice.name.toLowerCase().includes('samantha') || // Common on macOS
                 voice.name.toLowerCase().includes('google us english') || // Often female on Chrome desktop
                 voice.name.toLowerCase().includes('susan') || 
                 voice.name.toLowerCase().includes('hazel'))
            );

            if (femaleVoice) {
                utterance.voice = femaleVoice;
                // console.log("Using voice:", femaleVoice.name);
            } else {
                // Fallback: try any default English voice or the first available English voice
                let fallbackVoice = availableVoices.find(voice => voice.lang.startsWith('en-') && voice.default) ||
                                    availableVoices.find(voice => voice.lang.startsWith('en-'));
                if (fallbackVoice) {
                    utterance.voice = fallbackVoice;
                    // console.log("Using fallback English voice:", fallbackVoice.name);
                } else if (availableVoices.length > 0) {
                    // If no English voice, uncomment to use the very first available voice
                    // utterance.voice = availableVoices[0];
                    // console.log("No English voice found, using first available voice:", availableVoices[0].name);
                }
            }
        }
        // utterance.pitch = 1;
        // utterance.rate = 1;
        // utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
    } else {
        // console.warn("Speech synthesis not supported or not enabled in this browser.");
    }
}

export function initializeEngine(scenesObject, domElements, onReadyCallback) {
    allScenes = scenesObject;
    uiElements.storyTextElement = domElements.storyTextElement;
    uiElements.choicesContainer = domElements.choicesContainer;
    uiElements.timeDisplay = domElements.timeDisplay;
    uiElements.certaintyDisplay = domElements.certaintyDisplay;
    uiElements.friendStatusContainer = domElements.friendStatusContainer;

    voicesLoadedCallback = onReadyCallback;

    if ('speechSynthesis' in window) {
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadAndProcessVoices;
        }
        loadAndProcessVoices(); // Initial attempt

        // Fallback for browsers that might load voices quickly but not fire onvoiceschanged immediately for the first load.
        // Or for browsers that don't support onvoiceschanged reliably.
        if (!voicesEnsured && availableVoices.length > 0) { // If voices are somehow already there but callback hasn't fired
            setTimeout(() => { // Use a timeout to allow onvoiceschanged to potentially fire first
                if (!voicesEnsured) {
                    loadAndProcessVoices(); // This will call the callback if voices are now present
                }
            }, 100); // A small delay
        } else if (!voicesEnsured && !('onvoiceschanged' in window.speechSynthesis) && voicesLoadedCallback) {
            // If onvoiceschanged is not supported, we've tried loadAndProcessVoices once.
            // We should call the callback to allow the game to start, even if voices might be empty.
             setTimeout(voicesLoadedCallback, 0); // Ensure it happens after current execution stack
        }

    } else {
        console.warn("Speech synthesis not supported. Game will run without voice.");
        if (voicesLoadedCallback) {
            voicesLoadedCallback(); // Proceed without voice features if API not present
        }
    }
}

function updateCertaintyDisplay() {
    let certaintyText = "Low";
    if (gameState.peterSimulationCertainty <= 0) certaintyText = "None";
    else if (gameState.peterSimulationCertainty >= 9) certaintyText = "Utterly Convinced";
    else if (gameState.peterSimulationCertainty >= 7) certaintyText = "Extremely High";
    else if (gameState.peterSimulationCertainty >= 5) certaintyText = "High";
    else if (gameState.peterSimulationCertainty >= 3) certaintyText = "Moderate";
    else if (gameState.peterSimulationCertainty >= 1) certaintyText = "Slight";
    uiElements.certaintyDisplay.textContent = certaintyText + ` (${gameState.peterSimulationCertainty}/10)`;
}

function updateFriendDisplay() {
    uiElements.friendStatusContainer.innerHTML = '<h4>Friend Status:</h4>';
    for (const friendKey in gameState.friends) {
        const friend = gameState.friends[friendKey];
        if (!friend) continue;
        const statusDiv = document.createElement('div');
        statusDiv.classList.add('friend-status-item');
        let displayStatus = `F: ${friend.friendship}/10`;
        if (friendKey === 'mel') {
             displayStatus += `, Trust (Theory): ${friend.trustInPeterTheory}/10`;
        }
        if (!friend.present) {
            displayStatus += " (Departed)";
        }
        statusDiv.textContent = `${friend.name}: ${displayStatus}`;
        uiElements.friendStatusContainer.appendChild(statusDiv);
    }
}

export function renderScene(sceneId) {
    if (gameState.currentTime >= 48 && !sceneId.startsWith("ending_") && sceneId !== "the_twist_reveal" && sceneId !== "mel_explains_twist" && sceneId !== "mel_explains_further_twist" && sceneId !== "end_game_time_up" ) {
        sceneId = "end_game_time_up";
    }

    const scene = allScenes[sceneId];
    if (!scene) {
        console.error("Scene not found:", sceneId);
        const errorText = `Error: Scene "${sceneId}" not found. This is a bug or an undeveloped path.`;
        uiElements.storyTextElement.textContent = errorText;
        speakText(errorText);
        uiElements.choicesContainer.innerHTML = '';
        uiElements.timeDisplay.textContent = `Hour ${parseFloat(gameState.currentTime.toFixed(1))}`;
        updateCertaintyDisplay();
        updateFriendDisplay();
        return;
    }

    gameState.currentSceneId = sceneId;
    
    const currentSceneText = typeof scene.text === 'function' ? scene.text() : scene.text;
    uiElements.storyTextElement.textContent = currentSceneText;
    speakText(currentSceneText);

    if (scene.beforeText && typeof scene.beforeText === 'function') {
        scene.beforeText();
    }
    if (scene.onLoad && typeof scene.onLoad === 'function') {
        scene.onLoad();
    }

    uiElements.choicesContainer.innerHTML = '';
    if (scene.choices && scene.choices.length > 0) {
        scene.choices.forEach(choice => {
            if (choice.condition && !choice.condition()) {
                return;
            }
            const button = document.createElement('button');
            button.textContent = typeof choice.text === 'function' ? choice.text() : choice.text;
            button.classList.add('choice-button');
            button.onclick = () => makeChoice(choice);
            uiElements.choicesContainer.appendChild(button);
        });
    } else {
         console.log(`Scene "${sceneId}" has no choices (this is normal for ending scenes).`);
    }

    uiElements.timeDisplay.textContent = `Hour ${parseFloat(gameState.currentTime.toFixed(1))}`;
    updateCertaintyDisplay();
    updateFriendDisplay();
}

function makeChoice(choice) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }

    if (choice.consequence) {
        choice.consequence();
    }
    const nextSceneId = typeof choice.nextScene === 'function' ? choice.nextScene() : choice.nextScene;
    renderScene(nextSceneId);
}