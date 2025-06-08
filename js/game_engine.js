// File: js/game_engine.js

import { gameState, advanceTime } from './game_state.js';

let allScenes = {};
let uiElements = {};
let availableVoices = [];
let voicesLoadedCallback = null;
let voicesEnsured = false; // Flag to ensure the initial ready callback is only triggered once
let bgmElement;
let defaultTrackSrc = "";
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
    // Assign all scenes and UI elements from main.js
    allScenes = scenesObject;
    uiElements.storyTextElement = domElements.storyTextElement;
    uiElements.choicesContainer = domElements.choicesContainer;
    uiElements.timeDisplay = domElements.timeDisplay;
    uiElements.certaintyDisplay = domElements.certaintyDisplay;
    uiElements.friendStatusContainer = domElements.friendStatusContainer;

    // NEW: Get the background music element and store its default track path
    bgmElement = document.getElementById('background-audio');
    if (bgmElement) {
        // Find the first <source> tag to reliably get the original relative path
        const sourceElement = bgmElement.getElementsByTagName('source')[0];
        if (sourceElement) {
            defaultTrackSrc = sourceElement.getAttribute('src');
        } else {
            // Fallback if no <source> tag is used (less reliable)
            defaultTrackSrc = bgmElement.src;
        }
    }

    // --- Voice Loading Logic ---
    voicesLoadedCallback = onReadyCallback;
    if ('speechSynthesis' in window) {
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadAndProcessVoices;
        }
        loadAndProcessVoices(); // Initial attempt

        // Fallback for browsers that might load voices quickly but not fire onvoiceschanged
        if (!voicesEnsured && availableVoices.length > 0) {
            setTimeout(() => {
                if (!voicesEnsured) {
                    loadAndProcessVoices();
                }
            }, 100);
        } else if (!voicesEnsured && !('onvoiceschanged' in window.speechSynthesis) && voicesLoadedCallback) {
            // If onvoiceschanged is not supported, call the callback to start the game
            setTimeout(voicesLoadedCallback, 0);
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
function updateDebugPanel() {
    // Get the span elements for our debug info
    const debugTime = document.getElementById('debug-time');
    const debugExodus = document.getElementById('debug-exodus');
    const debugMelKnows = document.getElementById('debug-mel-knows');

    // Update the text content of each element with the current game state
    // We check if the element exists first to prevent errors
    if (debugTime) {
        debugTime.textContent = gameState.currentTime.toFixed(1);
    }
    if (debugExodus) {
        debugExodus.textContent = gameState.allOtherFriendsHaveDeparted;
    }
    if (debugMelKnows) {
        debugMelKnows.textContent = gameState.melKnowsAboutDeadline;
    }
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
function manageMusicForScene(scene) {
    // If the audio element isn't ready, do nothing.
    if (!bgmElement) return;

    // Determine the target track: the one specified in the scene, or the default.
    const targetTrack = scene.backgroundMusic || defaultTrackSrc;

    // If the correct music is already loaded and playing, do nothing.
    // We use endsWith() because bgmElement.src provides the full browser path.
    if (bgmElement.src.endsWith(targetTrack)) {
        return;
    }

    // --- If music needs to change, change the source and play ---
    // Note: A fade-out/fade-in could be added here for a smoother transition,
    // but for simplicity, this is a direct switch.
    bgmElement.src = targetTrack;
    bgmElement.play();
}
export function renderScene(sceneId) {
    // --- 1. Check for Game Over by Time ---
    // This check redirects to the time-up ending if 48 hours have passed, excluding the final twist/ending scenes.
    if (gameState.currentTime >= 48 && !sceneId.startsWith("ending_") && sceneId !== "the_twist_reveal" && sceneId !== "mel_explains_twist" && sceneId !== "mel_explains_further_twist" && sceneId !== "end_game_time_up" ) {
        sceneId = "end_game_time_up";
    }

    const scene = allScenes[sceneId];

    // --- 2. Handle Scene Not Found Errors ---
    if (!scene) {
        console.error("Scene not found:", sceneId);
        const errorText = `Error: Scene "${sceneId}" not found. This is a bug or an undeveloped path.`;
        uiElements.storyTextElement.textContent = errorText;
        speakText(errorText);
        uiElements.choicesContainer.innerHTML = '';
        // Still update the rest of the UI to show current status
        uiElements.timeDisplay.textContent = `Hour ${parseFloat(gameState.currentTime.toFixed(1))}`;
        updateCertaintyDisplay();
        updateFriendDisplay();
        updateDebugPanel();
        return;
    }
    
    // --- 3. Manage Scene Music ---
    // This will check if the music needs to be changed or resumed.
    manageMusicForScene(scene);

    // --- 4. Update Game State & Render Core Text ---
    gameState.currentSceneId = sceneId;
    const currentSceneText = typeof scene.text === 'function' ? scene.text() : scene.text;
    uiElements.storyTextElement.textContent = currentSceneText;
    speakText(currentSceneText);

    // --- 5. Run Scene Lifecycle Functions ---
    if (scene.beforeText && typeof scene.beforeText === 'function') {
        scene.beforeText();
    }
    if (scene.onLoad && typeof scene.onLoad === 'function') {
        scene.onLoad();
    }

    // --- 6. Render Choices ---
    uiElements.choicesContainer.innerHTML = '';
    if (scene.choices && scene.choices.length > 0) {
        scene.choices.forEach(choice => {
            // Skip rendering this choice if its condition is not met
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

    // --- 7. Final UI Updates ---
    // This ensures all status displays are refreshed for every scene.
    uiElements.timeDisplay.textContent = `Hour ${parseFloat(gameState.currentTime.toFixed(1))}`;
    updateCertaintyDisplay();
    updateFriendDisplay();
    updateDebugPanel(); // Ensures the debug panel is always current
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