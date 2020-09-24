import $ from "jquery";
import Dimension from './Dimension';

export default function DimensionsInterface() {

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

    this.addDimension = function (name, data) {
        $this.append('<div class="dimension" id="dimension-' + name + '"></div>');
        const dimension = new Dimension(name, data);
        dimension.init();
        objects.push(dimension);
    };

    this.addDimensions = function (list) {
        Object.keys(list).forEach(name => this.addDimension(name, list[name]))
    };

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