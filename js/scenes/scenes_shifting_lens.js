// File: js/scenes/scenes_shifting_lens.js

import { gameState, advanceTime } from '../game_state.js';

export const shiftingLensScenes = {
    "pub_aftermath_debrief": {
        text: () => {
            let introText = "The crowd noise drops a notch as 'The Kite Machine' take a break. ";
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
    "esplanade_mel_offers_comfort": {
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
    "the_return_or_departure_esplanade": { // MODIFIED to correctly call rejoin_friends_at_pub
        text: "You and Mel head back into the Torquay Hotel. The atmosphere feels different now, filtered through your recent conversation. Some of your friends might still be there.",
        onLoad: () => { gameState.currentLocation = "Torquay Hotel"; advanceTime(0.1); },
        choices: [
            { text: "Rejoin the group.", nextScene: "rejoin_friends_at_pub" },
            { text: "Suggest to Mel you both just leave.", nextScene: "leaving_pub_options" },
            { text: "\"Want to grab a coffee at that late-night place? Clear our heads?\"", nextScene: "suggest_latenight_cafe" }
        ]
    },

    // --- DEVELOPED CAFE SCENES ---
    "suggest_latenight_cafe": {
        text: "You suggest heading to the 'All Nighter' cafe down the road, a place known for its questionable coffee and interesting late-night patrons. Mel considers it.",
        onLoad: () => { advanceTime(0.1); },
        choices: [
            { text: "\"Sounds good, I'm in.\" (Mel agrees)", nextScene: "latenight_cafe_arrival" },
            { text: "\"Nah, I think I'm done for the night.\" (Mel declines)", nextScene: "leaving_pub_options" }
        ]
    },
    "latenight_cafe_arrival": {
        text: "The 'All Nighter' lives up to its name – a haven for insomniacs and those with nowhere else to be. Fluorescent lights hum over sticky tabletops. A couple of solitary figures stare into their cups, and a lone barista with tired eyes gives you a nod. The air smells of stale coffee and old fryer oil.",
        onLoad: () => {
            gameState.currentLocation = "All Nighter Cafe";
            advanceTime(0.2);
        },
        choices: [
            { text: "Find a booth in the corner.", nextScene: "latenight_cafe_settle_in" },
            { text: "Order some coffee first.", nextScene: "latenight_cafe_order_coffee" }
        ]
    },
    "latenight_cafe_order_coffee": {
        text: () => {
            let baristaLine = "The barista, who looks like he hasn't slept since the last major comet sighting, raises an eyebrow. 'Yeah? What'll it be? We got coffee... and, uh... more coffee.'";
            if (Math.random() < 0.3) {
                baristaLine += " He blinks slowly. '...And the Tuesday Special, which is... regret. No, wait, that's tomorrow. Just coffee then?'";
                gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 0.5);
            }
            return `${baristaLine}\n\nMel mutters, 'I have a feeling I'll be sticking to water.'`;
        },
        onLoad: () => { advanceTime(0.1); },
        choices: [
            { text: "\"Two black coffees, please.\"", nextScene: "latenight_cafe_get_coffee" },
            { text: "\"Just one black coffee for me. Mel?\"", nextScene: "latenight_cafe_get_coffee" }
        ]
    },
    "latenight_cafe_get_coffee": {
        text: "You get your coffees – or coffee-like substances. They arrive in chipped, mismatched mugs. You find a relatively clean booth in the corner.",
        onLoad: () => { advanceTime(0.2); },
        choices: [
            { text: "Settle in and take a sip.", nextScene: "latenight_cafe_settle_in" }
        ]
    },
    "latenight_cafe_settle_in": {
        text: "You slide into a cracked vinyl booth. Mel takes a tentative sip of her coffee and makes a face. 'Well, it's certainly... a beverage.' She looks at you pointedly. 'So, enlighten me, Peter. What mysteries does this fine establishment hold for us tonight? Aside from the mystery of what's actually in this cup.'",
        onLoad: () => { advanceTime(0.1); },
        choices: [
            { text: "\"This place just feels... off. Look at that guy in the back.\"", nextScene: "latenight_cafe_discuss_patrons" },
            { text: () => gameState.friends.john.present ? "\"Never mind the coffee. About what John and the others were saying...\"" : "\"Never mind the coffee. What do you really think about all this?\"", condition: () => gameState.currentTime < 12 && Object.values(gameState.friends).filter(f => f.present && f.name !== "Mysterious Mel").length > 0, nextScene: "cafe_discuss_theories_early" },
            { text: "\"Honestly, Mel, after everything with the others... I'm glad you stayed.\"", condition: () => Object.values(gameState.friends).filter(f => f.present && f.name !== "Mysterious Mel").length === 0, nextScene: "cafe_discuss_mel_staying_post_exodus" },
            { text: "\"Maybe just needed a change of scenery. Try to process.\"", nextScene: "latenight_cafe_attempt_relax" }
        ]
    },
    "latenight_cafe_discuss_patrons": {
        text: "You nod towards a figure hunched over a newspaper in a dimly lit booth. 'That person over there... they've been reading the same page for the last ten minutes. And their coffee cup is empty, but they keep pretending to sip from it.'",
        onLoad: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 1); advanceTime(0.2);},
        choices: [
            { text: "Mel: \"Or they're deeply engrossed and a slow reader. And maybe just like the ambiance?\"", consequence: () => { if (gameState.friends.mel.trustInPeterTheory < 3) gameState.friends.mel.suspicion++; }, nextScene: "latenight_cafe_mel_skeptical" },
            { text: "Mel: \"Okay, that's a little odd. Let's observe for a bit.\"", condition: () => gameState.friends.mel.trustInPeterTheory >= 3, consequence: () => { gameState.friends.mel.trustInPeterTheory++; }, nextScene: "latenight_cafe_observe_patron" }
        ]
    },
    "latenight_cafe_mel_skeptical": {
        text: "Mel sighs. 'Peter, you're seeing patterns everywhere. While I appreciate your... unique perspective, we can't build a case on someone's reading habits in a greasy spoon.'",
        choices: [
            { text: "\"But it *is* weird, Mel! It's another glitch!\"", consequence: () => { gameState.peterSimulationCertainty++; gameState.friends.mel.suspicion++; gameState.friends.mel.friendship--;}, nextScene: "latenight_cafe_peter_insists" },
            { text: "\"Yeah, okay. Maybe I'm just tired.\"", consequence: () => { gameState.peterSimulationCertainty--; }, nextScene: "latenight_cafe_attempt_relax" }
        ]
    },
    "latenight_cafe_observe_patron": {
        text: "You and Mel watch the person. After another minute, they meticulously fold their newspaper, stand up, walk to the counter, tap it three times, then sit back down and reopen the newspaper to the exact same page, resuming their 'phantom sips'. Mel raises an eyebrow. 'Okay... that? That's not normal.'",
        onLoad: () => { gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 2); gameState.friends.mel.trustInPeterTheory = Math.min(10, gameState.friends.mel.trustInPeterTheory + 2); advanceTime(0.3);},
        choices: [
            { text: "\"See! I told you! What do we do?\"", nextScene: "latenight_cafe_decision_investigate_further" },
            { text: "\"Let's just... get out of here. This is too much.\"", nextScene: "latenight_cafe_decision_go_home" }
        ]
    },
    "cafe_discuss_theories_early": {
        text: "Mel nods. 'This whole night has been one long 'what the hell' moment. What are you really thinking, Peter? Beyond the glitches?'",
        onLoad: () => { advanceTime(0.3); },
        choices: [
            { text: "Explain your full simulation theory to her.", nextScene: "esplanade_explain_theory" },
            { text: "\"I think someone is messing with us, Mel.\"", nextScene: "latenight_cafe_attempt_relax" }
        ]
    },
    "cafe_discuss_mel_staying_post_exodus": {
        text: "Mel gives a small, tired smile. 'It wasn't an easy decision for them, Peter. Or for me to stay. But their theory... it felt too much like a scapegoat. And if you *are* onto something, well, abandoning the only person asking the right questions seems counterproductive.'",
        onLoad: () => { advanceTime(0.4); gameState.friends.mel.friendship++; gameState.friends.mel.trustInPeterTheory++;},
        choices: [
            { text: "\"So you do think I'm onto something?\"", nextScene: "latenight_cafe_decision_investigate_further" },
            { text: "\"Thanks, Mel. It means a lot.\"", nextScene: "latenight_cafe_attempt_relax" }
        ]
    },
    "latenight_cafe_attempt_relax": {
        text: "You both try to steer the conversation to something, anything, normal. But the oppressive atmosphere of the cafe and the events of the night make it difficult. The silence stretches, punctuated by the clatter of unseen dishes.",
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "\"This isn't working. Let's just go.\"", nextScene: "latenight_cafe_decision_go_home" },
            { text: "(Point out another 'oddity')", nextScene: "latenight_cafe_discuss_patrons" }
        ]
    },
    "latenight_cafe_peter_insists": {
        text: "You reiterate your certainty that these aren't coincidences. Mel listens, her patience wearing thin or her concern for you growing. 'Peter, insistence isn't evidence. What do you want to *do*?'",
        choices: [
            { text: "\"I want to understand! We need to find the source!\"", nextScene: "latenight_cafe_decision_investigate_further" },
            { text: "\"Okay, fine. Let's just... leave.\"", nextScene: "latenight_cafe_decision_go_home" }
        ]
    },
    "latenight_cafe_decision_investigate_further": {
        text: "Mel nods, a new resolve in her eyes. 'Alright, Peter. If these are pieces, let's try to make a picture. This place, the pub... any other locations showing this... heightened strangeness? We need a common denominator, or a focal point.'",
        onLoad: () => { advanceTime(0.3); gameState.friends.mel.trustInPeterTheory = Math.min(10, gameState.friends.mel.trustInPeterTheory + 1); },
        choices: [
            { text: "\"Point Impossible. The old radar station. It's always felt wrong.\"", nextScene: "gz_final_hours_planning" },
            { text: "\"Let's go back to my place and map everything out.\"", nextScene: "suggest_peters_place" },
            { text: "\"I need more time to think. Let's just get out of this cafe first.\"", nextScene: "latenight_cafe_decision_go_home" }
        ]
    },
    "latenight_cafe_decision_go_home": {
        text: "You both agree it's late, and the questionable coffee isn't helping matters. Time to leave the 'All Nighter' and its peculiar ambiance.",
        onLoad: () => { gameState.currentLocation = "Leaving Cafe"; advanceTime(0.2); },
        choices: [
            { text: "Walk Mel home?", nextScene: "walk_home_with_mel_intro" },
            { text: "Suggest going to your place.", nextScene: "suggest_peters_place" },
            { text: "Just go our separate ways for now.", nextScene: "go_home_alone_intro_todo" }
        ]
    },
    // --- DEVELOPED CAFE SCENES END ---

    // --- DEVELOPED "Peter's Place" SCENES & "Rejoining Friends at Pub" START ---
    // This "suggest_peters_place" is called from "latenight_cafe_decision_investigate_further", "latenight_cafe_decision_go_home",
    // and also "leaving_pub_options" in scenes_endings.js
    "suggest_peters_place": {
        text: () => {
            let context = (gameState.currentLocation === "Leaving Cafe") ? "after the strange cafe experience" : "after leaving the pub";
            return `You suggest heading back to your place. 'It's quieter there ${context}, we can talk properly and maybe figure some things out without... distractions.' Mel considers it.`;
        },
        onLoad: () => { advanceTime(0.1); },
        choices: [
            {
                text: "Mel: \"Alright, Peter. Your place it is. Lead the way.\"",
                condition: () => gameState.friends.mel.friendship > 3 || gameState.friends.mel.trustInPeterTheory > 2,
                nextScene: "at_peters_place_arrival"
            },
            {
                text: "Mel: \"You know, Peter, I think I'd rather just head home. It's been a really long night.\"",
                condition: () => !(gameState.friends.mel.friendship > 3 || gameState.friends.mel.trustInPeterTheory > 2),
                nextScene: "mel_declines_peters_place"
            },
            {
                text: "\"Actually, I think I just need to crash. You go ahead to yours if you want.\"",
                nextScene: "go_home_alone_intro_todo"
            }
        ]
    },
    "mel_declines_peters_place": {
        text: "Mel gives you an apologetic but firm look. 'Honestly, Peter, I'm exhausted. I think a quiet night at my own place is what I need. We can touch base tomorrow?' This effectively ends your joint investigation for the night.",
        onLoad: () => { advanceTime(0.1); },
        choices: [
            { text: "\"Okay, Mel. Get some rest. Talk tomorrow.\"", nextScene: "peter_parts_ways_with_mel" },
            { text: "\"Are you sure? I really think we're onto something!\" (Plead)", consequence: () => {gameState.friends.mel.friendship--;}, nextScene: "peter_parts_ways_with_mel_reluctantly" }
        ]
    },
    "peter_parts_ways_with_mel": {
        text: "You and Mel part ways for the night. The city feels strangely quiet as you head home alone, your mind racing with theories and the unsettling events. The clock is ticking.",
        onLoad: () => { advanceTime(0.5); gameState.currentLocation = "Peter's Place (Alone)"; },
        choices: [
            { text: "Try to get some sleep, though it feels impossible.", nextScene: "peters_place_alone_next_morning" },
            { text: "Stay up all night, poring over your notes.", consequence: () => {gameState.peterSimulationCertainty+=2; advanceTime(6);}, nextScene: "peters_place_alone_next_morning_nosleep" }
        ]
    },
    "peter_parts_ways_with_mel_reluctantly": {
        text: "Your pleading doesn't change Mel's mind. She looks genuinely tired. 'Peter, we both need to recharge. We'll be no good to anyone like this. Tomorrow.' With a final nod, she heads off, leaving you alone with your thoughts.",
        onLoad: () => { advanceTime(0.5); gameState.currentLocation = "Peter's Place (Alone)"; },
        choices: [
            { text: "Fine. Head home alone, frustrated.", nextScene: "peters_place_alone_next_morning" },
        ]
    },
    "at_peters_place_arrival": {
        text: () => {
            let placeDescription = Math.random() > 0.5 ? "Your apartment is quiet, a stark contrast to the pub. The usual clutter is reassuringly familiar." : "Your place is a chaotic landscape of notes, half-finished projects, and empty coffee mugs. A testament to your racing mind.";
            return `${placeDescription} Mel steps inside, looking around with interest. 'So, this is the nerve center,' she remarks, a hint of teasing in her voice.`;
        },
        onLoad: () => {
            gameState.currentLocation = "Peter's Place";
            advanceTime(0.5);
        },
        choices: [
            { text: "\"Let's go over everything we've seen and heard tonight.\"", nextScene: "peters_place_mapping_theories" },
            { text: "\"Want a coffee? Or something stronger? We need to think.\"", nextScene: "peters_place_offer_drink" },
            { text: "\"Honestly, Mel, I'm just glad you're here. I don't know what to make of all this.\"", nextScene: "peters_place_vulnerable_chat" }
        ]
    },
    "peters_place_mapping_theories": {
        text: "You grab some paper, or a whiteboard if you have one, and start listing everything: the singer, the repetitive conversations, the friends' reactions, any feelings or specific anomalies. Mel watches, occasionally asking a sharp question or offering a counter-theory.",
        onLoad: () => { advanceTime(1); gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 1); },
        choices: [
            {
                text: "Mel: \"Okay, if we look at this logically... what's the one thread that connects all the major anomalies?\"",
                condition: () => gameState.friends.mel.trustInPeterTheory > 4,
                nextScene: "peters_place_mel_helps_theorize"
            },
            {
                text: "Mel: \"It's a lot of data, Peter, but it's still mostly circumstantial. Are you sure we're not just stressed?\"",
                condition: () => gameState.friends.mel.trustInPeterTheory <= 4,
                nextScene: "peters_place_mel_skeptical_at_home"
            },
            { text: "\"This is exhausting. Maybe we should try to get some rest?\"", nextScene: "peters_place_suggest_rest" }
        ]
    },
    "peters_place_mel_helps_theorize": {
        text: "Mel taps the board. 'Besides you, obviously. What if it's not just *you* being the anchor, but something you're *doing*, or a place you keep returning to? Or something that's trying to communicate *through* you?' Her analytical mind is clearly engaged.",
        onLoad: () => { gameState.friends.mel.trustInPeterTheory = Math.min(10, gameState.friends.mel.trustInPeterTheory + 1); },
        choices: [
            { text: "\"Communicate? Like the console at Point Impossible might be?\"", nextScene: "gz_final_hours_planning" },
            { text: "\"That's an idea... What are you getting at?\"", nextScene: "peters_place_further_theorizing_with_mel" },
            { text: "\"I'm still leaning towards me being the target, or the key.\"", nextScene: "peters_place_mapping_theories" }
        ]
    },
    "peters_place_further_theorizing_with_mel": {
        text: "You and Mel spend another hour dissecting the events, looking for patterns. The theories become wilder, more specific. You feel a strange sense of camaraderie in this late-night session, a shared descent into the rabbit hole. The clock is ticking relentlessly.",
        onLoad: () => { advanceTime(1); gameState.peterSimulationCertainty++; gameState.friends.mel.trustInPeterTheory++; },
        choices: [
            { text: "\"I think we have a solid lead now. We need to act.\"", nextScene: "gz_final_hours_planning" },
            { text: "\"We're going in circles. We need sleep.\"", nextScene: "peters_place_suggest_rest" }
        ]
    },
    "peters_place_mel_skeptical_at_home": {
        text: "Mel sighs, looking at your web of connections. 'Peter, I want to believe you, or at least understand. But this... this is a lot of leaps of faith. We need something more concrete, or we need to consider that the stress is getting to us.'",
        onLoad: () => { gameState.friends.mel.suspicion = Math.min(10, gameState.friends.mel.suspicion + 1); },
        choices: [
            { text: "\"But the concrete things *are* the glitches, Mel!\"", nextScene: "peters_place_mapping_theories" },
            { text: "\"You're right. I'm exhausted. Maybe rest will bring clarity.\"", nextScene: "peters_place_suggest_rest" },
            { text: "\"Fine. If you won't help, I'll figure it out myself!\"", consequence: ()=>{gameState.friends.mel.friendship--; gameState.friends.mel.trustInPeterTheory--;}, nextScene: "peters_place_peter_goes_solo_from_home" }
        ]
    },
    "peters_place_peter_goes_solo_from_home": {
        text: "Frustrated, you tell Mel you'll continue alone. She looks disappointed but doesn't argue further. 'Be careful, Peter.' She decides to leave. You're left in your apartment, the weight of the world on your shoulders.",
        onLoad: () => { gameState.friends.mel.present = false; advanceTime(0.2); },
        choices: [
            { text: "Work through the night, alone.", consequence: () => {advanceTime(5); gameState.peterSimulationCertainty+=2;}, nextScene: "peters_place_alone_next_morning_nosleep" },
            { text: "Give up and crash.", nextScene: "ending_despair_early" }
        ]
    },
    "peters_place_offer_drink": {
        text: "You offer Mel a drink – water, tea, maybe an old beer you find in the fridge. She accepts a water. The simple act of hospitality creates a small island of calm in the storm of the night.",
        onLoad: () => { advanceTime(0.2); },
        choices: [
            { text: "Talk about how you're really feeling.", nextScene: "peters_place_vulnerable_chat" },
            { text: "\"Okay, back to business. Let's figure this out.\"", nextScene: "peters_place_mapping_theories" }
        ]
    },
    "peters_place_vulnerable_chat": {
        text: () => {
            let melComfort = "Mel listens patiently as you pour out your fears, your conviction that something is terribly wrong, your confusion. ";
            if (gameState.friends.mel.friendship > 5) {
                melComfort += " 'I get it, Peter. It's a lot. And for what it's worth, you're not entirely alone in feeling like the world's tilted. Just try to breathe. We take it one step at a time.'";
                if (!gameState.dogMentioned && Math.random() > 0.5) {
                     melComfort += " She adds, 'When my dog Charlie gets spooked by a loud noise, he looks to me. He doesn't understand it, but he trusts I'll keep him safe. Sometimes, you just gotta find your anchor.'";
                     gameState.dogMentioned = true;
                }
            } else {
                melComfort += "She nods slowly. 'That's... a heavy burden you're carrying, Peter. What do you think is the most rational first step, given everything?'";
            }
            return melComfort;
        },
        onLoad: () => { advanceTime(0.5); gameState.friends.mel.friendship = Math.min(10, gameState.friends.mel.friendship + 1); },
        choices: [
            { text: "\"Thanks, Mel. Okay, let's try to map out the facts.\"", nextScene: "peters_place_mapping_theories" },
            { text: "\"A rational step? Maybe it's just to get some sleep.\"", nextScene: "peters_place_suggest_rest" }
        ]
    },
    "peters_place_suggest_rest": {
        text: () => {
            const hoursLeft = Math.max(0, 48 - gameState.currentTime);
            return `Exhaustion is setting in. 'Mel, maybe we should try and get some sleep. We're not thinking straight. We still have about ${hoursLeft.toFixed(0)} hours.'`;
        },
        choices: [
            {
                text: "Mel: \"You're right. My brain feels like scrambled eggs. Your couch okay?\"",
                condition: () => gameState.friends.mel.friendship > 4,
                nextScene: "peters_place_mel_stays_over_scene"
            },
            {
                text: "Mel: \"Yeah, I should head home. Get some proper rest. Call me if anything... happens.\"",
                nextScene: "peters_place_mel_leaves_scene"
            },
            {
                text: "\"No, we can't rest! We have to keep going!\" (Push through exhaustion)",
                consequence: () => { gameState.peterSimulationCertainty++; gameState.friends.mel.suspicion++; },
                nextScene: "peters_place_further_theorizing_with_mel"
            }
        ]
    },
    "peters_place_mel_stays_over_scene": {
        text: "Mel agrees to stay, not wanting you to be alone, or perhaps wanting to keep an eye on things. You offer her the couch. An uneasy truce with the night settles over the apartment. You both try to rest.",
        onLoad: () => {
            advanceTime(6); 
            gameState.currentLocation = "Peter's Place (Next Morning)";
        },
        choices: [
            { text: "Morning. The city is stirring. What now?", nextScene: "peters_place_next_morning_mel_present" }
        ]
    },
    "peters_place_mel_leaves_scene": {
        text: "Mel decides to head to her own place. 'Get some rest, Peter. Seriously. We'll connect when the sun's up.' She leaves, and you're alone in your apartment with your thoughts and the dwindling clock.",
        onLoad: () => {
            gameState.friends.mel.present = false;
            advanceTime(6); 
            gameState.currentLocation = "Peter's Place (Alone, Next Morning)";
        },
        choices: [
            { text: "Morning. Alone. The weight of it all settles.", nextScene: "peters_place_alone_next_morning" }
        ]
    },
    "peters_place_next_morning_mel_present": {
        text: () => {
            const hoursLeft = Math.max(0, 48 - gameState.currentTime);
            return `Sunlight filters through your dusty blinds. Mel is stirring on the couch. A quick glance at the clock shows you have about ${hoursLeft.toFixed(0)} hours left. The brief rest has either cleared your head or made the fear more potent.`;
        },
        onLoad: () => { gameState.friends.mel.present = true; },
        choices: [
            { text: "\"Morning. Any new insights from the dream world?\"", nextScene: "gz_final_hours_planning" },
            { text: "\"Mel, I had this weird dream...\" (Describe a new 'glitch' or clue)", nextScene: "peters_place_dream_clue" },
            { text: "\"I need coffee. And a plan. A real one this time.\"", nextScene: "gz_final_hours_planning" }
        ]
    },
    "peters_place_alone_next_morning": {
        text: () => {
            const hoursLeft = Math.max(0, 48 - gameState.currentTime);
            return `You wake up, groggy and alone. The silence of your apartment is heavy. Glancing at the clock, you see there are only about ${hoursLeft.toFixed(0)} hours left. The pressure is immense.`;
        },
        onLoad: () => { gameState.friends.mel.present = false; },
        choices: [
            { text: "Call Mel immediately.", nextScene: "peter_calls_mel_morning" },
            { text: "Forget Mel, investigate that new lead on your own.", condition: () => gameState.playerNoticedSpecificAnomaly, nextScene: "gz_final_hours_planning" },
            { text: "It's hopeless. I'm truly alone.", nextScene: "ending_despair_early" }
        ]
    },
    "peters_place_alone_next_morning_nosleep": {
        text: () => {
            const hoursLeft = Math.max(0, 48 - gameState.currentTime);
            return `You've been up all night, fueled by caffeine and adrenaline, your notes spreading like a virus across every surface. The first light of dawn creeps in. You have about ${hoursLeft.toFixed(0)} hours left. You're exhausted but hyper-aware.`;
        },
        onLoad: () => { gameState.friends.mel.present = false; },
        choices: [
            { text: "Call Mel, tell her about your all-night breakthrough (or breakdown).", nextScene: "peter_calls_mel_morning_manic" },
            { text: "No time for Mel. Act on your findings NOW.", nextScene: "gz_final_hours_planning" },
            { text: "Collapse from exhaustion.", nextScene: "ending_despair_early" }
        ]
    },
    "peter_calls_mel_morning": {
        text: "You call Mel. She sounds like she actually got some sleep. 'Peter? What's up? Everything okay?'",
        onLoad: () => { gameState.friends.mel.present = true; advanceTime(0.2);},
        choices: [
            { text: "\"Mel, we need to move. Time's running out. That Point Impossible idea...\"", nextScene: "gz_final_hours_planning" },
            { text: "\"I... I don't know if I can do this, Mel.\"", nextScene: "mel_reassures_peter_on_phone" }
        ]
    },
    "peter_calls_mel_morning_manic": {
        text: "You call Mel, your voice hoarse and rapid-fire as you explain your night of intense theorizing. 'Mel! I've got it! It all connects! But we have to move NOW!' There's a pause on her end. 'Peter... slow down. Where are you? Did you sleep at all?'",
        onLoad: () => { gameState.friends.mel.present = true; advanceTime(0.2); gameState.friends.mel.suspicion++;},
        choices: [
            { text: "\"Sleep is for the simulated! Point Impossible, Mel, now!\"", nextScene: "gz_final_hours_planning" },
            { text: "\"Okay, maybe I am a bit wired. But I found something.\"", nextScene: "mel_reassures_peter_on_phone" }
        ]
    },
    "mel_reassures_peter_on_phone": {
        text: "Mel's voice is calm and steady over the phone. 'Okay, Peter. Deep breaths. Whatever you found, whatever you're feeling, we'll face it. I'm on my way to your place. We'll figure out the next step together. Don't do anything rash until I get there.'",
        onLoad: () => { advanceTime(0.5); gameState.friends.mel.friendship++; },
        choices: [
            { text: "Wait for Mel, trying to calm down.", nextScene: "peters_place_next_morning_mel_present" }
        ]
    },
    "peters_place_dream_clue": {
        text: "You recount a vivid, disturbing dream that felt more real than waking life – perhaps numbers, a location, or a distorted message. Mel listens intently. 'Dreams can be... data, sometimes. Especially in a place like this. Does it connect to anything we already know?'",
        onLoad: () => { gameState.peterSimulationCertainty++; advanceTime(0.3); },
        choices: [
            { text: "\"Yes! It points straight back to Point Impossible!\"", nextScene: "gz_final_hours_planning" },
            { text: "\"I'm not sure yet, but it felt significant.\"", nextScene: "peters_place_mapping_theories" }
        ]
    },
    // --- END OF DEVELOPED "Peter's Place" SCENES ---

    // --- START: Corrected "Rejoining Friends at Pub" sequence ---
    // Note: This was also part of message #46's additions to this file
    "rejoin_friends_at_pub": {
        text: () => {
            let friendCount = Object.values(gameState.friends).filter(f => f.present && f.name !== "Mysterious Mel").length;
            if (friendCount === 0) {
                return "You and Mel walk back into the Torquay Hotel. It seems quieter now, and you realize your other friends must have already left. The space where they were sitting is empty. It's just the two of you and the lingering music of 'The Kite Machine'.";
            }
            return "You and Mel walk back into the Torquay Hotel. 'The Kite Machine' is playing a slower number. You spot John, Andy, and the others still at a large table, though their conversation seems more subdued. They look up as you approach; Simone offers a small, questioning smile."; // Names updated
        },
        onLoad: () => { advanceTime(0.2); },
        choices: [
            { text: () => Object.values(gameState.friends).filter(f => f.present && f.name !== "Mysterious Mel").length > 0 ? "Act casual: \"Hey everyone, just needed some air. What'd we miss?\"" : "Sit down with Mel, taking in the quieter pub.", nextScene: () => Object.values(gameState.friends).filter(f => f.present && f.name !== "Mysterious Mel").length > 0 ? "rejoin_friends_casual_chat" : "pub_just_peter_mel_quiet" },
            { text: () => Object.values(gameState.friends).filter(f => f.present && f.name !== "Mysterious Mel").length > 0 ? "Address their looks: \"Alright, you're all staring. What's up?\"" : "Suggest to Mel it's time to leave soon.", nextScene: () => Object.values(gameState.friends).filter(f => f.present && f.name !== "Mysterious Mel").length > 0 ? "rejoin_friends_address_curiosity" : "leaving_pub_options" },
            { text: () => Object.values(gameState.friends).filter(f => f.present && f.name !== "Mysterious Mel").length > 0 && gameState.peterSimulationCertainty > 5 ? "\"Guys, I need to tell you what I'm figuring out!\" (Share theories)" : "Just observe the room with Mel.", condition: () => Object.values(gameState.friends).filter(f => f.present && f.name !== "Mysterious Mel").length > 0 && gameState.peterSimulationCertainty > 5, nextScene: "rejoin_friends_share_theories_early" }
        ]
    },
    "pub_just_peter_mel_quiet": {
        text: "With the others gone, the pub feels different. You and Mel find a quiet table. The band plays on, a soundtrack to your thoughts. The events of the night, the Esplanade conversation, hang in the air.",
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "Talk to Mel about what happened with the others (if intervention occurred).", condition: () => !gameState.friends.john.present, nextScene: "gz_discuss_abandonment" },
            { text: "Discuss your simulation theories further with Mel.", nextScene: "esplanade_explain_theory" },
            { text: "Suggest it's time to leave.", nextScene: "leaving_pub_options" }
        ]
    },
    "rejoin_friends_casual_chat": {
        text: () => {
            let johnLine = gameState.friends.john.present ? "John grins. 'Not much, mate. Just wondering if you two were solving the world's problems out there or just needed some privacy.'" : ""; // Name updated
            let janitaLine = gameState.friends.carrot.present ? "Janita adds, 'I saved you some carrot cake, Peter, if you want some later!'" : ""; // Name updated
            return `You try to act casual. ${johnLine} ${janitaLine} The conversation picks up, a bit strained perhaps, but an attempt at normalcy. Mel subtly supports your casual demeanor.`;
        },
        onLoad: () => { advanceTime(0.3); },
        choices: [
            { text: "Join the conversation, try to keep it light.", nextScene: "pub_normal_group_time" },
            { text: "Subtly try to see if anyone else has noticed odd things.", nextScene: "pub_subtle_probing" }
        ]
    },
    "rejoin_friends_address_curiosity": {
        text: "You meet their questioning looks. 'Okay, I can tell you're all wondering what that was about. Mel and I were just... processing some of the weirdness tonight.'\nSimone exchanges a look with Tony. '\"Weirdness\" is one word for it, Peter. We've all been feeling it. And honestly, a lot of it seems to center around you.'", // Names updated
        onLoad: () => {
            gameState.friends.kath.suspicion = Math.min(10, (gameState.friends.kath.suspicion || 0) +1); // kath is key for Simone
            advanceTime(0.2);
        },
        choices: [
            { text: "\"Around me? What are you implying?\"", nextScene: "rejoin_friends_defensive_reaction" },
            { text: "\"Okay, yes, things are strange. And I think I know why.\"", nextScene: "rejoin_friends_share_theories_early" }
        ]
    },
    "rejoin_friends_defensive_reaction": {
        text: "Your defensive tone raises the tension. Andy sighs. 'No one's implying anything malicious, Peter. Just observations.' Mel subtly places a hand on your arm, a silent signal to tread carefully.", // Name updated
        choices: [
            { text: "Take a breath, try to explain calmly.", nextScene: "rejoin_friends_share_theories_early" },
            { text: "\"Observations? Or are you all starting to gang up on me?\"", consequence: () => { Object.keys(gameState.friends).forEach(fKey => { const friend = gameState.friends[fKey]; if(friend.present && fKey !== 'mel') friend.suspicion = Math.min(10, (friend.suspicion || 0) +1); }); }, nextScene: "talk_to_other_friends_intro" }
        ]
    },
    "rejoin_friends_share_theories_early": {
        text: "You launch into your simulation theory, explaining the glitches and your growing conviction that something is fundamentally wrong with your reality. The friends listen, expressions shifting from curiosity to concern, and for some, clear skepticism. John might interject with his 'Tatiana is an NPC' comment here if it fits the flow of Peter's explanation.", // Name updated
        onLoad: () => {
            gameState.peterSimulationCertainty = Math.min(10, gameState.peterSimulationCertainty + 1);
            Object.keys(gameState.friends).forEach(fKey => { const friend = gameState.friends[fKey]; if(friend.present && fKey !== 'mel') friend.suspicion = Math.min(10, (friend.suspicion || 0) +1); });
            advanceTime(0.5);
        },
        choices: [
            { text: "Pause, seeing their doubt: \"You guys think I'm crazy, don't you?\"", nextScene: "pub_tense_group_time" },
            { text: "Press on, trying to convince them with more details.", consequence: () => { Object.keys(gameState.friends).forEach(fKey => { const friend = gameState.friends[fKey]; if(friend.present && fKey !== 'mel') friend.suspicion = Math.min(10, (friend.suspicion || 0) +1); }); gameState.peterSimulationCertainty++; }, nextScene: "talk_to_other_friends_intro" }
        ]
    },
    "pub_normal_group_time": {
        text: "You manage to steer the conversation to lighter topics – the band's next song, local gossip, plans for the weekend that suddenly feel very far away. For a while, things almost feel normal, though an undercurrent of tension remains. Mel seems to be observing everyone, including you.",
        onLoad: () => { advanceTime(1); },
        choices: [
            { text: "After a while, suggest it's getting late.", nextScene: "leaving_pub_options" },
            { text: "Use a quiet moment to talk to Mel again.", nextScene: "pub_aftermath_debrief" },
            { text: "Wait and see if the friends bring up the 'weirdness' again.", nextScene: "pub_friends_initiate_talk" }
        ]
    },
    "pub_subtle_probing": {
        text: "You try to subtly ask if anyone else noticed the singer's skip, or the lights flickering, or if the beer tasted 'a bit digital'. Most shrug it off or give you funny looks. Andy thoughtfully says, 'The bass amp did hum a bit weirdly for a second there, didn't it?' but doesn't elaborate.", // Name updated
        onLoad: () => { advanceTime(0.4); },
        choices: [
            { text: "File away Andy's comment. Rejoin the main group chat.", nextScene: "pub_normal_group_time" }, // Name updated
            { text: "Press Andy: \"Exactly! What else did you notice?\"", consequence: () => { gameState.friends.neil.friendship++; gameState.friends.neil.suspicion = Math.max(0, gameState.friends.neil.suspicion-1);}, nextScene: "pub_chat_with_andy_detail" } // Name updated, scene name updated
        ]
    },
    "pub_chat_with_andy_detail": { // Renamed from pub_chat_with_neil_detail
        text: "You pull Andy aside. 'That hum, Andy, was it like a... a data stream struggling to load?' Andy looks a bit uncomfortable. 'Whoa, Peter, that's a bit much. It was probably just feedback. But yeah, it was... sharp. Unusual.' He doesn't seem keen to discuss it further.", // Name updated
        choices: [
            { text: "Thank Andy and rejoin the others.", nextScene: "pub_normal_group_time"}, // Name updated
            { text: "Try to convince Andy it's more significant.", consequence: () => {gameState.friends.neil.suspicion++;}, nextScene: "pub_tense_group_time"} // Name updated
        ]
    },
    "pub_tense_group_time": {
        text: "Your earlier outburst or persistent theories have made the atmosphere palpably tense. Conversations are stilted, and you catch your friends exchanging worried glances. Mel looks like she's trying to decide on her next move.",
        onLoad: () => { advanceTime(0.5); },
        choices: [
            { text: "Apologize for being intense, try to smooth things over.", nextScene: "pub_normal_group_time" },
            { text: "Address the tension: \"Okay, clearly something's up. Let's just talk.\"", nextScene: "talk_to_other_friends_intro" },
            { text: "Decide to leave with Mel.", nextScene: "leaving_pub_options" }
        ]
    },
    "pub_friends_initiate_talk": {
        text: "After a period of strained small talk, Simone clears her throat. 'Peter... actually, there is something we wanted to discuss. All of us. Properly.' She looks around at the others, who nod in agreement. The mood shifts, becoming serious.", // Name updated
        onLoad: () => { advanceTime(0.1); },
        choices: [
            { text: "Alright. I'm listening.", nextScene: "talk_to_other_friends_intro" }
        ]
    }
    // --- END: Corrected "Rejoining Friends at Pub" sequence ---
};