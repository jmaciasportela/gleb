/**
* Gleb
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

Ti.API.info("GLEB - INIT - Init New Gleb App");

(function(){
Ti.include('config/initial.js');

Ti.App.glebUtils = require("modules/utils");

Ti.API.debug("GLEB - INIT - Set background");
Titanium.UI.setBackgroundImage('images/background.png');

require('plugins/GCM').start();
require('plugins/battery').start();
require('plugins/gps').start();
require('plugins/colaHTTP').start();

////////////////////////////////////////////
// ARRANQUE DE LA APP
///////////////////////////////////////////
Ti.API.debug("GLEB - INIT - Checking new endpoints");
require("clients/glebAPI").getGlebURLs(require('modules/initFlow').wizard);

})();
