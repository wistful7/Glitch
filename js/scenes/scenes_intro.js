// File: js/scenes/scenes_intro.js

import { gameState, advanceTime } from '../game_state.js';

export const introScenes = {
    "start": {
        text: () => {
            // Updated text (Option 2)
            return "Torquay Hotel is jumping. Your mates have assembled: Mel, eyebrow already set to 'skeptical'; John, Andy, in his Fender t-shirt; Yanita, phone out, filming; Simone and Tony - or is that Kath and Kel, ready to flee. 'The Kite Machine' is singing a Cold Chisel classic. Levi, their frontman – a blur of hair,– grabs the mike. 'Torquay!' he roars, 'Dance hard or it's \"Sweet Caroline\" for nine hours straight!' He grins maniacally. A few brave patrons twitch. You sip your beer. It tastes...strange.";
        },
        onLoad: () => {
            advanceTime(1);
            gameState.currentLocation = "Torquay Hotel";
        },
        choices: [
            { text: "Enjoy the music and the moment, or at least pretend to.", nextScene: "glitch_observe" },
            { text: "Scan the room, feeling a slight, unplaceable unease, possibly related to the 'Sweet Caroline' threat.", nextScene: "glitch_observe_uneasy" }
        ]
    },

    // ... rest of your introScenes (glitch_observe, glitch_observe_uneasy, etc.) ...
    // Ensure those scenes follow here as they were defined previously. For example:

    "glitch_observe": {
    text: () => {
            return "You're watching the band when Levi the singer hits a strange snag, stuttering a lyric: '...cheap wine and a three-day, three-day growth, growth!'\n\nOn the second 'growth,' his head snaps around, and for a split second, he stares directly at you. His eyes are blank, his expression gone. A voice—his, but utterly flat and devoid of melody—cuts through the pub noise straight into your head: 'You have 48 hours.'\n\nThen he blinks, and he's back, wailing into the microphone as if he never stopped. You look around, heart pounding, but your friends are completely oblivious.";
        },
        choices: [
            { text: "What was that? A hallucination? Must be the beer...", consequence: () => { gameState.peterSimulationCertainty = Math.max(0, gameState.peterSimulationCertainty - 1); }, nextScene: "post_glitch_initial_chat_mel" },
            { text: "That was a message. That was real. Make a detailed mental note.", consequence: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 2); }, nextScene: "post_glitch_initial_chat_mel" },
            { text: "Immediately turn to Mel. 'You did NOT just see that, did you?'", nextScene: "ask_mel_glitch_initial" }
        ]
    },
    "glitch_observe_uneasy": {
        beforeText: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 1); },
        text: () => {
            return "Your gnawing unease proves justified. The sound of the pub suddenly cuts out, and the singer, Levi, turns from the mike. His eyes are blank as they find yours across the room. A flat, internal voice, using his mouth but not his soul, states clearly: 'The deadline is 48 hours.' The sound immediately returns. Your unease hardens into cold dread. That was a warning.";
        },
        backgroundMusic: "audio/thelake.mp3",
        choices: [
            { text: "It's nothing. Just my mind playing tricks...", consequence: () => { gameState.peterSimulationCertainty = Math.max(0, gameState.peterSimulationCertainty - 1); }, nextScene: "post_glitch_initial_chat_mel" },
            { text: "This feeling... it's real. That was a message.", consequence: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 2); }, nextScene: "post_glitch_initial_chat_mel" },
            { text: "Quietly ask Mel if she saw that.", nextScene: "ask_mel_glitch_initial" }
        ]
    },
        "look_around_reaction": {
        text: "You glance quickly at your friends, then at nearby tables. Everyone seems engrossed in their conversations or the music, oblivious. It makes the moment feel even stranger, more isolated.",
        onLoad: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 1); },
        choices: [
            { text: "Okay, definitely weird. Say something to Mel.", nextScene: "ask_mel_glitch_initial" },
            { text: "Maybe it's best to keep quiet for now.", nextScene: "post_glitch_initial_chat_mel" }
        ]
    },
    "ask_mel_glitch_initial": {
        text: () => {
            const peterLine = "You grab Mel's arm, your voice tight with adrenaline. 'Mel. The singer. He stopped. He looked right at me and said something.'";
            let melResponse = "";

            if (gameState.friends.mel.friendship > 5) {
                melResponse = "Mel leans closer, shouting over the music. 'He spoke to you? Mid-song? So now you're the star of the show! While flattering, it seems statistically unlikely.'";
            } else {
                melResponse = "Mel pulls a face. 'Looked at you? Peter, he's a singer on a stage, he looks at everyone.'";
            }
            return `${peterLine}\n\n${melResponse}`;
        },
        onLoad: () => {
            advanceTime(0.1);
        },
        choices: [
            {
                text: "\"You're right... it was nothing. Just the lights playing tricks.\"",
                consequence: () => { 
                    // If Mel is already skeptical, backing down makes Peter seem more erratic.
                    if (gameState.friends.mel.friendship <= 5) gameState.friends.mel.suspicion++; 
                },
                nextScene: "post_glitch_initial_chat_mel"
            },
            {
                text: "\"No, I'm serious, Mel! He looked at me and said, 'You have 48 hours!'\"",
                consequence: () => {
                    // Making such a wild claim increases her suspicion more significantly.
                    gameState.friends.mel.suspicion = Math.min(10, gameState.friends.mel.suspicion + 3);
                    gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 2);
                    gameState.melKnowsAboutDeadline = true;
                },
                nextScene: "post_glitch_initial_chat_mel_defensive"
            }
        ]
    },
    "post_glitch_initial_chat_mel": {
        text: "The band finishes the song to enthusiastic applause. The moment of strangeness hangs in your mind, but the pub atmosphere quickly returns to normal. Mel raises her glass, 'Good set, eh?'",
        onLoad: () => { advanceTime(0.2); },
        choices: [
            { text: "Yeah, not bad at all! (Try to act normal)", nextScene: "pub_aftermath_debrief" },
            { text: "Actually, Mel, about that singer...", consequence: () => { gameState.friends.mel.suspicion = Math.min(10, gameState.friends.mel.suspicion + 1); }, nextScene: "pub_aftermath_debrief" }
        ]
    },
    "post_glitch_initial_chat_mel_defensive": {
        text: "Mel frowns slightly. 'He said you have 48 hours'... Okay, Peter. Right. Look, I think you've had one too many pints, or maybe you're in an X Files script.' She doesn't sound entirely convinced, more like humoring you.",
        onLoad: () => { advanceTime(0.2); },
        choices: [
            { text: "Right, yeah. Mulder flashback. (Drop it)", nextScene: "pub_aftermath_debrief" },
            { text: "I'm telling you, Mel, something's not right here. (Persist)", consequence: () => { gameState.friends.mel.suspicion = Math.min(10, gameState.friends.mel.suspicion + 2); gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 1); gameState.friends.mel.friendship = Math.max(0, gameState.friends.mel.friendship-1); }, nextScene: "pub_aftermath_debrief" }
        ]
    }
};