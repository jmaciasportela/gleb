/**
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/


var view;
var radar;
var signal;
var latitud;
var latitud_value;
var longitud;
var longitud_value;
var accuracy;
var accuracy_value;
var buttonRight;

exports._get = function() {

	Ti.API.info('GLEB - Cargando GPS View');
	// create UI components
	view = Ti.UI.createView({		
		backgroundImage: '../../images/statusBar.png',
		height: Ti.App.glebUtils._p(40),		
		touchEnabled: true,
		borderRadius: 0
	});

	radar = Ti.UI.createImageView({
		top: Ti.App.glebUtils._p(5),
		left: Ti.App.glebUtils._p(275),
		width: Ti.App.glebUtils._p(32),
		height: Ti.App.glebUtils._p(32),
  		image: '../../images/antenna.png'
	});
	
	signal = Ti.UI.createImageView({
		top: Ti.App.glebUtils._p(5),
		left: Ti.App.glebUtils._p(220),
		width: Ti.App.glebUtils._p(40),
		height: Ti.App.glebUtils._p(30),
  		image: '../../images/signal-0.png'
	});
	
	
	
	latitud = Ti.UI.createLabel({
		name:"latitud",
		color:'#fff',
		text:'Latitud',
		height:'auto',
		width:Ti.App.glebUtils._p(80),
        top:Ti.App.glebUtils._p(4),
        left:Ti.App.glebUtils._p(5),
    	shadowColor:'#000',
    	shadowOffset:{x:Ti.App.glebUtils._p(3),y:Ti.App.glebUtils._p(3)},    	
    	font:{fontSize:Ti.App.glebUtils._p(10)},
    	textAlign:'center'		
		});
	latitud_value = Ti.UI.createLabel({
		name:"latitud_value",
		text: Ti.Utils.base64decode(Ti.App.Properties.getString('lastLatitudeGLEB')),
		color:'#fff',		
		height:'auto',
		width:Ti.App.glebUtils._p(80),
        top:Ti.App.glebUtils._p(20),
        left:Ti.App.glebUtils._p(5),
    	shadowColor:'#000',
    	shadowOffset:{x:Ti.App.glebUtils._p(3),y:Ti.App.glebUtils._p(3)},    	
    	font:{fontSize:Ti.App.glebUtils._p(10)},
    	textAlign:'center'		
		});
		
	longitud = Ti.UI.createLabel({
		name:"longitud",
		color:'#fff',
		text:'Longitud',
		height:'auto',
		width:Ti.App.glebUtils._p(80),
        top:Ti.App.glebUtils._p(4),
        left:Ti.App.glebUtils._p(92),
    	shadowColor:'#000',
    	shadowOffset:{x:Ti.App.glebUtils._p(3),y:Ti.App.glebUtils._p(3)},    	
    	font:{fontSize:Ti.App.glebUtils._p(10)},
    	textAlign:'center'		
		});
	longitud_value = Ti.UI.createLabel({
		name:"longitud_value",
		text: Ti.Utils.base64decode(Ti.App.Properties.getString('lastLongitudeGLEB')),
		color:'#fff',		
		height:'auto',
		width:Ti.App.glebUtils._p(80),
        top:Ti.App.glebUtils._p(20),
        left:Ti.App.glebUtils._p(92),
    	shadowColor:'#000',
    	shadowOffset:{x:Ti.App.glebUtils._p(3),y:Ti.App.glebUtils._p(3)},    	
    	font:{fontSize:Ti.App.glebUtils._p(10)},
    	textAlign:'center'		
		});		

	accuracy = Ti.UI.createLabel({
		name:"accuracy",
		text:"....",
		color:'#fff',
		text:'Accuracy',
		height:'auto',		
    	width:Ti.App.glebUtils._p(45),
        top:Ti.App.glebUtils._p(4),
        left:Ti.App.glebUtils._p(180),
    	shadowColor:'#000',
    	shadowOffset:{x:Ti.App.glebUtils._p(3),y:Ti.App.glebUtils._p(3)},    	
    	font:{fontSize:Ti.App.glebUtils._p(10)},
    	textAlign:'left'		
		});
	accuracy_value = Ti.UI.createLabel({
		name:"accuracy_value",
		color:'#fff',
		text: Ti.App.Properties.getString('lastAccuracy'),		
		height:'auto',
		width:Ti.App.glebUtils._p(45),
        top:Ti.App.glebUtils._p(20),
        left:Ti.App.glebUtils._p(180),
    	shadowColor:'#000',
    	shadowOffset:{x:Ti.App.glebUtils._p(3),y:Ti.App.glebUtils._p(3)},    	
    	font:{fontSize:Ti.App.glebUtils._p(10)},
    	textAlign:'center'		
		});		
				
		
		var acc  = Ti.App.Properties.getString('lastAccuracy');
		var currentProvider = Ti.App.Properties.getString('lastProvider');
	    //Poner icono gps verde 
		//Leemos el accuracy y dependiendo ponemos uno u otro		
		if (acc >= 0 && acc < 20) signal.image = '../../images/signal-5.png';
		else if (acc >= 20 && acc < 40) signal.image = '../../images/signal-4.png';
		else if (acc >= 40 && acc < 60) signal.image = '../../images/signal-3.png';
		else if (acc >= 60 && acc < 100) signal.image = '../../images/signal-2.png';
		else if (acc >= 100) signal.image = '../../images/signal-1.png';
		
		if (currentProvider =='gps') radar.image = '../../images/satellite.png';
		else radar.image = '../../images/antenna.png';		

	// assemble view hierarchy
    view.add(radar);
	view.add(signal);
	view.add(latitud);
	view.add(longitud);
	view.add(accuracy);
	view.add(latitud_value);
	view.add(longitud_value);
	view.add(accuracy_value);

	//view.add(provider);
	//view.add(reverseGeo);

return view;
}
	
exports._update = function(e) {
	if (view != null){
		//Ti.API.info("GLEB - Event location.updated - "+JSON.stringify(e));
		
		if (!e.success || e.error)
			{			
				radar.image = '../images/signal-0.png';		
				Ti.API.info("GLEB - Code translation: "+translateErrorCode(e.code));
				return;
			}
			//Poner icono gps verde 
			//Leemos el accuracy y dependiendo ponemos uno u otro		
			if (e.coords.accuracy >= 0 && e.coords.accuracy < 20) signal.image = '../../images/signal-5.png';
			else if (e.coords.accuracy >= 20 && e.coords.accuracy < 40) signal.image = '../../images/signal-4.png';
			else if (e.coords.accuracy >= 40 && e.coords.accuracy < 60) signal.image = '../../images/signal-3.png';
			else if (e.coords.accuracy >= 60 && e.coords.accuracy < 100) signal.image = '../../images/signal-2.png';
			else if (e.coords.accuracy >= 100) signal.image = '../../images/signal-1.png';				
	
			longitud_value.text = Ti.Utils.base64decode(Ti.App.Properties.getString('lastLongitudeGLEB')); 
			latitud_value.text = Ti.Utils.base64decode(Ti.App.Properties.getString('lastLatitudeGLEB'));
			accuracy_value.text = Ti.App.Properties.getString('lastAccuracy');	
			
			if (e.provider.name =='gps') radar.image = '../../images/satellite.png';
			else radar.image = '../../images/antenna.png';
					
			latitud_value.color = 'red';
			longitud_value.color = 'red';
			accuracy_value.color = 'red';
			setTimeout(function()
			{
				latitud_value.color = '#fff';
				longitud_value.color = '#fff';
				accuracy_value.color = '#fff';
		},500);
	}
}




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

