import $ from "jquery";
import HUD from "./hud";
import DimensionsInterface from "./DimensionInterface";
import {window_reference} from "./Globals";

export default function SolarSystem(name, data) {
    let $this = $('#solar_system'),
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
        HUD.log("Initiate solar system: " + name);
        updateSize();
        dimensions.init(this);
        name = data.name;
        dimensions.addDimensions(data.dimensions);
        if (callback !== undefined) {
            callback();
        }
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