debugMode = false;
const player = document.getElementById('player');
const playerWrapper = document.getElementById('player-wrapper');
const gameContainer = document.getElementById('game-container');
let playerPosition = 225; // Starting position
let playerSpeed = 5;  // Speed of movement
let isBoosting = false;
let verticalSpeed = 0;
const gravity = 0.15;  // How fast the player falls
const boostPower = 0.125;  // How fast the player ascends
const maxSpeed = 10;  // Maximum vertical speed
let lightningAttack = false;
let lastEscalationTime = 0; // Initialize to a value outside valid gameTime

let escalationLevel = 1; //eventually used to multiple difficulty over time
let spawnMax = 1450;
let spawnMin = 550;
let spotlightTimeOut = 2000;
let spotlightTrackingTime = 1000;
const baseInterval = 1000; // Base interval (e.g., 1000ms or 1 second)
const escalationFactor = 0.7; // Determines how quickly intervals decrease

let animationFrameID;
let gameTime = 0; // Total time played in game
let exactGameTime = 0;
let lastGameTime = 0;

let userAgreed = false;
let isGameOn = false;
let isGameOver = false;
let isGamePaused = false;
let fallingObjects = []; // To store all active falling objects
let drones = [];
let lasers = [];
let isManualPaused = false; // Tracks if the game is manually paused
let isAutoPaused = false; // Tracks if the game is auto-paused due to focus/visibility
let fallingObjectTimeout; // Track the timeout ID
const gameOverReasonText = document.getElementById('gameOverReason');
const highScoreText = document.getElementById('hScoreText'); //highScore is the score
const currentScoreText = document.getElementById('cScoreText'); //playerScore is the score
const timerText = document.getElementById('timer-text');

let perfectCatchStreak = 0;
let comboCounter = 0;  // Tracks successful combos
let comboTracker = [];  // Tracks collected unique resource types
let survivalTime = 0;
let survivalScore = 0; // Tracks score from survival time
let playerScore = 0;  // Tracks the total score
let storedScores = JSON.parse(localStorage.getItem('blockmanHighScores') || '[]');
let testStored = JSON.parse(localStorage.getItem('blockmanHighScores') || '[]');
let previousScore = 0; // For logging and UI updates
let roundedSurvivalScore = 0;
let lastTime = 0;  // Initialize globally
let deltaTime = 0;  // Initialize globally







const difficultySelector = document.getElementById('difficulty');
let difficulty;
const difficultyModifier = {
    easy: 1,
    medium: 1.25,
    hard: 1.75
};
let gameDifficulty;

const resources = ['fuel', 'food', 'supplies'];
// Define resources
const resourceNeeded = {
    fuel: 5,
    food: 5,
    supplies: 8
};
const spawnCooldowns = {
    food: 0,
    fuel: 0,
    supplies: 0,
    hazard: 0,
};
const cooldownDurations = {
    food: 5000, // 5 seconds
    fuel: 6000,
    supplies: 5000,
    hazard: 2000, // Hazards can spawn more frequently
    health: 10000,
    shield: 12000
};
let collectedResources = {
    fuel: 0,
    food: 0,
    supplies: 0
};

const screens = {
    agreement: document.getElementById('agreement'),
    title: document.getElementById('game-title'),
    about: document.getElementById('game-about'),
    mission: document.getElementById('game-mission'),
    instructions: document.getElementById('game-instructions'),
    leaderBoard: document.getElementById('leader-board'),
    pause: document.getElementById('game-paused'),
    gameOver: document.getElementById('game-over'),
    welcome: document.getElementById('welcome'),
    test: document.getElementById('test-overlay')
};

const bgMusic = new Audio('sounds/let-the-drummer-kick.mp3')
bgMusic.volume = 0.2; 
bgMusic.loop = true;

const menuTheme = new Audio('sounds/menu-theme.mp3')
menuTheme.volume = .5; 
menuTheme.loop = true;

const boostSound = new Audio('sounds/booster.mp3')
boostSound.loop = true;

const restartButton = document.getElementById('restart');
const unpauseButton = document.getElementById('unpause');
const instructionsButton = document.getElementById('instructions');
const missionButton = document.getElementById('missionSummary');
const leaderBoardButton = document.getElementById('leaderBoard');
const resetScoresButton = document.getElementById('reset-scores');
const aboutButton = document.getElementById('aboutGame');
const agreeButton = document.getElementById('agreeButton');
const startButton = document.getElementById('startButton');
startButton.disabled = true;

//const startSound = document.getElementById('start-sound');
const sounds = {
    illbeback: 'sounds/illbeback.mp3',
    menuTheme: 'sounds/menu-theme.mp3',
    countdown: 'sounds/countdown.mp3',
    go: 'sounds/go.mp3',
    evillaugh: 'sounds/evillaugh.mp3',
    stopcantwin: 'sounds/stopcantwin.mp3',
    youwilllose: 'sounds/youwilllose.mp3',
    droneExplode: 'sounds/drone-explode.mp3',
    crash: 'sounds/crash.mp3',
    zap: 'sounds/zap.mp3',
    spotlight: 'sounds/spotlight.mp3',
    theme01: 'sounds/let-the-drummer-kick.mp3',
    combo01: 'sounds/combo01.mp3',
    death01: 'sounds/death01.mp3',
    death02: 'sounds/death02.mp3',
    death03: 'sounds/death03.mp3',
    death04: 'sounds/worseThanLand.mp3',
    start01: 'sounds/start.mp3',
    start02: 'sounds/letsGo.mp3',
    start03: 'sounds/plugInTurnUp.mp3',
    start04: 'sounds/unwrapVictory.mp3',
    buttonHover: 'sounds/buttonHover.mp3',
    boxDrop: 'sounds/boxDrop.mp3',
    pause01: 'sounds/pause01.mp3',
    good01: 'sounds/blocktastic.mp3',
    good02: 'sounds/bingo.mp3',
    good03: 'sounds/blockmanRoll.mp3',
    bad01: 'sounds/grumble.mp3',
    bad02: 'sounds/cmonman.mp3',
    bad03: 'sounds/watchit.mp3',
    win01: 'sounds/win01.mp3',
    win02: 'sounds/win02.mp3',
    win03: 'sounds/win03.mp3',
    laser01: 'sounds/laser01.mp3',
    pop: 'sounds/pop.mp3',
    doorchain: 'sounds/doorchain.mp3',
    grandFinale: 'sounds/grandFinale.mp3',
    mickeySelect: 'sounds/mickey-select.mp3',
    blockySelect: 'sounds/blocky-select.mp3',
    r2d2Select: 'sounds/r2d2-select.mp3'
};

// Create sound objects for random selection
const soundObjects = {};
for (const [key, path] of Object.entries(sounds)) {
    soundObjects[key] = new Audio(path);
}

const soundCategories = {
    Death: ['death01', 'death02', 'death03', 'death04'],
    Start: ['start01', 'start02', 'start03','start04'],
    Pause: ['pause01'],
    Combo: ['combo01'],
    Button: ['buttonHover', 'buttonClick'],
    Box: ['buttonHover'],
    Good: ['good01','good02','good03'],
    Bad: ['bad01','bad02','bad03'],
    Laser: ['laser01'],
    Win: ['win01','win02','win03'],
    Door: ['doorchain'],
    Fireworks: ['grandFinale']
};

function playRandomSound(category) {
    const keys = soundCategories[category]; // Get the array of keys for the category
    if (!keys) {
        console.error(`Sound category "${category}" not found.`);
        return;
    }
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    playSound(randomKey); // Play the random sound
}


function playSound(soundKey, speed = 1.0, volume = 1.0) {
    const soundPath = soundObjects[soundKey]; // Retrieve the source path
    if (soundPath) {
        const soundInstance = new Audio(soundPath.src); // Create a new instance for playback
        soundInstance.volume = volume;
        soundInstance.playbackRate = speed; // Set the playback speed
        soundInstance.play().catch(error => {
            console.error(`Error playing sound "${soundKey}":`, error);
        });
    } else {
        console.error(`Sound "${soundKey}" not found.`);
    }
}

let musicOn = false;

function toggleMusic() {
    const toggle = document.getElementById('music-toggle');
    const status = document.getElementById('music-status');

    // Toggle the state
    musicOn = !musicOn;

    // Update the UI
    if (musicOn) {
        toggle.classList.add('on'); // Apply ON styles
        status.textContent = "Music ON ";
    } else {
        toggle.classList.remove('on'); // Remove ON styles
        status.textContent = "Music OFF";
    }

    // Add your music logic here (e.g., play or pause audio)
    console.log(`Music is now ${musicOn ? "ON" : "OFF"}`);
}

function toggleDebug() {
    const toggle = document.getElementById('debug-toggle');
    const status = document.getElementById('debug-status');

    // Toggle the state
    debugMode = !debugMode;

    // Update the UI
    if (debugMode) {
        toggle.classList.add('on'); // Apply ON styles
        status.textContent = "Debug ON";
    } else {
        toggle.classList.remove('on'); // Remove ON styles
        status.textContent = "Debug OFF";
    }

    // Add your music logic here (e.g., play or pause audio)
    console.log(`Debug mode is now ${debugMode ? "ON" : "OFF"}`);
}

let eazMode = false;
function toggleEazMode() {
    const toggle = document.getElementById('eaz-toggle');
    const status = document.getElementById('eaz-status');

    // Toggle the state
    eazMode = !eazMode;

    // Update the UI
    if (eazMode) {
        toggle.classList.add('on'); // Apply ON styles
        status.textContent = "Eaz Mode ON ";
    } else {
        toggle.classList.remove('on'); // Remove ON styles
        status.textContent = "Eaz Mode OFF";
    }

    // Add your music logic here (e.g., play or pause audio)
    console.log(`Eaz Mode is now ${eazMode ? "ON" : "OFF"}`);
}

let selectedCharacter = null;

function selectCharacter(character) {
    selectedCharacter = character;
    startButton.disabled = false;
    console.log(`Character selected: ${character}`);
    playSound(character + "Select");
    //setPlayerModel(character + "-model.gif");
    // Reset all character divs
    const characters = document.querySelectorAll('.character');
    characters.forEach(div => div.classList.remove('selected')); // Remove 'selected' class

    // Add 'selected' class to the clicked character
    const selectedDiv = Array.from(characters).find(div => 
        div.onclick.toString().includes(character)
    );
    if (selectedDiv) {
        selectedDiv.classList.add('selected');
    }
}


function setPlayerModel(image) {
    /*player.style.backgroundImage = `url('imgs/${image}')`;*/
    imagePath = `imgs/${image}`
    player.src = imagePath;
}

function setObjectModel(object,image) {
    object.style.backgroundImage = `url('imgs/${image}')`;
    object.style.backgroundSize = 'cover'; // Ensure the image fits the element
    object.style.backgroundPosition = 'center'; // Center the image
    object.style.backgroundRepeat = 'no-repeat'; // Prevent tiling
}

function callManualPause() {
    if (!isGamePaused) {
        pauseGame(true); // Manual pause
        musicOn && bgMusic.pause()
    } else if (isManualPaused) {
        isManualPaused = false; // Reset manual pause flag
        resumeGame(true); // Manual resume
        musicOn && bgMusic.play();
    }
}

// Add event listeners to all game menu buttons
document.querySelectorAll('#ui-buttons button').forEach((button) => {
    button.addEventListener('mouseover', () => {
        playSound('buttonHover'); // Play hover sound
    });
});
// Agreement button
agreeButton.addEventListener('click', () => {
    showOverlay("agreement",false);
    showOverlay("welcome",true);
    //playSilentSound(); // Initial silent sound
    //startSilentPlayback(); // Begin periodic silent playback
    fadeAudio(menuTheme, 1000, "in");
});
// Start button
startButton.addEventListener('click', () => {
    showOverlay("welcome",false);
    revealSidebarSections();
    difficulty = difficultySelector.value;
    gameDifficulty = difficultyModifier[difficulty];
    userAgreed = true;
});
// Instructions button
instructionsButton.addEventListener('click', () => {
    showOverlay("instructions");
    console.log(gameDifficulty);
});
// Mission button
missionButton.addEventListener('click', () => {
    showOverlay("mission");
});
// Leader Board button
leaderBoardButton.addEventListener('click', () => {
    renderLeaderboard();
});

// Reset Scores button
resetScoresButton.addEventListener('click', () => {
    console.log(storedScores);
    if (confirm("Are you sure you want to reset the leaderboard? This action cannot be undone.")) {
        storedScores = [];
        console.log(typeof storedScores);
        console.log(storedScores);
        localStorage.setItem('blockmanHighScores', JSON.stringify(storedScores));
        updateLeaderboard(); // Call a function to refresh the displayed leaderboard
        console.log("High scores have been reset!")
        console.log
    }
});




// About button
aboutButton.addEventListener('click', () => {
    showOverlay("about");
});


function getHighScores() {
    storedScores = JSON.parse(localStorage.getItem('blockmanHighScores')) || [];
    if (typeof storedScores == "object") {
    return storedScores;
    } else {
        console.log("Uh oh!");
        return;
    }
}

function saveHighScores() {
    localStorage.setItem('blockmanHighScores', JSON.stringify(storedScores));
}

function updateLeaderboard(playerName, score) {
    if (playerName === undefined && score == undefined) {
        renderLeaderboard();
    } else {
            // Add the new score
            console.log("Pushing to the array!");
            console.log(typeof storedScores);
            if (!Array.isArray(storedScores)) {
                storedScores = [];
            }
            storedScores.push({ name: playerName, score: score, character: selectedCharacter });
            // Sort by score in descending order
            storedScores.sort((a, b) => b.score - a.score);
            // Keep only the top 5
            if (storedScores.length > 5) {
                storedScores.pop();
            }
            // Save back to localStorage
            saveHighScores(storedScores);
    }
}

function renderLeaderboard() {
    // Example: Initialize empty leaderboard if none exists
    const leaderBoardUI = document.getElementById('lboard-scores')
    showOverlay("leaderBoard");

    // Clear existing content
    leaderBoardUI.innerHTML = '';

    if (storedScores === undefined || storedScores.length == 0) {
        const scoreElement = document.createElement('div');
        scoreElement.innerHTML = `<center>No high scores! <br><br> Get in there and make the magic happen!</center>`;
        leaderBoardUI.appendChild(scoreElement);
    }
    // Populate leaderboard
    storedScores.forEach((entry, index) => {
        const scoreElement = document.createElement('div');
        scoreElement.textContent = `${index + 1}. ${entry.name} - ${entry.score} (${entry.character})`;
        leaderBoardUI.appendChild(scoreElement);
    });
}



let enterDisabled = false;
// Unpause the game
unpauseButton.addEventListener('click', () => {
    callManualPause();
});
// Restart the game
restartButton.addEventListener('click', () => {
    /*isGameOver = false;*/
    document.querySelectorAll('.falling-object').forEach((obj) => obj.remove()); // Remove old objects
    location.reload(); // Restart game logic
});

// Handle keyboard controls
//Start game from title screen
document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'p' && !isGameOver && !isGameOn) {
        event.preventDefault(); // Prevent whatever
        showNameInputModal();
        }
    if (event.key.toLowerCase() === 't' && !isGameOver && !isGameOn) {
        event.preventDefault(); // Prevent whatever
        showOverlay("test");
        }
    if (event.key === 'Enter' && userAgreed && !isGameOver && !isGameOn && !enterDisabled) {
        enterDisabled = true;
        event.preventDefault(); // Prevent scrolling
        fadeAudio(menuTheme)
        setTimeout(() => musicOn && bgMusic.play(), 500);
        showOverlay("title",false);
        updateScoreDisplay();
        setPlayerModel(selectedCharacter + "-model.gif")
        startCountdown(() => {
            console.log("Game starts now!");
            startGame(); // Replace with your game's start logic
        });
        }
});
// Toggle manual pause/resume
document.addEventListener('keydown', (event) => {
    if (event.key  === ' ' && !isGameOver && isGameOn) {
        event.preventDefault(); // Prevent scrolling
        callManualPause();
        playRandomSound("Pause");
        }
});

function formatGameTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60); // Get the whole minutes
    const seconds = Math.floor(timeInSeconds % 60); // Get the remaining seconds
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Pad seconds to always have 2 digits
}


function revealSidebarSections() {
    const sections = document.querySelectorAll('.sidebar-section');
    playSound("doorchain", .75);
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('revealed');
        }, index * 150); // Delay each section by 300ms
    });
    
}

let playerHealth = 100;

function takeDamage (input) {
    triggerScreenEffect();
    playRandomSound('Bad'); 
    let damage = 0;
    const healthBar = document.getElementById('health-fill');
    // Check if the input is an object with a 'damage' property
    if (typeof input === 'object' && input !== null && 'damage' in input) {
        damage = input.damage;
        const objectIndex = fallingObjects.indexOf(input);
        if (objectIndex !== -1) {
            input.element.remove();
            fallingObjects.splice(objectIndex, 1); // Remove the object from the array
        }
    } 
    // Otherwise, assume it's a direct damage value
    else if (typeof input === 'number') {
        damage = input;
    }
    playerHealth -= damage;
    
    if (playerHealth > 0) {
        console.log(playerHealth)
        healthBar.style.width = `${playerHealth}%`;
    } else {
        gameOver(); // End if you die
        healthBar.style.width = '0%';
    }

}

function updateBoostState(boostActive) {
    if (boostActive && !isBoosting) {
        // Start boosting sound
        boostSound.play();
        isBoosting = true;
    } else if (!boostActive && isBoosting) {
        // Stop boosting sound
        boostSound.pause();
        boostSound.currentTime = 0; // Reset playback position
        isBoosting = false;
    }
}


let laserCooldown = false;
//------------------------------------------------
// Track currently pressed keys and run game loop
//-------------------------------------------------
const keysPressed = {};
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true
    if (event.key === 'ArrowUp') {
        updateBoostState(true);
    }
});

/*document.addEventListener('keyup', (event) => keysPressed[event.key] = false);*/
document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false; // Set the key state to false
    if (event.key === 'ArrowUp') {
        updateBoostState(false);
    }
});

let lastFrameTime = null;
function gameLoop(currentTime) {
    if (isGamePaused || isGameOver) {
        console.log("Game Loop STOPPED!");
        cancelAnimationFrame(animationFrameID);  // Stop the game loop
        cancelAnimationFrame(gameLoop)
        return;
    }
    // Calculate deltaTime and ensure it is valid
    if (!lastTime || isNaN(lastTime)) {
        lastTime = performance.now();  // Proper initialization
    };
    if (!currentTime || isNaN(currentTime)) {
        lastTime = performance.now();  // Proper initialization
    };
    // Calculate deltaTime
    const deltaTime = isNaN((currentTime - lastTime) / 1000) 
    ? 0 
    : Math.max((currentTime - lastTime),0) / 1000;

    lastTime = isNaN(currentTime) 
    ? performance.now()
    : currentTime;  // Update for the next frame

    // Run only if game is active and not paused
    if (isGameOn && !isGamePaused && !isGameOver) {
        survivalScore += deltaTime; // Increment survival time
        roundedSurvivalScore = Math.floor(survivalScore); // Calculate new survival score
        exactGameTime += deltaTime; // Increment game time by the elapsed frame time
        gameTime = Math.floor(exactGameTime);
        if (gameTime != lastGameTime) {
            timerText.textContent = formatGameTime(gameTime);
            lastGameTime = gameTime;
        }
        if (gameTime % 15 === 0 && gameTime !== lastEscalationTime) {
            escalateDifficulty();
            lastEscalationTime = gameTime; 
        }
        // Handle player movement
        if (keysPressed['ArrowLeft'] && playerPosition > 0) {
            playerPosition -= playerSpeed * deltaTime * 60;
        }
        if (keysPressed['ArrowRight'] && playerPosition < gameContainer.offsetWidth - player.offsetWidth) {
            playerPosition += playerSpeed * deltaTime * 60;
        }
        if (keysPressed['ArrowUp']) {
            isBoosting = true;
        }
        if (keysPressed['e'] && !laserCooldown) {
            fireLaser();
            laserCooldown = true;
            setTimeout(() => (laserCooldown = false), 400); // Cooldown duration
        }
        player.style.left = `${playerPosition}px`;
    }
    checkPlayerMovement();
    updatePlayerPosition();
    moveFallingObjects(deltaTime);
    moveDrone(deltaTime);
    updateDrones();            // Check if drones should attack
    updateDroneProjectiles();  // Move drone projectiles and check for collisions
    checkObjectCollisions();
    checkLaserCollisions();
    // Check if all resources are collected
    if (areResourcesFull() && !isGameOver) {
        console.log("All resources collected! You win!");
        gameOver("win");  // End the game
    }
        // Continue the game loop
        animationFrameID = requestAnimationFrame(gameLoop);
}

function moveDrone(deltaTime) {
    if (drones.length === 0) return; // No drone exists

    const drone = drones[0]; // There's only one drone at a time
    const droneElement = drone.element;

    // Get current position
    let leftPosition = parseFloat(droneElement.style.left) || 0;

    // Move drone side to side
    leftPosition += drone.horizontalSpeed * deltaTime * 60;

    // Reverse direction if hitting screen edges
    if (leftPosition <= 0 || leftPosition >= gameContainer.offsetWidth - droneElement.offsetWidth) {
        drone.horizontalSpeed *= -1; // Change direction
        // Apply tilt effect based on movement direction
        droneElement.style.transform = `rotate(${drone.horizontalSpeed > 0 ? "5deg" : "-5deg"})`;

        // Optional: Reset tilt after a short delay to make it more natural
        setTimeout(() => droneElement.style.transform = "rotate(0deg)", 300);
    }

    // Apply new position
    droneElement.style.left = `${leftPosition}px`;
}


function moveFallingObjects(deltaTime) {
    if (isGamePaused || isGameOver) {
        return;
    }
    for (let i = fallingObjects.length - 1; i >= 0; i--) {
        if (isGamePaused) return;
        const object = fallingObjects[i];
        const element = object.element; // The DOM element
        const currentTop = parseFloat(element.style.top) || 0;
        const currentLeft = parseFloat(element.style.left) || 0;

        // Calculate new positions using frame rate-independent movement
        const newTop = currentTop + (object.dropSpeed * 0.5) * deltaTime * 60;
        const newLeft = currentLeft + (object.horizontalSpeed || 0) * deltaTime * 60;

        // Bounce off screen edges
        if (newLeft <= 0 || newLeft + element.offsetWidth >= gameContainer.offsetWidth) {
            object.horizontalSpeed = -(object.horizontalSpeed || 0); // Reverse direction
        }

        // Check if the object has left the screen
        if (newTop > gameContainer.offsetHeight) {
            element.remove(); // Remove from DOM
            fallingObjects.splice(i, 1); // Remove from array
            if (object.isResource) {
                perfectCatchStreak = 0; // Reset perfect catch streak
                console.log("Resource missed! Perfect catch streak ruined!");
            }
        } else {
            element.style.top = `${newTop}px`; // Update vertical position
            element.style.left = `${newLeft}px`; // Update horizontal position
        }
    }
}


function updatePlayerPosition() {
    const playerStyles = window.getComputedStyle(player);
    const playerBottom = parseInt(playerStyles.bottom, 10);
    const playerTop = parseInt(playerStyles.top, 10);
    let newBottom = Math.max(playerBottom + verticalSpeed, 10);

       if (!isBoosting && playerBottom == 10 && BoostModule.boostJuice < 100) {
        BoostModule.recoverPower(1);
        updateBoostBar();
    }

    if (isBoosting && !isGamePaused && BoostModule.boostJuice > 1) {
        playerSpeed = 1;
        verticalSpeed = Math.min(verticalSpeed + boostPower, maxSpeed); // Increase speed with a cap
        BoostModule.spendPower(.25);
        updateBoostBar();
        showBoosterEffect(player);
    } else {
        verticalSpeed = Math.max(verticalSpeed - gravity, -maxSpeed); // Decrease speed with a cap
        hideBoosterEffect(player);
    }

    // When the player hits the ceiling, prevent further movement
    if (playerTop <= 0) {
        verticalSpeed = 0;
        if (!isBoosting) {
            newBottom = (playerBottom - gravity);
            player.style.bottom = `${newBottom}px`;
        }
    } else {
        // Prevent the player from falling below the ground
        if (newBottom <= 10 && !isBoosting) {
            verticalSpeed = 0;
            playerSpeed = 5;
            player.style.bottom = '10px';
        } else {
            player.style.bottom = `${newBottom}px`;
        }
    }
}


function escalateDifficulty() {
    escalationLevel++;
    spawnMax *= escalationFactor;
    spawnMin *= escalationFactor;
    spotlightTrackingTime *= escalationFactor;
    spotlightTimeOut *= escalationFactor;
    console.warn(`Escalation level is now increased to ${escalationLevel}`)
    if (escalationLevel == 2) {
        startStillTime = Date.now();
        playSound("stopcantwin");
        lightningAttack = true;
    }
    if (escalationLevel > 2) {
        spawnDrone();
        playSound("stopcantwin");
    }
}

let lightningLockout = false;
function callLightning(playerPosition) {
    if (lightningLockout) {
        return;
    }
    const spotlight = document.getElementById('spotlight');
    playSound('spotlight', 2, 1)
    spotlight.style.left = `${playerPosition}px`;
    spotlight.style.display = 'block';
    lightningLockout = true;
    setTimeout(() => {
        lightningLockout = false; // wait before allowing another attack
    }, spotlightTimeOut);
    setTimeout(() => {
        // Create an explosion
        const explosion = document.createElement('div');
        explosion.classList.add('explosion');

        // Position the explosion at the player's location
        explosion.style.left = `${playerPosition}px`;
        explosion.style.bottom = `10px`;

        // Add explosion to the game container
        gameContainer.appendChild(explosion);

        // Check collision with the player
        const explosionRect = explosion.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            explosionRect.left < playerRect.right &&
            explosionRect.right > playerRect.left &&
            explosionRect.top < playerRect.bottom &&
            explosionRect.bottom > playerRect.top
        ) {
            console.log("Player hit by the explosion!");
           takeDamage(20);
        }

        // Clean up explosion after animation
        setTimeout(() => {
            explosion.remove();
        }, 500); // Match this duration to your CSS animation

        spotlight.style.display = 'none';
    }, spotlightTrackingTime); // Spotlight display duration
}




let isPlayerMoving = false;
let startStillTime = null; // Timestamp when player stopped moving
let lastPlayerPosition = parseFloat(player.style.left) || 0;

function checkPlayerMovement() {
    const playerPosition = parseFloat(player.style.left) || 0; // Track horizontal position

    if (playerPosition !== lastPlayerPosition || isBoosting) {
        // Player moved
        if (!isPlayerMoving && startStillTime !== null) {
            const stillDuration = Math.floor((Date.now() - startStillTime) / 1000);
            console.log(`Player was still for ${stillDuration} seconds.`);
        }
        isPlayerMoving = true;
        startStillTime = null; // Reset still timer
    } else {
        // Player has not moved
        if (isPlayerMoving) {
            // Player just stopped moving
            isPlayerMoving = false;
            startStillTime = Date.now();
        } else if (startStillTime) {
            const stillDuration = Math.floor((Date.now() - startStillTime) / 1000);
            if (stillDuration >= 1 && lightningAttack) {
                // Player has been still for more than 5 seconds
                console.log("Player has been still for too long! Triggering event...");
                callLightning(playerPosition);
                startStillTime = Date.now(); // Reset the timer to prevent repeated triggering
            }
        }
    }

    // Update the last known position
    lastPlayerPosition = playerPosition;
}
















function areResourcesFull() {
    return Object.keys(collectedResources).every(
        (type) => collectedResources[type] >= resourceNeeded[type]
    );
}



function fireLaser() {
    const laser = document.createElement('div');
    laser.classList.add('laser');
    playRandomSound("Laser");
    // Define laser width as a variable
    const laserWidth = 5;  // Default width, can be changed later
    // Get player and game-container elements
    const gameContainer = document.getElementById('game-container');
    // Use computed styles for accurate player positioning
    const playerStyles = window.getComputedStyle(player);
    const playerLeft = parseInt(playerStyles.left, 10);  // Horizontal position
    const playerBottom = parseInt(playerStyles.bottom, 10); // Vertical position
    const playerHeight = parseInt(playerStyles.height, 10); // Player's height
    // Calculate laser's starting position
    const laserX = playerLeft + player.offsetWidth / 2 - laserWidth / 2;  // Center horizontally
    const laserY = playerBottom + playerHeight;  // Top of the player\
    // Set laser's position
    laser.style.left = `${laserX}px`;
    laser.style.bottom = `${laserY}px`;  // Use bottom since player uses bottom
    laser.style.width = `${laserWidth}px`;  // Set width dynamically
    // Add the laser to the game
    gameContainer.appendChild(laser);
    // Fire laser animation
    laser.animate(
        [
            { transform: `translateY(0px)`, opacity: 1 },
            { transform: `translateY(-150px) scale(0.5)`, opacity: 0 }
        ],
        {
            duration: 400,  // Adjust for timing
            easing: 'ease-out',
            fill: 'forwards'
        }
    );
    // Remove the laser after firing
    setTimeout(() => laser.remove(), 400);
    lasers.push({
        element: laser,
    });
}

function checkObjectCollisions() {
    if (debugMode || isGameOver) return; // Skip collision logic in debug mode
    const playerRect = player.getBoundingClientRect();
    //Prevents splicing at a bad spot in the index as items are removed
    for (let i = fallingObjects.length - 1; i >= 0; i--) {
        const object = fallingObjects[i];
        const objectRect = object.element.getBoundingClientRect();

        if (
            objectRect.left < playerRect.right &&
            objectRect.right > playerRect.left &&
            objectRect.top < playerRect.bottom &&
            objectRect.bottom > playerRect.top
        ) {
            
            if (object.isResource) {
                collectResource(object.objectType); // Collect the resource
                object.element.remove(); // Remove from DOM
                fallingObjects.splice(i, 1); // Remove from array
            } else {
                takeDamage(object);
                return;
            }
        }
    }
}


function checkLaserCollisions() {
    lasers.forEach((laser, laserIndex) => {
        drones.forEach((object, objectIndex) => {
            const laserRect = laser.element.getBoundingClientRect();
            const droneRect = object.element.getBoundingClientRect();
            if (
                laserRect.left < droneRect.right &&
                laserRect.right > droneRect.left &&
                laserRect.top < droneRect.bottom &&
                laserRect.bottom > droneRect.top
            ) {
                // Collision detected
                console.log("You got the drone!");
                object.health -= 25;
                laser.element.remove();
                lasers.splice(laserIndex, 1);
                if (object.health <= 0) {
                    destroyDrone(object);
                }
            }
            
        });
        fallingObjects.forEach((object, objectIndex) => {
            if (!object.isResource) {
            const laserRect = laser.element.getBoundingClientRect();
            const objectRect = object.element.getBoundingClientRect();

            if (
                laserRect.left < objectRect.right &&
                laserRect.right > objectRect.left &&
                laserRect.top < objectRect.bottom &&
                laserRect.bottom > objectRect.top
            ) {
                // Collision detected
                handleLaserCollision(laser, object, laserIndex, objectIndex);
            }
            }
        });
    });
}

function destroyDrone(object) {    
    updateScore(25 * Math.abs(object.horizontalSpeed));
    createDroneExplosion(object.element.style.left, object.element.style.top);
    playSound("droneExplode");
    object.element.remove();
    drones = [];
}

function createDroneExplosion(x, y) {
    const explosion = document.createElement('img');
    explosion.src = 'imgs/blue-explosion.gif'; // Use a unique explosion sprite
    explosion.classList.add('drone-explosion');

    // Set explosion position
    explosion.style.position = "absolute";
    explosion.style.left = x;
    explosion.style.top = y;
    explosion.style.width = "80px"; // Adjust size
    explosion.style.height = "80px";
    explosion.style.zIndex = "5000";

    gameContainer.appendChild(explosion);

    // Remove explosion after animation completes
    setTimeout(() => explosion.remove(), 1000);
}


function handleLaserCollision(laser, object, laserIndex, objectIndex) {
    createExplosion(object);
    laser.element.remove();
    object.element.remove();
    lasers.splice(laserIndex, 1);
    fallingObjects.splice(objectIndex, 1);
    updateScore(10); // Change per difficulty level? Hazard type?
    playSound("crash");
}

function updateBoostBar() {
    const boostBar = document.getElementById('rocket-fill');
    const fuelPercentage = (BoostModule.boostJuice / BoostModule.maxBoostJuice) * 100; // Convert to percentage
    boostBar.style.width = `${fuelPercentage}%`;
}

function showBoosterEffect(player) {
    player.classList.add('boosting');
}

function hideBoosterEffect(player) {
    player.classList.remove('boosting');
}


function createExplosion (object) {
    console.log("BOOM");
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');

    // Get the object's position
    const objectRect = object.element.getBoundingClientRect();
    const gameContainer = document.getElementById('game-container');

    // Position the explosion at the object's location
    explosion.style.left = `${objectRect.left + objectRect.width / 2 - 25}px`;
    explosion.style.top = `${objectRect.top + objectRect.height / 2 - 25}px`;

    // Add explosion to the game container
    gameContainer.appendChild(explosion);

    // Remove explosion after animation
    setTimeout(() => explosion.remove(), 500);
}



// Function to activate a combo part
function activateComboPart(partId) {
    const part = document.getElementById(partId);
    part.classList.add("combo-on"); // Add the active class
}

// Function to reset (deactivate) all combo parts
function resetCombo() {
    const comboParts = document.querySelectorAll(".combo-text");
    comboParts.forEach(part => part.classList.remove("combo-on")); // Remove the active class
}

// Function to update the UI meter
function updateResourceBar(resourceType) {
    const fillBar = document.getElementById(`${resourceType}-fill`);
    const percentage = Math.min(
        (collectedResources[resourceType] / resourceNeeded[resourceType]) * 100,
            100).toFixed(1);  // Cap at 100%
    fillBar.style.width = `${percentage}%`;
}

// Collect resource logic function
function collectResource(type) {
    if (collectedResources[type] !== undefined) {
        collectedResources[type]++;

        // Calculate percentage
        const percentage = Math.min(
            (collectedResources[type] / resourceNeeded[type]) * 100
        ).toFixed(1);  // Rounds to 1 decimal place

        // Resource Collection Points
        if (collectedResources[type] <= resourceNeeded[type]) {
            updateScore(5);  // Correct Resource Bonus
            console.info("Resource collected! 5 points");
        } else {
            updateScore(-3);  // Over-Collection Penalty
            console.info("Overcollection penalty! -3 points");
            triggerScreenEffect();
        }

        // Full Resource Bonus
        if (collectedResources[type] === resourceNeeded[type]) {
            updateScore(20);
            console.info("Full resource bonus! 20 points");
            if (!isGameOver){
                playRandomSound('Good');
            }
        }

        // Perfect Catch Streak Logic
        perfectCatchStreak++;
        if (perfectCatchStreak >= 5) {
            updateScore(25);  // Perfect Catch Streak Reward
            console.info("Perfect Catch Streak Bonus! 25 points!");
            perfectCatchStreak = 0;  // Reset streak
            //to implement? if a resource makes the screen end reset this
        }

        // Combo Multiplier Logic
        if (!comboTracker.includes(type) && collectedResources[type] <= resourceNeeded[type]) {
            comboTracker.push(type);  // Track unique resource types
            activateComboPart(`combo-text-${type}`);
        } else if (comboTracker.includes(type)) {
            comboTracker = []; // reset the tracker
            resetCombo();
            console.log("This item is already inb the combo!");
            comboTracker.push(type);  // Add the resource to start it again
            activateComboPart(`combo-text-${type}`);
        }

        if (comboTracker.length === Object.keys(resourceNeeded).length) {
            comboCounter++;  // Increase the combo counter
            updateScore(5 * comboCounter);  // Apply Combo Bonus
            console.log(`Combo Achieved! Combo Level: ${comboCounter}`);
            comboTracker = [];  // Reset tracker after combo bonus
            resetCombo();
            playRandomSound('Combo');  // Reward sound
        }
        console.log(`Collected ${type}! ${percentage}% collected (${collectedResources[type]} / ${resourceNeeded[type]})`);
        // Update the resource bar
        updateResourceBar(type);

        if (percentage > 100) {
            playRandomSound('Bad');  // Play the sound
        } else if (percentage < 100) { 
            playSound('pop');  // Play the sound
        }
    } else {
        console.error(`Unknown resource type: ${type}`);
    }
}

//Toggles overlay if no boolean is passed, otherwise does as requested
function showOverlay(screenName, show) {
    const screenElement = screens[screenName];  // Look up the element
    if (screenElement) {
        if (show === undefined) { // Determine visibility if 'show' is undefined
            const isCurrentlyVisible = window.getComputedStyle(screenElement).display !== 'none';
            show = !isCurrentlyVisible;  // Toggle state
        }
        // Overlays triggered by UI buttons
        const buttonTriggeredOverlays = ['about', 'mission', 'instructions', 'leaderBoard'];
        // Hide other overlays triggered by buttons
        buttonTriggeredOverlays.forEach((overlayName) => {
            if (overlayName !== screenName && screens[overlayName]) {
                screens[overlayName].style.display = 'none';
            }
        });
        screenElement.style.display = show ? 'block' : 'none'; // Update screen display
    } else {
        console.error(`Screen "${screenName}" not found.`);
    }
}

/*
function fadeAudio(audioElement, duration = 2000) {
    if (!audioElement) {
        console.error("No audio element provided.");
        return;
    }
    // Calculate the interval for volume adjustment
    curVolume = audioElement.volume;
    const step = curVolume / (duration / 50); // Adjust every 50ms
    // Create a fade-out interval
    const fadeInterval = setInterval(() => {
        if (audioElement.volume > 0) {
            audioElement.volume = Math.max(0, audioElement.volume - step); // Reduce volume, ensure it doesn't go below 0
        } else {
            clearInterval(fadeInterval); // Clear interval when volume reaches 0
            audioElement.pause(); // Pause the audio
            audioElement.volume = curVolume; // Reset volume to 1 for future plays
        }
    }, 50);
}*/
function fadeAudio(audioElement, duration = 2000, direction = "out", percent = 0) {
    if (!audioElement) {
        console.error("No audio element provided.");
        return;
    }

    // Validate direction
    const isFadeOut = direction.toLowerCase() === "out";
    const fadeInVol = audioElement.volume

    // Calculate target volume and initial step size
    const targetVolume = isFadeOut ? percent / 100 : fadeInVol;
    const startVolume = isFadeOut ? audioElement.volume : percent / 100;
    const step = Math.abs(startVolume - targetVolume) / (duration / 50); // Adjust every 50ms

    // Set the initial volume for fade-in
    if (!isFadeOut) {
        audioElement.volume = startVolume;
        if (audioElement.paused) audioElement.play(); // Play audio if paused
    }

    // Create the interval for volume adjustment
    const fadeInterval = setInterval(() => {
        if ((isFadeOut && audioElement.volume > targetVolume) ||
            (!isFadeOut && audioElement.volume < targetVolume)) {
            // Adjust volume: subtract for fade-out, add for fade-in
            audioElement.volume = isFadeOut
                ? Math.max(targetVolume, audioElement.volume - step) // Ensure it doesn't go below target
                : Math.min(targetVolume, audioElement.volume + step); // Ensure it doesn't go above target
        } else {
            // Clear the interval when target volume is reached
            clearInterval(fadeInterval);
            if (isFadeOut) {
                audioElement.pause(); // Pause audio for fade-out
            }
        }
    }, 50);
}


function showNameInputModal(playerScore) {
    const modal = document.getElementById('nameInputModal');
    const input = document.getElementById('playerNameInput');
    const button = document.getElementById('submitName');

    modal.style.display = 'block';

    button.onclick = () => {
        const playerName = input.value.trim() || 'Anonymous'; // Default if empty
        updateLeaderboard(playerName, playerScore);
        modal.style.display = 'none';
        renderLeaderboard();
    };
}

// Handle game over
function gameOver(reason) {
    isGameOver = true;
    fadeAudio(bgMusic);
    showOverlay("gameOver",true)
    // Stop all falling objects
    fallingObjects.forEach((object) => {
        clearInterval(object.interval); // Stop the object's movement
        pauseAnimations(true);
    });
    fallingObjects = []; // Clear the array
    clearTimeout(fallingObjectTimeout);
    if (reason === "win") {
        playSound("illbeback");
        setPlayerModel("blocky-happy.png");
        console.log(`WIN -- Player Score: ${playerScore}, Win Bonus: 100, Survival Bonus: ${roundedSurvivalScore}`);
        updateScore(100 + roundedSurvivalScore);  // Survivor Bonus
        console.log(`Win and Survivor Bonus applied: You earned an additional: 100 + ${roundedSurvivalScore} points!`);
        console.log(typeof playerScore, typeof storedScores[storedScores.length - 1]?.score);
        console.log(`Player Score: ${playerScore}`);
        console.log(`Lowest High Score: ${storedScores[storedScores.length - 1]?.score ?? 0}`);
        console.log(`Stored Scores:`, storedScores);
        if (playerScore > (storedScores[4]?.score ?? 0)) {
            console.log("High Score Event triggered");
            showNameInputModal(playerScore);
            playSound('grandFinale');
            grandFinale(100);
            gameOverReasonText.textContent = "🎆 🎆 NEW HIGH SCORE! 🎆 🎆";
        } else {
            console.log(`Not a high score: ${playerScore}`)
            console.log(storedScores)
            gameOverReasonText.textContent = "✨ ✨ You win! ✨ ✨";
            setTimeout(playRandomSound, 1500, "Win");
        }
    } else {
        setPlayerModel(selectedCharacter + "-model-sad.gif");
        gameOverReasonText.textContent = "☠️ ☠️ You lose! ☠️ ☠️";
        eazMode ? playSound("death04") : playRandomSound("Death");
        setTimeout(playSound, 1500, "evillaugh");
    }
}

function updateScore(points = 0) {
    playerScore += points;
    updateScoreDisplay()
    if (playerScore !== previousScore) {
        previousScore = playerScore;
    }
}

function updateScoreDisplay() {
    currentScoreText.textContent = playerScore;  // Update display
    console.log(`Updating score: ${playerScore}`);
}





// Spawn objects at random intervals
function spawnFallingObjectsWithRandomInterval() {
    if (fallingObjectTimeout) {
        clearTimeout(fallingObjectTimeout); // Clear any pending timeout
    }
    const randomInterval = (Math.random() * (1450 - 550) + 550)/gameDifficulty; // Random time between 550ms and 1450ms (easy)
    //const randomInterval = (Math.random() * ((spawnMax - spawnMin) / (escalationLevel + 1)) + spawnMin / (escalationLevel + 1)) / gameDifficulty;
    //const randomInterval = (Math.random() * baseInterval * Math.pow(escalationFactor, escalationLevel)) / gameDifficulty;
    
    fallingObjectTimeout = setTimeout(() => {
        if (!isGameOver && isGameOn && !isGamePaused) {
            spawnFallingObject(); // Spawn a falling object
            spawnFallingObjectsWithRandomInterval(); // Call recursively to set the next interval
        }
    }, randomInterval);
}




const fireworks = []; // Array to hold particles
const fireworkCanvas = document.getElementById('firework-canvas');
const fireworkContext = fireworkCanvas.getContext('2d');
fireworkCanvas.width = fireworkCanvas.offsetWidth;
fireworkCanvas.height = fireworkCanvas.offsetHeight;

function grandFinale(total){
    if(!total){
        triggerFirework(100, 100);
        triggerFirework(300, 200);
        triggerFirework(400, 400);
    } else {
        const randomPop = Math.random() * (100 - 50) + 50; // Random time between 50ms and 100ms
        if (total > 0) {
            total--;
            let randX=Math.random() * (500 - 50) + 50;
            let randY=Math.random() * (700 - 50) + 50;
            setTimeout(() => {
                triggerFirework(randX, randY);
                grandFinale(total); // Call recursively to set the next interval
            }, randomPop);}
    }
}


function triggerFirework(x, y) {
    fireworks.push(createFirework(x, y)); // Add new firework to array

    // Start animation loop if not already running
    if (fireworks.length === 1) {
        animateFireworks();
    }
}

// Firework creation
function createFirework(x, y) {
    const particles = [];
    const particleCount = 50; // Number of particles
    let speed = Math.random() * 3 + 5;
    // Generate particles for the firework
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x,
            y,
            vx: Math.cos((i / particleCount) * 2 * Math.PI) * Math.random() * speed,
            vy: Math.sin((i / particleCount) * 2 * Math.PI) * Math.random() * speed,
            alpha: 1,
            color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`,
        });
    }
    // Return firework object
    return { particles };
}

function animateFireworks() {
    // Clear the canvas
    fireworkContext.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);
    // Loop through each firework
    fireworks.forEach((firework, fireworkIndex) => {
        firework.particles.forEach((particle, particleIndex) => {
            // Update particle position
            particle.x += particle.vx;
            particle.y += particle.vy;
            // Fade out particle
            particle.alpha -= 0.01;
            // Draw particle
            fireworkContext.globalAlpha = particle.alpha;
            fireworkContext.fillStyle = particle.color;
            fireworkContext.beginPath();
            fireworkContext.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            fireworkContext.fill();
            // Remove particle if fully faded
            if (particle.alpha <= 0) {
                firework.particles.splice(particleIndex, 1);
            }
        });
        // Remove firework if no particles are left
        if (firework.particles.length === 0) {
            fireworks.splice(fireworkIndex, 1);
        }
    });

    // Continue animation if fireworks remain
    if (fireworks.length > 0) {
        requestAnimationFrame(animateFireworks);
    }
}




//
//
// Generate falling objects
// main gameplay mechanic!
//
//
function spawnDrone() {
    if (drones.length > 0) {
        return; //do not spawn a second drone
    }
    const object = document.createElement('img');
    object.alt = 'Drone';
    const damage = 30;
    const horizontalSpeed = Math.ceil(Math.random() * 6) // Horizontal speed, random direction
    const health = 100;

    //Set metadata and assign a model
    object.dataset.objectType = "drone";
    object.classList.add('drone');
    object.src = 'imgs/drone-red-gif.gif';
    object.style.position = "absolute";  // Ensure it's positioned correctly
    object.style.width = "100px";  // Adjust as needed
    object.style.zIndex = "5000";
    object.style.opacity = "1";          // Ensure it's fully visible
    object.style.filter = "none";        // Remove any unwanted filters

    //Spawn location
    object.style.left = `20px`;
    object.style.top = `300px`;

    gameContainer.appendChild(object);

    // Track the object and its interval
    drones.push({
        element: object,
        horizontalSpeed,
        damage,
        health,
        attackInterval: 2000, // Attack every 2 seconds (adjust as needed)
        lastAttackTime: Date.now()
    });
}

// Global array for drone projectiles
const droneProjectiles = [];

function spawnDroneProjectile(drone) {
    const projectile = document.createElement('div');
    projectile.classList.add('drone-projectile');
    projectile.style.position = "absolute";
    projectile.style.width = "10px";
    projectile.style.height = "10px";
    projectile.style.backgroundColor = "red"; // You can style this as needed

    // Start at the drone's position
    projectile.style.left = drone.element.style.left;
    projectile.style.top = drone.element.style.top;
    
    gameContainer.appendChild(projectile);

    // Calculate the direction from the drone to the player
    const droneRect = drone.element.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    //const playerRect = player.element.getBoundingClientRect(); // Assumes you have a global player object
    let dx = playerRect.left - droneRect.left;
    let dy = playerRect.top - droneRect.top;
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    dx /= magnitude;
    dy /= magnitude;

    // Add the projectile to the tracking array
    droneProjectiles.push({
        element: projectile,
        dx,
        dy,
        speed: 5,       // Adjust speed as desired
        damage: drone.damage
    });
}

function updateDrones() {
    const now = Date.now();
    drones.forEach(drone => {
        // Check if enough time has passed since the last attack
        if (now - drone.lastAttackTime >= drone.attackInterval) {
            spawnDroneProjectile(drone);
            drone.lastAttackTime = now;
        }
        
        // (Optional) You might also update drone position here if it moves
    });
}


function updateDroneProjectiles() {
    // Use a reverse loop if you plan to remove items while iterating
    for (let i = droneProjectiles.length - 1; i >= 0; i--) {
        const proj = droneProjectiles[i];
        // Get current position
        let left = parseFloat(proj.element.style.left);
        let top = parseFloat(proj.element.style.top);
        
        // Update the position based on direction and speed
        left += proj.dx * proj.speed;
        top += proj.dy * proj.speed;
        proj.element.style.left = left + "px";
        proj.element.style.top = top + "px";
        
        // Check for collision with the player
        if (detectCollision(proj.element, player)) {
            takeDamage(proj.damage)
            // Remove the projectile
            proj.element.remove();
            droneProjectiles.splice(i, 1);
            continue;
        }
        
        // Remove projectile if it goes out of bounds (adjust boundaries as needed)
        if (left < 0 || top < 0 || left > gameContainer.clientWidth || top > gameContainer.clientHeight) {
            proj.element.remove();
            droneProjectiles.splice(i, 1);
        }
    }
}

function detectCollision(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}


function spawnFallingObject() {
    const currentTime = Date.now();
    
    // Check eligible types based on cooldown
    const eligibleTypes = Object.keys(spawnCooldowns).filter(type => {
        return currentTime - spawnCooldowns[type] >= cooldownDurations[type];
    });
    // Define the type to spawn
    let randomObject; 
    if (eligibleTypes.length > 0) {
        // Randomly pick from eligible types
        randomObject = eligibleTypes[Math.floor(Math.random() * eligibleTypes.length)];
    } else {
        // Default to hazard if no type is eligible
        randomObject = "hazard";
    }
    const object = document.createElement('img');
    object.alt = 'Object';
    const isResource = randomObject !== "hazard"; // Resources vs hazards
    // Set drop speed based on type
    const dropSpeed = randomObject === "supplies" 
        ? 2 * gameDifficulty
        : (Math.ceil(Math.random() * 4 + 4))*gameDifficulty;
    const damage = randomObject === "hazard" 
    ? 5 * (gameDifficulty * 3)
    : 0;
    const horizontalSpeed = randomObject === "supplies" 
        ? 0
        : (Math.random() - 0.5) * 4 // Horizontal speed, random direction

    //Set metadata and assign a model
    object.dataset.objectType = randomObject;
    object.classList.add(`falling-${randomObject}`);
    if (isResource) {
        object.src = `imgs/crate-${randomObject}.png`;
    } else {
        eazMode ? object.src = "imgs/ketchup.png" : object.src = `imgs/fallingObject${Math.ceil(Math.random() * 3)}.png`;
    }
    // Randomize animations
    const animations = ['fall-rotate', 'fall-wiggle'];
    if (randomObject === "supplies") {
        object.classList.add('fall-wiggle');
    } else {
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        object.classList.add(randomAnimation);
    }
    //Spawn in a random place
    object.style.left = `${Math.random() * (gameContainer.offsetWidth - 50)}px`;
    object.style.top = `0px`;

    gameContainer.appendChild(object);
    playSound("buttonHover");
    // Track cooldown for the spawned type
    if (randomObject !== "hazard") {
        spawnCooldowns[randomObject] = currentTime; // Update the cooldown timer
    }

    // Track the object and its interval
    fallingObjects.push({
        element: object,
        horizontalSpeed,
        dropSpeed,
        isResource,
        damage,
        objectType: randomObject,
    });
}


function pauseAnimations(pause = true) {
    document.querySelectorAll('.falling-supplies, .falling-hazard, .falling-food, .falling-fuel, .laser, img').forEach((object) => {
        object.style.animationPlayState = pause ? 'paused' : 'running';
    });
}

// Wrap spawn logic in a function to allow restarting
function startGame() {
    isGameOn = true;
    // Initialize lastTime before the game starts
    lastTime = performance.now();
    console.log*(`Music: ${musicOn}`);
    stopSilentPlayback(); // Stop silent playback when the game starts
    gameLoop();
    spawnFallingObjectsWithRandomInterval();
}


function pauseGame(manual = false) {
    if (!isGamePaused && !isGameOver) {
        console.log(manual ? "Manual pause triggered" : "Auto-pause triggered");

        // Update game state
        isGamePaused = true;
        if (manual) isManualPaused = true;

        // Stop game logic
        clearTimeout(fallingObjectTimeout); // Clear the timeout for spawning objects

        // Pause animations and show pause overlay
        pauseAnimations(true);
        showOverlay("pause", true);
    } else {
        console.log("why are you calling pause when the game is already paused or over?!")
    }
}

function resumeGame(manualResume = false) {
    if (isGamePaused && !isGameOver) {
        console.log(manualResume ? "Manual resume triggered" : "Auto-resume triggered");
        lastTime = performance.now();
        // Update game state
        isGamePaused = false;
        if (!isManualPaused) isAutoPaused = false;

        // Resume game loop
        animationFrameID = requestAnimationFrame(gameLoop);

        // Restart object spawner
        spawnFallingObjectsWithRandomInterval();

        // Resume animations and hide pause overlay
        pauseAnimations(false);
        showOverlay("pause", false);
    }
}


// Unified focus and visibility handling
document.addEventListener('visibilitychange', () => {
    if (document.hidden && !isGameOver && isGameOn) {
        pauseGame(); // Auto-pause
        isAutoPaused = true;
    } else if (!isManualPaused && isAutoPaused && !isGameOver) {
        resumeGame(); // Auto-resume only if not manually paused
    }
});

window.addEventListener('blur', () => {
    if (!isGameOver && isGameOn) {
        pauseGame(); // Auto-pause
        isAutoPaused = true;
    } 
});

function triggerElectricEffect() {
    const electricBorder = document.getElementById('electric-border');
    electricBorder.classList.add('active');
    // Remove the effect after 2 seconds (matching the animation duration)
    setTimeout(() => {
        electricBorder.classList.remove('active');
    }, 2000);
}

function triggerScreenEffect() {
    const redOverlay = document.getElementById('red-overlay');
    // Add the shake animation
    gameContainer.classList.add('shake');
    // Show the red overlay
    redOverlay.style.opacity = 1;
    // Remove the shake animation after it completes (400ms)
    setTimeout(() => {
        gameContainer.classList.remove('shake');
    }, 400);
    // Fade out the red overlay
    setTimeout(() => {
        redOverlay.style.opacity = 0;
    }, 200);
}


function startCountdown(callback) {
    const countdownElement = document.getElementById('countdown');
    const messages = ["3", "2", "1", "GO!"];
    let index = 0;

    function showNextMessage() {
        if (index < messages.length) {
            // Update the countdown text
            if (index < messages.length-1) {
                playSound("countdown"); 
            } else {
                playSound("go");
                setTimeout(() => playSound("youwilllose"), 1000); 
            }
            countdownElement.textContent = messages[index];
            countdownElement.style.animation = "none"; // Reset animation
            void countdownElement.offsetWidth; // Trigger reflow to restart animation
            countdownElement.style.animation = "fadeScale 1s ease-out forwards";

            index++;
            setTimeout(showNextMessage, 1000); // Show next message after 1 second
        } else {
            // When countdown is over, remove the element and start the game
            
            countdownElement.style.display = "none";
            if (callback) callback(); // Start the game via callback
        }
    }

    // Start the countdown
    showNextMessage();
}


// Opening
highScoreText.textContent = storedScores[0]?.score ?? 0;
showOverlay("title",true);
