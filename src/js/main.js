'use strict';

import HUD from './lib/hud'
import GPU from './lib/gpu'
// Check compatibility with original v2.1.4
import $ from 'jquery';

/*global
	requestAnimationFrame, $
*/

function Iterator(arrayMap) {

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


function isBlacklistedKey(key) {
    return key === 17 || key === 18 || key === 91;
}

const window_reference = {x: 1440, y: 900};
window_reference.diagonal = Math.sqrt(Math.pow(window_reference.x, 2) + Math.pow(window_reference.y, 2));

HUD.showDebug();
HUD.infos.log("frameCount", 0);
HUD.infos.log("GPU", "pause");
HUD.title.fix = "@ Baidu Galaxy @";
HUD.title.set("Construction des objects");

let solarSystem, solar;

function Planet() {
}

function SolarSystem(dName) {
    let $this = $('#solar_system'),
        dirName = dName,
        name = "Data not fetched",
        size = {x: 0, y: 0},
        center = {x: 0, y: 0},
        diagonal = 0,
        scaleFactor = 1,
        dimensions = new DimensionsInterface();

    function updateSize() {
        size.x = $this.width();
        size.y = $this.height();
        center.x = size.x / 2;
        center.y = size.y / 2;
        diagonal = Math.sqrt(Math.pow(size.x, 2) + Math.pow(size.y, 2));
        scaleFactor = diagonal / window_reference.diagonal;
        HUD.infos.log("size", size.x + 'x ' + size.y + 'y');
        HUD.infos.log("center", center.x + 'x ' + center.y + 'y');
        HUD.infos.log("scaleFactor", scaleFactor.toFixed(3), 'px');
    }

    function initiate(callback) {
        updateSize();
        dimensions.init(this);
        fetchData(callback);
    }

    function fetchData(callback) {
        HUD.tLog("loading " + dirName + " data");
        $.ajax({
            type: "GET",
            url: "data/" + dirName + "/config.json",
            dataType: "JSON",
            error: function (e, f, g) {
                console.log(g);
                HUD.log("solarSystem loadingdata : " + f);
            },
            success: function (data) {
                HUD.log("Data of solarSystem loaded");
                name = data.name;
                dimensions.addDimensions(data.dimensions);
                if (callback !== undefined) {
                    callback();
                }
            }
        });
    }

    function updateChildren() {
        solar.resizeEvent(center, scaleFactor);
        dimensions.resizeEvent(center, scaleFactor);
    }

    this.getCenter = function () {
        return center;
    };
    this.getSize = function () {
        return size;
    };
    this.getScaleFactor = function () {
        return scaleFactor;
    };
    this.getName = function () {
        return name;
    };
    this.getDimensions = function () {
        return dimensions;
    };
    this.updateSize = updateSize;
    this.updateChildren = updateChildren;
    this.init = initiate;

}


function Dimension(dName) {
    let $this = $("#dimension-" + dName),
        name = dName,
        rotation = {speed: 25, direction: 0},
        radius = 50,
        layer = 1,
        planets = {};

    function initiate() {
    }

    this.getName = function () {
        return name;
    };

    function fetchData(callback) {
        HUD.tLog("loading " + name + " data");
        console.log("data/" + solarSystem.getName() + "/dimension-" + name + ".json")
        $.ajax({
            type: "GET",
            url: "data/" + solarSystem.getName() + "/dimension-" + name + ".json",
            dataType: "JSON",
            error: function (e, f, g) {
                console.log(g);
                HUD.log(name + " loadingdata : " + f);
            },
            success: function (data) {
                HUD.log("Data of " + name + " loaded");
                radius = data.radius;
                layer = data.layer;
                rotation.speed = data.rotationSpeed;
                rotation.direction = data.rotationDirection;
                // THIS IS FOR THE FUN
                $this.css("background-image", "url(" + data.bckg + ")").css("background-repeat", "no-repeat").css("background-position", "middle");
                $this.css("animation-duration", rotation.speed + "s");
                if (callback !== undefined) {
                    callback();
                }
            }
        });
    }

    this.play = function () {
        if (rotation.direction === 1) {
            $this.addClass("clockRotation");
        } else if (rotation.direction === -1) {
            $this.addClass("aclockRotation");
        }

    };

    this.pause = function () {

        $this.removeClass("clockRotation aclockRotation");

    };

    this.fetchData = fetchData;

    this.fadeIn = function () {
        $this.fadeIn();
    };

    this.fadeOut = function () {
        $this.fadeOut();
    };

    this.init = initiate;
}


function DimensionsInterface() {

    let $this = $('#dimensions'),
        position = {x: 0, y: 0},
        offset = {x: 0, y: 0},
        defaultSize = 750,
        size = 750,
        objects = [];

    function updatePosition() {
        $this.css('left', position.x + offset.x + 'px').css('top', position.y + offset.y + 'px');
    }

    function updateSize() {
        offset.x = offset.y = -size / 2;
        $this.css('width', size + 'px').css('height', size + 'px');
    }

    function initiate(solarSystem) {
        size = defaultSize * solarSystem.getScaleFactor();
        updateSize();
        position = solarSystem.getCenter();
        updatePosition();
    }

    this.setX = function (x) {
        position.x = x;
        updatePosition();
    };
    this.setY = function (y) {
        position.y = y;
        updatePosition();
    };
    this.setPosition = function (x, y) {
        position.x = x;
        position.y = y;
        updatePosition();
    };
    this.setOffsetX = function (x) {
        offset.x = x;
        updatePosition();
    };
    this.setOffsetY = function (y) {
        offset.y = y;
        updatePosition();
    };
    this.setSize = function (s) {
        size = s;
        updateSize();
        updatePosition();
    };

    this.getOffset = function () {
        return offset;
    };
    this.getPosition = function () {
        return position;
    };
    this.getDefaultSize = function () {
        return defaultSize;
    };
    this.getSize = function () {
        return size;
    };

    this.addDimension = function (dName) {
        $this.append('<div class="dimension" id="dimension-' + dName + '"></div>');
        objects.push(new Dimension(dName));
    };

    this.addDimensions = function (list) {
        let i = 0;
        for (i; i < list.length; i += 1) {
            this.addDimension(list[i]);
        }
    };

    this.fetchChildren = function (callback) {
        for (var i = 0; i < objects.length; i++) {
            if (i == objects.length - 1 && callback !== undefined) objects[i].fetchData(callback);
            else objects[i].fetchData();
        }
    }

    this.resizeEvent = function (center, scaleFactor) {
        size = defaultSize * scaleFactor;
        updateSize();
        position = center;
        updatePosition();
    };

    this.playAll = function () {
        for (let i = 0; i < objects.length; i++)
            objects[i].play();
    };

    this.fadeIn = function () {
        $this.fadeIn();
    };

    this.fadeOut = function () {
        $this.fadeOut();
    };

    this.init = initiate;
}


function Solar() {

    let $this = $('#solar'),
        position = {x: 0, y: 0},
        offset = {x: 0, y: 0},
        defaultSize = 150,
        size = 150;

    function updatePosition() {

        $this.css('left', position.x + offset.x + 'px').css('top', position.y + offset.y + 'px');

    }

    function updateSize() {

        offset.x = offset.y = -size / 2;
        $this.css('width', size + 'px').css('height', size + 'px');

    }

    function initiate() {

        offset.x = offset.y = -size / 2;
        $('#solar').css("background-image", "url(src/img/soleil_0.png)");
        updatePosition();

    }


    this.setX = function (x) {
        position.x = x;
        updatePosition();
    };
    this.setY = function (y) {
        position.y = y;
        updatePosition();
    };
    this.setPosition = function (x, y) {

        position.x = x;
        position.y = y;
        updatePosition();

    };
    this.setOffsetX = function (x) {
        offset.x = x;
        updatePosition();
    };
    this.setOffsetY = function (y) {
        offset.y = y;
        updatePosition();
    };
    this.setSize = function (s) {
        size = s;
        updateSize();
        updatePosition();
    };

    this.getOffset = function () {
        return offset;
    };
    this.getPosition = function () {
        return position;
    };
    this.getDefaultSize = function () {
        return defaultSize;
    };
    this.getSize = function () {
        return size;
    };

    this.resizeEvent = function (center, scaleFactor) {

        size = defaultSize * scaleFactor;
        updateSize();

        position = center;
        updatePosition();

    };

    this.fadeIn = function () {

        $this.fadeIn();

    };

    this.fadeOut = function () {

        $this.fadeOut();

    };

    this.init = initiate;

}


solarSystem = new SolarSystem("system-0");
solar = new Solar();
solar.init();

solarSystem.init(function () {

    solarSystem.getDimensions().fetchChildren(function () {

        solarSystem.getDimensions().playAll();

    });
    solarSystem.updateChildren();
    solar.fadeIn();
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