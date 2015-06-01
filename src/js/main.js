var DEBUG = {
	
	printDebug : false,
	
	title : {

		title : "",

		fix : "",

		set : function(str) {

			this.title = str;
			document.title = str;

		},

		update : function(object) {

			document.title = this.title.replace("{value}", object);

		},

		reset : function () {

			document.title = this.fix;

		}

	},
	
	infos : {
		
		objects : {},
		
		log : function(prop, val, attr) {
			
			if(!this.printDebug) return;
				console.log("go one");
			
			if(objects.hasOwnProperty(prop)) {
				this.infos.objects[prop].innerHTML = val;
				console.log("yes");
			
			} else {
				
				console.log("no");
				this.infos.objects[prop] = {html:"", attr:""};
				this.infos.objects[prop].html = document.createElement("li");
				this.infos.objects[prop].html.id = prop;
				document.getElementById("debug").appendChild(this.infos.objects[prop].html);
				this.infos.objects[prop].innerHTML = prop + ' : ' + val + (this.infos.objects[prop].attr != "") ? this.infos.objects[prop].attr : "";
				
			}
			
		}
		
	},
	
	showDebug : function() {
		
		this.printDebug = true;
		document.getElementById("debug").style.display = "block";
		
	},
	
	hideDebug : function() {
		
		this.printDebug = false;
		document.getElementById("debug").style.display = "none";
		
	}

};

DEBUG.showDebug();
DEBUG.infos.log("show_debug", true, "");
DEBUG.title.fix = "Baidu Galaxy";

$(function() {
	
	
	DEBUG.title.reset();
	
	
});