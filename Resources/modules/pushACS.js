exports.pushACS = function (){

var Cloud = require('ti.cloud');
Cloud.debug = true;
Cloud.useSecure = true;

var androidPushModule = null;
var pushDeviceToken = null;
var pushNotificationsEnabled = null;

Ti.API.debug('GLEB - ACS - Exist push User ?? '+Ti.App.Properties.getString('ACSpushUser'));
Ti.API.debug('GLEB - ACS - Trying Login User:'+Ti.App.Properties.getString('ACSpushUser')+' Password: '+Ti.App.Properties.getString('ACSpushUserPassword'));


glebACS_retrieveDeviceToken = function(){
    androidPushModule = getAndroidPushModule();
    androidPushModule.retrieveDeviceToken({
        success: deviceTokenSuccess,
        error: deviceTokenError
    }); 
}


glebACS_setUpPush = function(){ 
    //HABILITAMOS EL MODULO PUSH
    androidPushModule.enabled = true;
    Ti.API.debug('GLEB - ACS - Enable Push Module: '+androidPushModule.enabled);
    // RECEIVE PUSH
    androidPushModule.addEventListener('callback', require('modules/requestACS').receivePush);
    //checkPushNotifications();
    Ti.API.debug('GLEB - ACS - Enable Push Notifications');
    enablePushNotifications();  
    //androidPushModule = getAndroidPushModule();
    androidPushModule.showTrayNotification = true ;
    Ti.API.debug('GLEB - ACS - showTrayNotification:'+androidPushModule.showTrayNotification);
    androidPushModule.showAppOnTrayClick = true;
    Ti.API.debug('GLEB - ACS - showAppOnTrayClick:'+androidPushModule.showAppOnTrayClick);
    androidPushModule.showTrayNotificationsWhenFocused = false;
    Ti.API.debug('GLEB - ACS - showTrayNotificationsWhenFocused:'+androidPushModule.showTrayNotificationsWhenFocused);
    androidPushModule.focusAppOnPush = false;    
    Ti.API.debug('GLEB - ACS - focusAppOnPush:'+androidPushModule.focusAppOnPush);
    if (!Ti.App.Properties.getBool('ACSisPushSuscribedAll')) glebACS_suscribeChannelAll();
    if (!Ti.App.Properties.getBool('ACSisPushSuscribed')) glebACS_suscribeChannel();       
}


glebACS_suscribeChannelAll = function(){    
    
    Cloud.PushNotifications.subscribe({
        channel: "gleb",
        device_token: pushDeviceToken,
        type: Ti.Platform.name === 'iPhone OS' ? 'ios' : Ti.Platform.name
    }, function (e) {
        if (e.success) {
            Ti.API.debug('GLEB - ACS - Channel subscribed OK:'+JSON.stringify(e));
            Ti.App.Properties.setBool('ACSisPushSuscribedAll', true);
        }
        else {
            Ti.API.debug('GLEB - ACS - Channel subscribed NOK:'+JSON.stringify(e));
            Ti.App.Properties.setBool('ACSisPushSuscribedAll', false);
        }
    });     
}


glebACS_suscribeChannel = function(){   
    
    Cloud.PushNotifications.subscribe({
        channel: "gleb"+pushDeviceToken,
        device_token: pushDeviceToken,
        type: Ti.Platform.name === 'iPhone OS' ? 'ios' : Ti.Platform.name
    }, function (e) {
        if (e.success) {
            Ti.API.debug('GLEB - ACS - Channel subscribed OK:'+JSON.stringify(e));
            Ti.App.Properties.setBool('ACSisPushSuscribed', true);
        }
        else {
            Ti.API.debug('GLEB - ACS - Channel subscribed NOK:'+JSON.stringify(e));
            Ti.App.Properties.setBool('ACSisPushSuscribed', false);
        }
    });     
}



function enablePushNotifications() {
    pushNotificationsEnabled = true;
    Ti.App.Properties.setBool('PushNotifications-Enabled', true);
    //checkPushNotifications();
}

function disablePushNotifications() {
    pushNotificationsEnabled = false;
    Ti.App.Properties.setBool('PushNotifications-Enabled', false);
    //checkPushNotifications();
}

function getAndroidPushModule() {
    try {
        return require('ti.cloudpush')
    }
    catch (err) {
        Ti.API.debug('GLEB - ACS - Unable to require the ti.cloudpush module for Android!');
        pushNotificationsEnabled = false;
        Ti.App.Properties.setBool('PushNotifications-Enabled', false);
        return null;
    }
}

function checkPushNotifications() {
    if (pushNotificationsEnabled === null) {
        pushNotificationsEnabled = Ti.App.Properties.getBool('PushNotifications-Enabled');
    }
    if (Ti.Platform.name === 'iPhone OS') {
        if (pushNotificationsEnabled) {
            if (Titanium.Platform.model == 'Simulator') {
                alert('The simulator does not support push!');
                disablePushNotifications();
                return;
            }
            Ti.Network.registerForPushNotifications({
                types: [
                    Ti.Network.NOTIFICATION_TYPE_BADGE,
                    Ti.Network.NOTIFICATION_TYPE_ALERT,
                    Ti.Network.NOTIFICATION_TYPE_SOUND
                ],
                success: deviceTokenSuccess,
                error: deviceTokenError,
                callback: require('modules/requestACS').receivePush
            });
        }
        else {
            Ti.Network.unregisterForPushNotifications();
            pushDeviceToken = null;
        }
    }
    else if (Ti.Platform.name === 'android') {
        if (androidPushModule === null) {
            androidPushModule = getAndroidPushModule();
            if (androidPushModule === null) {
                return;
            }
        }
        if (pushNotificationsEnabled) {
            androidPushModule.enabled = true;
            androidPushModule.addEventListener('callback', require('modules/requestACS').receivePush);
            androidPushModule.retrieveDeviceToken({
                success: deviceTokenSuccess,
                error: deviceTokenError
            });
        }
        else {
            androidPushModule.enabled = false;
            androidPushModule.removeEventListener('callback', require('modules/requestACS').receivePush);
            pushDeviceToken = null;
        }
    }
}

function deviceTokenSuccess(e) {
    Ti.API.debug('GLEB - ACS - register for push! ' + JSON.stringify(e));
    pushDeviceToken = e.deviceToken;
    Ti.App.Properties.setString("ACSdeviceToken",pushDeviceToken);
    // Equivalente al setGCMId
    require("clients/glebAPI").setACSId(Ti.App.Properties.getString('ACSpushUserId'), pushDeviceToken);
    glebACS_setUpPush();
}

function deviceTokenError(e) {
    Ti.API.debug('GLEB - ACS - Failed to register for push! ' + e.error);
    disablePushNotifications();
}



// Comprobamos si existe un usuario, si no existe lo creamos
if (Ti.App.Properties.getString('ACSdeviceToken')==""){
    Ti.API.debug('GLEB - ACS - Creating new User'); 
    // Primero hacemos login para ver si el usuario ya existe   
    Cloud.Users.login({         
        login: Ti.App.Properties.getString('ACSpushUser'),
        password: Ti.App.Properties.getString('ACSpushUserPassword')
        }, function (e) {
            if (e.success) {                
                Ti.API.debug('GLEB - ACS - SUCESS LOGIN: '+JSON.stringify(e));
                Ti.App.Properties.setString('ACSpushUserId',e.users[0].id);
                glebACS_retrieveDeviceToken();                                
                Ti.App.Properties.setBool('isPushSuscribed', false);
            }
            else {
                Ti.API.debug('GLEB - ACS - ERROR LOGIN: '+JSON.stringify(e));
                Cloud.Users.create({
                    username: Ti.App.Properties.getString('ACSpushUser'),
                    password: Ti.App.Properties.getString('ACSpushUserPassword'),
                    password_confirmation: Ti.App.Properties.getString('ACSpushUserPassword')
                }, function (e) {
                    if (e.success) {
                        Ti.API.debug('GLEB - ACS - Created! You are now logged in as ' + e.users[0].id);
                        Ti.App.Properties.setString('ACSpushUserId',e.users[0].id);
                        Ti.API.debug('GLEB - ACS - INIT LOGIN');
                        Cloud.Users.login({
                            login: Ti.App.Properties.getString('ACSpushUser'),
                            password: Ti.App.Properties.getString('ACSpushUserPassword')
                        }, function (e) {
                            if (e.success) {
                                Ti.API.debug('GLEB - ACS - SUCESS LOGIN: '+JSON.stringify(e));
                                Ti.App.Properties.setString('ACSpushUserId',e.users[0].id);
                                glebACS_retrieveDeviceToken();
                            }
                            else {
                                Ti.API.debug('GLEB - ACS - ERROR LOGIN: '+JSON.stringify(e));
                            }
                        });                         
                    }
                    else {
                        Ti.API.debug('GLEB - ACS - Error creating User: ' + JSON.stringify(e));
                        Ti.App.Properties.setString('ACSpushStatus','error');
                        Ti.App.Properties.setString('ACSpushStatusDescription','Error creando el usuario');
                    }
                }); 
                            
            }
        });
}

else {
    Ti.API.debug('GLEB - ACS - INIT LOGIN');    
    Cloud.Users.login({
        login: Ti.App.Properties.getString('ACSpushUser'),
        password: Ti.App.Properties.getString('ACSpushUserPassword')
    }, function (e) {
        if (e.success) {
            Ti.API.debug('GLEB - ACS - SUCESS LOGIN: '+JSON.stringify(e));
            Ti.App.Properties.setString('ACSpushUserId',e.users[0].id);
            glebACS_retrieveDeviceToken();            
        }
        else {
            Ti.API.debug('GLEB - ACS - ERROR LOGIN: '+JSON.stringify(e));
        }
    }); 
    if (!Ti.App.Properties.getBool('ACSisPushSuscribedAll')) glebACS_suscribeChannelAll();
    if (!Ti.App.Properties.getBool('ACSisPushSuscribed')) glebACS_suscribeChannel();       
}

}
