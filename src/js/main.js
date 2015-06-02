window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function HUD() {
	
	this.printDebug = false;
	
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
			
			if (!printDebug) return;
			
			if(this.objects.hasOwnProperty(prop)) {
				
				this.objects[prop].innerHTML = prop + ' : ' + val + attr;
			
			} else {
				
				this.objects[prop] = {html:"", attr:""};
				this.objects[prop].html = document.createElement("li");
				this.objects[prop].html.id = prop;
				document.getElementById("debug").appendChild(this.objects[prop].html);
				this.objects[prop] = document.getElementById(prop);
				this.objects[prop].innerHTML = prop + ' : ' + val + attr;
				
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
	
	
	
	var frameCount = 0,
		fps = 40,
		now,
		then = Date.now(),
		interval = 1000/fps,
		delta;
	
	var speed = 1,
		isPause = false;
	
	this.draw = function(foo) {draw = foo;};
	var draw = function(){};
	
	function compute (parent) {
		
		if(isPause) return;
			
		requestAnimationFrame(compute);

		now = Date.now();
		delta = now - then;

		if (delta > interval) {

			then = now - (delta % interval);

			frameCount++;
			draw();

		}
			
	}
	
	this.getFrameCount = function() { return frameCount; };
	
	this.play = function() {
		
		isPause = false;
		requestAnimationFrame(compute);
		
	};
	
	this.pause = function() {
		
		isPause = true;
		
	}
		
	
}

window.HUD = new HUD();
window.GPU = new GPU();

HUD.showDebug();

HUD.title.fix = "@ Baidu Galaxy @";

$(function() {
	
	HUD.title.reset();
	
	GPU.draw(function () {
		
		HUD.infos.log("frameCount", GPU.getFrameCount(), "");
		
	});
	
	GPU.play();
	
	setTimeout(GPU.pause, 2000);
	
});