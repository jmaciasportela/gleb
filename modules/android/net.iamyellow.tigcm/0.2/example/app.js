var tigcm = require('net.iamyellow.tigcm');

var id = null;


// ======   message event 
// setting this to true will force the module to execute the message event instead of the notification in gcm.js when the app is in foreground.
tigcm.fireEventWhenInFg = true;

tigcm.addEventListener('message', function (ev) {
	alert('a message from GCM  = ' + ev.alert);
});

// ====== end message event 



tigcm.addEventListener('registered', function (ev) {
	// here we have to send to our server this registrationId
	// the server uses it in order to send notifications to devices
	Ti.API.info('====== registered with id ' + ev.registrationId);
});

tigcm.addEventListener('unregistered', function (ev) {
	// here we have to send to our server the fact that we unregistered from GCM
	// the server uses it in order to send notifications to devices
	Ti.API.info('====== unregistered with id ' + ev.registrationId);
});

tigcm.addEventListener('error', function (ev) {
	Ti.API.info('====== error with id ' + ev.id);
});

tigcm.addEventListener('recoverableError', function (ev) {
	Ti.API.info('====== recoverable error with id ' + ev.id);
});


var window = Ti.UI.createWindow({
	backgroundColor: '#fff',
	exitOnClose:true,
	navBarHidden:true
});


window.addEventListener('open', function () {
	Ti.API.info('====  window opened');

	// get the registrationId
	id = tigcm.registrationId;

	if (id === null) {
		// if not, register and wait for 'registered' event!
		tigcm.registerDevice();
	}
	else {
		// we could also unregister the device
		// tigcm.unregisterDevice();
		Ti.API.info('===== we had the registration ID, is = ' + id);
	}
});
window.open();




