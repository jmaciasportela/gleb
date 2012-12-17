// This is a test harness for your module
// You should do something interesting in this harness 
// to test out the module and to provide instructions 
// to users on how to use it by example.


// open a single window
var window = Ti.UI.createWindow({
	backgroundColor:'#000'
});
var label_IMEI = Ti.UI.createLabel({color:'#fff',top:10});
var label_IMSI = Ti.UI.createLabel({color:'#fff',top:50});
window.add(label_IMEI);
window.add(label_IMSI);
window.open();


var glebandroidnative = require('es.gleb.androidnative');
Ti.API.info("module is => " + glebandroidnative);

label_IMEI.text = "IMEI=" + glebandroidnative.getIMEI();
label_IMSI.text = "IMSI=" + glebandroidnative.getIMSI();



var POI = [];
POI[0] = {"latitud":"41.627777777778", "longitud":"-4.6747222222222", "baseName":"Manolo", "ip":"delbombo"};
POI[1] = {"latitud":"41.764166666667", "longitud":"-4.7005555555556", "baseName":"Pepito", "ip":"delbombo"};


try {
        glebandroidnative.startWikitude(JSON.stringify(POI));
}
catch(e) {
            Ti.API.info('GLEB - '+e);

}


/*
Ti.API.info("module exampleProp is => " + glebandroidnative.exampleProp);
glebandroidnative.exampleProp = "This is a test value";

if (Ti.Platform.name == "android") {
	var proxy = glebandroidnative.createExample({
		message: "Creating an example Proxy",
		backgroundColor: "red",
		width: 100,
		height: 100,
		top: 100,
		left: 150
	});

	proxy.printMessage("Hello world!");
	proxy.message = "Hi world!.  It's me again.";
	proxy.printMessage("Hello world!");
	window.add(proxy);
}
*/
