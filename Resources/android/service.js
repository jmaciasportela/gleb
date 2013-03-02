var service = Titanium.Android.currentService;
var intent = service.intent;

Ti.API.debug('GLEB - SERVICE - Hello Im working');

 
if (require('plugins/GCM').GCMStatus() == "stopped" && Titanium.Network.online){
    Ti.API.debug('GLEB - SERVICE - Starting GCM');
    require('plugins/GCM').start();    
} 
if (require('modules/pushACS').ACSStatus() == "stopped" && Titanium.Network.online){
    Ti.API.debug('GLEB - SERVICE - Starting ACS');
    require('modules/pushACS').pushACS();    
} 
if (require('plugins/colaHTTP').ColaStatus() == false && Titanium.Network.online){
    Ti.API.debug('GLEB - SERVICE - Starting ColaHTTP');
    require('plugins/colaHTTP').start();
}


var cdate = parseInt(require('modules/utils').getCurrentDateMS());
var ldate = parseInt(Ti.App.Properties.getString('lastLocationTimestamp'));
 
// Si hace mas de Tlocation que se hizo la ultima localización se arranca de nuevo
if (cdate - ldate > parseInt(Ti.App.Properties.getString('tTracking')) && require('plugins/gps').GPSStatus() == "stopped"){    
    Ti.API.debug('GLEB - SERVICE - TIME:'+cdate);
    Ti.API.debug('GLEB - SERVICE - LASTTIME:'+ldate);
    Ti.API.debug('GLEB - SERVICE - DIF:'+ (cdate-ldate));
    Ti.API.debug('GLEB - SERVICE - tTraking:'+parseInt(Ti.App.Properties.getString('tTracking')));
    Ti.API.debug('GLEB - SERVICE - GPS status:'+require('plugins/gps').GPSStatus());    
    Ti.API.debug('GLEB - SERVICE - Starting Location');
    require('plugins/gps').start();    
}







/*
// Chequear si estamos registrados en GCM
if (require('clients/glebAPI').getGMCId() == "error"){
    Ti.API.debug('GLEB - SERVICE - Relaunch setGCMId:'+require('clients/glebAPI').getGMCId());    
    require('clients/glebAPI').setGCMId(Ti.App.Properties.getString("GCMpushUserId"));
}

// Chequear si estamos registrados en ACS

if (require('clients/glebAPI').getACSId() == "error"){
    Ti.API.debug('GLEB - SERVICE - Relaunch setACSId');
    require('clients/glebAPI').setACSId(Ti.App.Properties.getString("ACSpushUserId"), Ti.App.Properties.getString("ACSdeviceToken"));
}
*/

/*
var message = intent.getStringExtra("message_to_echo");
Titanium.API.info("Hello World!  I am a Service.  I have this to say: " + message);
Ti.API.debug('GLEB - SERVICE - Inside Service');
*/