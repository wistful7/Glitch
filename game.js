const storyTextElement = document.getElementById('story-text');
const choicesContainer = document.getElementById('choices-container');
const timeDisplay = document.getElementById('time-display');
const certaintyDisplay = document.getElementById('certainty-display');
const friendStatusContainer = document.getElementById('friend-status-container');

let gameState = {
    currentTime: 0, // Hours passed
    peterSimulationCertainty: 1, // Scale of 0-10 (0: None, 10: Utterly Convinced)
    playerNoticedSpecificAnomaly: false, // Flag for Peter noticing something concrete
    previousAnomaly: null, // To store type of anomaly if needed for conditional choices
    currentLocation: "Torquay Hotel", // To keep track of where Peter is
    friends: {
        mel: { name: "Mysterious Mel", friendship: 7, suspicion: 1, trustInPeterTheory: 0, present: true },
        john: { name: "Where Is John (Crossy)", friendship: 7, suspicion: 1, present: true },
        neil: { name: "Neil Young (Andy)", friendship: 7, suspicion: 1, present: true },
        carrot: { name: "Carrot Cake (Janita)", friendship: 7, suspicion: 1, present: true },
        kath: { name: "Kath (Simone)", friendship: 7, suspicion: 1, present: true },
        kel: { name: "Kel (Tony)", friendship: 7, suspicion: 1, present: true }
    },
    currentSceneId: "start",
    dogMentioned: false // for Mel's dog Charlie
};

const scenes = {
    "start": {
        text: "The familiar thrum of live music fills the Torquay Hotel. You're here with your mates: Mel, Crossy, Andy, Janita, Kath, and Tony. The band, 'The Kite Machine,' is halfway through a surprisingly good cover of a Cold Chisel classic. You take a sip of your beer, feeling a comfortable buzz.", // Changed band name
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
    },

    // ---- SECTION: "The Shifting Lens" (Peter & Mel focus) ----
    // These scenes are now explicitly included in full.
    "pub_aftermath_debrief": {
        text: () => {
            let introText = "The crowd noise drops a notch as 'The Kite Machine' take a break. "; // Band name updated
            if (gameState.friends.mel.suspicion > 2) {
                introText += "Mel is nursing her drink, her earlier dismissiveness now tinged with a thoughtful, almost wary, expression as she watches you. The air between you feels charged.";
            } else {
                introText += "Mel sips her drink, giving you an expectant look. 'So, what's next on the agenda, Mulder? Still pondering that 'glitch'?' she asks, a slight teasing tone in her voice.";
            }
            return introText;
        },
        onLoad: () => {
            advanceTime(0.3);
            gameState.currentLocation = "Torquay Hotel";
        },
        choices: [
            {
                text: "\"Mel, seriously. That wasn't just a singer messing up. What did *you* really think?\" (Direct Approach)",
                nextScene: "pub_direct_approach_mel",
                consequence: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 1); }
            },
            {
                text: "\"Alright, forget the singer. Just... look around. Doesn't anything else feel 'off'?\" (Observational Approach)",
                nextScene: "pub_observational_approach",
                consequence: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 1); }
            },
            {
                text: "\"Can we step outside? Get some air, talk this through properly?\" (Appeal to Partnership)",
                nextScene: "esplanade_confidential_intro",
                consequence: () => { gameState.friends.mel.friendship = Math.min(10, gameState.friends.mel.friendship + 1); }
            }
        ]
    },
    "pub_direct_approach_mel": {
        text: () => {
            let melResponse = "Mel considers your words, tapping her finger on her glass. 'Peter, \"tear in the fabric\" is a bit dramatic, even for you. It was unusual, I'll grant you that. My 'real thought' is that there are layers to things. Sometimes what looks like a simple explanation...' she trails off, looking at something distant, '...isn't the whole story. But that doesn't automatically mean we're in a computer program.'";
            if (gameState.friends.mel.trustInPeterTheory > 1) {
                melResponse += "\nShe leans in slightly. 'But... if you noticed something specific, something tangible beyond the singer's hiccup, I'm willing to listen.'";
            } else {
                melResponse += "\nShe raises an eyebrow. 'So, enlighten me. What other profound anomalies have you detected between the beer nuts and the bad lighting?'";
            }
            return melResponse;
        },
        choices: [
            {
                text: "\"It's the *feeling*, Mel. The way things just... repeat or go slightly wrong.\"",
                nextScene: "pub_discussion_deepens",
                consequence: () => { gameState.friends.mel.suspicion = Math.min(10, gameState.friends.mel.suspicion + 1); }
            },
            {
                text: "\"Okay, okay, maybe I'm overthinking it. What do you suggest?\" (Back down slightly)",
                nextScene: "pub_mel_suggests",
                consequence: () => { gameState.peterSimulationCertainty = Math.max(0, gameState.peterSimulationCertainty -1); gameState.friends.mel.friendship = Math.min(10, gameState.friends.mel.friendship + 1); }
            },
            {
                text: () => `"${gameState.playerNoticedSpecificAnomaly ? `Remember that ${gameState.previousAnomaly === 'repetitive_conversation' ? 'repetitive talk' : 'odd bartender behaviour'}?` : 'If I spot something concrete...'} No one else reacted!"`,
                condition: () => gameState.playerNoticedSpecificAnomaly,
                nextScene: () => gameState.previousAnomaly === 'repetitive_conversation' ? "pub_discuss_specific_anomaly" : "pub_discuss_specific_anomaly_bartender",
            }
        ]
    },
    "pub_observational_approach": {
        text: "You scan the room intently. The chatter, the clinking glasses, the low hum of the coolers. Mel watches you, a mixture of amusement and... something else? Patience? \n'And what exactly are you hoping to find?' she asks. 'The source code in your beer nuts? Fine, Peter. Observe. I'll 'observe' you observing. Just try not to make a scene.'",
        choices: [
            {
                text: "Focus on a nearby table where a conversation seems a bit too repetitive.",
                nextScene: "observe_repetitive_conversation",
                consequence: () => { advanceTime(0.2); }
            },
            {
                text: "Watch the bar staff. See if their movements seem 'scripted'.",
                nextScene: "observe_bar_staff",
                consequence: () => { advanceTime(0.2); }
            },
            {
                text: "\"You're right, this is silly. Let's just enjoy the music when it starts again.\"",
                nextScene: "pub_mel_suggests",
                consequence: () => { gameState.peterSimulationCertainty = Math.max(0, gameState.peterSimulationCertainty - 1); }
            }
        ]
    },
    "observe_repetitive_conversation": {
        text: "You subtly listen in on a nearby table. A group is laughing, and one of them tells a short punchline. A few moments later, you hear the *exact* same intonation, the same punchline, the same burst of laughter. It's brief, and could be a coincidence, but it prickles your skin.",
        onLoad: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 2); gameState.playerNoticedSpecificAnomaly = true; gameState.previousAnomaly = "repetitive_conversation"; },
        choices: [
            {
                text: "\"Mel! Did you hear that? That table over there...\"",
                nextScene: "pub_discuss_specific_anomaly",
                consequence: () => { gameState.friends.mel.suspicion = Math.min(10, gameState.friends.mel.suspicion + 1); }
            },
            {
                text: "Keep it to yourself for now. Gather more data.",
                nextScene: "pub_observational_approach_continued"
            }
        ]
    },
    "observe_bar_staff": {
        text: "You watch one of the bartenders. He wipes the counter, serves a beer, takes payment, gives change... then moves to the other end, wipes the counter, serves a beer, takes payment, gives change. It's efficient, sure, but is it *too* perfect? Too looped? Probably just a busy night.",
        onLoad: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 1); gameState.playerNoticedSpecificAnomaly = true; gameState.previousAnomaly = "bartender_loop";},
        choices: [
            {
                text: "\"Mel, look at that bartender. It's like he's on a short loop.\"",
                nextScene: "pub_discuss_specific_anomaly_bartender",
                consequence: () => { gameState.friends.mel.suspicion = Math.min(10, gameState.friends.mel.suspicion + 1); }
            },
            {
                text: "Nah, probably just efficient. Look for something else.",
                nextScene: "pub_observational_approach_continued"
            }
        ]
    },
    "pub_discuss_specific_anomaly": {
        text: () => {
            let melResponse = "Mel discreetly glances at the table you indicated. 'What about them, Peter? Seemed like typical pub chatter to me.'";
            if (gameState.friends.mel.trustInPeterTheory > 2) {
                melResponse += " She lowers her voice. 'But if you're sure... describe exactly what you heard. Every detail.'";
                gameState.friends.mel.trustInPeterTheory = Math.min(10, gameState.friends.mel.trustInPeterTheory + 1);
            } else {
                melResponse += " Her skepticism is evident. 'You're not going to tell me their conversation is evidence of a system-wide error, are you?'";
                gameState.friends.mel.suspicion = Math.min(10, gameState.friends.mel.suspicion +1);
            }
            return `You explain what you observed about the repetitive conversation.\n${melResponse}`;
        },
        choices: [
            { text: "Insist it was a clear repetition, a glitch.", nextScene: "pub_mel_ponders_anomaly" },
            { text: "Downplay it: \"Maybe it was nothing. Just sounded odd.\"", consequence: () => { gameState.peterSimulationCertainty--; gameState.playerNoticedSpecificAnomaly = false;}, nextScene: "pub_mel_suggests" }
        ]
    },
    "pub_discuss_specific_anomaly_bartender": {
        text: () => {
            let melResponse = "Mel watches the bartender for a moment. 'He looks busy, Peter. Efficient. That's what good bartenders do.'";
            if (gameState.friends.mel.trustInPeterTheory > 1 && gameState.friends.mel.friendship > 5) {
                melResponse += " She adds, more quietly, 'But... the way he polishes those glasses... there is a certain rhythm to it, isn't there? Almost too perfect.'";
                gameState.friends.mel.trustInPeterTheory = Math.min(10, gameState.friends.mel.trustInPeterTheory + 1);
            } else {
                melResponse += " 'Are you sure you're not just looking for patterns where there aren't any?'";
                gameState.friends.mel.suspicion = Math.min(10, gameState.friends.mel.suspicion +1);
            }
            return `You point out the bartender's seemingly looped actions.\n${melResponse}`;
        },
        choices: [
            { text: "Yes, it's too robotic, too precise!", nextScene: "pub_mel_ponders_anomaly" },
            { text: "\"You're right, probably just a pro at his job.\"", consequence: () => { gameState.peterSimulationCertainty--; gameState.playerNoticedSpecificAnomaly = false; }, nextScene: "pub_mel_suggests" }
        ]
    },
    "pub_mel_ponders_anomaly": {
        text: () => {
            let melText = "Mel is quiet for a moment, observing. 'Alright, Peter. Let's say, for the sake of argument, that you *did* observe a minor... inconsistency.'";
            if (gameState.friends.mel.trustInPeterTheory > 3) {
                melText += " 'What's your grand theory? And more importantly, what do you propose we *do* about it, right here, right now?' Her tone is serious, almost challenging, but with an undercurrent of genuine curiosity."
            } else {
                melText += " 'It's still a massive leap to 'simulation gone wrong'. But I'm... intrigued by your conviction.' She sounds like she's humouring a child, but her eyes are sharp."
            }
            return melText;
        },
        choices: [
            { text: "\"We need to find more proof! More glitches!\"", nextScene: "pub_observational_approach_continued" },
            { text: "\"We should talk to the others, see if they've noticed anything!\"", nextScene: "talk_to_other_friends_intro" },
            { text: "\"Maybe we should just get out of here. Go somewhere else.\"", nextScene: "suggest_leaving_pub" }
        ]
    },
    "pub_observational_approach_continued": {
        text: "You decide to keep observing, the feeling of unease growing. Mel stays with you, sometimes making small talk, sometimes just watching you watch the world. The pub atmosphere continues around you, a strange mix of the mundane and, to you, the deeply suspicious.",
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "After a while, suggest stepping out for air with Mel.", nextScene: "esplanade_confidential_intro" },
            { text: "Try to subtly involve another friend in your observations.", nextScene: "talk_to_other_friends_intro"},
            { text: "Decide to call it a night at the pub.", nextScene: "leaving_pub_options" }
        ]
    },
    "pub_mel_suggests": {
        text: "Mel nods slowly. 'Okay. Look, Peter, it's been a long week. Maybe we're both a bit tired. The band's about to start their next set. How about we just try to enjoy it? Or, if you're really not feeling this place anymore, we could call it a night soon.'",
        onLoad: () => { advanceTime(0.2); },
        choices: [
            { text: "\"You're right. Let's listen to the music.\"", nextScene: "listen_to_music_phase2_intro" },
            { text: "\"Actually, some fresh air sounds good. Fancy a walk along the Esplanade?\"", nextScene: "esplanade_confidential_intro" },
            { text: "\"Yeah, maybe I should head home soon.\"", nextScene: "leaving_pub_options" }
        ]
    },
    "esplanade_confidential_intro": {
        text: "Mel agrees, and you both step out of the Torquay Hotel into the cool night air. The Esplanade is quieter, with the rhythmic sound of waves crashing nearby. The change of scenery feels significant.",
        onLoad: () => {
            advanceTime(0.2);
            gameState.currentLocation = "Esplanade";
        },
        choices: [
            { text: "Start by explaining your simulation theory more calmly.", nextScene: "esplanade_explain_theory" },
            { text: "Ask Mel directly if she's ever felt like things aren't quite real.", nextScene: "esplanade_ask_mel_direct" }
        ]
    },
    "esplanade_explain_theory": {
        text: "You take a deep breath of the sea air. 'Okay, Mel. I know it sounds wild, but this feeling... it's not just tonight. It's like we're all just characters in a story someone else is writing, and the story is starting to unravel. Those glitches? They're like typos in the script.' You try to keep your voice even, persuasive.",
        choices: [
            { text: "Watch her reaction closely.", nextScene: "esplanade_mel_reacts_theory" }
        ]
    },
    "esplanade_ask_mel_direct": {
        text: "You look at Mel, the streetlights casting shadows on her face. 'Mel, be honest with me. Have you ever felt... detached? Like none of this is completely real? Or that you're just going through motions someone else decided for you?'",
        choices: [
            { text: "Await her answer, bracing yourself.", nextScene: "esplanade_mel_reacts_direct_question" }
        ]
    },
    "esplanade_mel_reacts_theory": {
        text: () => {
            let response = "Mel listens intently, her expression unreadable for a moment. She looks out at the dark ocean. 'A story someone else is writing...' she repeats softly. ";
            if (gameState.friends.mel.trustInPeterTheory > 2 || gameState.friends.mel.friendship > 6) {
                response += "'And what if,' she says, her voice barely above a whisper, 'some of the characters *want* the story to end, Peter? Or want to write their own chapter?' She quickly glances at you. 'Hypothetically speaking, of course. If one were to entertain such a wild notion.'";
                gameState.friends.mel.trustInPeterTheory = Math.min(10, gameState.friends.mel.trustInPeterTheory + 2);
            } else {
                response += "'That's a very... creative way of looking at things, Peter.' She offers a small, tight smile. 'But it sounds more like an existential crisis than a system glitch. Are you sure you're okay?'";
                gameState.friends.mel.suspicion = Math.min(10, gameState.friends.mel.suspicion + 1);
            }
            return response;
        },
        onLoad: () => { advanceTime(0.3); },
        choices: [
            { text: "\"Are you saying you feel it too, Mel? That you want out?\"", condition: () => gameState.friends.mel.trustInPeterTheory > 3, nextScene: "esplanade_mel_confides_hint" },
            { text: "\"Hypothetically... what would make a character want that?\"", nextScene: "esplanade_discuss_hypothetical" },
            { text: "\"Maybe it is just an existential crisis. But it feels so real.\"", consequence: () => { gameState.peterSimulationCertainty--; }, nextScene: "esplanade_mel_offers_comfort" }
        ]
    },
    "esplanade_mel_reacts_direct_question": {
        text: () => {
            let response = "Mel turns from the ocean, her eyes searching yours. 'That's a heavy question, Peter.' ";
            if (gameState.friends.mel.trustInPeterTheory > 1 && gameState.friends.mel.friendship > 5) {
                response += "She hesitates. 'There are times... when the world feels less like a home and more like a well-decorated cage. Moments when I've wondered if there's something... beyond the horizon we're allowed to see.' She shrugs, a little too casually. 'But feelings are just feelings, right? Not evidence.'";
                gameState.friends.mel.trustInPeterTheory = Math.min(10, gameState.friends.mel.trustInPeterTheory + 2);
            } else {
                response += "'Everyone feels detached sometimes. It's part of being human. Doesn't mean the universe is broken.' She sounds reassuring, but also a little distant.";
                gameState.friends.mel.suspicion = Math.min(10, gameState.friends.mel.suspicion + 1);
            }
            return response;
        },
        onLoad: () => { advanceTime(0.3); },
        choices: [
            { text: "\"A cage? So you *do* feel trapped!\"", condition: () => gameState.friends.mel.trustInPeterTheory > 2, nextScene: "esplanade_mel_confides_hint" },
            { text: "\"What kind of things make you feel that way?\"", nextScene: "esplanade_discuss_hypothetical" },
            { text: "\"Yeah, you're right. Just feelings. Thanks, Mel.\"", consequence: () => { gameState.peterSimulationCertainty--; }, nextScene: "esplanade_mel_offers_comfort" }
        ]
    },
    "esplanade_mel_confides_hint": {
        text: "Mel looks around, as if checking they're truly alone. 'Let's just say, Peter, that I believe in keeping an open mind. And if there *was* a way to... verify things... or to ensure one's own autonomy in a system that felt predetermined... I'd consider it.' She meets your gaze directly. 'But it would have to be smart. Careful. Not just... shouting about glitches in a pub.'",
        onLoad: () => { gameState.friends.mel.trustInPeterTheory = Math.min(10, gameState.friends.mel.trustInPeterTheory + 2); gameState.friends.mel.friendship = Math.min(10, gameState.friends.mel.friendship +1); },
        choices: [
            { text: "\"So you'll help me? We can figure this out together!\"", nextScene: "esplanade_mel_cautious_ally" },
            { text: "\"What do you mean, 'careful'? What are you not telling me?\"", nextScene: "esplanade_mel_secretive" },
            { text: "\"I understand. Smart and careful. I can do that.\"", nextScene: "esplanade_mel_cautious_ally" }
        ]
    },
    "esplanade_discuss_hypothetical": {
        text: "Mel turns back to the ocean. 'Hypothetically? Maybe a character gets tired of their lines. Maybe they see the edges of the set. Or maybe they just dream of a different story.' She sighs. 'But dreams aren't maps, Peter. And this is Torquay, not the Twilight Zone. As far as we know.'",
        choices: [
            { text: "\"But what if it *is* like the Twilight Zone, just for us?\"", nextScene: "esplanade_peter_persists_twilight" },
            { text: "\"You have a very poetic way of looking at things, Mel.\"", consequence: () => { gameState.friends.mel.friendship++; }, nextScene: "the_return_or_departure_esplanade" },
            { text: "\"Okay, okay. Point taken. Let's talk about something else.\"", nextScene: "the_return_or_departure_esplanade" }
        ]
    },
    "esplanade_mel_offers_comfort": { // Mel mentions her dog Charlie here
        text: () => {
            let charlieMention = "";
            if (!gameState.dogMentioned) {
                charlieMention = "Sometimes when things get too much, I just focus on walking Charlie. My dog, you know? Simple things. He just cares about walks and treats, not... cosmic conspiracies.";
                gameState.dogMentioned = true;
            }
            return `Mel puts a comforting hand on your arm. 'Hey. It's okay to feel overwhelmed. ${charlieMention} There's a lot going on in the world, even without adding weird glitches.' She smiles gently. 'How about we head back? Or I can walk you home if you want to call it a night?'`;
        },
        choices: [
            { text: "\"Thanks, Mel. Maybe heading back isn't a bad idea.\"", nextScene: "the_return_or_departure_esplanade" },
            { text: "\"Yeah, a walk home sounds good. My head's spinning a bit.\"", nextScene: "walk_home_with_mel_intro" }
        ]
    },
    "esplanade_mel_cautious_ally": {
        text: "Mel nods slowly. 'I'll... keep an open mind, Peter. And I'll listen. If you find something concrete, something verifiable, then we can talk about what it means. But you need to be rational about this. No jumping to conclusions. Deal?'",
        choices: [
            { text: "\"Deal! Thank you, Mel. This means a lot.\"", consequence: () => { gameState.friends.mel.friendship = Math.min(10, gameState.friends.mel.friendship+2); gameState.friends.mel.trustInPeterTheory = Math.min(10, gameState.friends.mel.trustInPeterTheory+1);}, nextScene: "the_return_or_departure_esplanade"},
            { text: "\"Rational? Mel, the world is glitching! But okay, I'll try.\"", nextScene: "the_return_or_departure_esplanade"}
        ]
    },
    "esplanade_mel_secretive": {
        text: "Mel gives a slight shake of her head. 'Just that if things *were* as strange as you imagine, rushing in blindly wouldn't help anyone. It would just attract unwanted attention.' She looks pointedly towards the pub. 'Let's just say some systems have... antibodies.'",
        choices: [
            { text: "\"Antibodies? What does that mean?\"", nextScene: "esplanade_peter_persists_twilight" },
            { text: "\"Okay, I get it. We need to be smart. So what's our next move?\"", nextScene: "esplanade_mel_cautious_ally"}
        ]
    },
    "esplanade_peter_persists_twilight": {
        text: "You press Mel further about her cryptic comments or the 'Twilight Zone' comparison. She deflects, her Scully-mode reasserting itself. 'Peter, I'm speaking in metaphors. Don't read too much into it. It's late, we're probably both tired. Let's just decide what we're doing for the rest of the night.'",
        choices: [
            { text: "Agree to head back or decide what to do next.", nextScene: "the_return_or_departure_esplanade"}
        ]
    },
    "the_return_or_departure_esplanade": {
        text: "The conversation on the Esplanade hangs in the air. The sound of the waves seems to echo the strangeness of it all.",
        onLoad: () => { advanceTime(0.2); },
        choices: [
            { text: "Suggest heading back to the pub.", nextScene: "return_to_pub_after_esplanade" },
            { text: "\"Want to grab a coffee at that late-night place? Clear our heads?\"", nextScene: "suggest_latenight_cafe" },
            { text: "\"I think I should call it a night. Too much to process.\"", nextScene: "leaving_pub_options" }
        ]
    },

    // ---- SECTION: "The Intervention and Exodus" ----
    "talk_to_other_friends_intro": {
        text: () => {
            let melConcern = "";
            if (gameState.friends.mel.trustInPeterTheory > 3 || gameState.friends.mel.friendship > 6) {
                melConcern = "Mel gives you a supportive but worried glance. 'Be careful, Peter. They seem... on edge.'";
            } else {
                melConcern = "Mel watches you approach the others, her expression carefully neutral.";
            }
            let janitaOffer = "Janita (Carrot Cake) nervously fiddles with a container. 'Oh, Peter, Mel... before things get too serious, I brought some of my carrot cake. If anyone wants to try a piece later? It's a new recipe.'"; // Janita's carrot cake
            return `You decide it's time to talk to the others, or perhaps they've decided it's time to talk to you. ${janitaOffer} The air feels thick with unspoken words. ${melConcern} You find John (Crossy) and Kath (Simone) exchanging a serious look. They motion for you and Mel to join them, and soon Neil (Andy), Janita, and Kel (Tony) are gathered.`;
        },
        onLoad: () => {
            advanceTime(0.5);
            gameState.currentLocation = "Intervention Point (e.g., Crossy's Lounge)";
        },
        choices: [
            { text: "\"Alright, what's going on? You all look like you've seen a ghost.\"", nextScene: "intervention_confrontation" },
            { text: "Wait for them to speak, bracing yourself.", nextScene: "intervention_confrontation" }
        ]
    },
    "intervention_confrontation": {
        text: () => {
            return "Kath (Simone) steps forward, her arms crossed. 'Peter, Mel. Thanks for... joining us. This isn't easy, but we all agreed we need to talk. Openly.'\n\nJohn (Crossy) nods, looking unusually grim. 'It's about these... things that have been happening, mate. The glitches, the weirdness. And... well, you, Peter.'";
        },
        choices: [
            { text: "\"Me? What are you talking about?\"", nextScene: "intervention_accusation_begins" },
            { text: "\"I know things have been strange. That's what I've been trying to tell you!\"", nextScene: "intervention_accusation_begins", consequence: () => gameState.peterSimulationCertainty++ }
        ]
    },
    "intervention_accusation_begins": {
        text: () => {
            let JanitaText = "Janita (Carrot Cake) speaks up, her voice trembling slightly. 'Peter, I'm scared. Every time something really odd happens, you're right there. It feels... it feels connected to you.'";
            let AndyText = "Neil (Andy) adds, more softly, 'Maybe I've just had one too many wines tonight, Peter, but it really does feel like the strangeness follows you. It's like the background radiation of weirdness just spikes whenever you get worked up about something.'"; // Andy's wine comment
            let JohnText = "John (Crossy) jumps in, 'It's not just the big stuff, Pete. It's little things. You ever talk to Tatiana at the surf club? Feels like her dialogue tree's got three branches, max. Classic NPC, that one. The point is, the whole vibe gets screwy around you.'"; // John on Tatiana
            return `${JanitaText}\n\n${AndyText}\n\n${JohnText}\n\nKath continues, 'We've discussed it. A lot. And we've come to a difficult conclusion, Peter. We think you're the reason this is all happening. You're somehow... the cause, or an anchor for this simulation's instability.'`;
        },
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "\"That's insane! I'm trying to figure out what's wrong, not cause it!\" (Denial)", nextScene: "intervention_peters_denial" },
            { text: "\"You think *I'm* the problem? After everything we've been through?\" (Betrayal)", nextScene: "intervention_peters_betrayal" },
            { text: "Listen silently, trying to process what they're saying.", nextScene: "intervention_friends_explain_further" }
        ]
    },
    "intervention_peters_denial": {
        text: "Your denial hangs in the air. Crossy shakes his head. 'We're not saying you're doing it on purpose, mate. But the pattern is undeniable.' Kel (Tony) chimes in, 'Look, Peter, we're not here to point fingers just to be mean. We're trying to find a solution.'",
        onLoad: () => {
            gameState.friends.john.friendship = Math.max(0, gameState.friends.john.friendship -1);
            gameState.friends.kel.friendship = Math.max(0, gameState.friends.kel.friendship -1);
        },
        choices: [
            { text: "Attempt to reason with them about your own theories.", nextScene: "intervention_peter_explains_his_side" },
            { text: "\"A solution? What kind of solution involves blaming me?\"", nextScene: "intervention_friends_explain_further" }
        ]
    },
    "intervention_peters_betrayal": {
        text: "A hurt silence follows your words. Janita looks close to tears. 'It's not about blame, Peter,' Neil says gently. 'It's about observation. And frankly, self-preservation. For all of us.'",
        onLoad: () => {
            gameState.friends.neil.friendship = Math.max(0, gameState.friends.neil.friendship -1);
            gameState.friends.carrot.friendship = Math.max(0, gameState.friends.carrot.friendship -1);
        },
        choices: [
            { text: "\"Self-preservation? What are you planning?\"", nextScene: "intervention_friends_reveal_plan" },
            { text: "Look to Mel for support.", nextScene: "intervention_mel_checkpoint" }
        ]
    },
    "intervention_friends_explain_further": {
        text: "Kath elaborates, 'Our hypothesis, Peter, is that your strong... perceptions, your focus on anomalies, somehow destabilizes the local environment. Or, you are a key variable that the simulation is struggling to process. If you're removed from the equation, or at least distanced, the system might stabilize, or even collapse, freeing everyone.'",
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
        text: "You make a heartfelt plea, reminding them of your friendships, the good times, urging them to reconsider their drastic plan. Some look away, affected, but Kath and Tony exchange a resolute glance.",
        choices: [
            { text: "Wait for their final decision.", nextScene: "intervention_friends_reveal_plan" }
        ]
    },
    "intervention_friends_reveal_plan": {
        text: "Kel (Tony) finally speaks, his voice practical. 'Look, Peter. We've already made up our minds. We're not doing this to hurt you. We're doing this because we feel we have no other choice. For the simulation to collapse, or at least for us to get out of this... this localized distortion field around you, we think we all need to go away. Leave you. Completely alone.'\n\nCrossy adds, 'If you're the anchor, Peter, then with no ships tied to you... maybe the harbor itself disappears.'",
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "\"Alone? You're all just going to... leave?\"", nextScene: "exodus_ubers_setup" },
            { text: "Look at Mel, a desperate appeal in your eyes.", nextScene: "exodus_ubers_setup" }
        ]
    },
    "exodus_ubers_setup": {
        text: "The finality in their voices is chilling. John (Crossy), Neil (Andy), and Janita (Carrot Cake) start checking their phones. 'Our rides are on the way,' Crossy mutters, not meeting your eye.",
        choices: [
            { text: "Say something to Crossy before he leaves.", nextScene: "exodus_farewell_crossy" },
            { text: "Watch them, a knot of anger and despair tightening in your chest.", nextScene: "exodus_campervan_setup" }
        ]
    },
    "exodus_farewell_crossy": {
        text: "You try to say something to Crossy, a mix of anger and pleading. He just shakes his head. 'Sorry mate. Hope you get it sorted.' He turns as his Uber pulls up.",
        onLoad: () => {
            gameState.friends.john.present = false;
            gameState.friends.john.friendship -= 2;
            advanceTime(0.1);
        },
        choices: [
            { text: "Let him go. Turn to Neil and Janita.", nextScene: "exodus_farewell_neil_janita" }
        ]
    },
    "exodus_farewell_neil_janita": {
        text: "Neil gives a sad shrug. 'Maybe we'll see you on the other side, Peter. If there is one.' Janita is openly crying. 'I'll miss our music nights,' she whispers, before they both hurry to their ride. 'And the carrot cake...' she adds, a small, sad afterthought.",
        onLoad: () => {
            gameState.friends.neil.present = false;
            gameState.friends.carrot.present = false;
            gameState.friends.neil.friendship -=1;
            gameState.friends.carrot.friendship -=1;
            advanceTime(0.2);
        },
        choices: [
            { text: "They're gone. Now it's Tony and Kath.", nextScene: "exodus_campervan_setup" }
        ]
    },
    "exodus_campervan_setup": {
        text: "With a finality that chills you, John, Neil, and Janita leave. Kel (Tony) and Kath (Simone) head towards the door. 'Our camper's out front,' Kath says. 'We packed light. Figured it's best.'",
        onLoad: () => {
            gameState.friends.john.present = false;
            gameState.friends.neil.present = false;
            gameState.friends.carrot.present = false;
        },
        choices: [
            { text: "\"You too? You're really all doing this?\"", nextScene: "exodus_farewell_campervan" },
            { text: "Look at Mel. Is she leaving too?", nextScene: "exodus_mel_stays_check" }
        ]
    },
    "exodus_farewell_campervan": {
        text: "Tony claps you on the shoulder, a gesture that feels more like a goodbye than reassurance. 'It's for the best, Pete. For everyone.' Kath offers a small, sad smile. 'Maybe... maybe this will work. We hope so.' They turn and leave, the sound of their campervan starting up a moment later and fading into the distance.",
        onLoad: () => {
            gameState.friends.kel.present = false;
            gameState.friends.kath.present = false;
            gameState.friends.kel.friendship -= 2;
            gameState.friends.kath.friendship -= 2;
            advanceTime(0.3);
        },
        choices: [
            { text: "They're all gone. It's just you and Mel.", nextScene: "ground_zero_aftermath" }
        ]
    },
    "exodus_mel_stays_check": {
        text: () => {
            let melResponse = "";
            if (gameState.friends.mel.trustInPeterTheory > 4 && gameState.friends.mel.friendship > 4) {
                melResponse = "Mel meets your gaze, her own filled with a complex mix of sorrow and resolve. She shakes her head slightly. 'No, Peter. I'm not going with them. Their theory... it's one possibility. I'm not convinced it's the only one, or the right one.'";
            } else {
                melResponse = "Mel looks down, then back at you, her face etched with worry. 'I... I don't know what to think, Peter. But no, I'm not leaving. Not like this.'";
                gameState.friends.mel.friendship++;
            }
            return `As Tony and Kath leave, your eyes lock with Mel's. ${melResponse}`;
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
    },

    // ---- FINAL ACT: The Last Hours & The Twist ----
    "gz_discuss_abandonment": {
        text: "You voice your despair and anger at being abandoned. Mel listens patiently. 'It's a heavy blow, Peter. Feeling alone like this... it's understandable. But wallowing won't change what happened, or what might happen next. We have very little time left.'",
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "\"You're right. What do we do?\"", nextScene: "gz_final_hours_planning" },
            { text: "\"What's the point? They were right. It's hopeless.\"", consequence: () => { gameState.peterSimulationCertainty = Math.max(0, gameState.peterSimulationCertainty-3);}, nextScene: "ending_despair_early" }
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
        text: "Mel raises an eyebrow. 'Everything's a game, Peter, until it isn't. Right now, our game is against the clock. Are you going to play, or are you going to question your only remaining teammate?'",
        choices: [
            { text: "\"Alright, alright. Let's play. What do you suggest?\"", nextScene: "gz_final_hours_planning"},
            { text: "\"I can't trust anyone right now. Not even you.\"", nextScene: "ending_despair_early"}
        ]
    },
    "gz_final_hours_planning": {
        text: () => {
            const hoursLeft = 48 - gameState.currentTime;
            let melPlan = "";
            if (gameState.friends.mel.trustInPeterTheory > 6) {
                melPlan = "Mel leans in. 'Alright, Mulder. If this is a construct, it has rules. And probably a core. Your friends leaving might have even created a power vacuum, or destabilized things enough for a... direct approach. I've been mapping the anomalies you've mentioned, cross-referencing them with local energy grids and... other things. There's a place. Point Impossible. The old radar station there. It's always had strange readings. If there's a 'heart' to this, it might be there. It's a long shot, but it's the only shot we have with " + hoursLeft.toFixed(1) + " hours left.'";
            } else {
                melPlan = "Mel looks grim. 'With " + hoursLeft.toFixed(1) + " hours left, Peter, our options are limited. If you're right about this being a simulation, we need to do something drastic. Something that would force the system's hand. You mentioned Point Impossible before, didn't you? The old radar tower? It's as good a place as any to... make some noise.'";
            }
            return `You and Mel face the dwindling hours. "Okay," you say, "What's our move?"\n\n${melPlan}`;
        },
        onLoad: () => { advanceTime(1); },
        choices: [
            { text: "\"Point Impossible. The radar station. Let's do it.\"", nextScene: "final_act_point_impossible_approach" },
            { text: "\"It's too risky. There has to be another way.\"", nextScene: "ending_inaction" }
        ]
    },
    "final_act_point_impossible_approach": {
        text: "You and Mel make your way to Point Impossible. The derelict radar station looms against the pre-dawn sky, an unsettling silhouette. The air here feels incredibly charged, almost vibrating. The remaining time is short: just a few hours until the 48-hour mark.",
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
        choices: [
            { text: "\"Together.\"", nextScene: "final_act_breaching_station"},
            { text: "\"I can't. I just can't.\" (Give up)", nextScene: "ending_inaction"}
        ]
    },
    "final_act_breaching_station": {
        text: "The main door is rusted shut, but you find a smashed window. Inside, the control room is a wreck of old technology, but one central console hums with an unnatural green light. It seems to be the source of the vibrations. Strange symbols flicker across its dusty screen. This is it.",
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "\"Mel, what do we do? Try to shut it down?\"", nextScene: "final_act_the_console" },
            { text: "\"This is it. I can feel it. This is the core!\"", consequence: () => gameState.peterSimulationCertainty = 10, nextScene: "final_act_the_console" }
        ]
    },
    "final_act_the_console": {
        text: () => {
            const hoursLeft = Math.max(0, 48 - gameState.currentTime); // Ensure it doesn't go negative
            return `Mel studies the console. 'It's... not like any tech I've ever seen. It's responding to something.' She looks at you. 'To you, Peter. I think you need to interact with it. We have maybe ${hoursLeft.toFixed(1)} hour${hoursLeft.toFixed(1) === "1.0" ? "" : "s"} left. What do you do?'`;
        },
        choices: [
            { text: "Reach out and touch the glowing screen.", nextScene: "simulation_collapse" },
            { text: "Try to smash the console.", nextScene: "simulation_collapse_violent" }
        ]
    },
    "simulation_collapse": {
        text: "As your hand touches the screen, an earsplitting whine fills the air. The green light flares, engulfing the room. The vibrations intensify, shaking the very foundations of reality. Torquay, the radar station, everything begins to pixelate and fragment around you. You feel a profound sense of disconnection, then... nothingness.",
        onLoad: () => { gameState.currentTime = 47.9; },
        choices: [
            { text: "Darkness...", nextScene: "the_twist_reveal" }
        ]
    },
    "simulation_collapse_violent": {
        text: "You grab a piece of debris and smash it into the console. Sparks fly. The green light turns blood red, and a deafening klaxon blares. The world outside the window shatters like glass, revealing a chaotic void of code and light. You're thrown to the ground as the station itself deconstructs around you.",
        onLoad: () => { gameState.currentTime = 47.9; },
        choices: [
            { text: "Chaos...", nextScene: "the_twist_reveal" }
        ]
    },
    "the_twist_reveal": {
        text: "Slowly, sensation returns. You're lying on a cool, smooth surface. The green glow is gone, replaced by soft, ambient lighting. You sit up. You're in a minimalist, futuristic room. Mel is standing by a sleek console, watching you with an unreadable expression. She's wearing a simple, silver uniform you've never seen before. She doesn't look like 'Mel from Torquay' anymore.",
        onLoad: () => { gameState.currentTime = 48; },
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

    // ---- Existing STUB SCENES (ensure they are minimal if not developed) ----
    "pub_discussion_deepens": { text: "You continue discussing the strange feelings with Mel... (Path to be further developed or merged)", choices: [{text: "Decide on next steps.", nextScene: "pub_mel_suggests"}]},
    "suggest_leaving_pub": { text: "You suggest leaving the pub.", choices: [{text: "Okay, where to?", nextScene: "leaving_pub_options"}]},
    "listen_to_music_phase2_intro": { text: "The band plays on. You try to enjoy it, but your mind races...", onLoad: () => advanceTime(1), choices: [{text: "Time to leave.", nextScene: "leaving_pub_options"}]},
    "leaving_pub_options": {
        text: () => `You're ready to leave the Torquay Hotel. The night is still relatively young, though, around ${Math.floor(gameState.currentTime) % 24}:00.`,
        onLoad: () => { advanceTime(0.1); gameState.currentLocation = "Outside Hotel"; },
        choices: [
            { text: "Suggest everyone goes back to your place.", nextScene: "suggest_peters_place_todo" },
            { text: "Ask if anyone wants to grab a late bite at the all-night cafe.", nextScene: "suggest_latenight_cafe" },
            { text: "Just head home alone.", nextScene: "go_home_alone_intro_todo" }
        ]
    },
    "walk_home_with_mel_intro": { text: "You and Mel begin walking...", onLoad: () => { gameState.currentLocation = "Walking with Mel"; advanceTime(0.5); }, choices: [{text: "Talk about what happened.", nextScene: "end_early"}]},
    "return_to_pub_after_esplanade": { text: "You and Mel return to the pub...", onLoad: () => { gameState.currentLocation = "Torquay Hotel"; advanceTime(0.1); }, choices: [{text: "Rejoin any remaining friends.", nextScene: "end_early"}]},
    "suggest_latenight_cafe": { text: "You suggest the late-night cafe...", onLoad: () => advanceTime(0.1), choices: [{text: "Head to the cafe.", nextScene: "latenight_cafe_intro_todo"}]},

    "suggest_peters_place_todo": { text: "You suggest going to your place... (Stub)", choices: [{text: "End current path.", nextScene: "end_early"}]},
    "go_home_alone_intro_todo": { text: "You decide to head home alone... (Stub)", choices: [{text: "End current path.", nextScene: "end_early"}]},
    "latenight_cafe_intro_todo": { text: "You arrive at the All Nighter cafe... (Stub)", choices: [{text: "End current path.", nextScene: "end_early"}]},

    "end_early": {
        text: "This particular narrative thread concludes for now. (This is a temporary end point for an undeveloped path).",
        choices: []
    },
    "end_game_time_up": {
        text: "The 48 hours are up. Time has run out. The world around you seems to settle into a mundane, unchanging loop. Your questions remain unanswered, your friends gone. (Generic Timeout Ending)",
        choices: []
    }
};

function advanceTime(hours) {
    gameState.currentTime += hours;
    gameState.currentTime = Math.min(gameState.currentTime, 48);
}

function updateCertaintyDisplay() {
    let certaintyText = "Low";
    if (gameState.peterSimulationCertainty <= 0) certaintyText = "None";
    else if (gameState.peterSimulationCertainty >= 9) certaintyText = "Utterly Convinced";
    else if (gameState.peterSimulationCertainty >= 7) certaintyText = "Extremely High";
    else if (gameState.peterSimulationCertainty >= 5) certaintyText = "High";
    else if (gameState.peterSimulationCertainty >= 3) certaintyText = "Moderate";
    else if (gameState.peterSimulationCertainty >= 1) certaintyText = "Slight";
    certaintyDisplay.textContent = certaintyText + ` (${gameState.peterSimulationCertainty}/10)`;
}

function updateFriendDisplay() {
    friendStatusContainer.innerHTML = '<h4>Friend Status:</h4>';
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
        friendStatusContainer.appendChild(statusDiv);
    }
}

function renderScene(sceneId) {
    if (gameState.currentTime >= 48 && !sceneId.startsWith("ending_") && sceneId !== "the_twist_reveal" && sceneId !== "mel_explains_twist" && sceneId !== "mel_explains_further_twist" && sceneId !== "end_game_time_up" ) {
        sceneId = "end_game_time_up";
    }

    const scene = scenes[sceneId];
    if (!scene) {
        console.error("Scene not found:", sceneId);
        storyTextElement.textContent = `Error: Scene "${sceneId}" not found. This is a bug or an undeveloped path.`;
        choicesContainer.innerHTML = '';
        timeDisplay.textContent = `Hour ${parseFloat(gameState.currentTime.toFixed(1))}`;
        updateCertaintyDisplay();
        updateFriendDisplay();
        return;
    }

    gameState.currentSceneId = sceneId;
    storyTextElement.textContent = typeof scene.text === 'function' ? scene.text() : scene.text;

    if (scene.beforeText && typeof scene.beforeText === 'function') {
        scene.beforeText();
    }
    if (scene.onLoad && typeof scene.onLoad === 'function') {
        scene.onLoad();
    }

    choicesContainer.innerHTML = '';
    if (scene.choices && scene.choices.length > 0) {
        scene.choices.forEach(choice => {
            if (choice.condition && !choice.condition()) {
                return;
            }
            const button = document.createElement('button');
            button.textContent = typeof choice.text === 'function' ? choice.text() : choice.text;
            button.classList.add('choice-button');
            button.onclick = () => makeChoice(choice);
            choicesContainer.appendChild(button);
        });
    } else {
         console.log(`Scene "${sceneId}" has no choices (this is normal for ending scenes).`);
    }

    timeDisplay.textContent = `Hour ${parseFloat(gameState.currentTime.toFixed(1))}`;
    updateCertaintyDisplay();
    updateFriendDisplay();
}

function makeChoice(choice) {
    if (choice.consequence) {
        choice.consequence();
    }
    const nextSceneId = typeof choice.nextScene === 'function' ? choice.nextScene() : choice.nextScene;
    renderScene(nextSceneId);
}

document.addEventListener('DOMContentLoaded', () => {
    renderScene(gameState.currentSceneId);
});