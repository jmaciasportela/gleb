var service = Titanium.Android.currentService;
var intent = service.intent;


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


/*
var message = intent.getStringExtra("message_to_echo");
Titanium.API.info("Hello World!  I am a Service.  I have this to say: " + message);
Ti.API.debug('GLEB - SERVICE - Inside Service');
*/