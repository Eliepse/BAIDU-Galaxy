import $ from "jquery";

export default function Solar() {

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