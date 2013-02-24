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

//Convierte la posicion GPS al formato GLEB
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

function silentLocation(e)
    {   
        var lastLocationTimestamp = parseInt(Ti.App.Properties.getString('lastLocationTimestamp'));        
        if (!e.success || e.error)
        {
            Ti.API.debug("GLEB - SILENTGPS - Geolocation Listener Error: " + translateErrorCode(e.code)+" - "+ e.error); 
            Ti.API.debug("GLEB - SILENTGPS - Geolocation Listener Error: " + e.code + " - "+ e.error);
            if (e.code == 3) Ti.App.Properties.setBool('GPSOff', true);
        }       
        else {
            
        Ti.API.debug('GLEB - SILENTGPS - Geolocation Updated: ' + JSON.stringify(e));
        var longitude = e.coords.longitude;
        var latitude = e.coords.latitude;
        var currentProvider = e.provider.name;
        var altitude = e.coords.altitude;
        var heading = e.coords.heading;
        var accuracy = e.coords.accuracy;
        var speed = e.coords.speed;
        var timestamp = e.coords.timestamp;
        var altitudeAccuracy = e.coords.altitudeAccuracy;        
        // TRACKING DE POSICION     
        prevTimeStamp = Ti.App.Properties.getString('prevTimestamp');
        Ti.API.debug('GLEB - SILENTGPS - Ultimo tracking: ' + prevTimeStamp+ ', nuevo timestamp: ' + timestamp+', diferencia: ' + (parseInt(timestamp) - parseInt(prevTimeStamp)).toString());
        // Dif de tiempo en milisegundos
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


        Ti.API.debug("GLEB - SILENTGPS - ACCURACY:"+Math.floor(accuracy)+" timestamp:"+parseInt(timestamp)+ "lastTimestamp:"+lastLocationTimestamp);
        
        if (Math.floor(accuracy) <= 50 && parseInt(timestamp) > lastLocationTimestamp){                
            //Location conseguida, apagamos location
            Ti.API.debug("GLEB - SILENTGPS - Deshabilitando localizacion");
            Titanium.Geolocation.removeEventListener('location', silentLocation);
            //Paramos el servicios
            Ti.API.debug("GLEB - SILENTGPS - Parando Servicio");
            Ti.Android.stopService(serviceIntent);
        } 
    }   
}



//Check if serial exist
if (!require('config/data').contains(serviceIntent.getStringExtra('serial'))){

    if (serviceIntent.getStringExtra('pushId') == "0000"){
        Ti.Geolocation.Android.manualMode = true;
            gpsProvider = Ti.Geolocation.Android.createLocationProvider({
            name: Ti.Geolocation.PROVIDER_GPS,
            minUpdateTime: 15, 
            minUpdateDistance: 10
        });
        Ti.Geolocation.Android.addLocationProvider(gpsProvider);    
        Titanium.Geolocation.addEventListener('location', silentLocation);
        Ti.API.debug("GLEB - SILENT GPS - Habilitando localizacion");        
    }
}
else Ti.API.debug("GLEB - SERVICE GCM - Notificacion "+ serviceIntent.getStringExtra('serial')+" ya estaba procesada, no se hace nada.");



// stop this service
//Ti.Android.stopService(serviceIntent);












