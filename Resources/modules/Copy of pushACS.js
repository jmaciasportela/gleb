exports.pushACS = function (){

var Cloud = require('ti.cloud');
Cloud.debug = true;

var androidPushModule = null;
var pushDeviceToken = null;
var pushNotificationsEnabled = null;

Ti.API.debug('GLEB - ACS - Exist push User ?? '+Ti.App.Properties.getString('pushUser'));
Ti.API.debug('GLEB - ACS - Trying Login User:'+Ti.App.Properties.getString('pushUser')+' Password: '+Ti.App.Properties.getString('pushUserPassword'));

// Comprobamos si existe un usuario, si no existe lo creamos
if (!Ti.App.Properties.hasProperty('pushUserId')){
    Ti.API.debug('GLEB - ACS - Creating new User'); 
    // Primero hacemos login para ver si el usuario ya existe   
    Cloud.Users.login({         
        login: Ti.App.Properties.getString('pushUser'),
        password: Ti.App.Properties.getString('pushUserPassword')
        }, function (e) {
            if (e.success) {                
                Ti.API.debug('GLEB - ACS - SUCESS LOGIN: '+JSON.stringify(e));
                Ti.App.Properties.setString('pushUserId',e.users[0].id);
                glebACS_retrieveDeviceToken();
                //require("plugins/glebAPI").registerClient();
                //Usuario existente en un terminal nuevo, necesita suscribirse al canal para recibir las notificaciones push                
                Ti.App.Properties.setBool('isPushSuscribed', false);
            }
            else {
                Ti.API.debug('GLEB - ACS - ERROR LOGIN: '+JSON.stringify(e));
                Cloud.Users.create({
                    username: Ti.App.Properties.getString('pushUser'),
                    password: Ti.App.Properties.getString('pushUserPassword'),
                    password_confirmation: Ti.App.Properties.getString('pushUserPassword')
                }, function (e) {
                    if (e.success) {
                        var user = e.users[0];
                        Ti.API.debug('GLEB - ACS - Created! You are now logged in as ' + user.id);
                        Ti.App.Properties.setString('pushUserId',user.id);                      
                        //Ti.App.fireEvent ('glebACS_login');
                        Ti.API.debug('GLEB - ACS - INIT LOGIN');
                        Cloud.Users.login({
                            login: Ti.App.Properties.getString('pushUser'),
                            password: Ti.App.Properties.getString('pushUserPassword')
                        }, function (e) {
                            if (e.success) {
                                var user = e.users[0];
                                Ti.API.debug('GLEB - ACS - SUCESS LOGIN: '+JSON.stringify(e));
                                Ti.App.Properties.setString('pushUserId',e.users[0].id);
                                glebACS_retrieveDeviceToken();
                                //require("plugins/glebAPI").registerClient();
                            }
                            else {
                                Ti.API.debug('GLEB - ACS - ERROR LOGIN: '+JSON.stringify(e));
                            }
                        });                         
                    }
                    else {
                        Ti.API.debug('GLEB - ACS - Error creating User: ' + JSON.stringify(e));
                        Ti.App.Properties.setString('pushStatus','error');
                        Ti.App.Properties.setString('pushStatusDescription','Error creando el usuario');
                    }
                }); 
                            
            }
        });
}

else {
    Ti.API.debug('GLEB - ACS - INIT LOGIN');    
    Cloud.Users.login({
        login: Ti.App.Properties.getString('pushUser'),
        password: Ti.App.Properties.getString('pushUserPassword')
    }, function (e) {
        if (e.success) {
            var user = e.users[0];
            Ti.API.debug('GLEB - ACS - SUCESS LOGIN: '+JSON.stringify(e));
            Ti.App.Properties.setString('pushUserId',e.users[0].id);
            glebACS_retrieveDeviceToken();
            
        }
        else {
            Ti.API.debug('GLEB - ACS - ERROR LOGIN: '+JSON.stringify(e));
        }
    }); 
    if (!Ti.App.Properties.getBool('isPushSuscribedAll')) glebACS_suscribeChannelAll();
    if (!Ti.App.Properties.getBool('isPushSuscribed')) glebACS_suscribeChannel();       
}


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
    androidPushModule.addEventListener('callback', receivePush);
    //checkPushNotifications();
    Ti.API.debug('GLEB - ACS - Enable Push Notifications');
    enablePushNotifications();  
    //androidPushModule = getAndroidPushModule();
    androidPushModule.showTrayNotification = true ;
    Ti.API.debug('GLEB - ACS - showTrayNotification:'+androidPushModule.showTrayNotification);
    androidPushModule.showAppOnTrayClick = false;
    Ti.API.debug('GLEB - ACS - showAppOnTrayClick:'+androidPushModule.showAppOnTrayClick);
    androidPushModule.showTrayNotificationsWhenFocused = false;
    Ti.API.debug('GLEB - ACS - showTrayNotificationsWhenFocused:'+androidPushModule.showTrayNotificationsWhenFocused);
    androidPushModule.focusAppOnPush = true;    
    Ti.API.debug('GLEB - ACS - focusAppOnPush:'+androidPushModule.focusAppOnPush);
    if (!Ti.App.Properties.getBool('isPushSuscribedAll')) glebACS_suscribeChannelAll();
    if (!Ti.App.Properties.getBool('isPushSuscribed')) glebACS_suscribeChannel();       
}


glebACS_suscribeChannelAll = function(){    
    
    Cloud.PushNotifications.subscribe({
        channel: "gleb",
        device_token: pushDeviceToken,
        type: Ti.Platform.name === 'iPhone OS' ? 'ios' : Ti.Platform.name
    }, function (e) {
        if (e.success) {
            Ti.API.debug('GLEB - ACS - Channel subscribed OK:'+JSON.stringify(e));
            Ti.App.Properties.setBool('isPushSuscribedAll', true);
        }
        else {
            Ti.API.debug('GLEB - ACS - Channel subscribed NOK:'+JSON.stringify(e));
            Ti.App.Properties.setBool('isPushSuscribedAll', false);
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
            Ti.App.Properties.setBool('isPushSuscribed', true);
        }
        else {
            Ti.API.debug('GLEB - ACS - Channel subscribed NOK:'+JSON.stringify(e));
            Ti.App.Properties.setBool('isPushSuscribed', false);
        }
    });     
}

// Funciones auxiliares                                                                                                                                                                 

function receivePush(e) {
    Ti.API.debug('GLEB - ACS - PUSH Received:'+JSON.stringify(e));
    payload = JSON.parse(e.payload);    
    if (payload.custom.msg!="")alert (payload.custom.msg);
    
    switch(payload.custom.pushId){
        
        //c2dm_0000 = CHAT 
        case "0000":            
            //alert(payload.custom.from+" : "+payload.custom.msg);
            Ti.API.debug('GLEB - PUSH - isChatOpen:' + Ti.App.Properties.getBool('isChatOpen'));            
            if (Ti.App.Properties.getBool('isChatOpen')) Ti.App.fireEvent('gleb_message');
            else Ti.App.fireEvent('gleb_newMessage');
        break;
        
        //c2dm_0001 = VIBRADOR
        case "0001":
            Titanium.Media.vibrate([ 0, 500, 100, 500, 100, 500 ] );    
            Ti.API.info('GLEB - C2DM:' + payload.custom.pushId);
            require("plugins/glebAPI").confirmPUSH(payload.custom.uuid);
            //Ti.App.fireEvent('gleb_vibrate');
        break;  
        
        //c2dm_0002 = APAGA GPS
        case "0002":
            Ti.App.fireEvent('pauseLocation');
        break;
        
        //c2dm_0003 = ENCIENDE GPS
        case "0003":
            Ti.App.fireEvent('resumeLocation');
        break;
        
        //c2dm_0004 = ACTUALIZA POSICION
        case "0004":
            require("plugins/glebAPI").updateStatus(payload.custom.uuid);
        break;
        
        //c2dm_0005 = Enviar fichero tracking diario
        case "0005":
            require("plugins/glebAPI").uploadTracking();
        break;
        
        //c2dm_0006 = Enviar fichero tracking diario
        case "c2dm_0006":
            alert("No comment");
        break;          
        }   
    
    
    
    
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
                callback: receivePush
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
            androidPushModule.addEventListener('callback', receivePush);
            androidPushModule.retrieveDeviceToken({
                success: deviceTokenSuccess,
                error: deviceTokenError
            });
        }
        else {
            androidPushModule.enabled = false;
            androidPushModule.removeEventListener('callback', receivePush);
            pushDeviceToken = null;
        }
    }
}

function deviceTokenSuccess(e) {
    Ti.API.debug('GLEB - ACS - register for push! ' + JSON.stringify(e));
    pushDeviceToken = e.deviceToken;
    Ti.App.Properties.setString("deviceToken",pushDeviceToken);
    require("plugins/glebAPI").registerClient();
    glebACS_setUpPush();
}

function deviceTokenError(e) {
    Ti.API.debug('GLEB - ACS - Failed to register for push! ' + e.error);
    disablePushNotifications();
}
    
}
