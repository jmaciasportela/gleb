/**
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/


var tigcm = require('net.iamyellow.tigcm');
var id = null;

exports.start = function (){
    
    Ti.API.debug('GLEB - GCM - Loading Module');
    
    // GLEB - GCM -   message event 
    // setting this to true will force the module to execute the message event instead of the notification in gcm.js when the app is in foreground.
    tigcm.fireEventWhenInFg = true;    
    tigcm.addEventListener('message', function (ev) {
        Ti.API.debug('GLEB - GCM - Message received: '+ JSON.stringify(ev));
        alert('a message from GCM  = ' + ev.message);
    });    
    // GLEB - GCM - end message event 
    
        
    tigcm.addEventListener('registered', function (ev) {
        // here we have to send to our server this registrationId
        // the server uses it in order to send notifications to devices
        Ti.API.debug('GLEB - GCM - registered with id ' + ev.registrationId);
    });
    
    tigcm.addEventListener('unregistered', function (ev) {
        // here we have to send to our server the fact that we unregistered from GCM
        // the server uses it in order to send notifications to devices
        Ti.API.debug('GLEB - GCM - unregistered with id ' + ev.registrationId);
    });
    
    tigcm.addEventListener('error', function (ev) {
        Ti.API.debug('GLEB - GCM - error with id ' + ev.id);
    });
    
    tigcm.addEventListener('recoverableError', function (ev) {
        Ti.API.debug('GLEB - GCM - recoverable error with id ' + ev.id);
    });
    
    id = tigcm.registrationId;

    if (id === null) {
        // if not, register and wait for 'registered' event!
        Ti.API.debug('GLEB - GCM - Registering device ...');
        tigcm.registerDevice();
    }
    else {
        // we could also unregister the device
        // tigcm.unregisterDevice();
        Ti.API.debug('GLEB - GCM - we had the registration ID, is = ' + id);
    }
}    
    
    
    
