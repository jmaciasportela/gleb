/**
* Plugin to control heading
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

Ti.API.debug('GLEB - HEADING - Loading battery plugin');

/*
exports.init = function() {
    Ti.App.Properties.setBool('headingActive',false);
    if (Titanium.Geolocation.hasCompass)
    {
        Titanium.Geolocation.showCalibration = false;
        Titanium.Geolocation.headingFilter = 90;
        Ti.Geolocation.getCurrentHeading(function(e)
        {
            if (e.error)
            {
                currentHeading.text = 'error: ' + e.error;
                return;
            }
            //var x = e.heading.x;
            //var y = e.heading.y;
            //var z = e.heading.z;
            //var magneticHeading = e.heading.magneticHeading;
            //var accuracy = e.heading.accuracy;
            var magneticHeading = e.heading.magneticHeading;
            //var timestamp = e.heading.timestamp; 
            Titanium.API.debug('GLEB - COMPASS - current heading: ' + magneticHeading);
            Titanium.API.debug('GLEB - COMPASS - heading'+JSON.stringify(e.heading));
            if (e.heading.magneticHeading){
                Ti.App.Properties.setInt ('initialDegrees',magneticHeading);
            }
        });
    }
    else {
        Titanium.API.debug("GLEB - COMPASS - No Compass on device");
    }
}

*/

heading_f = function(e){
    Ti.App.Properties.setString('headingValue',e.heading.magneticHeading);
    Ti.App.fireEvent ('gleb_compassUpdated',{"value":e.heading.magneticHeading});
}

exports.start = function (){
    if (Titanium.Geolocation.hasCompass){
    	Ti.App.Properties.setBool('headingActive',true);
		Ti.API.info("GLEB - start monitoring Heading");
		Titanium.Geolocation.addEventListener('heading',heading_f);
	}	
}

exports.stop = function (){
		Ti.App.Properties.setBool('headingActive',false);
		Ti.API.info("GLEB - start monitoring Heading");
		Titanium.Geolocation.removeEventListener('heading',heading_f);
}
