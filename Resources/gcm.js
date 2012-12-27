// ****************************************************************************************************************
// some init stuff

var now = new Date(),
serviceIntent = Ti.Android.currentService.getIntent(),
tickerText = 'GGM Notification',
contentText = 'Received at ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

// ****************************************************************************************************************
// getting the payload

Ti.API.info("GLEB - SERVICE GCM - ServiceIntent: "+ JSON.stringify(serviceIntent));

Ti.API.info("GLEB - SERVICE GCM - PushId: "+ serviceIntent.getStringExtra('pushId'));
Ti.API.info("GLEB - SERVICE GCM - Message: "+ serviceIntent.getStringExtra('message'));
Ti.API.info("GLEB - SERVICE GCM - Payload: "+ serviceIntent.getStringExtra('payload'));



if (serviceIntent.hasExtra('message')) {
	tickerText = serviceIntent.getStringExtra('message');
}


// ****************************************************************************************************************
// intents & notification

var act = Ti.Android.currentActivity;

// we an intent and a pending intent in order to open the app when the users clicks on the notification
var notificationIntent = Ti.Android.createIntent({
    action : Ti.Android.ACTION_MAIN,
    url : 'app.js',
    flags : Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
});
notificationIntent.addCategory(Titanium.Android.CATEGORY_LAUNCHER);

// Create a PendingIntent to tie together the Activity and Intent
// check http://docs.appcelerator.com/titanium/2.1/index.html#!/api/Titanium.Android.PendingIntent
var intent = Ti.Android.createPendingIntent({
    activity: act,
    intent: notificationIntent,
    type: Ti.Android.PENDING_INTENT_FOR_ACTIVITY,
    flags: Ti.Android.FLAG_ACTIVITY_NO_HISTORY
});

// check http://docs.appcelerator.com/titanium/2.1/index.html#!/api/Titanium.Android.Notification
var notification = Ti.Android.createNotification({
	contentIntent: intent,
	contentTitle: tickerText,
	contentText: contentText,
	tickerText: tickerText,
	icon: Ti.App.Android.R.drawable.appicon,
	defaults:Titanium.Android.NotificationManager.DEFAULT_ALL,
	flags : Titanium.Android.ACTION_DEFAULT | Titanium.Android.FLAG_AUTO_CANCEL | Titanium.Android.FLAG_SHOW_LIGHTS
});

Ti.Android.NotificationManager.notify((new Date().getTime()), notification);

// stop this service
Ti.Android.stopService(serviceIntent);












