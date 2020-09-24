'use strict';

import HUD from './lib/hud'
import GPU from './lib/gpu'
// Check compatibility with original v2.1.4
import $ from 'jquery';
import system from "../../data/system-0"
import SolarSystem from "./lib/SolarSystem";
import Solar from "./lib/Solar";
import {window_reference} from "./lib/Globals";

/*function Iterator(arrayMap) {

    'use strict';

    var values = [],
        i = 0,
        length,
        key;

    function Entry(key, value) {

        this.key = key;
        this.value = value;

    }

    for (key in arrayMap) {

        console.log(key);

        if (arrayMap.hasOwnProperty(key)) {
            values.push(new Entry(key, arrayMap[key]));
        }
    }

    length = values.length;

    this.length = length;

    this.next = function () {


        if (i < length) {

            var val = values[i];
            i += 1;
            return val;

        } else {

            return false;

        }

    };

    this.previous = function () {

        if (i > 0) {

            i -= 1;
            return values[i];

        } else {

            return false;

        }

    };

    this.reset = function () {

        i = 0;

    };

}

function Planet() {
}*/


function isBlacklistedKey(key) {
    return key === 17 || key === 18 || key === 91;
}

HUD.showDebug();
HUD.infos.log("frameCount", 0);
HUD.infos.log("GPU", "pause");
HUD.title.fix = "@ Baidu Galaxy @";
HUD.title.set("Construction des objects");

const solarSystem = new SolarSystem("system-0", system);

solarSystem.init(function () {
    solarSystem.getDimensions().playAll();
    solarSystem.updateChildren();
    solarSystem.fadeIn();
    HUD.title.reset();
});


GPU.draw(function () {
    HUD.infos.log("frameCount", GPU.getFrameCount());
});


$(document).on("keydown", function (e) {
    if (isBlacklistedKey(e.keyCode)) {
        return;
    }
    GPU.play();
});

$(document).on("keyup", function () {
    GPU.pause();
});

$(window).resize(function () {
    solarSystem.updateSize();
    solarSystem.updateChildren();
});