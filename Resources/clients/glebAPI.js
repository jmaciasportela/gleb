exports.getGlebURLs = function(callback) {
    var url = Ti.App.Properties.getString("getGlebURLs_url");
    var params = {};
    var timeout = 15000; //miliseconds
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token")
    };

    var getGlebURLs_callback = function (obj,e){
        if (e.error) {
                Ti.App.fireEvent('gleb_getGlebURLs_error');
        }
        else {
            if (obj.responseText) {
                var response =  JSON.parse(obj.responseText);
                if (response.sendSMS_url!="") Ti.App.Properties.setString("sendSMS_url", response.sendSMS_url);
                if (response.validate_url!="") Ti.App.Properties.setString("validate_url", response.validate_url);
                if (response.getMenus_url!="") Ti.App.Properties.setString("getMenus_url", response.getMenus_url);
                if (response.getView_url!="") Ti.App.Properties.setString("getView_url", response.getView_url);
                if (response.getWindow_url!="") Ti.App.Properties.setString("getWindow_url", response.getWindow_url);
                if (response.getMenuVersion_url!="") Ti.App.Properties.setString("getMenuVersion_url", response.getMenuVersion_url);
                if (response.registerClient_url!="") Ti.App.Properties.setString("registerClient_url", response.registerClient_url);
                if (response.updateStatus_url!="") Ti.App.Properties.setString("updateStatus_url", response.updateStatus_url);
                if (response.confirmPUSH_url!="") Ti.App.Properties.setString("confirmPUSH_url", response.confirmPUSH_url);
                if (response.uploadTracking_url!="") Ti.App.Properties.setString("uploadTracking_url", response.uploadTracking_url);
                if (response.getGlebURLs_url!="") Ti.App.Properties.setString("getGlebURLs_url", response.getGlebURLs_url);
                if (response.sendForm_url!="") Ti.App.Properties.setString("sendForm_url", response.sendForm_url);
                Ti.API.debug('GLEB - API -URL remotas establecidas.');
            }
        }
       callback();
    }
    makeGET(url,params,timeout,headers,getGlebURLs_callback);
};

exports.sendSMS = function(msisdn) {

    var url = Ti.App.Properties.getString("sendSMS_url");
    var params = {
     "msisdn" : msisdn
    }
    var timeout = 45000; //miliseconds
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
    };

    var sendSMS_callback = function (obj,e){
        if (e.error) {
          Ti.App.glebUtils.closeActivityIndicator();          var dialog = Ti.UI.createAlertDialog({
                cancel: 0,
                buttonNames: ['CANCELAR', 'REENVIAR','AVANZAR'],
                message: '¿Desea reintentar el envio del código de registro?',
                title: 'Error envio SMS'
              });
              dialog.addEventListener('click', function(e){
                if (e.index === e.source.cancel){
                  Ti.API.info('The cancel button was clicked');
                }
                else if (e.index === 1){
                    Ti.App.glebUtils.openActivityIndicator({"text":"Enviando código ..."});
                    exports.sendSMS(msisdn);
                }
                else require('ui/wizard').toRight();
              });
              dialog.show();
        }
        else {
            Ti.App.glebUtils.closeActivityIndicator();            require('ui/wizard').toRight();
        }

        url = null;
        params = null;
        timeout = null;
        headers = null;
    }
    makePOST (url,params,timeout,"","",headers,sendSMS_callback);
}

exports.validate = function(code,msisdn) {

    var url = Ti.App.Properties.getString("validate_url");
    var params = {
      "code" : code,
      "msisdn" : msisdn
    }
    var timeout = 30000; //miliseconds
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
    };

    var validate_callback = function (obj,e){
        if (e.error) {
          Ti.App.glebUtils.closeActivityIndicator();              // Si no tenemos conexion
              if (e.source.connected) {
                  var dialog = Ti.UI.createAlertDialog({
                        cancel: 0,
                        buttonNames: ['CANCEL', 'OK'],
                        message: '¿Desea introducir de nuevo el PIN?',
                        title: 'PIN incorrecto'
                      });
                      dialog.addEventListener('click', function(e){
                        if (e.index === e.source.cancel){
                          Ti.API.info('The cancel button was clicked');
                        }
                      });
                      dialog.show();
             }
             else {
                  var dialog2 = Ti.UI.createAlertDialog({
                    message: 'No tienes cobertura de datos. Reintenta el envio.',
                    ok: 'OK',
                    title: 'Error de conexión'
                  }).show();
             }

        }
        else {
            Ti.App.glebUtils.closeActivityIndicator();            require('ui/wizard').toRight();
        }

        url = null;
        params = null;
        timeout = null;
        headers = null;
    }
    makePOST (url,params,timeout,"","",headers,validate_callback);
}

exports.getMenus = function(gleb_loadMenusLocal, gleb_loadMenus_error) {

    var url = Ti.App.Properties.getString("getMenus_url");
    var params = {};
    var timeout = 30000; //miliseconds
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token")
    };

    var getMenus_callback = function (obj,e){
        if (e.error) {
                gleb_loadMenus_error();
        }
        else {

            if (obj.responseText) {
                //Ti.API.debug('GLEB - API -PATH= '+Titanium.Filesystem.applicationDataDirectory);
                var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'ui');
                if (!uiDir.exists()) {
                    uiDir.createDirectory();
                }
                var f = Titanium.Filesystem.getFile(uiDir.resolve(), "gui.json");
                if (f.write(obj.responseText)===false) {
                   // handle write error
                   Ti.API.debug("GLEB - API -Ha habido un error guardando el UI");
                }
            }
            var ts = Math.round((new Date()).getTime());
            Ti.App.Properties.setString('lastUIDownload', ts);
            Ti.API.debug('GLEB - API -gleb_getMenus_done Event called');
            gleb_loadMenusLocal();
        }

        url = null;
        params = null;
        timeout = null;
        headers = null;
    }
    makeGET (url,params,timeout,headers,getMenus_callback);
}


exports.getView = function(name, f_callback) {

    var url = Ti.App.Properties.getString("getView_url");
    var params = {
        "name" : name
    };
    var timeout = 30000;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token")
    };

    var getView_callback = function (obj,e){
        if (e.error) {
            Ti.API.debug('GLEB - API -onerror called, HTTP status = '+obj.status);
            f_callback ({"error":"No se puede actualizar la vista. Error de red."});
        }
        else {
            //Ti.API.debug('GLEB - API -onload called, HTTP status = '+ obj.status);
            //Ti.API.debug('GLEB - API -onload called, HTTP status = '+ obj.responseText);
            if (obj.responseText) {
                var response =  JSON.parse(obj.responseText);
                var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'ui');
                var f = Titanium.Filesystem.getFile(uiDir.resolve(), "gui.json");
                if (f.exists()){
                    var content = f.read();
                    var json = JSON.parse(content.text); //UI JSON
                    for (var i=0 ; i< json.windows[0].views.length; i++){
                        if (json.windows[0].views[i].name == response.name){
                            Ti.API.debug('GLEB - API -VISTA ENCONTRADA, ACTUALIZNADO UI.LOCAL');
                            json.windows[0].views[i] = response;
                            if (f.write(JSON.stringify(json))===false) {
                                // handle write error
                                Ti.API.debug("GLEB - API -Ha habido un error guardando el UI");
                            }
                        };
                    }
                }
                Ti.API.debug('GLEB - API -gleb_getView_done Event called');
                f_callback (response);

                //Ti.App.fireEvent('gleb_getView_done',{"name":name,"response":response});

                response = null;
                uiDir = null;
                f = null;
                content = null;
                json = null;
                url = null;
                params = null;
                timeout = null;
                headers = null;
            }
            else {
                f_callback ({"error":"No se puede actualizar la vista, no existe."});
            }
        }
    }
    makeGET (url,params,timeout,headers,getView_callback);
}



exports.getWindow = function(name) {

    var url = Ti.App.Properties.getString("getWindow_url");
    var params = {
        "name" : name
    };
    var timeout = 30000;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token")
    };

    var getWindow_callback = function (obj,e){
        if (e.error) {
            Ti.App.fireEvent('gleb_getWindow_error',{"name":name,"response":+JSON.stringify(e)});
        }
        else {
            if (obj.responseText) {
                var response =  JSON.parse(obj.responseText);
                var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'ui');
                var f = Titanium.Filesystem.getFile(uiDir.resolve(), "gui.json");
                if (f.exists()){
                    var content = f.read();
                    var json = JSON.parse(content.text); //UI JSON
                    for (var i=0 ; i< json.windows.length; i++){
                        if (json.windows[i].name == response.name){
                            Ti.API.debug('GLEB - API -VENTANA ENCONTRADA, ACTUALIZNADO UI.LOCAL');
                            json.windows[i] = response;
                            if (f.write(JSON.stringify(json))===false) {
                                // handle write error
                                Ti.API.debug("GLEB - API -Ha habido un error guardando el UI");
                            }
                        };
                    }
                }
                Ti.API.debug('GLEB - API -gleb_getWindow_done Event called');
                Ti.App.fireEvent('gleb_getWindow_done',{"name":name,"response":response});
                response = null;
                uiDir = null;
                f = null;
                content = null;
                json = null;
                url = null;
                params = null;
                timeout = null;
                headers = null;
            }
        }
    }
    makeGET (url,params,timeout,headers,getWindow_callback);
}


exports.getMenuVersion = function() {

    var url = Ti.App.Properties.getString("getMenuVersion_url");
    var params = {};
    var timeout = 30000;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token")
    };

    var getMenuVersion_callback = function (obj,e){
        if (e.error) {
            Ti.App.fireEvent('gleb_getMenuVersion_error');
        }
        else {
            if (obj.responseText) {
                var response =  JSON.parse(obj.responseText);
                Ti.API.debug('GLEB - API -gleb_getMenuVersion_done Event called');
                Ti.App.fireEvent('gleb_getMenuVersion_done',response);
            }
        }
    }
    makeGET (url,params,timeout,headers,getMenuVersion_callback);
}

exports.registerClient = function(e) {

    var url = Ti.App.Properties.getString("registerClient_url");
    var body = "";
    var params ="";
    var timeout = 30000;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "Content-Type": "application/json"
    };

    var registerClient_callback = function (obj,e){
        if (e.error) {
            Ti.API.debug('GLEB - API -registerClient Error, HTTP status = '+obj.status);
            Ti.App.fireEvent('gleb_registerClient_error');
        }
        else {
            Ti.API.debug('GLEB - API -registerClient called, HTTP status = '+obj.status);
            try {
                var response =  JSON.parse(obj.responseText);
                if (!Ti.App.Properties.hasProperty('token')){
                    if (response.token) {
                            Ti.App.Properties.setString('token',response.token);
                            Ti.API.debug('GLEB - API -registro inicial guardando token: '+response.token);
                            Ti.App.glebUtils.closeActivityIndicator();
                            Ti.App.Properties.setString("WIZARD","done");
                            Ti.App.Properties.setBool('registered',true);                            
                            require('ui/wizard').close();
                            require('modules/initFlow').gleb_loadMenus();
                            Ti.API.info('GLEB - API -Wizard finished, booting app');
                        }
                    else {
                        Ti.API.debug('GLEB - API -El registro inicial no ha ido bien el server no ha devuelto token');
                        Ti.App.fireEvent('gleb_registerClient_error');
                    }
                }
                else {
                    Ti.API.debug('GLEB - API -registerClient response = '+obj.responseText);
                    Ti.App.glebUtils.closeActivityIndicator();
                    Ti.App.Properties.setString("WIZARD","done");
                    Ti.App.Properties.setBool('registered',true);                    
                    require('ui/wizard').close();
                    require('modules/initFlow').gleb_loadMenus();
                    Ti.API.info('GLEB- Wizard finished, booting app');
                }
            }catch (err){
                Ti.App.fireEvent('gleb_registerClient_error');
            }
        }
    url = null;
    params = null;
    timeout = null;
    headers = null;
    }

    var UUID = Titanium.Platform.id;
    if(Titanium.Platform.osname === 'android') {
        var glebandroidnative = require("es.gleb.androidnative");
        var nickname=Ti.App.Properties.getString("nickname");
        var IMEI=glebandroidnative.getIMEI() ? glebandroidnative.getIMEI(): '0';
        var IMSI=glebandroidnative.getIMSI() ? glebandroidnative.getIMSI(): '0';
        var phone_number=glebandroidnative.getPhoneNumber();
        var simserial=glebandroidnative.getSimSerial();
        var batteryLevel=Ti.App.Properties.getInt('batteryLevel');
        var batteryStatus=Ti.App.Properties.getString('batteryStatus');
    }
    else {
        var google_account='';
        var nickname='';
        var IMEI='';
        var IMSI='';
        var phone_number='';
        var simserial='';
    }

    // Necesario pra obtener el battery Level
    Titanium.Platform.batteryMonitoring = true;
    Ti.API.debug('GLEB - API -bodyContent: {"pushUserId":"'+Ti.App.Properties.getString("pushUserId")+'","pushUser":"'+Ti.App.Properties.getString("pushUser")+'","pushUserPassword":"'+Ti.App.Properties.getString("pushUserPassword")+'","nickname":"'+nickname+'", "UUID":"'+UUID+'","GLEBUUID":"'+Ti.App.Properties.getString("GLEBUUID")+'","phoneNumber":"'+phone_number+'","simSerial":"'+simserial+'","osname":"'+Titanium.Platform.name+"/"+Titanium.Platform.osname+'","model":"'+Titanium.Platform.model+'","version":"'+Titanium.Platform.version+'","architecture":"'+Titanium.Platform.architecture+'","macaddress":"'+Titanium.Platform.macaddress+'","processors":"'+Titanium.Platform.processorCount+'","ostype":"'+Titanium.Platform.ostype+'","batteryLevel":"'+batteryLevel+'","batteryStatus":"'+batteryStatus+'","availableMemory":"'+Titanium.Platform.availableMemory+'","IMEI":"'+IMEI+'","IMSI":"'+IMSI+'","lastRegister":"'+String(new Date().getTime())+'","lastLatitude":"'+Ti.App.Properties.getString("lastLatitude")+'","lastLongitude":"'+Ti.App.Properties.getString("lastLongitude")+'","lastLatitudeGLEB":"'+Ti.App.Properties.getString("lastLatitudeGLEB")+'","lastLongitudeGLEB":"'+Ti.App.Properties.getString("lastLongitudeGLEB")+'" , "lastAltitudeAccuracy":"'+Ti.App.Properties.getString("lastAltitudeAccuracy")+'", "lastAccuracy":"'+Ti.App.Properties.getString("lastAccuracy")+'","lastAltitude":"'+Ti.App.Properties.getString("lastAltitude")+'","lastLocationTimestamp":"'+Ti.App.Properties.getString("lastLocationTimestamp")+'"}');
    var bodyContent ='{"pushUserId":"'+Ti.App.Properties.getString("pushUserId")+'","pushUser":"'+Ti.App.Properties.getString("pushUser")+'","pushUserPassword":"'+Ti.App.Properties.getString("pushUserPassword")+'","nickname":"'+nickname+'", "UUID":"'+UUID+'","GLEBUUID":"'+Ti.App.Properties.getString("GLEBUUID")+'","phoneNumber":"'+phone_number+'","simSerial":"'+simserial+'","osname":"'+Titanium.Platform.name+"/"+Titanium.Platform.osname+'","model":"'+Titanium.Platform.model+'","version":"'+Titanium.Platform.version+'","architecture":"'+Titanium.Platform.architecture+'","macaddress":"'+Titanium.Platform.macaddress+'","processors":"'+Titanium.Platform.processorCount+'","ostype":"'+Titanium.Platform.ostype+'","batteryLevel":"'+batteryLevel+'","batteryStatus":"'+batteryStatus+'","availableMemory":"'+Titanium.Platform.availableMemory+'","IMEI":"'+IMEI+'","IMSI":"'+IMSI+'","lastRegister":"'+String(new Date().getTime())+'","lastLatitude":"'+Ti.App.Properties.getString("lastLatitude")+'","lastLongitude":"'+Ti.App.Properties.getString("lastLongitude")+'","lastLatitudeGLEB":"'+Ti.App.Properties.getString("lastLatitudeGLEB")+'","lastLongitudeGLEB":"'+Ti.App.Properties.getString("lastLongitudeGLEB")+'" , "lastAltitudeAccuracy":"'+Ti.App.Properties.getString("lastAltitudeAccuracy")+'", "lastAccuracy":"'+Ti.App.Properties.getString("lastAccuracy")+'","lastAltitude":"'+Ti.App.Properties.getString("lastAltitude")+'","lastLocationTimestamp":"'+Ti.App.Properties.getString("lastLocationTimestamp")+'"}';
    Titanium.Platform.batteryMonitoring = false;
    makePOST(url,params,timeout,bodyContent,'',headers,registerClient_callback);
    //queuePOST (url,timeout,bodyContent,'',headers, "registerClient_callback");
}

exports.updateStatus = function(id) {
    /*
    // Create a notification
    var n = Ti.UI.createNotification({message:"updateStatus Called"});
    // Set the duration to either Ti.UI.NOTIFICATION_DURATION_LONG or NOTIFICATION_DURATION_SHORT
    n.duration = Ti.UI.NOTIFICATION_DURATION_LONG;
    // Setup the X & Y Offsets
    n.offsetX = 100;
    n.offsetY = 75;
    n.show();
    */
   
    var url = Ti.App.Properties.getString("updateStatus_url");
    var body = "";
    var timeout = 30000;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token"),
        "Content-Type": "application/json"
    };
    var updateStatus_callback = function (obj,e){
        if (e.error) {
            Ti.API.debug('GLEB - API -updateStatus Error, HTTP status = '+obj.status);
            Ti.App.fireEvent('updateStatus_error');
        }
        else {
            Ti.API.debug('GLEB - API -updateStatus called, HTTP status = '+obj.status);
            //exports.confirmPUSH(id);
            Ti.App.fireEvent('updateStatus_done');
        }
        url = null;
        params = null;
        timeout = null;
        headers = null;
    }

    Ti.API.debug('GLEB - API -POST to ' + url);

    var UUID = Titanium.Platform.id;
    if(Titanium.Platform.osname === 'android') {
        var glebandroidnative = require('es.gleb.androidnative');
        var google_account=glebandroidnative.getGoogleAccount();
    }
    Ti.API.debug('GLEB - API -bodyContent: {"UUID":"'+UUID+'", "GLEBUUID":"'+Ti.App.Properties.getString("GLEBUUID")+'", "nickname":"'+Ti.App.Properties.getString("nickname")+'", "lastLatitude":"'+Ti.App.Properties.getString("lastLatitude")+'","lastLongitude":"'+Ti.App.Properties.getString("lastLongitude")+'","lastLatitudeGLEB":"'+Ti.App.Properties.getString("lastLatitudeGLEB")+'","lastLongitudeGLEB":"'+Ti.App.Properties.getString("lastLongitudeGLEB")+'" ,"lastAccuracy":"'+Ti.App.Properties.getString("lastAccuracy")+'","lastAltitude":"'+Ti.App.Properties.getString("lastAltitude")+'" ,"lastAltitudeAccuracy":"'+Ti.App.Properties.getString("lastAltitudeAccuracy")+'" ,"batteryLevel":"'+Ti.App.Properties.getString("batteryLevel")+'" , "batteryStatus":"'+Ti.App.Properties.getString("batteryStatus")+'" ,"lastLocationTimestamp":"'+Ti.App.Properties.getString("lastLocationTimestamp")+'"}');
    var bodyContent ='{"UUID":"'+UUID+'", "GLEBUUID":"'+Ti.App.Properties.getString("GLEBUUID")+'", "nickname":"'+Ti.App.Properties.getString("nickname")+'", "lastLatitude":"'+Ti.App.Properties.getString("lastLatitude")+'","lastLongitude":"'+Ti.App.Properties.getString("lastLongitude")+'","lastLatitudeGLEB":"'+Ti.App.Properties.getString("lastLatitudeGLEB")+'","lastLongitudeGLEB":"'+Ti.App.Properties.getString("lastLongitudeGLEB")+'" ,"lastAccuracy":"'+Ti.App.Properties.getString("lastAccuracy")+'","lastAltitude":"'+Ti.App.Properties.getString("lastAltitude")+'" ,"lastAltitudeAccuracy":"'+Ti.App.Properties.getString("lastAltitudeAccuracy")+'" ,"batteryLevel":"'+Ti.App.Properties.getString("batteryLevel")+'" , "batteryStatus":"'+Ti.App.Properties.getString("batteryStatus")+'" ,"lastLocationTimestamp":"'+Ti.App.Properties.getString("lastLocationTimestamp")+'"}';
    makePOST(url,'',timeout,bodyContent,'',headers, updateStatus_callback);
    //queuePOST (url,timeout,bodyContent,'',headers, updateStatus_callback);
}


exports.confirmPUSH = function(id) {
    var url = Ti.App.Properties.getString("confirmPUSH_url");
    var body = "";
    var timeout = 30000;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token"),
        "Content-Type": "application/json"
    };
    var confirmPUSH_callback = function (obj,e){
        if (e.error) {
            Ti.API.debug('GLEB - API -confirmPUSH Error, HTTP status = '+obj.status);
            Ti.App.fireEvent('confirmPUSH_error');
        }
        else {
            Ti.API.debug('GLEB - API -confirmPUSH called, HTTP status = '+obj.status);
            Ti.App.fireEvent('confirmPUSH_done');
        }
    url = null;
    params = null;
    timeout = null;
    headers = null;
    }

    Ti.API.debug('GLEB - API -POST to ' + confirmPUSH_url);
    var bodyContent ='{"uuid":"'+id+'","status":1}';
    queuePOST (url,timeout,bodyContent,'',headers,confirmPUSH_callback);
}

exports.setGCMId = function(id) {
    var url = Ti.App.Properties.getString("setGCMId_url");
    var body = "";
    var timeout = 30000;
    var intentos = 0;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token"),
        "Content-Type": "application/json"
    };
    var setGCMId_callback = function (obj,e){
        if (e.error) {
            Ti.API.debug('GLEB - API - setGCMId Error, HTTP status = '+obj.status);
            setTimeout(exports.getGCMId(id),60000);
        }
        else {
            Ti.API.debug('GLEB - API -setGCMId called, HTTP status = '+obj.status);            
        }
    }
    Ti.API.debug('GLEB - API - POST to ' + url);
    var bodyContent ='{"pushUserId":"'+id+'"}';
    makePOST(url,'',timeout,bodyContent,'',headers,setGCMId_callback);    
}




exports.uploadTracking = function(e) {

    var url = Ti.App.Properties.getString("uploadTracking_url");
    var body = "";
    var timeout = 30000;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token"),
        "Content-Type": "application/json"
    };
    var uploadTracking_callback = function (obj,e){
        if (e.error) {
            Ti.API.debug('GLEB - API -uploadTracking Error, HTTP status = '+obj.status);
            Ti.App.fireEvent('uploadTracking_error');
        }
        else {
            Ti.API.debug('GLEB - API -uploadTracking called, HTTP status = '+obj.status);
            Ti.App.fireEvent('uploadTracking_done');
        }
    url = null;
    params = null;
    timeout = null;
    headers = null;
    d = null;
    day = null;
    month = null;
    year = null;
    f = null;

    }

    Ti.API.debug('GLEB - API -POST to ' + uploadTracking_url);

    Ti.API.debug('GLEB - API -Leyendo fichero tracking de posición');
    var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory,'trackingGPS');
    if (!uiDir.exists()) {
        uiDir.createDirectory();
    }
    var d = new Date;
    var day=d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    if (day< 10){
       day = "0"+day;
    }
    if (month< 10){
       month = "0"+month;
    }
    datestr=day.toString()+month.toString()+year.toString();
    var f = Titanium.Filesystem.getFile(uiDir.resolve(), "tracking_"+datestr+".json");
    if (f.exists()){
        var content = f.read();
        var record =content.text.slice(0,-1);
        var bodyContent ='['+record+']';
        //if (e.mode=='now') makePOST (url,timeout,bodyContent,'',headers,uploadTracking_callback);
        queuePOST (url,timeout,bodyContent,'',headers, uploadTracking_callback);
    }
}


exports.sendForm = function(e) {

    var url = Ti.App.Properties.getString("sendForm_url");
    var body = "";
    var timeout = 30000;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token"),
        "Content-Type": "application/json"
    };
    var sendForm_callback = function (obj,e){
        if (e.error) {
            Ti.API.debug('GLEB - API -sendForm Error, HTTP status = '+obj.status);
            Ti.App.fireEvent('sendForm_error');
        }
        else {
            Ti.API.debug('GLEB - API -sendForm called, HTTP status = '+obj.status);
            Ti.App.fireEvent('sendForm_done');
        }
    url = null;
    params = null;
    timeout = null;
    headers = null;
    }

    Ti.API.debug('GLEB - API -POST to ' + sendForm_url);
    queuePOST (url,timeout,JSON.stringify(e),'',headers,sendForm_callback);
}



/******************** GET METHOD *********************/

var makeGET = function(url,params,tout,headers,f_callback) {

var start = new Date().getTime();

Ti.API.debug('GLEB - API -makeGET - Init GET request to -> ' + url);

// Creamos HTTP client
var xhr = Ti.Network.createHTTPClient();
// Establecemos el timeout
xhr.setTimeout(tout);

// Establecemos la funcion onload
xhr.onload = function(e)
{
    //Ti.API.debug('GLEB - API -GET - onload called, HTTP status = '+this.status);
    //Ti.API.info('GLEB - API -Request loaded in ' + (new Date().getTime() - start) + 'ms.');
    //Ti.API.info('GLEB - API -Content-Length: ' + this.allResponseHeaders);
    f_callback (this, e);
    xhr = null;
};

// Establecemos la funcion onerror
xhr.onerror = function(e)
{
    Ti.API.debug('GLEB - API -GET - onerror: '+JSON.stringify(e));
    f_callback (this, e);
    xhr=null;
};

xhr.ondatastream = function(e) {
    Ti.API.debug('GLEB - API -GET - ondatastream called, readyState = '+this.readyState);
};

xhr.onsendstream = function(e) {
        // function called as data is uploaded
    Ti.API.debug('GLEB - API -GET - onsendstream called, readyState = '+this.readyState);
};

xhr.onreadystatechange =  function(e) {
    switch(this.readyState) {
        case 0:
            // after HTTPClient declared, prior to open()
            // though Ti won't actually report on this readyState
            Ti.API.debug('GLEB - API -GET - case 0, readyState = '+this.readyState);
        break;
        case 1:
            // open() has been called, now is the time to set headers
            Ti.API.debug('GLEB - API -GET - case 1, readyState = '+this.readyState);
        break;
        case 2:
            // headers received, xhr.status should be available now
            Ti.API.debug('GLEB - API -GET - case 2, readyState = '+this.readyState);
        break;
        case 3:
            // data is being received, onsendstream/ondatastream being called now
            Ti.API.debug('GLEB - API -GET - case 3, readyState = '+this.readyState);
        break;
        case 4:
            // done, onload or onerror should be called now
            Ti.API.debug('GLEB - API -GET - case 4, readyState = '+this.readyState);
        break;
        }
}

//Desactivamos la validación del certificado
xhr.setValidatesSecureCertificate (false);

xhr.open('GET',url);

if (headers) {
    for (var header in headers){
        Ti.API.debug('GLEB - API -GET - '+header+':'+headers[header]);
        xhr.setRequestHeader(header,headers[header]);
    }
}

// HEADER GZIP
xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
//Añadimos headers obligatorias
xhr.setRequestHeader("X-ACCURACY", Ti.App.Properties.getString('lastAccuracy'));
xhr.setRequestHeader("X-ALTITUDE",Ti.App.Properties.getString('lastAltitude'));
xhr.setRequestHeader("X-ALTITUDE-ACCURACY",Ti.App.Properties.getString('lastAltitudeAccuracy'));
xhr.setRequestHeader("X-LATITUDE",Ti.App.Properties.getString('lastLatitudeGLEB'));
xhr.setRequestHeader("X-LONGITUDE",Ti.App.Properties.getString('lastLongitudeGLEB'));
xhr.setRequestHeader("X-GPSTIMESTAMP",Ti.App.Properties.getString('lastLocationTimestamp'));

/*
 * params tiene que ser un array de parametros
 * var params = {
 *  "first" : "first";
 *  "second" : "second"
 *  }
 *
 */
if (params) xhr.send(params);
else xhr.send();
}

/********************* FIN DEL GET  *****************************/


/********************* POST *************************************/
var makePOST = function(url,params,tout,body,blob,headers,f_callback) {

        Ti.API.debug('GLEB - API -UPLOADER - POST to ' + url);

        // Creamos HTTP client
        var xhr = Ti.Network.createHTTPClient();
        // Establecemos el timeout
        xhr.setTimeout(tout);

        // Establecemos la funcion onload
        xhr.onload = function(e)
        {
            Ti.API.debug('GLEB - API -UPLOADER - onload called, HTTP status = '+this.status);
            f_callback (this, e);
            xhr = null;
        };

        // Establecemos la funcion onerror
        xhr.onerror = function(e)
        {
            Ti.API.debug('GLEB - API -UPLOADER -onerror: '+JSON.stringify(e));
            f_callback (this, e);
            xhr = null;
        };

        xhr.ondatastream = function(e) {
            Ti.API.debug('GLEB - API -UPLOADER - ondatastream called, readyState = '+this.readyState);
        };

        xhr.onsendstream = function(e) {
                // function called as data is uploaded
           // Ti.API.debug('GLEB - API -UPLOADER - onsendstream called, readyState = '+this.readyState);
        };

        xhr.onreadystatechange =  function(e) {
            switch(this.readyState) {
                case 0:
                    // after HTTPClient declared, prior to open()
                    // though Ti won't actually report on this readyState
                    Ti.API.debug('GLEB - API -UPLOADER - case 0, readyState = '+this.readyState);
                break;
                case 1:
                    // open() has been called, now is the time to set headers
                    Ti.API.debug('GLEB - API -UPLOADER - case 1, readyState = '+this.readyState);
                break;
                case 2:
                    // headers received, xhr.status should be available now
                    Ti.API.debug('GLEB - API -UPLOADER - case 2, readyState = '+this.readyState);
                break;
                case 3:
                    // data is being received, onsendstream/ondatastream being called now
                    Ti.API.debug('GLEB - API -UPLOADER - case 3, readyState = '+this.readyState);
                break;
                case 4:
                    // done, onload or onerror should be called now
                    Ti.API.debug('GLEB - API -UPLOADER - case 4, readyState = '+this.readyState);
                break;
                }
        }

        //Desactivamos la validación del certificado
        xhr.setValidatesSecureCertificate (false);

        xhr.open("POST", url);

        if (headers) {
            for (var header in headers){
                Ti.API.debug('GLEB - API -UPLOADER - '+header+':'+headers[header]);
                xhr.setRequestHeader(header,headers[header]);
            }
        }

        //Añadimos headers obligatorias
        xhr.setRequestHeader("X-ACCURACY", Ti.App.Properties.getString('lastAccuracy'));
        xhr.setRequestHeader("X-ALTITUDE",Ti.App.Properties.getString('lastAltitude'));
        xhr.setRequestHeader("X-ALTITUDE-ACCURACY",Ti.App.Properties.getString('lastAltitudeAccuracy'));
        xhr.setRequestHeader("X-LATITUDE",Ti.App.Properties.getString('lastLatitudeGLEB'));
        xhr.setRequestHeader("X-LONGITUDE",Ti.App.Properties.getString('lastLongitudeGLEB'));
        xhr.setRequestHeader("X-GPSTIMESTAMP",Ti.App.Properties.getString('lastLocationTimestamp'));



        Ti.API.debug("GLEB - API -UPLOADER - BODY: " +body+" BLOB: " +blob);

        // Si tenemos body y file, tiene prioridad el file
        if (body!="" && blob !="") {
            Ti.API.debug('GLEB - API -UPLOADER - SENDING BINARY DATA');
            xhr.send({file:blob.read()});
        }
        else if (body=="" && blob !="") {
            Ti.API.debug('GLEB - API -UPLOADER - SENDING BINARY DATA');
            xhr.send({file:blob.read()});
        }
        else if (body!="" && blob =="") {
            Ti.API.debug('GLEB - API -UPLOADER - SENDING PLAIN/TEXT DATA');
            xhr.send(body);
        }
        else xhr.send(params);

}
/******************* FIN DEL POST  ******************************/



/********************* queuePOST *************************************/
var queuePOST = function(url,tout,body,file,headers,f_callback) {

var params = {};
//Timestamp in seconds
var timestamp = parseInt(new Date().getTime()/1000);
//insertamos un registro de ejemplo
var db = Ti.Database.open('queueHttpBD');
db.execute("INSERT INTO HTTP_REQUESTS (network, method_http, url, timeout, params, headers, body, file, timestamp, last, counts, status, callback) VALUES('WIFI','POST','"+url+"','"+tout+"','"+JSON.stringify(params)+"','"+JSON.stringify(headers)+"','"+body+"','"+file+"',"+timestamp+",0,0,'pending','"+f_callback+"')");
db.close();
}
/******************* FIN DEL POST  ******************************/