/**
* Module to control gleb JSON stack
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

var data;
var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'ui');                     
var f = Titanium.Filesystem.getFile(uiDir.resolve(), "gui.json");

//Comprueba si existen datos globales
exports.checkGUI = function(){    
    if (f.exists()) return true;
    else return false;
}

exports.getWinId = function(windowId){    
    if (f.exists()){
        var content = f.read();
        try {
            data = JSON.parse(content.text); //UI JSON
			//Ti.API.debug('GLEB - JSON completo: ' + JSON.stringify(data));       
        }
        catch (err){
            return null;            
        }        
        //Tenemos el objeto JSON cargado en data, hay que comprobar si existe el windowId solicitado.
        for(i in data.windows){
        	var winContent=data.windows[i];
        	Ti.API.debug('GLEB - winId: ' + windowId);
        	//Ti.API.debug('GLEB - winContent: ' + JSON.stringify(winContent));
        	//Ti.API.debug('GLEB - winContent: ' + JSON.stringify(winContent.name));
        	if(winContent.winId && winContent.winId == windowId){
        		return winContent;
        	}
        }
    }
    return null;
}

exports.getGUI = function(){    
    if (f.exists()){
        var content = f.read();
        try {
            data = JSON.parse(content.text); //UI JSON        
        }
        catch (err){
            exports.errorGUI("bad JSON");
            return null;            
        }        
        //Tenemos el objeto JSON cargado en data, hay que comprobar si tiene main window antes de devolverlo.
        if(data.windows != undefined){        
            return data;
        }
        else{            
            exports.errorGUI("missing windows");    
        }
    }
    return null;
}

exports.errorGUI = function(text){
        Ti.App.glebUtils.closeActivityIndicator();
        Ti.API.debug('GLEB - INIT - Error procesando Menus: '+text);
        
        if (exports.checkGUI()){
            Ti.API.debug('GLEB - INIT - Existe GUI local');
            var alertDialog = Titanium.UI.createAlertDialog({
	            title: 'Error',
	            message:'Ha ocurrido un error procesando los datos gleb. ¿Desea reintentar la descarga?',
	            buttonNames: ['SI','NO']
	        });
	        
			alertDialog.addEventListener('click', function(e)
            {
	            if (e.index==0) {
                    //Borramos antiguo fichero
                    //f.deleteFile();
                    //require("modules/initFlow").gleb_loadMenus();
                    require("clients/glebAPI").getMenus(require("modules/initFlow").gleb_loadMenusLocal, require("modules/initFlow").gleb_loadMenus_error);
				}
	            else{
	            	require('modules/initFlow').gleb_loadMenusLocal();
	            }
	        });
        }
        else{
        	var alertDialog = Titanium.UI.createAlertDialog({
	            title: 'Error',
	            message:'Ha ocurrido un error procesando los datos gleb. ¿Desea reintentar la descarga?',
	            buttonNames: ['Reintentar','Salir']
	        });	
	        
	        alertDialog.addEventListener('click', function(e)
            {
	            if (e.index==0) {
                    require("modules/initFlow").gleb_loadMenus();
	            }
	            else{
	                require('plugins/newgps').stop(); 
	                require("modules/initFlow").servicioGLEBSTOP();
	                var activity = Titanium.Android.currentActivity;
	                activity.finish();                
	            }
	        });
        }
                
        alertDialog.show();
}


exports.errorGUI_View = function(text){
        Ti.App.glebUtils.closeActivityIndicator();
        Ti.API.debug('GLEB - INIT - Error procesando vista: '+text);
        
        var alertDialog = Titanium.UI.createAlertDialog({
            title: 'Error',
            message:'Ha ocurrido un error procesando los datos gleb.',
            ok: 'OK'
        }).show();
}


// POR REVISAR
exports.setGUI = function(){    
    if (f.exists()) return true;
    else return false;
}

// POR REVISAR
exports.updateGUI = function(){
    if (f.exists()) return true;
    else return false;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// VALIDATE VIEWS DATA
/////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.validateView = function(viewData, contentType){
	var validate = false;
	
	if( contentType =='grid' || contentType =='market' || contentType =='listMarket' || contentType =='grid_3' || contentType =='list' || contentType =='form' || contentType =='mapView' ){
        if(viewData.content){
        	validate = true;
        }
    }
    else if(contentType =='webView' ){      
        if(viewData.url && viewData.url!=''){
        	validate = true;
        }
    }
        
	return validate;
}
