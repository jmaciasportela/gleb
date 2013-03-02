/**
* Plugin to control GPS
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

Ti.API.debug('GLEB - GPS - Loading GPS plugin');

//Variable para registrar el estado del modulo
var GPSStatus = "stopped";

//Variable para devolver el estado del modulo
exports.getStatus = function (){ 
 return GPSStatus;
}

//Variable para modificar el estado del modulo
exports.setStatus = function (){ 
 return GPSStatus;
}

//Variable para almacenar las pasadas
var pasadas = 0;

//Por defecto vamos a pensar que el GPS esta habilitado siempre
var isGPSEnabled = true;

//Timestamp del momento en que se activo la localizacion
var startTimestamp = 0;


function translateErrorCode (code) {
	if (code == null) {
		return null;
	}
	switch (code) {
		case 0:
			return "Gps is disabled";
		case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
			return "Location unknown";
		case Ti.Geolocation.ERROR_DENIED:
			return "Access denied";
		case Ti.Geolocation.ERROR_NETWORK:
			return "Network error";
		case Ti.Geolocation.ERROR_HEADING_FAILURE:
			return "Failure to detect heading";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
			return "Region monitoring access denied";
		case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
			return "Region monitoring access failure";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
			return "Region monitoring setup delayed";
	}
}

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


exports.warningGPS = function (){

    if (isGPSEnabled == false){            
        Ti.API.debug('GLEB - GPS - GPS deshabilitado');
        var alertDialog = Titanium.UI.createAlertDialog({
            title: 'Aviso',
            message:'Para conseguir un funcionamiento óptimo de GLEB se recomienda activar la localización GPS',
            buttonNames: ['ACTIVAR','CANCEL']
        });         
        alertDialog.addEventListener('click', function(e)
            {
            if (e.index==0) {   
                var intent = Ti.Android.createIntent({action: "android.settings.LOCATION_SOURCE_SETTINGS"});
                Ti.Android.currentActivity.startActivity(intent);               
            }        
        }); 
        alertDialog.show();
    }
}


function locationCallback(e)
	{
	    //Si ocurre un error
		if (!e.success || e.error)
		{
			Ti.API.debug("GLEB - GPS - Geolocation Listener Error: " + translateErrorCode(e.code)+" - "+ e.error); 
            Ti.API.debug("GLEB - GPS - Geolocation Listener Error: " + e.code + " - "+ e.error);
			isGPSEnabled == false;
		}		
		//Si se recibe un evento correcto
		else {			
		Ti.API.debug('GLEB - GPS - Geolocation Updated: ' + JSON.stringify(e));
		
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
		Ti.API.debug('GLEB - GPS - Ultimo tracking: ' + prevTimeStamp+ ', nuevo timestamp: ' + timestamp+', diferencia: ' + (parseInt(timestamp) - parseInt(prevTimeStamp)).toString());
		if (parseInt(timestamp) - parseInt(prevTimeStamp) > parseInt(Ti.App.Properties.getString('tTracking')) ){
    		Ti.App.Properties.setString('prevTimestamp',timestamp);
    		
    		Ti.API.debug('GLEB - GPS - Guardando tracking de posición');
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
    		   Ti.API.debug("GLEB - GPS - Ha habido un error guardando el tracking");
    		}
    		else Ti.API.debug("GLEB - GPS - tracking guardado correctamente"); 
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
		
		//Actualizamos el UI
		require("ui/statusBar/gpsView")._update(e);
		
		//Si la accuracy obtenida es menor de Accuracy se detiene y al menos hace dos pasadas para pararse
		if (Math.floor(accuracy) <= 100){
		   if (pasadas<1) {
		       Ti.API.debug("GLEB - GPS - Pasadas: "+ pasadas);
		       pasadas ++;
		    }
		   else{
		       pasadas = 0;
		       //Enviamos coordenadas
		       require('clients/glebAPI').updateStatus("","Localización estandar");
		       exports.stop();
		   }    
		}
		
		// Si lleva intentado localizar mas de TmaxLocation (default=3min), se para y se envia la ultima localizacion valida
		// Para evitar que en zonas sin cobertura GPS se coma la bateria
		if (parseInt(require('modules/utils').getCurrentDateMS()) - startTimestamp > Ti.App.Properties.getInt('tMaxLocation')){
	       pasadas = 0;
           //Enviamos coordenadas
           require('clients/glebAPI').updateStatus("","Localización estandar");
           exports.stop();		    
		}
		
	}	
}


exports.start = function() {   
    
if (Ti.App.Properties.getString('GPSStatus') =="stopped"){    
    Ti.App.Properties.setString('GPSStatus', "started");    
    startTimestamp = require('modules/utils').getCurrentDateMS();
    Ti.Geolocation.Android.manualMode = false;
      
    Ti.Geolocation.purpose = "Receive User Location";
    Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
    Titanium.Geolocation.frequency = 10000;
    Titanium.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
    
    // POSITION ONE SHOT - Es la primera que se ejecuta
    Titanium.Geolocation.getCurrentPosition(function(e) {
       		if (e.error) {
    			Ti.API.debug("GLEB - GPS ONESHOT - Geolocation One Shot Error: "+ translateErrorCode(e.error.code)+" - "+e.error.message);
    			return;
    		} else {
    			
    			Ti.API.debug('GLEB - GPS ONESHOT - Geolocation One Shot: ' + JSON.stringify(e));
    			if (e.provider.name=="gps") Ti.App.Properties.setBool('GPSOff',false);
    			var longitude = e.coords.longitude;
    			var latitude = e.coords.latitude;
    			var currentProvider = e.provider.name;
    			var altitude = e.coords.altitude;
    			var heading = e.coords.heading;
    			var accuracy = e.coords.accuracy;
    			var speed = e.coords.speed;
    			var timestamp = e.coords.timestamp;
    			var altitudeAccuracy = e.coords.altitudeAccuracy;		
    			Titanium.API.info('GLEB - GPS ONESHOT - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
    		    
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
    			//Ti.App.fireEvent ("gleb_locationUpdated", e);
    			require("ui/statusBar/gpsView")._update(e);
        	}
    	});    
        Titanium.Geolocation.addEventListener('location', locationCallback);
    }
}

exports.stop = function() {    
	Ti.API.debug("GLEB - GPS - stop event received");
	if (Ti.App.Properties.getString('GPSStatus')=="started") {
		Ti.API.debug("GLEB - GPS - removing location callback on pause");
		Titanium.Geolocation.removeEventListener('location', locationCallback);
		Ti.App.Properties.setString('GPSStatus', "stopped");
		Ti.API.debug("GLEB - GPS - GPS status: "+Ti.App.Properties.getString('GPSStatus'));
	}
	Ti.App.Properties.setString('GPSStatus', "stopped");
}
