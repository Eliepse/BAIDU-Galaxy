import $ from "jquery";
import HUD from "./hud";

export default function Dimension(name, data) {
    let $this = $("#dimension-" + name),
        rotation = {speed: 25, direction: 0},
        radius = 50,
        layer = 1,
        planets = {};

    function initiate() {
        HUD.tLog("Initiate dimension: " + name);
        radius = data.radius;
        layer = data.layer;
        rotation.speed = data.rotationSpeed;
        rotation.direction = data.rotationDirection;
        // THIS IS FOR THE FUN
        $this.css("background-image", "url(" + data.bckg + ")").css("background-repeat", "no-repeat").css("background-position", "middle");
        $this.css("animation-duration", rotation.speed + "s");
    }

    this.getName = function () {
        return name;
    };

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

    this.fadeIn = function () {
        $this.fadeIn();
    };

    this.fadeOut = function () {
        $this.fadeOut();
    };

    this.init = initiate;
}