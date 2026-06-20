//
// scale.js
// Fit the fixed-size game (650x700) to any screen.
//
// Two modes:
//   - Landscape / desktop: the game keeps its fixed 650x700 layout and is
//     visually scaled with a CSS transform to fit (the "scale to fit" approach
//     Phaser/Unity use). Never scales above 1x, so desktop is native size.
//   - Portrait phones: we DON'T scale. Instead the CSS (see the portrait media
//     query in styles.css) reflows the game into a stacked layout — play area on
//     top, compact HUD below — so the play field can use the full screen width.
//
// Either way the game's px-based movement/collision math is unaffected: it reads
// gameContainer.offsetWidth/Height dynamically, and a transform scales the player
// and objects together.
//

(function () {
    const GAME_WIDTH = 650;
    const GAME_HEIGHT = 700;
    const game = document.getElementById('raingame');
    if (!game) return;

    const portrait = window.matchMedia('(orientation: portrait) and (max-width: 820px)');

    function fit() {
        if (portrait.matches) {
            // CSS handles the stacked portrait layout; clear any scale transform.
            game.style.transform = 'none';
            return;
        }
        const scale = Math.min(
            window.innerWidth / GAME_WIDTH,
            window.innerHeight / GAME_HEIGHT,
            1 // don't upscale past the native size
        );
        game.style.transform = `scale(${scale})`;
    }

    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
    // matchMedia change fires when crossing the portrait/landscape boundary.
    if (portrait.addEventListener) portrait.addEventListener('change', fit);
    fit();
})();
