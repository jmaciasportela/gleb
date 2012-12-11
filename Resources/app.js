/**
* Gleb
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

Ti.API.info("GLEB - Init New Gleb App");


// 'app' is the core namespace we'll use throughout
var app = require('modules/core');

(function(){
Ti.API.debug("GLEB - Set background");
Titanium.UI.setBackgroundImage('images/background.png');    
Ti.include('config/initial.js');
require('plugins/battery').start();
require('plugins/gps').start();
require('plugins/colaHTTP').start();
alert("STARTED");
})();
