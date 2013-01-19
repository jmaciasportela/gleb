/**
* Plugin to control GPS
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

Ti.API.debug('GLEB - GPS - Loading GPS plugin');

var locationAdded = false;
var showAlertGPS = false;

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


function locationCallback(e)
	{
		if (!e.success || e.error)
		{
			Ti.API.debug("GLEB - GPS - Geolocation Listener Error: " + translateErrorCode(e.code)+" - "+ e.error); 
            Ti.API.debug("GLEB - GPS - Geolocation Listener Error: " + e.code + " - "+ e.error);
			if (e.code == 3) Ti.App.Properties.setBool('GPSOff', true);
		}		
		else {
			
		Ti.API.debug('GLEB - GPS - Geolocation Updated: ' + JSON.stringify(e));

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
		Ti.API.debug('GLEB - GPS - Ultimo tracking: ' + prevTimeStamp+ ', nuevo timestamp: ' + timestamp+', diferencia: ' + (parseInt(timestamp) - parseInt(prevTimeStamp)).toString());
		// Dif de tiempo en milisegundos
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
}

exports.start = function() {
     
//IOS
if (Titanium.Platform.name != 'android') {
	if (Ti.Geolocation.locationServicesEnabled) {
	    // perform other operations with Ti.Geolocation	    
		Ti.Geolocation.purpose = 'Get Current Location';
    	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
    	Ti.Geolocation.distanceFilter = 10;
    	Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;	    	
    	// POSITION ONE SHOT
    	Titanium.Geolocation.getCurrentPosition(function(e) {
       		if (e.error) {
				Ti.API.debug("GLEB - GPS ONESHOT - Code translation: "+translateErrorCode(e.code));
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
				Ti.API.debug('speed ' + speed);
				Titanium.API.info('GLEB - GPS ONESHOT - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
			    
			    if (longitude < 0) Ti.App.Properties.setString('lastLongitude', longitude.toString().substring(0,10));
			    else Ti.App.Properties.setString('lastLongitude', longitude.toString().substring(0,10));
			    
		        if (latitude < 0) Ti.App.Properties.setString('lastLatitude', latitude.toString().substring(0,10));
			    else Ti.App.Properties.setString('lastLatitude', latitude.toString().substring(0,10));
	    				
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
	locationAdded = true;    
}
}
//ANDROID
else{

    Ti.Geolocation.Android.manualMode = true;

	var providerPassive = Ti.Geolocation.Android.createLocationProvider({
		name: Ti.Geolocation.PROVIDER_PASSIVE,
		// no more than one per every 60 seconds
        minUpdateTime: 15,
        // Don't send location updates until the location changes at least this meters
        minUpdateDistance: 0,
	});

	var providerGps = Ti.Geolocation.Android.createLocationProvider({
		name: Ti.Geolocation.PROVIDER_GPS,
		// no more than one per every 60 seconds
		minUpdateTime: 15,
		// Don't send location updates until the location changes at least this meters
		minUpdateDistance: 20,		
	});
	
	var providerNetwork = Ti.Geolocation.Android.createLocationProvider({
		name: Ti.Geolocation.PROVIDER_NETWORK,
		// no more than one per every 15 seconds
        minUpdateTime: 15,
        // Don't send location updates until the location changes at least this meters
        minUpdateDistance: 0,
	});
	
	//This rules filter location updates
    var gpsRule = Ti.Geolocation.Android.createLocationRule({
        name: Ti.Geolocation.PROVIDER_GPS,
        // Updates should be accurate to 100m
        //accuracy: 100,
        // Updates should be no older than 5m
        maxAge: 120000,
        // But  no more frequent than once per 10 seconds
        minAge: 10000
    });

	var networkRule = Ti.Geolocation.Android.createLocationRule({
		name: Ti.Geolocation.PROVIDER_NETWORK,
        // Updates should be accurate to 100m
        //accuracy: 100,
        // Updates should be no older than 5m
        maxAge: 60000,
        // But  no more frequent than once per 10 seconds
        minAge: 10000
	});
		
	Ti.Geolocation.Android.addLocationProvider(providerGps);
	//Quiza hay que desactivarlo para las tablet, o hacer una deteccion de si es tablet
	if (!Ti.App.Properties.getBool('isTablet')) Ti.Geolocation.Android.addLocationProvider(providerNetwork);	
	Ti.Geolocation.Android.addLocationProvider(providerPassive);

	Ti.Geolocation.Android.addLocationRule(gpsRule);
	Ti.Geolocation.Android.addLocationRule(networkRule);	
	
	// POSITION ONE SHOT - Es la primera que se ejecuta
    Titanium.Geolocation.getCurrentPosition(function(e) {
       		if (e.error) {
				Ti.API.debug("GLEB - GPS ONESHOT - Geolocation One Shot Error: "+ translateErrorCode(e.error.code)+" - "+e.error.message);
				Ti.App.Properties.setBool('GPSOff',true);
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
				//Ti.API.debug('speed ' + speed);
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
	locationAdded = true;		
}
}

exports.pause = function() {
	Ti.API.debug("GLEB - GPS - pause event received");
	if (locationAdded) {
		Ti.API.debug("GLEB - GPS - removing location callback on pause");
		Titanium.Geolocation.removeEventListener('location', locationCallback);
		locationAdded = false;
	}
}

exports.resume = function() {
	Ti.API.debug("GLEB - GPS - resume event received");
	if (!locationAdded && locationCallback) {
		Ti.API.debug("GLEB - GPS - adding location callback on resume");
		Titanium.Geolocation.addEventListener('location', locationCallback);
		locationAdded = true;
	}
}
