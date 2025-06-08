// File: js/game_state.js

export let gameState = {
    currentTime: 0,
    peterSimulationCertainty: 1,
    playerNoticedSpecificAnomaly: false,
    melKnowsAboutDeadline: false,
    previousAnomaly: null,
    currentLocation: "Torquay Hotel",
    friends: {
        mel: { name: "Mysterious Mel", friendship: 7, suspicion: 1, trustInPeterTheory: 0, present: true },
        john: { name: "John", friendship: 7, suspicion: 1, present: true }, // UPDATED
        neil: { name: "Andy", friendship: 7, suspicion: 1, present: true }, // UPDATED
        carrot: { name: "Janita", friendship: 7, suspicion: 1, present: true }, // UPDATED
        kath: { name: "Simone", friendship: 7, suspicion: 1, present: true }, // UPDATED
        kel: { name: "Tony", friendship: 7, suspicion: 1, present: true } // UPDATED
    },
    currentSceneId: "start",
    dogMentioned: false,
    allOtherFriendsHaveDeparted: false, 
};

export function advanceTime(hours) {
    gameState.currentTime += hours;
    gameState.currentTime = Math.min(gameState.currentTime, 48); // Cap at 48
}