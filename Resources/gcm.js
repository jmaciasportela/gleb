// ****************************************************************************************************************
// some init stuff

var now = new Date(),
serviceIntent = Ti.Android.currentService.getIntent(),
tickerText = 'GGM Notification',
contentText = 'Received at ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

// ****************************************************************************************************************
// getting the payload

Ti.API.debug("GLEB - SERVICE GCM - ServiceIntent: "+ JSON.stringify(serviceIntent));
Ti.API.debug("GLEB - SERVICE GCM - PushId: "+ serviceIntent.getStringExtra('pushId'));
Ti.API.debug("GLEB - SERVICE GCM - Message: "+ serviceIntent.getStringExtra('message'));
Ti.API.debug("GLEB - SERVICE GCM - Payload: "+ serviceIntent.getStringExtra('payload'));
Ti.API.debug("GLEB - SERVICE GCM - Serial: "+ serviceIntent.getStringExtra('serial'));

//Variable para almacenar las veces que ha habido un Error
var updateError = 0;

//Variable para almacenar las pasadas
var pasadas = 0;

//Por defecto vamos a pensar que el GPS esta habilitado siempre
var isGPSEnabled = true;

//Timestamp del momento en que se activo la localizacion
var startTimestamp = 0;

function convertPosition (position,isLatitude) {
   positive = position > 0 ? true : false;
   position = Math.abs(position);
   latDegrees = Math.floor(position);               
   position = position - latDegrees;
   latMinutes = Math.floor(position * 60);
   position = position - (latMinutes / 60.0);
   latSeconds = Math.round((position * 3600)*Math.pow(10,3))/Math.pow(10,3);
   return Ti.Utils.base64encode(latDegrees+ "º"+ latMinutes+ "' "+latSeconds+ "\" "+ (positive ? (isLatitude ? "N" : "E") : (isLatitude ? "S": "O")));
}

GPSWarning = function(){
    
    var notificationIntent = Ti.Android.createIntent({action: "android.settings.LOCATION_SOURCE_SETTINGS"});

    var intent = Ti.Android.createPendingIntent({
        intent: notificationIntent,
        flags: Titanium.Android.FLAG_UPDATE_CURRENT
    });
    
    // check http://docs.appcelerator.com/titanium/2.1/index.html#!/api/Titanium.Android.Notification
    var notification = Ti.Android.createNotification({
        contentIntent: intent,
        contentTitle: "Error",
        contentText: "GLEB requiere la activacion del GPS",
        tickerText: "GLEB requiere tu atención",
        icon: Ti.App.Android.R.drawable.appiconred,
        //icon: '/images/appiconred.png',       
        defaults:Titanium.Android.NotificationManager.DEFAULT_ALL,
        flags : Titanium.Android.ACTION_DEFAULT | Titanium.Android.FLAG_AUTO_CANCEL | Titanium.Android.FLAG_SHOW_LIGHTS
    });    
    Ti.Android.NotificationManager.notify((new Date().getTime()), notification);
    // Aviso especial GPS deshabilitado
    
    ////
    Titanium.Geolocation.removeEventListener('location', locationCallback);
    Ti.API.debug("GLEB - SILENTGPS - Parando Servicio, GPS deshabilitado");
    Ti.Android.stopService(serviceIntent);
}

function locationCallback(e)
    {
        //Si ocurre un error
        if (!e.success || e.error)
        {
            Ti.API.debug("GLEB - SILENTGPS - Geolocation Listener Error: " + e.code + " - "+ e.error);
            isGPSEnabled == false;
            GPSWarning();
        }       
        //Si se recibe un evento correcto
        else {          
        Ti.API.debug('GLEB - SILENTGPS - Geolocation Updated: ' + JSON.stringify(e));
        
        //Obtenemos todos los parametros
        var longitude = e.coords.longitude;
        var latitude = e.coords.latitude;
        var currentProvider = e.provider.name;
        var altitude = e.coords.altitude;
        var heading = e.coords.heading;
        var accuracy = e.coords.accuracy;
        var speed = e.coords.speed;
        var timestamp = e.coords.timestamp;
        var altitudeAccuracy = e.coords.altitudeAccuracy;       
        
        //Check location event provider
        if (currentProvider=="gps") isGPSEnabled == true;
        

        // Comprobamos el intervalo de tiempo de tracking
        //Solo guardamos en el archivo aquellos eventos que cumplan el intervalo tTracking, para que el fichero no crezca mucho     
        prevTimeStamp = Ti.App.Properties.getString('prevTimestamp');       
        Ti.API.debug('GLEB - SILENTGPS - Ultimo tracking: ' + prevTimeStamp+ ', nuevo timestamp: ' + timestamp+', diferencia: ' + (parseInt(timestamp) - parseInt(prevTimeStamp)).toString());
        if (parseInt(timestamp) - parseInt(prevTimeStamp) > parseInt(Ti.App.Properties.getString('tTracking')) ){
            Ti.App.Properties.setString('prevTimestamp',timestamp);
            
            Ti.API.debug('GLEB - SILENTGPS - Guardando tracking de posición');
            var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory,'trackingGPS');
            if (!uiDir.exists()) {
                uiDir.createDirectory();
            }
            var d = new Date;   
            var day=d.getDate();
            var month = d.getMonth();
            var year = d.getFullYear();
            if (day<= 10){
               day = "0" + day;
            }
            if (month<= 10){
               month = "0"+month;
            }
            datestr=day.toString()+month.toString()+year.toString();
            var f = Titanium.Filesystem.getFile(uiDir.resolve(), "tracking_"+datestr+".json");
            var record =' {"provider":"'+e.provider.name+'","coords":'+JSON.stringify(e.coords)+",\r\n";            
            if (f.write(record, true)===false) {               
               Ti.API.debug("GLEB - SILENTGPS - Ha habido un error guardando el tracking");
            }
            else Ti.API.debug("GLEB - SILENTGPS - tracking guardado correctamente"); 
        }

        //Almacenamos los parametros en properties
        if (longitude < 0) Ti.App.Properties.setString('lastLongitude', longitude.toString().substring(0,10));
        else Ti.App.Properties.setString('lastLongitude', longitude.toString().substring(0,10));
        if (latitude < 0) Ti.App.Properties.setString('lastLatitude', latitude.toString().substring(0,10));
        else Ti.App.Properties.setString('lastLatitude', latitude.toString().substring(0,10));  
        Ti.App.Properties.setString('lastProvider', currentProvider);   
        Ti.App.Properties.setString('lastAccuracy', Math.floor(accuracy));
        Ti.App.Properties.setString('lastAltitude', Math.floor(altitude));
        Ti.App.Properties.setString('lastAltitudeAccuracy', altitudeAccuracy);
        Ti.App.Properties.setString('lastLatitudeGLEB', convertPosition (latitude, true));
        Ti.App.Properties.setString('lastLongitudeGLEB', convertPosition (longitude, true));
        Ti.App.Properties.setString('lastLocationTimestamp', timestamp);
        
        //Si la accuracy obtenida es menor de Accuracy se detiene y al menos hace dos pasadas para pararse
        if (Math.floor(accuracy) <= 100){
           if (pasadas<1) {
               Ti.API.debug("GLEB - SILENTGPS - Pasadas: "+ pasadas);
               pasadas ++;
            }
           else{
               Ti.API.debug("GLEB - SILENTGPS - Pasadas: "+ pasadas);
               pasadas = 0;               
               //Location conseguida, apagamos location
               Ti.API.debug("GLEB - SILENTGPS - Deshabilitando localizacion");
               Titanium.Geolocation.removeEventListener('location', locationCallback);
               //Paramos el servicios
               Ti.App.Properties.setString('GPSStatus', "stopped");
               //Enviamos coordenadas
               updateStatus();
           }    
        }
        
        // Si lleva intentado localizar mas de TmaxLocation (default=3min), se para y se envia la ultima localizacion valida
        // Para evitar que en zonas sin cobertura GPS se coma la bateria
        if (parseInt(require('modules/utils').getCurrentDateMS()) - startTimestamp > Ti.App.Properties.getInt('tMaxLocation')){            
           pasadas = 0;           
           //Location conseguida, apagamos location
           Ti.API.debug("GLEB - SILENTGPS - Deshabilitando localizacion, tiempo excedido");
           Titanium.Geolocation.removeEventListener('location', locationCallback);
           //Paramos el servicios
           Ti.App.Properties.setString('GPSStatus', "stopped");
           //Enviamos coordenadas
           updateStatus(); 
        }
        
    }   
}

//Si obtenemos 5 errores consecutivos detenemos el servicio
updateStatus_callback = function(obj,e){
    if (updateError >= 4) {
        updateError = 0;
        Titanium.Geolocation.removeEventListener('location', locationCallback);
        Ti.API.debug("GLEB - SILENTGPS - Parando Servicio, alcanzado el numero de reintentos");
        Ti.Android.stopService(serviceIntent);
        return;
    }
    if (e.error) {        
        updateError++;
        Ti.API.debug("GLEB - SILENTGPS - Error actualizando estado:"+updateError);
        setTimeout(updateStatus, 15000);    
    }
    else {
        updateError = 0;
        Titanium.Geolocation.removeEventListener('location', locationCallback);
        Ti.API.debug("GLEB - SILENTGPS - Parando Servicio, actualizacion correcta");
        Ti.Android.stopService(serviceIntent);
    }    
}

updateStatus = function() {   
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
    require('clients/glebAPI').makePOSTnow(url,'',timeout,bodyContent,'',headers, updateStatus_callback);
}


//Check if serial exist
if (!require('config/data').contains(serviceIntent.getStringExtra('serial'))){
    if (serviceIntent.getStringExtra('pushId') == "0000"){  
        
        Ti.API.debug("GLEB - SILENT GPS - Estado localizacion: " + Ti.App.Properties.getString('GPSStatus'));
        Ti.API.debug("GLEB - SILENT GPS - Estado localizacion: " + Ti.App.Properties.getString('lastLatitudeGLEB'));
        if (Ti.App.Properties.getString('GPSStatus')=="stopped"){        
            Ti.App.Properties.setString('GPSStatus', "started");
            Titanium.Geolocation.removeEventListener('location', locationCallback);    
            startTimestamp = require('modules/utils').getCurrentDateMS();
            Ti.Geolocation.Android.manualMode = false;          
            Ti.Geolocation.purpose = "Receive User Location";
            Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
            Titanium.Geolocation.frequency = 1000;
            Titanium.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
            Titanium.Geolocation.addEventListener('location', locationCallback);        
            Ti.API.debug("GLEB - SILENT GPS - Habilitando localizacion");        
        } 
        else{
            Ti.API.debug("GLEB - SILENTGPS - Parando Servicio, localizacion funcionando");
            Ti.Android.stopService(serviceIntent);        
        }
    }
    else{
        Ti.API.debug("GLEB - SILENTGPS - Parando Servicio, servicio ocupado");
        Ti.Android.stopService(serviceIntent);        
    }
}
else Ti.API.debug("GLEB - SERVICE GCM - Notificacion "+ serviceIntent.getStringExtra('serial')+" ya estaba procesada, no se hace nada.");

