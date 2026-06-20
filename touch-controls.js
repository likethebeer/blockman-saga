//
// touch-controls.js
// Mobile / tablet support for Blockman.
//
// Design goal: the game loop in main.js already drives all movement off the
// `keysPressed` object (ArrowLeft / ArrowRight / ArrowUp for boost, 'e' for
// laser). So instead of adding a parallel input path, a touch simply *acts
// like a held key*. That means the loop, collision, and boost logic need
// zero changes -- this file just flips the same flags main.js already reads.
//

(function () {
    // Only activate on devices that actually have touch. Desktop keeps the
    // pure keyboard experience with no on-screen buttons cluttering the view.
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    document.body.classList.add('touch-enabled');

    // Mirror the keyboard handlers from main.js exactly: setting ArrowUp also
    // needs to kick the boost sound/state, same as the real keydown listener.
    function pressKey(key) {
        keysPressed[key] = true;
        if (key === 'ArrowUp') updateBoostState(true);
    }
    function releaseKey(key) {
        keysPressed[key] = false;
        if (key === 'ArrowUp') updateBoostState(false);
    }

    // Bind a button so that holding it = holding the key, releasing = keyup.
    function bindHold(btn, key) {
        if (!btn) return;
        const start = (e) => {
            e.preventDefault();          // stop the tap from scrolling / zooming
            btn.classList.add('pressed');
            pressKey(key);
        };
        const end = (e) => {
            e.preventDefault();
            btn.classList.remove('pressed');
            releaseKey(key);
        };
        btn.addEventListener('touchstart', start, { passive: false });
        btn.addEventListener('touchend', end, { passive: false });
        btn.addEventListener('touchcancel', end, { passive: false });
    }

    bindHold(document.getElementById('touch-left'), 'ArrowLeft');
    bindHold(document.getElementById('touch-right'), 'ArrowRight');
    bindHold(document.getElementById('touch-boost'), 'ArrowUp');
    bindHold(document.getElementById('touch-fire'), 'e');

    // Pause is a tap, not a hold -- mirror the spacebar handler in main.js.
    const pauseBtn = document.getElementById('touch-pause');
    if (pauseBtn) {
        pauseBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!isGameOver && isGameOn) {
                callManualPause();
                playRandomSound('Pause');
            }
        }, { passive: false });
    }

    // Safety net: if every finger leaves the screen, clear any still-held
    // virtual keys. Prevents a "stuck" direction if a finger slides off a
    // button and its own touchend never fires.
    window.addEventListener('touchend', (e) => {
        if (e.touches.length === 0) {
            ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'e'].forEach((k) => {
                if (keysPressed[k]) releaseKey(k);
            });
            document.querySelectorAll('.touch-btn.pressed')
                .forEach((b) => b.classList.remove('pressed'));
        }
    }, { passive: true });

    // The title screen says "PRESS ENTER TO BEGIN" -- but phones have no Enter
    // key, so the game would be unreachable on mobile. Make a tap on the title
    // run the same start flow. beginGameFromTitle() lives in main.js.
    const title = document.getElementById('game-title');
    if (title) {
        title.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (typeof beginGameFromTitle === 'function') beginGameFromTitle();
        }, { passive: false });
    }
})();
