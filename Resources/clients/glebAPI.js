exports.sendSMS = function(msisdn) {

    var url = require('clients/glebAPI.config').sendSMS_url;
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
                //message: '¿Desea reintentar el envío del código de registro?',
                message: 'Hola',
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

    var url = require('clients/glebAPI.config').validate_url;
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

    var url = require('clients/glebAPI.config').getMenus_url;
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

    var url = require('clients/glebAPI.config').getView_url;
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

    var url = require('clients/glebAPI.config').getWindow_url;
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

    var url = require('clients/glebAPI.config').getMenuVersion_url;
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

    var url = require('clients/glebAPI.config').registerClient_url;
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
            Ti.API.debug('GLEB - API -registerClient Error, ERROR = '+JSON.stringify(e));
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
        var nickname=Ti.App.Properties.getString("nickname")
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
    Ti.API.debug('GLEB - API -bodyContent: {"GCMpushUserId":"'+Ti.App.Properties.getString("GCMpushUserId")+'", "ACSpushUserId":"'+Ti.App.Properties.getString("ACSpushUserId")+'","ACSpushUser":"'+Ti.App.Properties.getString("ACSpushUser")+'","ACSpushUserPassword":"'+Ti.App.Properties.getString("ACSpushUserPassword")+'","ACSdeviceToken":"'+Ti.App.Properties.getString("ACSdeviceToken")+'","nickname":"'+nickname+'", "UUID":"'+UUID+'","GLEBUUID":"'+Ti.App.Properties.getString("GLEBUUID")+'","phoneNumber":"'+phone_number+'","simSerial":"'+simserial+'","osname":"'+Titanium.Platform.name+"/"+Titanium.Platform.osname+'","model":"'+Titanium.Platform.model+'","version":"'+Titanium.Platform.version+'","architecture":"'+Titanium.Platform.architecture+'","macaddress":"'+Titanium.Platform.macaddress+'","processors":"'+Titanium.Platform.processorCount+'","ostype":"'+Titanium.Platform.ostype+'","batteryLevel":"'+batteryLevel+'","batteryStatus":"'+batteryStatus+'","availableMemory":"'+Titanium.Platform.availableMemory+'","IMEI":"'+IMEI+'","IMSI":"'+IMSI+'","lastRegister":"'+String(new Date().getTime())+'","lastLatitude":"'+Ti.App.Properties.getString("lastLatitude")+'","lastLongitude":"'+Ti.App.Properties.getString("lastLongitude")+'","lastLatitudeGLEB":"'+Ti.App.Properties.getString("lastLatitudeGLEB")+'","lastLongitudeGLEB":"'+Ti.App.Properties.getString("lastLongitudeGLEB")+'" , "lastAltitudeAccuracy":"'+Ti.App.Properties.getString("lastAltitudeAccuracy")+'", "lastAccuracy":"'+Ti.App.Properties.getString("lastAccuracy")+'","lastAltitude":"'+Ti.App.Properties.getString("lastAltitude")+'","lastLocationTimestamp":"'+Ti.App.Properties.getString("lastLocationTimestamp")+'"}');
    var bodyContent ='{"GCMpushUserId":"'+Ti.App.Properties.getString("GCMpushUserId")+'","ACSpushUserId":"'+Ti.App.Properties.getString("ACSpushUserId")+'","ACSpushUser":"'+Ti.App.Properties.getString("ACSpushUser")+'","ACSpushUserPassword":"'+Ti.App.Properties.getString("ACSpushUserPassword")+'","ACSdeviceToken":"'+Ti.App.Properties.getString("ACSdeviceToken")+'","nickname":"'+nickname+'", "UUID":"'+UUID+'","GLEBUUID":"'+Ti.App.Properties.getString("GLEBUUID")+'","phoneNumber":"'+phone_number+'","simSerial":"'+simserial+'","osname":"'+Titanium.Platform.name+"/"+Titanium.Platform.osname+'","model":"'+Titanium.Platform.model+'","version":"'+Titanium.Platform.version+'","architecture":"'+Titanium.Platform.architecture+'","macaddress":"'+Titanium.Platform.macaddress+'","processors":"'+Titanium.Platform.processorCount+'","ostype":"'+Titanium.Platform.ostype+'","batteryLevel":"'+batteryLevel+'","batteryStatus":"'+batteryStatus+'","availableMemory":"'+Titanium.Platform.availableMemory+'","IMEI":"'+IMEI+'","IMSI":"'+IMSI+'","lastRegister":"'+String(new Date().getTime())+'","lastLatitude":"'+Ti.App.Properties.getString("lastLatitude")+'","lastLongitude":"'+Ti.App.Properties.getString("lastLongitude")+'","lastLatitudeGLEB":"'+Ti.App.Properties.getString("lastLatitudeGLEB")+'","lastLongitudeGLEB":"'+Ti.App.Properties.getString("lastLongitudeGLEB")+'" , "lastAltitudeAccuracy":"'+Ti.App.Properties.getString("lastAltitudeAccuracy")+'", "lastAccuracy":"'+Ti.App.Properties.getString("lastAccuracy")+'","lastAltitude":"'+Ti.App.Properties.getString("lastAltitude")+'","lastLocationTimestamp":"'+Ti.App.Properties.getString("lastLocationTimestamp")+'"}';
    Titanium.Platform.batteryMonitoring = false;
    makePOST(url,params,timeout,bodyContent,'',headers,registerClient_callback);
}

exports.updateStatus = function(id, description) {
    //Pera desde el servicio
    /*
    // Create a notification
    var n = Ti.UI.createNotification({message:"Actualizando estado"});
    // Set the duration to either Ti.UI.NOTIFICATION_DURATION_LONG or NOTIFICATION_DURATION_SHORT
    n.duration = Ti.UI.NOTIFICATION_DURATION_LONG;
    // Setup the X & Y Offsets
    n.offsetX = 100;
    n.offsetY = 75;
    n.show();
    */
   
    var url = require('clients/glebAPI.config').updateStatus_url;
    var body = "";
    var timeout = 30000;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token"),
        "Content-Type": "application/json"
    };

    Ti.API.debug('GLEB - API -POST to ' + url);

    var UUID = Titanium.Platform.id;
    if(Titanium.Platform.osname === 'android') {
        var glebandroidnative = require('es.gleb.androidnative');
        var google_account=glebandroidnative.getGoogleAccount();
    }
    Ti.API.debug('GLEB - API -bodyContent: {"UUID":"'+UUID+'", "GLEBUUID":"'+Ti.App.Properties.getString("GLEBUUID")+'", "nickname":"'+Ti.App.Properties.getString("nickname")+'", "lastLatitude":"'+Ti.App.Properties.getString("lastLatitude")+'","lastLongitude":"'+Ti.App.Properties.getString("lastLongitude")+'","lastLatitudeGLEB":"'+Ti.App.Properties.getString("lastLatitudeGLEB")+'","lastLongitudeGLEB":"'+Ti.App.Properties.getString("lastLongitudeGLEB")+'" ,"lastAccuracy":"'+Ti.App.Properties.getString("lastAccuracy")+'","lastAltitude":"'+Ti.App.Properties.getString("lastAltitude")+'" ,"lastAltitudeAccuracy":"'+Ti.App.Properties.getString("lastAltitudeAccuracy")+'" ,"batteryLevel":"'+Ti.App.Properties.getString("batteryLevel")+'" , "batteryStatus":"'+Ti.App.Properties.getString("batteryStatus")+'" ,"lastLocationTimestamp":"'+Ti.App.Properties.getString("lastLocationTimestamp")+'"}');
    var bodyContent ='{"UUID":"'+UUID+'", "GLEBUUID":"'+Ti.App.Properties.getString("GLEBUUID")+'", "nickname":"'+Ti.App.Properties.getString("nickname")+'", "lastLatitude":"'+Ti.App.Properties.getString("lastLatitude")+'","lastLongitude":"'+Ti.App.Properties.getString("lastLongitude")+'","lastLatitudeGLEB":"'+Ti.App.Properties.getString("lastLatitudeGLEB")+'","lastLongitudeGLEB":"'+Ti.App.Properties.getString("lastLongitudeGLEB")+'" ,"lastAccuracy":"'+Ti.App.Properties.getString("lastAccuracy")+'","lastAltitude":"'+Ti.App.Properties.getString("lastAltitude")+'" ,"lastAltitudeAccuracy":"'+Ti.App.Properties.getString("lastAltitudeAccuracy")+'" ,"batteryLevel":"'+Ti.App.Properties.getString("batteryLevel")+'" , "batteryStatus":"'+Ti.App.Properties.getString("batteryStatus")+'" ,"lastLocationTimestamp":"'+Ti.App.Properties.getString("lastLocationTimestamp")+'"}';
    //makePOST(url,'',timeout,bodyContent,'',headers, updateStatus_callback);
    //var queuePOST = function(url,tout,body,file,headers,f_callback)
    queuePOST (url,timeout,bodyContent,'',headers, null, description, "any");
}


exports.confirmPUSH = function(id) { 
    
    var url = require('clients/glebAPI.config').confirmPUSH_url;
    var body = "";
    var timeout = 30000;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token"),
        "Content-Type": "application/json"
    };

    Ti.API.debug('GLEB - API -POST to ' + confirmPUSH_url);
    var bodyContent ='{"uuid":"'+id+'","status":1}';
    queuePOST (url,timeout,bodyContent,'',headers,null, "any");
}


var GCMIdStatus ="";

exports.getGMCId = function (){
    return GCMIdStatus;
}

exports.setGCMId_callback = function (obj,e){
    if (e.error) {
        GCMIdStatus = "error";
        Ti.API.debug('GLEB - API - setGCMId Error, HTTP status = '+obj.status);            
    }
    else {
        GCMIdStatus = "ok";
        require('ui/statusBar/status').setStatus("online");
        exports.updateStatus();
    }
}

exports.setGCMId = function(id, description) {
    Ti.API.debug('GLEB - API - setGCMId - GCMIdStatus:'+GCMIdStatus);   
    if (GCMIdStatus!="on" && GCMIdStatus!="ok"){
        GCMIdStatus = "on";
        var url = require('clients/glebAPI.config').setGCMId_url;
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
                GCMIdStatus = "error";
                Ti.API.debug('GLEB - API - setGCMId Error, HTTP status = '+obj.status);            
            }
            else {
                GCMIdStatus = "ok";
                require('ui/statusBar/status').setStatus("online");
                exports.updateStatus();
            }
        }
        Ti.API.debug('GLEB - API - POST to ' + url);
        var bodyContent ='{"GCMpushUserId":"'+id+'"}';
        queuePOST(url,timeout,bodyContent,'',headers,"setGCMId_callback", description, "any");
    }    
}


var ACSIdStatus ="";

exports.getACSId = function (){
    return ACSIdStatus;
}

exports.setACSId_callback = function (obj,e){
    if (e.error) {
        ACSIdStatus = "error";
        Ti.API.debug('GLEB - API - setACSId Error, HTTP status = '+obj.status);            
    }
    else {
        ACSIdStatus = "ok";
        require('ui/statusBar/status').setStatus("online");
        exports.updateStatus();
    }
}

exports.setACSId = function(id, ACSdeviceToken, description) {    
    if (ACSIdStatus!="on"){
        ACSIdStatus = "on";
        var url = require('clients/glebAPI.config').setACSId_url;
        var body = "";
        var timeout = 30000;
        var intentos = 0;
        var headers = {
            "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
            "X-TOKEN": Ti.App.Properties.getString("token"),
            "Content-Type": "application/json"
        };

        Ti.API.debug('GLEB - API - POST to ' + url);
        var bodyContent ='{"ACSpushUserId":"'+id+'","ACSdeviceToken":"'+ACSdeviceToken+'"}';
        //makePOST(url,'',timeout,bodyContent,'',headers,setACSId_callback);
        queuePOST(url,timeout,bodyContent,'',headers,"setACSId_callback", description, "any");
    }    
}


exports.uploadTracking = function(description) {

    var url = require('clients/glebAPI.config').uploadTracking_url;
    var body = "";
    var timeout = 30000;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token"),
        "Content-Type": "application/json"
    };
    /*
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
    */
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
        queuePOST (url,timeout,bodyContent,'',headers, null, description, "any");
    }
}


exports.sendForm = function(fields, description) {

    var url = require('clients/glebAPI.config').sendForm_url;

    var bodyContent = "";
    var firstTime = true;
    for(i=0;i<fields.length;i++){
        var item = fields[i];
        //Primero comprobamos de que tipo es cada campo del formulario
        if(item.typeField === "textField" || item.typeField === "date" || item.typeField === "checkBox"){
            if(firstTime){
                firstTime = false;
                bodyContent+='{"' + item.name + '":"' + item.value + '"'; 
            }
            else{
                bodyContent+=',"' + item.name + '":"' + item.value + '"'; 
            }  
        }
        else if(item.typeField === "selectOption"){
            if(firstTime){
                firstTime = false;
                bodyContent+='{"' + item.name + '":"' + item.title + '"'; 
            }
            else{
                bodyContent+=',"' + item.name + '":"' + item.title + '"'; 
            }  
        }
    }
    if(bodyContent != ""){
        bodyContent+='}';
    }
    
    Ti.API.debug('GLEB - ENVIAR FORM - URL = '+url);
    Ti.API.debug('GLEB - ENVIAR FORM - BODY = '+bodyContent);
    
    var params = "";
    var timeout = 30000;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token"),
        "Content-Type": "application/json"
    };
    
    queuePOST (url,timeout,bodyContent,'',headers,null,description, "any");
    showQueueNotification();
}


exports.uploadImage = function(image, url, description) {     
        
    var bodyContent = "";
    var params = {
        file: image
    };
    var timeout = 30000;
    var headers = {
        "X-GLEBUUID": Ti.App.Properties.getString("GLEBUUID"),
        "X-TOKEN": Ti.App.Properties.getString("token")
    };
    
    //Logica para preguntar calidad y metodo
    
    /*
    var uploadImage_callback = function (obj,e){
        Ti.API.debug('GLEB - ENVIAR IMAGE - BODY = '+obj.status);
        if (e.error) {
            Ti.API.debug('GLEB - API -uploadImage Error, HTTP status = '+obj.status);
            
            Ti.App.glebUtils.closeActivityIndicator();
            var dialog = Ti.UI.createAlertDialog({
                cancel: 0,
                buttonNames: ['CANCELAR', 'REENVIAR'],
                message: '�Desea reintentar el env�o de la imagen?',
                title: 'Error envío imagen'
            });
            dialog.addEventListener('click', function(e){
                if (e.index === e.source.cancel){
                    Ti.API.info('The cancel button was clicked');
                }
                else if (e.index === 1){
                    Ti.App.glebUtils.openActivityIndicator({"text":"Enviando imagen ..."});
                    exports.uploadImage(image, url);
                }
            });
            dialog.show();
        }
        else {
            Ti.App.glebUtils.closeActivityIndicator();
            Ti.API.debug('GLEB - API -uploadImage called, HTTP status = '+obj.status);
            var dialog = Ti.UI.createAlertDialog({
                message: 'La imagen se ha enviado correctamente',
                ok: 'OK',
            }).show();
        }
        
    bodyContent = null;
    params = null;
    timeout = null;
    headers = null;
    }
    */
    //makePOST (url,params,timeout,bodyContent,'',headers,uploadImage_callback);
    queuePOST (url,timeout,'',image,headers,null,description,"any");
    showQueueNotification();
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

    Ti.API.debug('GLEB - API -POST - POST to ' + url);
    
    if(Titanium.Network.online){
    
        // Creamos HTTP client
        var xhr = Ti.Network.createHTTPClient();
        // Establecemos el timeout
        xhr.setTimeout(tout);
    
        // Establecemos la funcion onload
        xhr.onload = function(e)
        {
            Ti.API.debug('GLEB - API -POST - onload called, HTTP status = '+this.status);
            f_callback (this, e);
            xhr = null;
        };
    
        // Establecemos la funcion onerror
        xhr.onerror = function(e)
        {
            Ti.API.debug('GLEB - API -POST -onerror: '+JSON.stringify(e));
            f_callback (this, e);
            xhr = null;
        };
    
        xhr.ondatastream = function(e) {
            Ti.API.debug('GLEB - API -POST - ondatastream called, readyState = '+this.readyState);
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
                    Ti.API.debug('GLEB - API -POST - case 0, readyState = '+this.readyState);
                break;
                case 1:
                    // open() has been called, now is the time to set headers
                    Ti.API.debug('GLEB - API -POST - case 1, readyState = '+this.readyState);
                break;
                case 2:
                    // headers received, xhr.status should be available now
                    Ti.API.debug('GLEB - API -POST - case 2, readyState = '+this.readyState);
                break;
                case 3:
                    // data is being received, onsendstream/ondatastream being called now
                    Ti.API.debug('GLEB - API -POST - case 3, readyState = '+this.readyState);
                break;
                case 4:
                    // done, onload or onerror should be called now
                    Ti.API.debug('GLEB - API -POST - case 4, readyState = '+this.readyState);
                break;
                }
        }
    
        //Desactivamos la validación del certificado
        xhr.setValidatesSecureCertificate (false);
    
        xhr.open("POST", url);
    
        if (headers) {
            for (var header in headers){
                Ti.API.debug('GLEB - API -POST - '+header+':'+headers[header]);
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
    
    
    
        Ti.API.debug("GLEB - API -POST - BODY: " +body+" BLOB: " +blob);
    
        // Si tenemos body y file, tiene prioridad el file
        if (body!="" && blob !="") {
            Ti.API.debug('GLEB - API -POST - SENDING BINARY DATA');
            xhr.send({file:blob.read()});
        }
        else if (body=="" && blob !="") {
            Ti.API.debug('GLEB - API -POST - SENDING BINARY DATA');
            xhr.send({file:blob.read()});
        }
        else if (body!="" && blob =="") {
            Ti.API.debug('GLEB - API -POST - SENDING PLAIN/TEXT DATA');
            xhr.send(body);
        }
        else 
        {
        	Ti.API.debug('GLEB - API -POST - SENDING PARAMS' + JSON.stringify(params));
        	xhr.send(params);
        }
    }
    else{
        Ti.API.debug('GLEB - API -POST - NETWORK NOT ONLINE');
        f_callback (this, {'error': true});     
    }

}
/******************* FIN DEL POST  ******************************/


/********************* POST *************************************/
exports.makePOSTnow = function(url,params,tout,body,blob,headers,f_callback) {

    Ti.API.debug('GLEB - API -POST - POST to ' + url);
    
    if(Titanium.Network.online){
    
        // Creamos HTTP client
        var xhr = Ti.Network.createHTTPClient();
        // Establecemos el timeout
        xhr.setTimeout(tout);
    
        // Establecemos la funcion onload
        xhr.onload = function(e)
        {
            Ti.API.debug('GLEB - API -POST - onload called, HTTP status = '+this.status);
            f_callback (this, e);
            xhr = null;
        };
    
        // Establecemos la funcion onerror
        xhr.onerror = function(e)
        {
            Ti.API.debug('GLEB - API -POST -onerror: '+JSON.stringify(e));
            f_callback (this, e);
            xhr = null;
        };
    
        xhr.ondatastream = function(e) {
            Ti.API.debug('GLEB - API -POST - ondatastream called, readyState = '+this.readyState);
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
                    Ti.API.debug('GLEB - API -POST - case 0, readyState = '+this.readyState);
                break;
                case 1:
                    // open() has been called, now is the time to set headers
                    Ti.API.debug('GLEB - API -POST - case 1, readyState = '+this.readyState);
                break;
                case 2:
                    // headers received, xhr.status should be available now
                    Ti.API.debug('GLEB - API -POST - case 2, readyState = '+this.readyState);
                break;
                case 3:
                    // data is being received, onsendstream/ondatastream being called now
                    Ti.API.debug('GLEB - API -POST - case 3, readyState = '+this.readyState);
                break;
                case 4:
                    // done, onload or onerror should be called now
                    Ti.API.debug('GLEB - API -POST - case 4, readyState = '+this.readyState);
                break;
                }
        }
    
        //Desactivamos la validación del certificado
        xhr.setValidatesSecureCertificate (false);
    
        xhr.open("POST", url);
    
        if (headers) {
            for (var header in headers){
                Ti.API.debug('GLEB - API -POST - '+header+':'+headers[header]);
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
    
    
    
        Ti.API.debug("GLEB - API -POST - BODY: " +body+" BLOB: " +blob);
    
        // Si tenemos body y file, tiene prioridad el file
        if (body!="" && blob !="") {
            Ti.API.debug('GLEB - API -POST - SENDING BINARY DATA');
            xhr.send({file:blob.read()});
        }
        else if (body=="" && blob !="") {
            Ti.API.debug('GLEB - API -POST - SENDING BINARY DATA');
            xhr.send({file:blob.read()});
        }
        else if (body!="" && blob =="") {
            Ti.API.debug('GLEB - API -POST - SENDING PLAIN/TEXT DATA');
            xhr.send(body);
        }
        else 
        {
            Ti.API.debug('GLEB - API -POST - SENDING PARAMS' + JSON.stringify(params));
            xhr.send(params);
        }
    }
    else{
        Ti.API.debug('GLEB - API -POST - NETWORK NOT ONLINE');
        f_callback (this, {'error': true});     
    }

}
/******************* FIN DEL POST  ******************************/


var indexOf = function(array, item) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
};

// Muestra una notificación de larga duración indicando que la petición HTTP se ha encolado correctamente
var showQueueNotification = function(params) {
    var toast = Ti.UI.createNotification({
	    message:'Su petición se ha encolado correctamente',
	    duration: Ti.UI.NOTIFICATION_DURATION_LONG
	});
	toast.show();
};

/********************* queuePOST *************************************/
var queuePOST = function(url,tout,body,file,headers,f_callback,description, network) {


// Si la llamada es a una de las URL del array de llamadas que no pueden estar duplicadas, se borran las anteriores peticiones antes de insertar la nueva
//Array de urls
var urls = require('clients/glebAPI.config');
var non_repeat_urls = [ urls.setGCMId_url, urls.setACSId_url, urls.updateStatus_url, urls.uploadTracking_url]

//Si hay urls duplicadas en BD hay que borrarlas, siempre que no esten en estado uploading
if (indexOf(non_repeat_urls, url)>-1){
    var db = Ti.Database.open('queueHttpBD');
    db.execute("DELETE FROM HTTP_REQUESTS WHERE  url= '"+url+"' AND status!='uploading'");    
    db.close();    
}


var params = {};
//Timestamp in seconds
var timestamp = new Date().getTime();
//insertamos un registro de ejemplo
var db = Ti.Database.open('queueHttpBD');
db.execute("INSERT INTO HTTP_REQUESTS (network, method_http, url, timeout, params, headers, body, file, timestamp, last, counts, status, callback, description) VALUES('"+network+"','POST','"+url+"','"+tout+"','"+JSON.stringify(params)+"','"+JSON.stringify(headers)+"','"+body+"','"+file+"',"+timestamp+",0,0,'pending','"+f_callback+"','"+description+"')");
db.close();
}
/******************* FIN DEL POST  ******************************/