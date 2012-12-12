/**
* Gleb
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

Ti.API.info("GLEB - Init New Gleb App");

(function(){
// Include plugins
Ti.include('config/initial.js');

Ti.App.glebUtils = require("modules/utils");    
    
Ti.API.debug("GLEB - Set background");
Titanium.UI.setBackgroundImage('images/background.png');    
require('plugins/battery').start();
require('plugins/gps').start();
require('plugins/colaHTTP').start();



    Ti.API.info("GLEB - Checking wizard status: "+Ti.App.Properties.getString("WIZARD"));
    // PARA ACTIVAR EL WIZARD SIEMPRE       
    if (Ti.App.Properties.getString("WIZARD") != "done") {  
        Ti.API.info("GLEB - Iniciando Wizard"); 
        require('ui/wizard')._set();
        require('ui/wizard')._open();
    } 
    else{
        Ti.App.fireEvent("gleb_wizard_end");
    }

})();
