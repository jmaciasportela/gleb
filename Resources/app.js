/**
* Gleb
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

Ti.API.info("GLEB - INIT - Init New Gleb App");

(function(){
// Include plugins
Ti.include('config/initial.js');

Ti.App.glebUtils = require("modules/utils");    
    
Ti.API.debug("GLEB - INIT - Set background");
Titanium.UI.setBackgroundImage('images/background.png');    
require('plugins/battery').start();
require('plugins/gps').start();
require('plugins/colaHTTP').start();


wizard = function (){
    Ti.API.info("GLEB - INIT - Checking wizard status: "+Ti.App.Properties.getString("WIZARD"));
    // PARA ACTIVAR EL WIZARD SIEMPRE       
    if (Ti.App.Properties.getString("WIZARD") != "done") {  
        Ti.API.info("GLEB - INIT - Iniciando Wizard"); 
        require('ui/wizard')._open();
    } 
    else{
        Ti.App.fireEvent("gleb_wizard_end");
    }
}

// Lo primero es pillar los endpoints
Ti.API.debug("GLEB - INIT - Checking new endpoints");
require("plugins/glebAPI").getGlebURLs(wizard);


})();
