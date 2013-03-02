/**
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/


var GCMStarted = "stopped";

exports.GCMStatus = function (){ 
 return GCMStarted;
}



var tigcm = require('net.iamyellow.tigcm');
var id = null;

Ti.API.debug('GLEB - GCM - Loading Module');    
// GLEB - GCM -   message event 
// setting this to true will force the module to execute the message event instead of the notification in gcm.js when the app is in foreground.
tigcm.fireEventWhenInFg = false;    
tigcm.addEventListener('message', function (ev) {        
    if (!require('config/data').contains(ev.serial)){
        require('config/data').push(ev.serial); 
        Ti.API.debug('GLEB - GCM - Message received: '+ JSON.stringify(ev));
        alert('a message from GCM  = ' + ev.message);
    }
});    
// GLEB - GCM - end message event 

    
tigcm.addEventListener('registered', function (ev) {
    // here we have to send to our server this registrationId
    // the server uses it in order to send notifications to devices
    //Lanzamos la peticion para actualizar el server
    //Ponemos el icono en verde
    Ti.API.debug('GLEB - GCM - registered event');
    Ti.App.Properties.setString("GCMpushUserId", ev.registrationId);
    GCMStarted = "started";
    require('clients/glebAPI').setGCMId(ev.registrationId, "Register GCM");
    Ti.API.debug('GLEB - GCM - registered with id ' + ev.registrationId);
});

tigcm.addEventListener('unregistered', function (ev) {
    // here we have to send to our server the fact that we unregistered from GCM
    // the server uses it in order to send notifications to devices
    // Ponemos el icono en rojo
    Ti.API.debug('GLEB - GCM - unregistered with id ' + ev.registrationId);
});

tigcm.addEventListener('error', function (ev) {
    GCMStarted = "stopped";
    Ti.API.debug('GLEB - GCM - error with id ' + ev.id);
});

tigcm.addEventListener('recoverableError', function (ev) {
    Ti.API.debug('GLEB - GCM - recoverable error with id ' + ev.id);
});

exports.start = function (){    
    Ti.API.debug('GLEB - GCM - Start registering');
    GCMStarted = "working";
    id = tigcm.registrationId;
    if (id === null) {
        // if not, register and wait for 'registered' event!
        Ti.API.debug('GLEB - GCM - Registering device ...');        
        tigcm.registerDevice();
    }
    else {        
        Ti.API.debug('GLEB - GCM - we had the registration ID, is = ' + id);
        Ti.App.Properties.setString("GCMpushUserId", id);
        GCMStarted = "started";
        require('clients/glebAPI').setGCMId(id,"Register GCM");
    }
}    
    
    
    
