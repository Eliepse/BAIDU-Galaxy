import HUD from "./hud";

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function GPU() {

    'use strict';

    let frameCount = 0,
        fps = 40,
        now,
        then = Date.now(),
        interval = 1000 / fps,
        delta,

        speed = 1,
        isPause = false,

        draw = function () {
        };

    this.draw = function (foo) { draw = foo; };

    function compute(parent) {

        if (isPause) { return; }

        //JSLint @
        requestAnimationFrame(compute);

        now = Date.now();
        delta = now - then;

        if (delta > interval) {

            then = now - (delta % interval);

            frameCount += 1;
            draw();

        }

    }

    this.getFrameCount = function () { return frameCount; };

    this.play = function () {

        isPause = false;
        HUD.infos.log("GPU", "play");
        requestAnimationFrame(compute);

    };

    this.pause = function () {

        isPause = true;
        HUD.infos.log("GPU", "pause");

    };


}

export default new GPU();