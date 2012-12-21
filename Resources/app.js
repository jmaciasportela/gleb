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


wizard = function (){
    Ti.API.info("GLEB - INIT - Checking wizard status: "+Ti.App.Properties.getString("WIZARD"));
    if (Ti.App.Properties.getString("WIZARD") != "done") {
        Ti.API.info("GLEB - INIT - Iniciando Wizard");
        require('ui/wizard')._open();
    }
    else{
        Ti.App.fireEvent("gleb_wizard_end");
    }
}

Ti.API.debug("GLEB - INIT - Checking new endpoints");
require("clients/glebAPI").getGlebURLs(wizard);

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Evento que se ejecuta cdo se finaliza el Wizard 
/////////////////////////////////////////////////////////////////////////////////////////////////////////	
	var f_gleb_wizard_end = function(){
		
		Ti.App.glebUtils.openActivityIndicator({"text":"Cargando ..."});	
				
		var ts = Math.round((new Date()).getTime());
		var date = new Date(ts);
		var mes = date.getMonth();		
		var dia = date.getDate();				
		var prev = Ti.App.Properties.getString('lastUIDownload');		
		var dateP = new Date(parseInt(prev));
		var mesP = dateP.getMonth();		
		var diaP = dateP.getDate();		
		Ti.API.info("GLEB - Fecha actual:"+dia+" - "+mes+" Fecha previa:"+diaP+" - "+mesP);		
		
		
		if (false) {
		//if (mes==mesP && dia==diaP) {			
			// Si existe fichero local
	    	var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'ui');						
	    	var f = Titanium.Filesystem.getFile(uiDir.resolve(), "gui.json");
	    	if (f.exists()){
	    		Ti.App.fireEvent("gleb_getMenus_local");
	    	}	
			else require("clients/glebAPI").getMenus();	
		}
		else require("clients/glebAPI").getMenus();	
			
	}	
	Ti.App.addEventListener('gleb_wizard_end', f_gleb_wizard_end);	
/////////////////////////////////////////////////////////////////////////////////////////////////////////	

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Evento que se ejecuta cdo ocurre un error descargando los Menus
/////////////////////////////////////////////////////////////////////////////////////////////////////////	
var gleb_getMenus_error_f = function(obj){
		Ti.App.fireEvent('gleb_closeActivityIndicator');
		Ti.API.info('GLEB - Error descargando Main Window');
		var alertDialog = Titanium.UI.createAlertDialog({
			title: 'Error',
			message:'Ha ocurrido un error descargando los datos gleb. Compruebe que tiene cobertura de red. ¿Desea reintentarlo?. Si pulsa NO se intentaran cargar los últimos datos disponibles',
		    buttonNames: ['SI','NO']
		});				
		alertDialog.addEventListener('click', function(e)
				{
				if (e.index==0) {
				        Ti.App.fireEvent("gleb_wizard_end");			    	
				}
				else {
				   		Ti.App.fireEvent('gleb_openActivityIndicator',{"text":"Cargando ..."});
						Ti.API.debug('GLEB - PATH= '+Titanium.Filesystem.applicationDataDirectory);
				    	var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'ui');						
				    	var f = Titanium.Filesystem.getFile(uiDir.resolve(), "gui.json");
				    	if (f.exists()){
				    		Ti.App.fireEvent("gleb_getMenus_local");
				    	}
				    	else {				    		
							var alertDialog2 = Titanium.UI.createAlertDialog({
								title: 'Error',
								message:'No existen datos previos, reintente la descarga de nuevo.',
							    buttonNames: ['REINTENTAR']
							});				
							alertDialog2.addEventListener('click', function(e)
									{
									if (e.index==0) {	
										Ti.App.addEventListener('gleb_wizard_end');
									}
							});
							alertDialog2.show();			    		
				    	}
				    }
			});	
			alertDialog.show();		
	}

	Ti.App.addEventListener('gleb_getMenus_error', gleb_getMenus_error_f);
/////////////////////////////////////////////////////////////////////////////////////////////////////////	


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Evento que se ejecuta cdo se detecta una copia actualizada del UI en local
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var gleb_getMenus_local_f= function(obj){
		Ti.API.info('GLEB - Se ha detectado un UI reciente');
		Ti.API.debug('GLEB - PATH= '+Titanium.Filesystem.applicationDataDirectory);
    	var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'ui');						
    	var f = Titanium.Filesystem.getFile(uiDir.resolve(), "gui.json");
    	if (f.exists()){
    		var content = f.read();
    		var json = JSON.parse(content.text); //UI JSON				    		
    		Ti.App.fireEvent("gleb_getMenus_done",json);
    	}		
	}

	Ti.App.addEventListener('gleb_getMenus_local', gleb_getMenus_local_f);
/////////////////////////////////////////////////////////////////////////////////////////////////////////	


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Evento que se ejecuta cdo ya se ha cargado el UI local o de internet
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var gleb_getMenus_done_f = function(){	
		Ti.API.info('GLEB - getMenus Callback');
        var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'ui');						
    	var f = Titanium.Filesystem.getFile(uiDir.resolve(), "gui.json");
    	if (f.exists()){
    		var content = f.read();
    		var json = JSON.parse(content.text); //UI JSON
    	}
    	Ti.API.debug('GLEB- CONTENT devuelto por getMenus: '+JSON.stringify(content));
    	Ti.API.debug('GLEB- JSON devuelto por getMenus: '+JSON.stringify(json));	
		Ti.API.info('GLEB - Abriendo main window');
		if(json.windows[0]){
			if(typeof(mainWin) != "undefined" && mainWin !== null) {
				mainWin.close();
				mainWin = null;
			}
			mainWin = new require('ui/mainWindow')._get(json.windows[0]);
			
			//Ti.App.glebUtils.closeActivityIndicator();
			
			require('modules/NavigationController').open(mainWin);			
			Ti.API.info('GLEB - Abriendo main window');
			//////// REMOVEMOS TODOS LOS LISTENERS INCESARIOS UNA VEZ ARRANCADA LA APP		
			if (f_gleb_wizard_end != null){	
				Ti.App.removeEventListener('gleb_wizard_end', f_gleb_wizard_end);	
				f_gleb_wizard_end = null;
		    }
			if (gleb_getMenus_error_f != null){
				Ti.App.removeEventListener('gleb_getMenus_error', gleb_getMenus_error_f);
				gleb_getMenus_error_f = null;
			}
			if (gleb_getMenus_local_f != null){
				Ti.App.removeEventListener('gleb_getMenus_local', gleb_getMenus_local_f);
				gleb_getMenus_local_f = null;
			}			
			
			//Ti.App.removeEventListener ('gleb_getMenus_done', gleb_getMenus_done_f);
			//gleb_getMenus_done_f = null;					
		}	
	}	
Ti.App.addEventListener('gleb_getMenus_done', gleb_getMenus_done_f);
/////////////////////////////////////////////////////////////////////////////////////////////////////////


})();
