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

require('plugins/battery').start();
require('plugins/gps').start();
require('plugins/colaHTTP').start();



//////////////////////////////////////////////////////////////////////////////////////////////////////////
// WIZARD 
/////////////////////////////////////////////////////////////////////////////////////////////////////////   
var wizard = function (){
    Ti.API.info("GLEB - INIT - Checking wizard status: "+Ti.App.Properties.getString("WIZARD"));
    if (Ti.App.Properties.getString("WIZARD") != "done") {
        Ti.API.info("GLEB - INIT - Iniciando Wizard");
        require('ui/wizard')._open();
    }
    else{
        gleb_loadMenus();
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOAD MENUS
/////////////////////////////////////////////////////////////////////////////////////////////////////////	
var gleb_loadMenus = function(){
	Ti.App.glebUtils.openActivityIndicator({"text":"Cargando ..."});	
	if (Ti.App.glebUtils.checkValidInterval()) {    	
    	if (require('modules/glebData').checkGUI()){    	    
    		gleb_loadMenusLocal();
    	}	
		else require("clients/glebAPI").getMenus(gleb_loadMenusLocal, gleb_loadMenus_error);	
	}
	else require("clients/glebAPI").getMenus(gleb_loadMenusLocal, gleb_loadMenus_error);		
}	
	

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOAD MENUS LOCAL
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var gleb_loadMenusLocal= function(){
    if (require("modules/glebData").getGUI() !== null) gleb_initMainWindow(require("modules/glebData").getGUI());
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// INIT MAIN WINDOW
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var gleb_initMainWindow = function(json){	
	Ti.API.debug('GLEB - getMenus Callback');
	Ti.API.debug('GLEB- JSON devuelto por getMenus: '+JSON.stringify(json));
	if(json.windows[0]){
		mainWin = new require('ui/mainWindow')._get(json.windows[0]);
		Ti.API.info('GLEB - Abriendo main window');
		require('modules/NavigationController').open(mainWin);
	}	
}	


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Evento que se ejecuta cdo ocurre un error descargando los Menus
/////////////////////////////////////////////////////////////////////////////////////////////////////////   
var gleb_loadMenus_error = function(obj){
        Ti.App.glebUtils.closeActivityIndicator();
        Ti.API.debug('GLEB - Error descargando Menus');
        var alertDialog = Titanium.UI.createAlertDialog({
            title: 'Error',
            message:'Ha ocurrido un error descargando los datos gleb. Compruebe que tiene cobertura de red. ¿Desea reintentarlo?. Si pulsa NO se intentaran cargar los últimos datos disponibles',
            buttonNames: ['SI','NO']
        });             
        alertDialog.addEventListener('click', function(e)
                {
                if (e.index==0) {
                        loadMenus();                    
                }
                else {
                        Ti.App.glebUtils.closeActivityIndicator({"text":"Cargando ..."});
                        if (require('modules/glebData').checkGUI()){
                           gleb_loadMenusLocal();                       
                        }                       
                        else {                          
                            var alertDialog2 = Titanium.UI.createAlertDialog({
                                title: 'Error',
                                message:'No existen datos previos, reintente la descarga de nuevo.',
                                buttonNames: ['REINTENTAR','SALIR']
                            });             
                            alertDialog2.addEventListener('click', function(e)
                                    {
                                    if (e.index==0) {   
                                        gleb_loadMenus();
                                    }
                                    else{   
                                        var activity = Titanium.Android.currentActivity;
                                        activity.finish();  
                                    }
                            });
                            alertDialog2.show();                        
                        }
                    }
            }); 
            alertDialog.show();     
    }


////////////////////////////////////////////
// ARRANQUE DE LA APP
///////////////////////////////////////////
Ti.API.debug("GLEB - INIT - Checking new endpoints");
require("clients/glebAPI").getGlebURLs(wizard);
})();
