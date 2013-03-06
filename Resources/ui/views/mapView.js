var mainView;
var mapWin;

exports._open = function () {
	
	mapWin = Titanium.UI.createWindow({  
		backgroundColor:'transparent',
		orientationModes : [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT],
       	navBarHidden: true,
	});
	mapWin.modal = true;
	
	
var mainView = Ti.UI.createView({
    name: "MapView",
    borderWidth: 0,
    backgroundColor: "transparent",
    layout: "vertical",
    width: Ti.UI.FILL,
    height: Ti.UI.FILL,
    top: Ti.App.glebUtils._p(46)
}); 



var header = Ti.UI.createView({
	backgroundColor:"#575252",
	width: Ti.App.glebUtils._p(320),
	height:Ti.App.glebUtils._p(30),
	top:Ti.App.glebUtils._p(0)
});
var headerTitle = Ti.UI.createLabel({
	text: "Localizaciones de Hoy",
	left:Ti.App.glebUtils._p(2),
	width:Ti.UI.FILL,
	top:Ti.App.glebUtils._p(2),
	height:"auto",
	color:"white",
	textAlign:"left",
	font:{fontSize:Ti.App.glebUtils._p(15),fontWeight:"bold"},
	shadowColor:"#A7A7A7",
	shadowOffset:{x:Ti.App.glebUtils._p(1),y:Ti.App.glebUtils._p(1)}
});
header.add(headerTitle);
/*
var buttonVolver = Titanium.UI.createButton({   		
	backgroundColor: 'white',
	borderColor: 'white',
	borderRadius: 4,
	borderWidth: 1,
	title: 'VOLVER',
	width: Ti.App.glebUtils._p(60),
	height: Ti.App.glebUtils._p(20),
	right: Ti.App.glebUtils._p(5),
	font:{fontSize:Ti.App.glebUtils._p(12),fontWeight:"bold"},
});
buttonVolver.addEventListener('click',function(){
	Titanium.Media.vibrate([ 0, 100]);
	Ti.App.fireEvent('gleb_openDailyMap_close');	
	});

header.add(buttonVolver);
*/

//Añadmos el header al container
mainView.add(header);

var mapview = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    region: {latitude:parseFloat(Ti.App.Properties.getString('lastLatitude')), longitude:parseFloat(Ti.App.Properties.getString('lastLongitude')),latitudeDelta:0.01, longitudeDelta:0.01},
    animate:true,
    regionFit:true,
    userLocation:false
    //top: Ti.App.glebUtils._p(46)
});

Ti.API.debug('GLEB - MAPVIEW - Leyendo fichero tracking de posición');
var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory,'trackingGPS');
if (uiDir.exists()) {
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
	if (f.exists()){    
        Ti.API.debug("GLEB - MAPVIEW - Abriendo fichero tracking_"+datestr+".json");    		
		var content = f.read();
		var record =content.text.slice(0,-1);	
		var json = '['+record+']';
		//Ti.API.debug('GLEB - JSON : '+ json);
		var markers=[];		
		try {
		    markers =JSON.parse(json);
		}
		catch (err){
			Ti.API.debug('GLEB - ERROR PARSEANDO JSON MARKERS : '+ err);			
		}	
		//Ti.API.debug('GLEB - MARKERS: '+JSON.stringify(markers));
		
		var prev = 0;
		var points = [];
		Ti.API.debug('GLEB - MAPVIEW - Markers length:'+ markers.length);
        Ti.API.debug('GLEB - MAPVIEW - Markers 0:'+ JSON.stringify(markers[0]));

		for (var i =0; i< markers.length; i++){
		  	var a = new Date(markers[i]["coords"]["timestamp"]);
			var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
		    var year = a.getFullYear();
		    var month = months[a.getMonth()];
		    var date = a.getDate();
		    var hour = a.getHours();
		    var min = a.getMinutes();
		    var sec = a.getSeconds();
		    var time = date+','+month+' '+year+' '+hour+':'+min+':'+sec ;	
		    
			var annotation = Titanium.Map.createAnnotation({
				image: Titanium.Filesystem.resourcesDirectory+"images/pin.png",
			    latitude:parseFloat(markers[i]["coords"]["latitude"]),
			    longitude:parseFloat(markers[i]["coords"]["longitude"]),
			    title: time,
			    subtitle:"Precision GPS:"+parseInt(markers[i]["coords"]["accuracy"])+"\n"+ "Velocidad"+parseInt(markers[i]["coords"]["speed"])+"\n"+"Altitud:"+parseInt(markers[i]["coords"]["altitude"]),			    
			    animate:true,    
			    myid:1
			});
			
			if (prev != markers[i]["coords"]["timestamp"]) {
			    Ti.API.debug('GLEB - MAPVIEW - Añadiendo anotacion:'+ JSON.stringify(annotation));
			    mapview.addAnnotation (annotation);
			}
			prev = 	markers[i]["coords"]["timestamp"];			
			points.push({latitude: markers[i]["coords"]["latitude"],longitude: markers[i]["coords"]["longitude"]});
		}
		
		
		var route = {
                name:"Dayly",
                points:points,
                color:"red",
                width: Ti.App.glebUtils._p(1)
            };
		mapview.addRoute(route);
				
	}
    else Ti.API.debug("GLEB - MAPVIEW - Error Abriendo fichero tracking_"+datestr+".json");

}

// Markers tipicos de google maps	
var currentLocation = Titanium.Map.createAnnotation({
    latitude:parseFloat(Ti.App.Properties.getString('lastLatitude')),
    longitude:parseFloat(Ti.App.Properties.getString('lastLongitude')),
    title:"Localizacion actual",
    subtitle:'Subtitulo',
    pincolor:Titanium.Map.ANNOTATION_RED,
    animate:true,    
    myid:1
});

mapview.addAnnotation (currentLocation);	
mainView.add(mapview);
// Handle click events on any annotations on this map.
mapview.addEventListener('click', function(evt) {

    Ti.API.info("Annotation " + evt.title + " clicked, id: " + evt.annotation.myid);
    // Check for all of the possible names that clicksouce
    // can report for the left button/view.
    if (evt.clicksource == 'leftButton' || evt.clicksource == 'leftPanel' ||
        evt.clicksource == 'leftView') {
        Ti.API.info("Annotation " + evt.title + ", left button clicked.");
    }
});

mapWin.add(mainView);
require('modules/NavigationController').open(mapWin);

};

exports.cleanup = function (){
	Ti.API.info('GLEB - Limpiando mapDaily' );
	mapWin.close();
	mapWin.remove(mainView);
	Ti.App.glebUtils.machaca(mainView);
    mapWin = null;
}


