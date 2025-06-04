// File: js/scenes/scenes_intro.js

import { gameState, advanceTime } from '../game_state.js';

export const introScenes = {
    "start": {
        text: "The familiar thrum of live music fills the Torquay Hotel. You're here with your mates: Mel, John, Andy, Janita, Simone, and Tony. The band, 'The Kite Machine,' is halfway through a surprisingly good cover of a Cold Chisel classic. You take a sip of your beer, feeling a comfortable buzz.", // UPDATED friend names
        onLoad: () => {
            advanceTime(1);
            gameState.currentLocation = "Torquay Hotel";
        },
        choices: [
            { text: "Enjoy the music and the moment.", nextScene: "glitch_observe" },
            { text: "Scan the room, feeling a slight, unplaceable unease.", nextScene: "glitch_observe_uneasy" }
        ]
    },
    "glitch_observe": {
        text: "You focus on the band, nodding along. Suddenly, the lead singer seems to skip, like a scratched CD, repeating the same line twice: '...cheap wine and a three-day growth, growth!' He blinks, shakes his head slightly, and carries on as if nothing happened. None of your friends seem to have noticed.",
        choices: [
            { text: "Shrug it off. Too much beer, maybe?", consequence: () => { gameState.peterSimulationCertainty = Math.max(0, gameState.peterSimulationCertainty - 1); }, nextScene: "post_glitch_initial_chat_mel" },
            { text: "Make a mental note. That was weird.", consequence: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 1); }, nextScene: "post_glitch_initial_chat_mel" },
            { text: "Look around to see if anyone else reacted.", nextScene: "look_around_reaction" }
        ]
    },
    "glitch_observe_uneasy": {
        beforeText: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 1); },
        text: "Your gaze sweeps across the pub, lingering on the flickering neon sign behind the bar, the way the smoke from somewhere seems to hang too perfectly still. Then, your attention snaps to the band. The lead singer stutters, repeating a line: '...cheap wine and a three-day growth, growth!' He recovers quickly, but you definitely saw it. A cold knot forms in your stomach.",
        choices: [
            { text: "It's nothing. Just a tired musician.", consequence: () => { gameState.peterSimulationCertainty = Math.max(0, gameState.peterSimulationCertainty - 1); }, nextScene: "post_glitch_initial_chat_mel" },
            { text: "This feeling... it's getting stronger. That wasn't normal.", consequence: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 2); }, nextScene: "post_glitch_initial_chat_mel" },
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
            let melResponse = "";
            if (gameState.friends.mel.friendship > 5) {
                melResponse = "Mel leans in, shouting over the music. 'Saw what, Pete? The singer nearly choking on his own spit? Nah, missed that bit.' She gives you a curious look. 'You alright?'";
            } else {
                melResponse = "Mel looks at you, a little impatient with the interruption. 'What are you on about, Peter? I'm trying to listen to the song.'";
            }
            return `You turn to Mel. "Did you see that? The singer just glitched out."\n\n${melResponse}`;
        },
        onLoad: () => { advanceTime(0.1); },
        choices: [
            { text: "Never mind, probably just me.", consequence: () => { if (gameState.friends.mel.friendship <= 5) gameState.friends.mel.suspicion++; }, nextScene: "post_glitch_initial_chat_mel" },
            { text: "No, really! He repeated a whole line. It was strange!", consequence: () => { gameState.friends.mel.suspicion++; gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 1); }, nextScene: "post_glitch_initial_chat_mel_defensive" }
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
        text: "Mel frowns slightly. 'Okay, Peter... if you say so. Maybe lay off the heavy beers for a bit?' She doesn't sound entirely convinced, more like humoring you. The band finishes their set.",
        onLoad: () => { advanceTime(0.2); },
        choices: [
            { text: "Right, yeah. Good idea. (Drop it)", nextScene: "pub_aftermath_debrief" },
            { text: "I'm telling you, Mel, something's not right here. (Persist)", consequence: () => { gameState.friends.mel.suspicion = Math.min(10, gameState.friends.mel.suspicion + 2); gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 1); gameState.friends.mel.friendship = Math.max(0, gameState.friends.mel.friendship-1); }, nextScene: "pub_aftermath_debrief" }
        ]
    }
};