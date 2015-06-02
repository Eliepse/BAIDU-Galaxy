/*global
	requestAnimationFrame, $
*/
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

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
			
		}
		
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

window.HUD = new HUD();
var GPU = new GPU();

HUD.showDebug();
HUD.infos.log("frameCount", 0);
HUD.infos.log("GPU", "pause");

HUD.title.fix = "@ Baidu Galaxy @";

$(function () {
	
	'use strict';
	
	
	
	function Planet() {}
	
	function Dimension() {}
	
	function SolarSystem() {}
	
	function Solar() {}
	
	
	
	/* 
	 *	DRAW FUNCTION
	*/
	
	GPU.draw(function () {
		
		HUD.infos.log("frameCount", GPU.getFrameCount());
		
	});
	
	
	HUD.title.reset();
	
	
	
	
	
	$(document).on("keydown", function () {
		
		GPU.play();
		
	});
	
	$(document).on("keyup", function () {
		
		GPU.pause();
		
	});
	
	
	
	
});