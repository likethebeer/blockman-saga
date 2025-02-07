// Silent sound instance
const mySilentSound = new Audio('sounds/silent.mp3');
mySilentSound.volume = 0; // Ensure it's inaudible

// Silent sound playback interval ID
let silentSoundInterval;

// Function to play silent sound
function playSilentSound() {
    mySilentSound.play().catch((error) => {
        console.error("Error playing silent sound:", error);
    });
}

// Start silent sound playback loop
function startSilentPlayback() {
    if (!silentSoundInterval) {
        silentSoundInterval = setInterval(() => {
            if (!window.gameOn) { // Check the game state
                playSilentSound();
            } else {
                stopSilentPlayback();
            }
        }, 3000); // Play every 3 seconds
    }
}

// Stop silent sound playback loop
function stopSilentPlayback() {
    if (silentSoundInterval) {
        clearInterval(silentSoundInterval);
        silentSoundInterval = null;
    }
}


