function HUD() {
    'use strict';

    let printDebug = false, logIterator = 0;

    this.title = {
        value: "",
        fix: "",
        set: function (str) {
            this.value = str;
            document.title = str;
        },
        update: function (object) {
            document.title = this.value.replace("{value}", object);
        },
        reset: function () {
            document.title = this.fix;
        }
    };

    this.infos = {
        objects: {},
        log: function (prop, val, attr) {
            if (!printDebug) {
                return;
            }
            if (this.objects.hasOwnProperty(prop)) {
                this.objects[prop].innerHTML = prop + ' : ' + val + this.objects[prop].attr;
                if (attr === undefined) {
                    this.objects[prop].attr = "";
                } else {
                    this.objects[prop].attr = attr;
                }
            } else {
                this.objects[prop] = {html: "", attr: ""};
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

    this.tLog = function (val) {

        document.getElementById("tLog").innerHTML = val;

    };


    this.log = function (val) {

        var p = document.createElement("p");
        p.innerHTML = "<p>" + val + "</p>";
        document.getElementById("logs").appendChild(p);

//		document.getElementById("log-" + logIterator).innerHTML = val;

//		if(logIterator > 5) {
//
//			logIterator = 0;
//
//		}

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

export default new HUD();