//StatusBar Constructor

exports._get = function() {

Ti.API.info('GLEB - Cargando reverseLocation View');
	// create UI components
	var view = Ti.UI.createView({		
		backgroundImage: '../../images/statusBar.png',
		height: '40dp',		
		touchEnabled: true,
		borderRadius: 0
	});

	var map = Ti.UI.createImageView({
		top: '5dp',
		left: '255dp',
		width: '32dp',
		height: '32dp',
  		image: '../../images/map.png'
	});

	var location = Ti.UI.createLabel({
		name:"latitud_value",
		text:"Cerca de" +Ti.App.Properties.getString('lastDirection'),
		color:'#fff',		
		height:'auto',
		width:'225dp',
        top:'5dp',
        left:'25dp',
    	shadowColor:'#000',
    	shadowOffset:{x:3,y:3},    	
    	font:{fontSize:20},
    	textAlign:'center'		
		});
		
		
	// assemble view hierarchy
    view.add(map);
	view.add(location);


		
	Ti.API.info('GLEB - Elementos añadidos a la vista');

	Ti.App.addEventListener("reverseLocation.updated",function(e){
	
	Ti.API.info("GLEB - Event reverseLocation.updated - "+JSON.stringify(e));
	
	if (!e.success || e.error)
		{			
			//radar.image = '../images/signal-0.png';		
			Ti.API.info("GLEB - Code translation: "+translateErrorCode(e.code));
			return;
		}

	    location.text  = "Cerca de "+e.places[0].address;
		location.color = 'red';		
		setTimeout(function()
		{
			location.color = '#fff';
		},500);
});

function translateErrorCode(code) {
	if (code == null) {
		return null;
	}
	switch (code) {
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

return view;
}
