/*global
	requestAnimationFrame, $
*/
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;




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

		if (arrayMap.hasOwnProperty(key)) {
			values.push(new Entry(key, arrayMap[key]));
		}
	}

	length = values.length;

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

function HUD() {
	
	'use strict';
	
	var printDebug = false;
	
	this.title = {

		title : "",

		fix : "",

		set : function (str) {

			this.title = str;
			document.title = str;

		},

		update : function (object) {

			document.title = this.title.replace("{value}", object);

		},

		reset : function () {

			document.title = this.fix;

		}

	};
	
	this.infos = {
		
		objects : {},
		
		log : function (prop, val, attr) {
			
			if (!printDebug) { return; }
			
			if (this.objects.hasOwnProperty(prop)) {
				
				this.objects[prop].innerHTML = prop + ' : ' + val + this.objects[prop].attr;
				
				if (attr === undefined) {
					this.objects[prop].attr = "";
				} else {
					this.objects[prop].attr = attr;
				}
			
			} else {
				
				this.objects[prop] = {html : "", attr : ""};
				this.objects[prop].html = document.createElement("li");
				this.objects[prop].html.id = prop;
				document.getElementById("debug").appendChild(this.objects[prop].html);
				this.objects[prop] = document.getElementById(prop);
				if (attr === undefined) {
					this.objects[prop].attr = "";
				} else {
					this.objects[prop].attr = attr;
				}
				this.objects[prop].innerHTML = prop + ' : ' + val + this.objects[prop].attr;
				
			}
			
		},
		
	};
			
	this.tLog = function (val) {

		document.getElementById("tLog").innerHTML = val;

	};
	
	this.showDebug = function () {
	
		
		printDebug = true;
		document.getElementById("debug").style.display = "block";
		
	};
	
	this.hideDebug = function () {
		
		printDebug = false;
		document.getElementById("debug").style.display = "none";
		
	};

}

function GPU() {
	
	'use strict';
	
	var frameCount = 0,
		fps = 40,
		now,
		then = Date.now(),
		interval = 1000 / fps,
		delta,
		
		speed = 1,
		isPause = false,
		
		draw = function () {};
	
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

function isBlacklistedKey(key) {
	
	'use strict';
	
	if (key === 17 || key === 18 || key === 91) { return true; }
	
	return false;
	
}




var HUD = new HUD();
var GPU = new GPU();
var window_reference = { x : 1440, y : 900 };
window_reference.diagonal = Math.sqrt(Math.pow(window_reference.x, 2) + Math.pow(window_reference.y, 2));

HUD.showDebug();
HUD.infos.log("frameCount", 0);
HUD.infos.log("GPU", "pause");

HUD.title.fix = "@ Baidu Galaxy @";
HUD.title.set("Construction des objects");





$(function () {
	
	'use strict';
	
	var solarSystem, solar;
	
	function Planet() {}
	
	
	function SolarSystem() {
		
		var $this = $('#solar_system'),
			size = { x : 0, y : 0 },
			center = { x : 0, y : 0 },
			diagonal = 0,
			scaleFactor = 1,
			dimensions = [];
		
		function updateSize() {
			
			size.x = $this.width();
			size.y = $this.height();
			
			center.x = size.x / 2;
			center.y = size.y / 2;
			
			diagonal = Math.sqrt(Math.pow(size.x, 2) + Math.pow(size.y, 2));
			scaleFactor = diagonal / window_reference.diagonal;
			
			HUD.infos.log("size", size.x + 'x ' + size.y + 'y');
			HUD.infos.log("center", center.x + 'x ' + center.y + 'y');
			HUD.infos.log("scaleFactor", scaleFactor, 'px');
			
		}
		
		function initiate() {
			
			updateSize();
			
		}
		
		function updateChildren() {
			
			solar.setPosition(center.x, center.y);
			solar.setSize(solar.getDefaultSize() * scaleFactor);
			
			for (var i=0; i<dimensions.length;i++) {
				
				var dim = dimensions[i];
				dim.setPosition(center.x, center.y);
				dim.setSize(dim.getDefaultSize() * scaleFactor);
				
			}
			
		}
		
		this.addDimension = function () {
			
			var i = dimensions.length;
			$this.append('<div class="dimension" id="dimension-' + i + '"></div>');
			dimensions.push(new Dimension(i));
			dimensions[i].fetchData(function () {
				
				HUD.tLog("Dimension-" + i + "  loaded");
				
			});
			
		};
		
		this.getCenter = function () { return center; };
		this.getSize = function () { return size; };
		this.getScaleFactor = function () { return scaleFactor; };
		
		this.updateSize = updateSize;
		this.updateChildren = updateChildren;
		
		this.init = initiate;
		
	}
	
	function Dimension(id) {
		
		var $this = $('#dimension-' + id),
			position = { x : 0, y : 0 },
			offset = { x : 0, y : 0 },
			defaultSize = 750,
			size = 750,
			planets = {};
		
		function updatePosition() {
			
			$this.css('left', position.x + offset.x + 'px').css('top', position.y + offset.y + 'px');
			
		}
		
		function updateSize() {
			
			offset.x = offset.y = -size / 2;
			$this.css('width', size + 'px').css('height', size + 'px');
			
		}
		
		function initiate() {
			
//			$this = solarSystem.addDimension(id);
			size = defaultSize * solarSystem.getScaleFactor();
			updateSize();
			this.setPosition(solarSystem.getCenter().x, solarSystem.getCenter().y);
			// instance et initialisation des planètes
			
		}
		
		this.setX = function (x) { position.x = x; updatePosition(); };
		this.setY = function (y) { position.y = y; updatePosition(); };
		this.setPosition = function (x, y) {
			
			position.x = x;
			position.y = y;
			updatePosition();
			
		};
		this.setOffsetX = function (x) { offset.x = x; updatePosition(); };
		this.setOffsetY = function (y) { offset.y = y; updatePosition(); };
		this.setSize = function (s) { size = s; updateSize(); updatePosition(); };
		
		this.getOffset = function () { return offset; };
		this.getPosition = function () { return position; };
		this.getDefaultSize = function () { return defaultSize; };
		this.getSize = function () { return size; };
		
		this.fadeIn = function () {
			
			$this.fadeIn();
			
		};
		
		this.fadeOut = function () {
			
			$this.fadeOut();
			
		};
		
		this.fetchData = function (callback) { callback(); };
		
		this.init = initiate;
		this.init();
		
	}
	
	function Solar() {
		
		var $this = $('#solar'),
			position = { x : 0, y : 0 },
			offset = { x : 0, y : 0 },
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
		
		
		this.setX = function (x) { position.x = x; updatePosition(); };
		this.setY = function (y) { position.y = y; updatePosition(); };
		this.setPosition = function (x, y) {
			
			position.x = x;
			position.y = y;
			updatePosition();
			
		};
		this.setOffsetX = function (x) { offset.x = x; updatePosition(); };
		this.setOffsetY = function (y) { offset.y = y; updatePosition(); };
		this.setSize = function (s) { size = s; updateSize(); updatePosition(); };
		
		this.getOffset = function () { return offset; };
		this.getPosition = function () { return position; };
		this.getDefaultSize = function () { return defaultSize; };
		this.getSize = function () { return size; };
		
		this.fadeIn = function () {
			
			$this.fadeIn();
			
		};
		
		this.fadeOut = function () {
			
			$this.fadeOut();
			
		};
		
		this.init = initiate;
		
	}
	
	
	
	
	
	
	
	
	solarSystem = new SolarSystem();
	solar = new Solar();
	
	solarSystem.init();
	solarSystem.updateChildren();
	
	solarSystem.addDimension();
	
	
	
	solar.init();
	solar.fadeIn();	
	
	
	HUD.title.reset();
	
	
	
	
	
	
	
	GPU.draw(function () {
		
		HUD.infos.log("frameCount", GPU.getFrameCount());
		
	});
	
	
	
	
	
	
	
	$(document).on("keydown", function (e) {
		
		if (isBlacklistedKey(e.keyCode)) { return; }
		
		GPU.play();
		
	});
	
	$(document).on("keyup", function () {
		
		GPU.pause();
		
	});
	
	$(window).resize(function () {
		
		solarSystem.updateSize();
		solarSystem.updateChildren();
		
	});
	
	
	
	
});