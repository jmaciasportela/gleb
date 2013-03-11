/**
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// WIZARD
/////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.wizard = function (){
    Ti.API.debug("GLEB - INIT - Checking wizard status: "+Ti.App.Properties.getString("WIZARD"));
    if (Ti.App.Properties.getString("WIZARD") != "done") {
        Ti.API.debug("GLEB - INIT - Iniciando Wizard");
        require('ui/wizard')._open();
    }
    else{        
        exports.gleb_starPUSH();
    }
}



exports.gleb_starPUSH = function(){
        //Arrancar solo si hay red
    if(Titanium.Network.online){
        require('plugins/GCM').start();
        require('modules/pushACS').pushACS();
    }
    exports.gleb_loadMenus();
}   


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOAD MENUS
/////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.gleb_loadMenus = function(){
    
    //require("clients/glebAPI").updateStatus();
    Ti.App.glebUtils.openActivityIndicator({"text":"Cargando ..."});
    if (Ti.App.glebUtils.checkValidInterval()) {
        if (require('modules/glebData').checkGUI()){
            Ti.API.debug('GLEB - INIT - Existe GUI local');
            exports.gleb_loadMenusLocal();
        }
        else {
            Ti.API.debug('GLEB - INIT - No Existe GUI local, descargando');
            require("clients/glebAPI").getMenus(exports.gleb_loadMenusLocal, exports.gleb_loadMenus_error);
        }
    }
    else {
        Ti.API.debug('GLEB - INIT - Cambio de dia, descargando nuevo GUI');
        require("clients/glebAPI").getMenus(exports.gleb_loadMenusLocal, exports.gleb_loadMenus_error);
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOAD MENUS LOCAL
/////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.gleb_loadMenusLocal= function(){
    if (require("modules/glebData").getGUI() !== null) exports.gleb_initMainWindow(require("modules/glebData").getGUI());
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// INIT MAIN WINDOW
/////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.gleb_initMainWindow = function(json){
    Ti.API.debug('GLEB - INIT -getMenus Callback');
    if(json.windows[0]){
        mainWin = new require('ui/mainWindow')._get(json.windows[0]);
        Ti.API.debug('GLEB - INIT -Abriendo main window');           
        require('modules/NavigationController').open(mainWin);      
    }
        
    if(Titanium.Network.online){        
        require('plugins/colaHTTP').start();        
    }
    //Init service GLEB
    servicioGLEB ();
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Evento que se ejecuta cdo ocurre un error descargando los Menus
/////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.gleb_loadMenus_error = function(obj){
        Ti.App.glebUtils.closeActivityIndicator();
        Ti.API.debug('GLEB - INIT -Error descargando Menus');
        var alertDialog = Titanium.UI.createAlertDialog({
            title: 'Error',
            message:'Ha ocurrido un error descargando los datos gleb. Compruebe que tiene cobertura de red. ¿Desea reintentarlo?. Si pulsa NO se intentaran cargar los últimos datos disponibles',
            buttonNames: ['SI','NO']
        });
        alertDialog.addEventListener('click', function(e)
                {
                if (e.index==0) {
                        exports.gleb_loadMenus();
                }
                else {
                        Ti.App.glebUtils.closeActivityIndicator({"text":"Cargando ..."});
                        if (require('modules/glebData').checkGUI()){
                           exports.gleb_loadMenusLocal();
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
                                        exports.gleb_loadMenus();
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// INIT MAIN WINDOW
/////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.gleb_reInit = function(){
    Ti.App.glebUtils.openActivityIndicator({"text":"Reiniciando ..."});
    // Resetear el stack de ventanas
    require('modules/NavigationController').clean();
    // La recarga siempre fuerza la descarga del servidor
    require("clients/glebAPI").getMenus(exports.gleb_loadMenusLocal, exports.gleb_loadMenus_error);
}

var service=null;;

//Iniciar servicio GLEB
servicioGLEB = function(){    
    if (service!=null){
        service.stop();
        service=null;
    }        
    var intent = Titanium.Android.createServiceIntent( { url: 'service.js' } );
    // Service should run its code every 30 seconds.
    intent.putExtra('interval', 15000);
    service = Titanium.Android.createService(intent);
    Ti.API.debug('GLEB - INIT - service:'+JSON.stringify(service));
    /*
    service.addEventListener('pause', function(e) {
        // CHECK SI ESTAMOS REGISTADOS EN LAS DOS PLATAFORMAS, SI SI, PARAMOS SERVICIO
        if (require('plugins/GCM').GCMStatus() == "started" && require('modules/pushACS').ACSStatus() == "started" && require('plugins/colaHTTP').ColaStatus() == true) {
            Ti.API.debug('GLEB - INIT - Deteniendo servicio');
            service.stop();
        }
    });
    */    
    service.start();    
}

//Iniciar servicio GLEB
exports.servicioGLEBSTOP = function(){       
    service.stop();
    service=null;   
}