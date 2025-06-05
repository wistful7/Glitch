// File: js/scenes/scenes_intro.js

import { gameState, advanceTime } from '../game_state.js';

export const introScenes = {
    "start": {
        text: () => {
            // Updated text (Option 2)
            return "Torquay Hotel is jumping. Your mates have assembled: Mel, eyebrow already set to 'skeptical'; John, having miraculously navigated his hearse to a screeching halt; Andy, in his possibly sentient Fender t-shirt; Janita, phone out, filming the unfolding drama for posterity; Simone; and Tony, ready to flee. 'The Kite Machine' concludes a valiant assault on a Cold Chisel classic. Levi, their frontman – a blur of hair and misplaced confidence – grabs the mike. 'Right, Torquay!' he yelps, 'Dance hard or it's \"Sweet Caroline\" for nine hours straight!' He grins maniacally. A few brave patrons twitch. You sip your beer. It's... beer-adjacent.";
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
            let scene_text = "You attempt to focus on the band, nodding with what you hope passes for rhythmic appreciation. Suddenly, the lead singer, Levi, mid-power-ballad-squall, seems to... skip. Not in a jaunty, hop-like fashion, but more like a corrupted audio file or a particularly stubborn AI refusing to compute the concept of 'subtlety'. He repeats the same line twice: '...cheap wine and a three-day growth, growth!' He blinks, a look of profound bafflement momentarily replacing the rock-god intensity, shakes his head as if dislodging a bewildered moth, and carries on. ";
            scene_text += "Remarkably, none of your friends, currently engrossed in their own existential crises or the bottom of their glasses, seem to have noticed this blatant affront to the laws of linear time.";
            return scene_text;
        },
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
                melResponse = "Mel leans in, shouting over the renewed musical onslaught. 'Saw what, Pete? The existential dread in the guitarist's eyes? Or did Levi just spontaneously combust and I missed it? Terribly inconvenient if he has, the set's not over.' She gives you a curious, slightly amused look. 'You alright, or has the cheap wine finally achieved sentience?'";
            } else {
                melResponse = "Mel turns, her expression one of carefully curated patience usually reserved for explaining offside rules to particularly dense spaniels. 'What are you on about, Peter? I'm trying to ascertain if the drummer is using actual rhythm or just hitting things in a sequence that vaguely resembles it. It's quite the conundrum.'";
            }
            return `You turn to Mel. "Did you see that? The singer just... hiccuped. In time. Twice."\n\n${melResponse}`;
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