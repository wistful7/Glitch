// File: js/scenes/scenes_endings.js

import { gameState, advanceTime } from '../game_state.js';

export const endingScenes = {
    // Main Twist Endings (Epilogues from scenes_final_act.js)
    "ending_mel_mastermind_epilogue": {
        text: "Mel considers you. 'Free is a... relative term, Peter. You've graduated from this phase. What happens next involves more... complex realities. For now, rest. Your data has been invaluable.' She presses a button on her console. The room hums. 'The Torquay program is archiving. Don't worry, Peter. You won't remember the specifics of this debriefing when you wake up in the next iteration. But the core of what you've learned... that will remain.' A gentle, lulling tone fills the air. Darkness slowly envelops you. THE END?",
        onLoad: () => { gameState.currentTime = 48; },
        choices: []
    },
    "ending_mel_mastermind_epilogue_existential": {
        text: "Mel gives a sympathetic look. 'The Torquay you knew was one of many operational environments. This particular iteration was about... you. Your journey. The data is what matters for our purposes. As for *your* life... it's an ongoing process of evaluation and development.' She gestures towards a door you hadn't noticed. 'There are other... scenarios. Other tests. You showed remarkable resilience. That's valuable.' The door slides open, revealing a blinding white light. You feel an irresistible pull towards it. THE END?",
        onLoad: () => { gameState.currentTime = 48; },
        choices: []
    },

    // Alternative "Bad" or "Neutral" Endings
    "ending_despair_early": {
        text: "You give in to despair. The simulation, or whatever it is, seems to overwhelm you. The remaining hours tick by in a blur of anxiety and resignation. Eventually, the 48-hour mark arrives. Nothing changes. You're simply... stuck. Alone with your thoughts in a world you no longer trust. (Ending: Despair)",
        onLoad: () => { gameState.currentTime = 48; },
        choices: []
    },
    "ending_inaction": {
        text: "You decide not to act, or you hesitate too long. The 48-hour deadline arrives. The world around you flickers once, twice... then stabilizes. The glitches stop. Everything seems... normal. Too normal. But your friends are gone, and you're left wondering if anything was ever real, or if you missed your only chance. (Ending: Inaction / Missed Chance)",
        onLoad: () => { gameState.currentTime = 48; },
        choices: []
    },

    // Teleport Anomaly Scenes (for handling undeveloped stubs)
    "teleport_glitch_event": {
        text: () => {
            let baseText = "You take a step towards home, or a few moments pass in mundane conversation, when suddenly the world around you dissolves into a blinding shimmer of static and rapidly shifting colours. A strange, high-pitched whine fills your ears. You feel a disorienting lurch, like being pulled through a too-tight space.";
            if (gameState.friends.mel.present && gameState.currentLocation === "Walking with Mel") {
                baseText += "\nYou reach out for Mel, and she for you, just as everything goes black for an instant.";
            } else {
                baseText += "\nEverything goes black for an instant.";
            }
            return baseText;
        },
        onLoad: () => {
            advanceTime(0.1);
            gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 2);
        },
        choices: [
            { text: "Blink... trying to get your bearings...", nextScene: "teleport_aftermath_confusion" }
        ]
    },
    "teleport_aftermath_confusion": {
        text: () => {
            let locationText = "a familiar but unsettlingly empty street corner near the town centre.";
            let melComment = "";
            if (gameState.friends.mel.present && (gameState.currentLocation === "Walking with Mel" || gameState.currentLocation === "Teleport Aftermath")) {
                melComment = "\n\nMel stumbles beside you, looking as shaken as you feel. 'Peter... what *was* that? It's like the ground just... jumped.'";
                gameState.currentLocation = "Teleport Aftermath";
            } else {
                gameState.friends.mel.present = false;
                melComment = "\nYou're alone, your heart pounding.";
                gameState.currentLocation = "Teleport Aftermath (Alone)";
            }
            return `You stagger, your head spinning, vision clearing. You're... not where you were. You find yourself on ${locationText}${melComment}\n\nThe air still hums faintly.`;
        },
        onLoad: () => { advanceTime(0.2); },
        choices: [
            {
                text: () => gameState.friends.mel.present ? "\"Mel, this is getting out of control. We need a plan, now!\"" : "\"This is escalating. I need to do something definitive.\"",
                nextScene: "gz_final_hours_planning" // From scenes_final_act.js
            },
            {
                text: () => gameState.friends.mel.present ? "\"Okay, that was NOT normal. Let's go to my place and figure this out.\"" : "\"I need to get somewhere safe and think. My place.\"",
                nextScene: "suggest_peters_place" // From scenes_shifting_lens.js
            },
            {
                text: "Just try to walk away from this spot, shaken.",
                nextScene: "teleport_glitch_event" // Soft loop
            }
        ]
    },

    // Generic Endpoint for truly undeveloped paths or explicit early stops
    "end_early": {
        text: "This particular narrative thread concludes for now. (This is a temporary end point for an undeveloped path).",
        choices: []
    },
    "end_game_time_up": {
        text: "The 48 hours are up. Time has run out. The world around you seems to settle into a mundane, unchanging loop. Your questions remain unanswered, your friends mostly gone. (Generic Timeout Ending)",
        choices: []
    },

    // Stubs that now lead to the teleport anomaly (or are hubs leading to such paths)
    "go_home_alone_intro_todo": { // Called from leaving_pub_options & latenight_cafe_decision_go_home
        text: "You decide to head home alone, trying to process the night's events.",
        onLoad: () => { gameState.currentLocation = "Heading Home Alone"; gameState.friends.mel.present = false; },
        choices: [{text: "Take a step towards home...", nextScene: "teleport_glitch_event"}]
    },
    "walk_home_with_mel_intro": { // Called from esplanade_mel_offers_comfort & latenight_cafe_decision_go_home
        text: "You and Mel start walking, the sound of your footsteps echoing in the quiet Torquay night.",
        onLoad: () => { gameState.currentLocation = "Walking with Mel"; gameState.friends.mel.present = true; advanceTime(0.1); }, // Short time for starting the walk
        choices: [
            { text: "Try to discuss your theories further.", nextScene: "walk_home_discuss_theory_todo" },
            { text: "Attempt some normal, lighter conversation.", nextScene: "walk_home_normal_chat_todo" }
        ]
    },
    "walk_home_discuss_theory_todo": {
        text: "Walking with Mel, you start to delve deeper into your simulation theories, the words tumbling out...",
        onLoad: () => { gameState.currentLocation = "Walking with Mel"; gameState.friends.mel.present = true; },
        choices: [{text: "As you explain your latest insight...", nextScene: "teleport_glitch_event"}]
    },
    "walk_home_normal_chat_todo": {
        text: "You try to steer the conversation with Mel to lighter, more normal topics, trying to find some semblance of reality...",
        onLoad: () => { gameState.currentLocation = "Walking with Mel"; gameState.friends.mel.present = true; },
        choices: [{text: "Just as you're feeling a bit more relaxed...", nextScene: "teleport_glitch_event"}]
    },

    // Hub-like scenes or partially developed stubs that connect to other things
    "pub_discussion_deepens": { // Called from pub_direct_approach_mel
        text: "You try to explain the unsettling feeling to Mel, how the glitches are more than just isolated incidents. She listens, her expression a mix of concern and deep thought. (More dialogue could be added here).",
        choices: [
            { text: "Suggest looking for more proof together.", nextScene: "pub_mel_ponders_anomaly" }, // in scenes_shifting_lens.js
            { text: "Ask if she's ever noticed anything similar herself.", nextScene: "pub_mel_suggests" } // in scenes_shifting_lens.js
        ]
    },
    "suggest_leaving_pub": { // Called from pub_mel_ponders_anomaly
        text: "You suggest leaving the pub. Mel seems to agree it might be a good idea.",
        onLoad: () => { gameState.currentLocation = "Leaving Hotel"; },
        choices: [
            { text: "Okay, let's decide where to go.", nextScene: "leaving_pub_options" }
        ]
    },
    "listen_to_music_phase2_intro": { // Called from pub_mel_suggests
        text: "The band, 'The Kite Machine', starts their next set. You try to focus on the music, with Mel beside you. The earlier weirdness still plays on your mind.",
        onLoad: () => { advanceTime(1); },
        choices: [
            { text: "After the set, suggest it's time to leave.", nextScene: "leaving_pub_options" },
            { text: "Try to talk to Mel again during a break.", nextScene: "pub_aftermath_debrief" } // in scenes_shifting_lens.js
        ]
    },
    "leaving_pub_options": { // Hub scene, called from multiple places
        text: () => `You're ready to leave the Torquay Hotel. The night is still relatively young, though, around ${Math.floor(gameState.currentTime) % 24}:00.`,
        onLoad: () => { advanceTime(0.1); gameState.currentLocation = "Outside Hotel"; },
        choices: [
            // "suggest_peters_place_todo" was the old stub name. The call should be to "suggest_peters_place" which is now developed in scenes_shifting_lens.js
            { text: "Suggest going back to your place.", nextScene: "suggest_peters_place" },
            // "suggest_latenight_cafe" is now developed in scenes_shifting_lens.js
            { text: "Ask if Mel wants to grab a late bite at the all-night cafe.", nextScene: "suggest_latenight_cafe" },
            { text: "Just head home alone.", nextScene: "go_home_alone_intro_todo" } // Leads to teleport
        ]
    }
    // NOTE: Stubs like "suggest_peters_place_todo", "rejoin_group_todo", "latenight_cafe_intro_todo"
    // have been removed as their functionalities were replaced by fully developed scenes in other files.
    // The scenes "return_to_pub_after_esplanade" and the original "suggest_latenight_cafe" (as a simple connector)
    // are now fully defined in scenes_shifting_lens.js.
};