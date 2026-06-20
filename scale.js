//
// scale.js
// Fit the fixed-size game (650x700) to any screen.
//
// The whole game uses a fixed pixel layout and absolute positioning, so it can't
// reflow. Instead of rewriting the layout, we keep the internal resolution fixed
// and visually scale the entire #raingame wrapper with a CSS transform — the same
// "scale to fit" approach Phaser/Unity/etc. use. Because the player AND the
// falling objects scale by the same factor, getBoundingClientRect() collisions
// still line up and the px-based movement math is untouched: this is purely
// presentational.
//
// We never scale ABOVE 1, so desktop keeps the native 650x700 size; small screens
// shrink to fit (letterboxed by the body's dark background + flex centering).
//

(function () {
    const GAME_WIDTH = 650;
    const GAME_HEIGHT = 700;
    const game = document.getElementById('raingame');
    if (!game) return;

    function fit() {
        const scale = Math.min(
            window.innerWidth / GAME_WIDTH,
            window.innerHeight / GAME_HEIGHT,
            1 // don't upscale past the native size
        );
        game.style.transform = `scale(${scale})`;
    }

    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
    fit();
})();
