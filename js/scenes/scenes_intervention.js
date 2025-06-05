// File: js/scenes/scenes_intervention.js

import { gameState, advanceTime } from '../game_state.js';

export const interventionScenes = {
    "talk_to_other_friends_intro": {
        text: () => {
            let melConcern = "";
            if (gameState.friends.mel.trustInPeterTheory > 3 || gameState.friends.mel.friendship > 6) {
                melConcern = "Mel gives you a supportive but worried glance. 'Be careful, Peter. They seem... on edge.'";
            } else {
                melConcern = "Mel watches you approach the others, her expression carefully neutral.";
            }
            // Janita's carrot cake offer - Name already updated to Janita in gameState, so just use that.
            let janitaOffer = gameState.friends.carrot.present ? "Janita nervously fiddles with a container. 'Oh, Peter, Mel... before things get too serious, I brought some of my carrot cake. If anyone wants to try a piece later? It's a new recipe.'" : "";
            return `You decide it's time to talk to the others, or perhaps they've decided it's time to talk to you. ${janitaOffer} The air feels thick with unspoken words. ${melConcern} You find John and Simone exchanging a serious look. They motion for you and Mel to join them, and soon Andy, Janita, and Tony are gathered.`; // Names updated
        },
        onLoad: () => {
            advanceTime(0.5);
            gameState.currentLocation = "Intervention Point (e.g., John's Lounge)"; // Updated location to reflect John instead of Crossy
        },
        choices: [
            { text: "\"Alright, what's going on? You all look like you've seen a ghost.\"", nextScene: "intervention_confrontation" },
            { text: "Wait for them to speak, bracing yourself.", nextScene: "intervention_confrontation" }
        ]
    },
    "intervention_confrontation": {
        text: () => {
            return "Simone steps forward, her arms crossed. 'Peter, Mel. Thanks for... joining us. This isn't easy, but we all agreed we need to talk. Openly.'\n\nJohn nods, looking unusually grim. 'It's about these... things that have been happening, mate. The glitches, the weirdness. And... well, you, Peter.'"; // Names updated
        },
        choices: [
            { text: "\"Me? What are you talking about?\"", nextScene: "intervention_accusation_begins" },
            { text: "\"I know things have been strange. That's what I've been trying to tell you!\"", nextScene: "intervention_accusation_begins", consequence: () => gameState.peterSimulationCertainty++ }
        ]
    },
    "intervention_accusation_begins": {
        text: () => {
            let JanitaText = gameState.friends.carrot.present ? "Janita speaks up, her voice trembling slightly. 'Peter, I'm scared. Every time something really odd happens, you're right there. It feels... it feels connected to you.'" : "";
            let AndyText = gameState.friends.neil.present ? "Andy adds, more softly, 'Maybe I've just had one too many wines tonight, Peter, but it really does feel like the strangeness follows you. It's like the background radiation of weirdness just spikes whenever you get worked up about something.'" : "";
            let JohnText = gameState.friends.john.present ? "John jumps in, 'It's not just the big stuff, Pete. It's little things. You ever talk to Tatiana at the surf club? Feels like her dialogue tree's got three branches, max. Classic NPC, that one. The point is, the whole vibe gets screwy around you.'" : "";
            return `${JanitaText}${JanitaText ? '\n\n' : ''}${AndyText}${AndyText ? '\n\n' : ''}${JohnText}${JohnText ? '\n\n' : ''}Simone continues, 'We've discussed it. A lot. And we've come to a difficult conclusion, Peter. We think you're the reason this is all happening. You're somehow... the cause, or an anchor for this simulation's instability.'`; // Names updated
        },
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "\"That's insane! I'm trying to figure out what's wrong, not cause it!\" (Denial)", nextScene: "intervention_peters_denial" },
            { text: "\"You think *I'm* the problem? After everything we've been through?\" (Betrayal)", nextScene: "intervention_peters_betrayal" },
            { text: "Listen silently, trying to process what they're saying.", nextScene: "intervention_friends_explain_further" }
        ]
    },
    "intervention_peters_denial": {
        text: "Your denial hangs in the air. John shakes his head. 'We're not saying you're doing it on purpose, mate. But the pattern is undeniable.' Tony chimes in, 'Look, Peter, we're not here to point fingers just to be mean. We're trying to find a solution.'", // Names updated
        onLoad: () => {
            if (gameState.friends.john.present) gameState.friends.john.friendship = Math.max(0, gameState.friends.john.friendship -1);
            if (gameState.friends.kel.present) gameState.friends.kel.friendship = Math.max(0, gameState.friends.kel.friendship -1); // kel is key for Tony
        },
        choices: [
            { text: "Attempt to reason with them about your own theories.", nextScene: "intervention_peter_explains_his_side" },
            { text: "\"A solution? What kind of solution involves blaming me?\"", nextScene: "intervention_friends_explain_further" }
        ]
    },
    "intervention_peters_betrayal": {
        text: "A hurt silence follows your words. Janita looks close to tears. 'It's not about blame, Peter,' Andy says gently. 'It's about observation. And frankly, self-preservation. For all of us.'", // Names updated
        onLoad: () => {
            if (gameState.friends.neil.present) gameState.friends.neil.friendship = Math.max(0, gameState.friends.neil.friendship -1); // neil is key for Andy
            if (gameState.friends.carrot.present) gameState.friends.carrot.friendship = Math.max(0, gameState.friends.carrot.friendship -1); // carrot is key for Janita
        },
        choices: [
            { text: "\"Self-preservation? What are you planning?\"", nextScene: "intervention_friends_reveal_plan" },
            { text: "Look to Mel for support.", nextScene: "intervention_mel_checkpoint" }
        ]
    },
    "intervention_friends_explain_further": {
        text: "Simone elaborates, 'Our hypothesis, Peter, is that your strong... perceptions, your focus on anomalies, somehow destabilizes the local environment. Or, you are a key variable that the simulation is struggling to process. If you're removed from the equation, or at least distanced, the system might stabilize, or even collapse, freeing everyone.'", // Name updated
        choices: [
            { text: "\"Collapse? You're willing to risk that based on a guess?\"", nextScene: "intervention_friends_reveal_plan" },
            { text: "\"And Mel? What does she think about this 'hypothesis'?\"", nextScene: "intervention_mel_checkpoint" }
        ]
    },
    "intervention_peter_explains_his_side": {
        text: "You try to explain your simulation theory, the glitches you've seen, your belief that you're all trapped and you're trying to find a way out for everyone. The friends listen, but their expressions range from pity to hardened resolve.",
        onLoad: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty +1); },
        choices: [
            { text: "\"Don't you see? Leaving me alone might be what IT wants!\"", nextScene: "intervention_friends_reveal_plan" },
            { text: "Plead with them to reconsider, to work with you.", nextScene: "intervention_friends_final_plea" }
        ]
    },
    "intervention_mel_checkpoint": {
        text: () => {
            let melDialogue = "";
            if (gameState.friends.mel.trustInPeterTheory > 5 && gameState.friends.mel.friendship > 5) {
                melDialogue = "Mel steps forward slightly. 'Hold on. This is a pretty extreme theory, based on correlations, not proven causation. Peter has been under stress, yes, but so have all of us with these... occurrences. Are we absolutely sure isolating him is the answer, or even safe?' Her voice is calm but firm.";
                gameState.friends.mel.trustInPeterTheory++;
            } else if (gameState.friends.mel.friendship > 3) {
                melDialogue = "Mel looks conflicted. 'I... I understand your concerns. Things have been incredibly strange. But this is Peter we're talking about. There has to be another way to look at this.'";
            } else {
                melDialogue = "Mel stays quiet, her expression unreadable, avoiding eye contact with everyone. The silence from her is telling.";
                gameState.friends.mel.suspicion = Math.min(10, gameState.friends.mel.suspicion +1);
            }
            return `All eyes turn to Mel. ${melDialogue}`;
        },
        choices: [
            { text: "Continue listening to what the friends have decided.", nextScene: "intervention_friends_reveal_plan" }
        ]
    },
    "intervention_friends_final_plea": {
        text: "You make a heartfelt plea, reminding them of your friendships, the good times, urging them to reconsider their drastic plan. Some look away, affected, but Simone and Tony exchange a resolute glance.", // Names updated
        choices: [
            { text: "Wait for their final decision.", nextScene: "intervention_friends_reveal_plan" }
        ]
    },
    "intervention_friends_reveal_plan": {
        text: "Tony finally speaks, his voice practical. 'Look, Peter. We've already made up our minds. We're not doing this to hurt you. We're doing this because we feel we have no other choice. For the simulation to collapse, or at least for us to get out of this... this localized distortion field around you, we think we all need to go away. Leave you. Completely alone.'\n\nJohn adds, 'If you're the anchor, Peter, then with no ships tied to you... maybe the harbor itself disappears.'", // Names updated
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "\"Alone? You're all just going to... leave?\"", nextScene: "exodus_ubers_setup" },
            { text: "Look at Mel, a desperate appeal in your eyes.", nextScene: "exodus_ubers_setup" }
        ]
    },
    "exodus_ubers_setup": {
        text: "The finality in their voices is chilling. John, Andy, and Janita start checking their phones. 'Our rides are on the way,' John mutters, not meeting your eye.", // Names updated
        choices: [
            { text: "Say something to John before he leaves.", nextScene: "exodus_farewell_john" }, // Name updated, scene name updated
            { text: "Watch them, a knot of anger and despair tightening in your chest.", nextScene: "exodus_campervan_setup" }
        ]
    },
    "exodus_farewell_john": { // Renamed from exodus_farewell_crossy
        text: "You try to say something to John, a mix of anger and pleading. He just shakes his head. 'Sorry mate. Hope you get it sorted.' He turns as his Uber pulls up.", // Name updated
        onLoad: () => {
            gameState.friends.john.present = false;
            gameState.friends.john.friendship -= 2;
            advanceTime(0.1);
        },
        choices: [
            { text: "Let him go. Turn to Andy and Janita.", nextScene: "exodus_farewell_andy_janita" } // Name updated, scene name updated
        ]
    },
    "exodus_farewell_andy_janita": { // Renamed from exodus_farewell_neil_janita
        text: "Andy gives a sad shrug. 'Maybe we'll see you on the other side, Peter. If there is one.' Janita is openly crying. 'I'll miss our music nights,' she whispers, before they both hurry to their ride. 'And the carrot cake...' she adds, a small, sad afterthought.", // Names updated
        onLoad: () => {
            gameState.friends.neil.present = false; // neil is key for Andy
            gameState.friends.carrot.present = false; // carrot is key for Janita
            gameState.friends.neil.friendship -=1;
            gameState.friends.carrot.friendship -=1;
            advanceTime(0.2);
        },
        choices: [
            { text: "They're gone. Now it's Tony and Simone.", nextScene: "exodus_campervan_setup" } // Names updated
        ]
    },
    "exodus_campervan_setup": {
        text: "With a finality that chills you, John, Andy, and Janita leave. Tony and Simone head towards the door. 'Our camper's out front,' Simone says. 'We packed light. Figured it's best.'", // Names updated
        onLoad: () => {
            gameState.friends.john.present = false;
            gameState.friends.neil.present = false; // neil is key for Andy
            gameState.friends.carrot.present = false; // carrot is key for Janita
        },
        choices: [
            { text: "\"You too? You're really all doing this?\"", nextScene: "exodus_farewell_campervan" },
            { text: "Look at Mel. Is she leaving too?", nextScene: "exodus_mel_stays_check" }
        ]
    },
    "exodus_farewell_campervan": {
        text: "Tony claps you on the shoulder, a gesture that feels more like a goodbye than reassurance. 'It's for the best, Pete. For everyone.' Simone offers a small, sad smile. 'Maybe... maybe this will work. We hope so.' They turn and leave, the sound of their campervan starting up a moment later and fading into the distance.", // Names updated
        onLoad: () => {
            gameState.friends.kel.present = false; // kel is key for Tony
            gameState.friends.kath.present = false; // kath is key for Simone
            gameState.friends.kel.friendship -= 2;
            gameState.friends.kath.friendship -= 2;
            advanceTime(0.3);
        },
        choices: [
            { text: "They're all gone. It's just you and Mel.", nextScene: "ground_zero_aftermath" }
        ]
    },
    // In js/scenes/scenes_intervention.js

"exodus_mel_stays_check": {
    text: () => {
        // ... existing text function ...
    },
    onLoad: () => { // <<< ADD THIS onLoad FUNCTION
        gameState.friends.kel.present = false;   // kel is key for Tony
        gameState.friends.kath.present = false;  // kath is key for Simone

        // Mirror the friendship decrease and any other relevant effects
        // from exodus_farewell_campervan's onLoad
        gameState.friends.kel.friendship = Math.max(0, gameState.friends.kel.friendship - 2);
        gameState.friends.kath.friendship = Math.max(0, gameState.friends.kath.friendship - 2);

        // exodus_farewell_campervan also advances time by 0.3.
        // Consider if this path should also advance time similarly.
        // If so, add:
        // advanceTime(0.3);
        // The choice of whether to advance time here depends on game pacing design for this specific branch.
    },
    choices: [
        { text: "The campervan drives away. Silence descends.", nextScene: "ground_zero_aftermath" }
    ]
},
    "ground_zero_aftermath": {
        text: () => {
            let melOpening = "";
            if (gameState.friends.mel.trustInPeterTheory > 6 && gameState.friends.mel.friendship > 6) {
                melOpening = "Mel breaks the heavy silence, her voice quiet but intense. 'Well, Peter. That was... something. They're scared, and they've made their choice. It doesn't mean they're right. What it means is that we have fewer variables to consider.'";
            } else if (gameState.friends.mel.friendship > 3) {
                melOpening = "Mel sighs, running a hand through her hair. 'They're gone. All of them. Peter... are you okay? That was brutal.'";
            } else {
                melOpening = "Mel watches you, her expression guarded. 'So. It's just us. What are you thinking, Peter?'";
            }
            return `The sound of the last vehicle fades. The room, or space, feels vast and empty. Only you and Mel remain. The weight of your friends' collective decision presses down.\n\n${melOpening}`;
        },
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "\"I can't believe they actually did it. They abandoned me.\"", nextScene: "gz_discuss_abandonment" },
            { text: "\"So, Mel... you stayed. Why? Do you believe me? Or pity me?\"", nextScene: "gz_discuss_mel_staying" },
            { text: "\"This doesn't change anything. I'm still going to figure this out. We have to.\"", consequence: () => gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty+2), nextScene: "gz_final_hours_planning" }
        ]
    }
};