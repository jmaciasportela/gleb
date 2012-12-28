// ****************************************************************************************************************
// some init stuff

var now = new Date(),
serviceIntent = Ti.Android.currentService.getIntent(),
tickerText = 'GGM Notification',
contentText = 'Received at ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

// ****************************************************************************************************************
// getting the payload

if (serviceIntent.hasExtra('alert')) {
	tickerText = serviceIntent.getStringExtra('alert');
}


// ****************************************************************************************************************
// intents & notification

// we an intent and a pending intent in order to open the app when the users clicks on the notification
var notificationIntent = Ti.Android.createIntent({
	className: 'es.thinetic.ngleb.NewglebActivity',
	packageName: 'es.thinetic.ngleb'
});

// Create a PendingIntent to tie together the Activity and Intent
// check http://docs.appcelerator.com/titanium/2.1/index.html#!/api/Titanium.Android.PendingIntent
var intent = Ti.Android.createPendingIntent({
    intent: notificationIntent,
    flags: Titanium.Android.FLAG_UPDATE_CURRENT
});

// check http://docs.appcelerator.com/titanium/2.1/index.html#!/api/Titanium.Android.Notification
var notification = Ti.Android.createNotification({
	contentIntent: intent,
	contentTitle: tickerText,
	contentText: tickerText,
	tickerText: tickerText,
	icon: Ti.App.Android.R.drawable.appicon,
	// icon: Ti.App.Android.R.drawable.notification,
	defaults:Titanium.Android.NotificationManager.DEFAULT_ALL,
	flags : Titanium.Android.ACTION_DEFAULT | Titanium.Android.FLAG_AUTO_CANCEL | Titanium.Android.FLAG_SHOW_LIGHTS
});

Ti.Android.NotificationManager.notify((new Date().getTime()), notification);

// stop this service
Ti.Android.stopService(serviceIntent);












