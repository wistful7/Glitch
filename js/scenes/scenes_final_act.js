// File: js/scenes/scenes_final_act.js

import { gameState, advanceTime } from '../game_state.js';

export const finalActScenes = {
    "gz_discuss_abandonment": {
        text: "You voice your despair and anger at being abandoned. Mel listens patiently. 'It's a heavy blow, Peter. Feeling alone like this... it's understandable. But wallowing won't change what happened, or what might happen next. We have very little time left.'",
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "\"You're right. What do we do?\"", nextScene: "gz_final_hours_planning" },
            { text: "\"What's the point? They were right. It's hopeless.\"", consequence: () => { gameState.peterSimulationCertainty = Math.max(0, gameState.peterSimulationCertainty-3);}, nextScene: "ending_despair_early" } // This will be in scenes_endings.js
        ]
    },
    "gz_discuss_mel_staying": {
        text: () => {
            let melReason = "";
            if (gameState.friends.mel.trustInPeterTheory > 5) {
                melReason = "Mel considers you. 'Pity? No. Believe you? I believe you're experiencing something profound, Peter. And their 'solution' felt too simple, too... convenient. I stayed because I think there's more to this than they realize. And frankly, you're the most interesting variable in this whole equation. Besides,' she adds with a faint smile, 'someone needs to make sure you don't accidentally delete Torquay. And Charlie would miss our walks if I just vanished.'";
                if (!gameState.dogMentioned) gameState.dogMentioned = true;
            } else {
                melReason = "Mel shrugs, a hint of her old Scully skepticism in her eyes. 'Let's just say I'm not convinced by mob rule. And leaving you alone felt... wrong. We're friends, Peter. Or at least, we were.' She pauses. 'What happens next depends on what we do with the time we have left.'";
            }
            return `You look at Mel, searching her face. "Why did you stay?"\n\n${melReason}`;
        },
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "\"Okay, Mel. What's the plan then?\"", nextScene: "gz_final_hours_planning" },
            { text: "\"You think I'm 'interesting'? Is this a game to you?\"", nextScene: "gz_peter_suspects_mel" }
        ]
    },
    "gz_peter_suspects_mel": {
        text: "Mel raises an eyebrow, like Spock. 'Everything's a game, Peter, until it isn't. Right now, our game is against the clock. Are you going to play, or are you going to question your only remaining teammate?'",
        choices: [
            { text: "\"Alright, alright. Let's play. What do you suggest?\"", nextScene: "gz_final_hours_planning"},
            { text: "\"I can't trust anyone right now. Not even you.\"", nextScene: "ending_despair_early"} // This will be in scenes_endings.js
        ]
    },
    "gz_final_hours_planning": {
        text: () => {
            const hoursLeft = Math.max(0, 48 - gameState.currentTime);
            let melPlan = "";

            // This new dialogue fits perfectly when Mel is on board with the theory.
            if (gameState.friends.mel.trustInPeterTheory > 6 || gameState.melKnowsAboutDeadline) {
                melPlan = "Mel's expression is intense, her eyes sharp with sudden insight. 'Peter, I've been thinking about it all wrong. We're looking for glitches, but we should be looking for signposts.'\n\n" +
                        "She leans forward. 'Point Impossible. The name has always felt... fateful. Deliberate. Almost like a name designed to scare people away from the one place that actually matters. Even in a simulation, there are clues within clues. It's not just possibly the way out. With only " + hoursLeft.toFixed(1) + " hours left on that clock, I think it's probably our only way.'";
            } else {
                // This is the fallback for when Mel is still skeptical but desperate.
                melPlan = "Mel looks exhausted but resolute. 'Peter, our options are limited. We can either wait for the next weird thing to happen, or we can force the issue. That radar station at Point Impossible you've mentioned before... it's as good a place as any to go and, I don't know... make some noise. It's a desperate move, but we're out of better ideas.'";
            }

            return `You and Mel face the dwindling hours. "Okay," you say, "What's our move?"\n\n${melPlan}`;
        },
        onLoad: () => { 
            advanceTime(1); 
        },
        choices: [
            { 
                text: "\"Point Impossible. The radar station. Let's do it. Clothes on!\"", 
                nextScene: "final_act_point_impossible_approach" // <<< THIS IS THE FIX
            },
            { 
                text: "\"It's too risky. There has to be another way.\"", 
                nextScene: "ending_inaction" 
            }
        ]
    },
    "final_act_point_impossible_approach": {
        text: "You and Mel make your way to Point Impossible. The derelict radar station looms against the pre-dawn sky, an unsettling silhouette. The air here feels incredibly charged, almost vibrating. The remaining time is short: just a few hours until the 48-hour mark.",
        backgroundMusic: "audio/dramatic_loop.mp3",
        onLoad: () => {
            gameState.currentLocation = "Point Impossible";
            advanceTime(2); 
        },
        choices: [
            { text: "Find a way into the main control building.", nextScene: "final_act_breaching_station" },
            { text: "\"Mel, I have a really bad feeling about this.\"", nextScene: "final_act_hesitation" }
        ]
    },
    "final_act_hesitation": {
        text: "Mel looks at you, her face determined. 'There's no turning back now, Peter. We're out of time and options. Whatever happens, we face it. Together?'",
        backgroundMusic: "audio/dramatic_loop.mp3",
        choices: [
            { text: "\"Together.\"", nextScene: "final_act_breaching_station"},
            { text: "\"I can't. I just can't.\" (Give up)", nextScene: "ending_inaction"} // This will be in scenes_endings.js
        ]
    },
    "final_act_breaching_station": {
        text: "The main door is rusted shut, but you find a smashed window. Inside, the control room is a wreck of old technology, but one central console hums with an unnatural green light. It seems to be the source of the vibrations. Strange symbols flicker across its dusty screen. This is it.",
        backgroundMusic: "audio/dramatic_loop.mp3",
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "\"Mel, what do we do? Try to shut it down?\"", nextScene: "final_act_the_console" },
            { text: "\"This is it. I can feel it. This is the core!\"", consequence: () => gameState.peterSimulationCertainty = 10, nextScene: "final_act_the_console" }
        ]
    },
    "final_act_the_console": {
        text: () => {
            const hoursLeft = Math.max(0, 48 - gameState.currentTime);
            return `Mel studies the console. 'It's... not like any tech I've ever seen. It's responding to something.' She looks at you. 'To you, Peter. I think you need to interact with it. We have maybe ${hoursLeft.toFixed(1)} hour${hoursLeft.toFixed(1) === "1.0" ? "" : "s"} left. What do you do?'`;
        },
        backgroundMusic: "audio/dramatic_loop.mp3",
        choices: [
            { text: "Reach out and touch the glowing screen.", nextScene: "simulation_collapse" },
            { text: "Try to smash the console.", nextScene: "simulation_collapse_violent" }
        ]
    },
    "simulation_collapse": {
        text: "As your hand touches the screen, an earsplitting whine fills the air. The green light flares, engulfing the room. The vibrations intensify, shaking the very foundations of reality. Torquay, the radar station, everything begins to pixelate and fragment around you. You feel a profound sense of disconnection, then... nothingness.",
        backgroundMusic: "audio/dramatic_loop.mp3",
        onLoad: () => { gameState.currentTime = 47.9; }, // Set time just before 48 for the twist
        choices: [
            { text: "Darkness...", nextScene: "the_twist_reveal" }
        ]
    },
    "simulation_collapse_violent": {
        text: "You grab a piece of debris and smash it into the console. Sparks fly. The green light turns blood red, and a deafening klaxon blares. The world outside the window shatters like glass, revealing a chaotic void of code and light. You're thrown to the ground as the station itself deconstructs around you.",
        backgroundMusic: "audio/dramatic_loop.mp3",
        onLoad: () => { gameState.currentTime = 47.9; }, // Set time just before 48 for the twist
        choices: [
            { text: "Chaos...", nextScene: "the_twist_reveal" }
        ]
    },
    "the_twist_reveal": {
        text: "Slowly, sensation returns. You're lying on a cool, smooth surface. The green glow is gone, replaced by soft, ambient lighting. You sit up. You're in a minimalist, futuristic room. Mel is standing by a sleek console, watching you with an unreadable expression. She's wearing a simple, silver uniform you've never seen before. She doesn't look like 'Mel from Torquay' anymore.",
        onLoad: () => { gameState.currentTime = 48; }, // The 48 hours are effectively up
        choices: [
            { text: "\"Mel...? What... what is this? Where are we?\"", nextScene: "mel_explains_twist" }
        ]
    },
    "mel_explains_twist": {
        text: "Mel smiles, a genuine, knowing smile. 'This, Peter, is Sector 7 Observation. And I'm not exactly 'Mel from Torquay'. You could call me Evaluator M3L. Welcome to the debriefing.'\n\nShe gestures to a large screen on the wall, which flickers to life, showing images of your 48 hours in Torquay – the glitches, your conversations, the friends leaving.\n\n'The 'Torquay Simulation Prime' was a deep immersion diagnostic, Peter. Designed to assess individual responses to sustained ontological stress and paradigm destabilization. Your friends... they were complex NPC constructs, programmed with specific behavioral loops and a collective counter-narrative. Their exodus was a key pressure point.'",
        choices: [
            { text: "\"A test? All of it? My friends weren't real?\"", nextScene: "mel_explains_further_twist" },
            { text: "\"You... you were watching me? Controlling it?\"", nextScene: "mel_explains_further_twist" }
        ]
    },
    "mel_explains_further_twist": {
        text: "Mel nods. 'My role was to observe, guide subtly if necessary, and evaluate your progress. Your ability to perceive anomalies was... exceptional. Most subjects either succumb to denial or complete paranoia much earlier. You maintained a core objective amidst the chaos. The 'simulation collapse' you initiated at Point Impossible was the designated endpoint for this iteration.'\n\nShe steps closer. 'Your friends believed you were the cause because that was the narrative designed to isolate you, to test your individual resolve. You passed, Peter. You pushed the boundaries and forced a system reset.'",
        choices: [
            { text: "\"Passed? What happens now? Am I... free?\"", nextScene: "ending_mel_mastermind_epilogue" },
            { text: "\"So my whole life... was this 'Torquay Simulation'?\"", nextScene: "ending_mel_mastermind_epilogue_existential" }
        ]
    },
    // Note: The actual ending scenes (ending_mel_mastermind_epilogue, etc.) will go in scenes_endings.js
    // For now, these nextScene calls point to IDs we will define in the next file.
};