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
        }
        catch (err){
            return null;            
        }        
        //Tenemos el objeto JSON cargado en data, hay que comprobar si existe el windowId solicitado.
        for(i in data.windows){
        	var winContent=data.windows[i];
        	Ti.API.debug('GLEB - winId: ' + windowId);
        	Ti.API.debug('GLEB - winContent: ' + JSON.stringify(winContent.name));
        	if(winContent.winId == windowId){
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
            exports.errorGUI();
            return null;            
        }        
        //Tenemos el objeto JSON cargado en data, hay que comprobar si tiene main window antes de devolverlo.
        if(data.windows != undefined){        
            return data;
        }
        else{            
            exports.errorGUI();    
        }
    }
    return null;
}

exports.errorGUI = function(obj){
        Ti.App.glebUtils.closeActivityIndicator();
        Ti.API.debug('GLEB - INIT -Error procesando Menus');
        var alertDialog = Titanium.UI.createAlertDialog({
            title: 'Error',
            message:'Ha ocurrido un error procesando los datos gleb. ¿Desea reintentar la descarga?',
            buttonNames: ['SI']
        });
        alertDialog.addEventListener('click', function(e)
            {
            if (e.index==0) {
                    //Borramos antiguo fichero
                    f.deleteFile();
                    require("modules/initFlow").gleb_loadMenus();
            }
        });
        alertDialog.show();
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


