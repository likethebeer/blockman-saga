//
// touch-controls.js
// Mobile / tablet support for Blockman.
//
// A touch *acts like a held key*: buttons flip the same `keysPressed` flags the
// keyboard uses, so the game loop needs no changes. We use Pointer Events with
// pointer capture (not raw touchstart/touchend) so a hold keeps registering even
// if the finger slides slightly off the button, and so multi-touch (move + fire)
// is reliable.
//

(function () {
    // Only activate on devices that actually have touch. Desktop stays keyboard-only.
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    document.body.classList.add('touch-enabled');

    function pressKey(key) {
        keysPressed[key] = true;
        if (key === 'ArrowUp') updateBoostState(true);
    }
    function releaseKey(key) {
        keysPressed[key] = false;
        if (key === 'ArrowUp') updateBoostState(false);
    }

    // Hold a button = hold the key. Pointer capture keeps the press bound to this
    // button until the finger lifts, even if it drifts off the button's bounds.
    function bindHold(btn, key) {
        if (!btn) return;
        const down = (e) => {
            e.preventDefault();
            btn.classList.add('pressed');
            pressKey(key);
            try { btn.setPointerCapture(e.pointerId); } catch (_) {}
        };
        const up = (e) => {
            if (e) e.preventDefault();
            btn.classList.remove('pressed');
            releaseKey(key);
        };
        btn.addEventListener('pointerdown', down);
        btn.addEventListener('pointerup', up);
        btn.addEventListener('pointercancel', up);
        btn.addEventListener('lostpointercapture', up);
    }

    bindHold(document.getElementById('touch-left'), 'ArrowLeft');
    bindHold(document.getElementById('touch-right'), 'ArrowRight');
    bindHold(document.getElementById('touch-boost'), 'ArrowUp');
    bindHold(document.getElementById('touch-fire'), 'e');

    // Pause is a tap, not a hold.
    const pauseBtn = document.getElementById('touch-pause');
    if (pauseBtn) {
        pauseBtn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            if (!isGameOver && isGameOn) {
                callManualPause();
                playRandomSound('Pause');
            }
        });
    }

    // Phones have no Enter key, so tapping the title screen starts the game.
    const title = document.getElementById('game-title');
    if (title) {
        title.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            if (typeof beginGameFromTitle === 'function') beginGameFromTitle();
        });
    }
})();
