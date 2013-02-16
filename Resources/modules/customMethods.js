/*
 * En este módulo definimos todos los métodos personalizados solicitados por el cliente
 */

/* Muestra una notificación de larga duración
 * @param1: es el texto de la notificación 
 */
exports.showNotification = function(params) {
    var toast = Ti.UI.createNotification({
	    message:params.param1,
	    duration: Ti.UI.NOTIFICATION_DURATION_LONG
	});
	toast.show();
};


exports.scan = function(e){
/**
 * In this example, we'll use the Barcode module to display some information about
 * the scanned barcode.
 */
var Barcode = require('ti.barcode');
Barcode.allowRotation = true;
Barcode.displayedMessage = ' ';
Barcode.allowMenu = false;
Barcode.allowInstructions = false;
Barcode.useLED = true;

  /**
 * Create a chrome for the barcode scanner.
 */
var overlay = Ti.UI.createView({
    backgroundColor: 'transparent',
    top: 0, right: 0, bottom: 0, left: 0
});
var switchButton = Ti.UI.createButton({
    title: Barcode.useFrontCamera ? 'Back Camera' : 'Front Camera',
    textAlign: 'center',
    color: '#000', backgroundColor: '#fff', style: 0,
    font: { fontWeight: 'bold', fontSize: 16 },
    borderColor: '#000', borderRadius: 10, borderWidth: 1,
    opacity: 0.5,
    width: 220, height: 30,
    bottom: 10
});
switchButton.addEventListener('click', function () {
    Barcode.useFrontCamera = !Barcode.useFrontCamera;
    switchButton.title = Barcode.useFrontCamera ? 'Back Camera' : 'Front Camera';
});
overlay.add(switchButton);
var cancelButton = Ti.UI.createButton({
    title: 'Cancel', textAlign: 'center',
    color: '#000', backgroundColor: '#fff', style: 0,
    font: { fontWeight: 'bold', fontSize: 16 },
    borderColor: '#000', borderRadius: 10, borderWidth: 1,
    opacity: 0.5,
    width: 220, height: 30,
    top: 20
});
cancelButton.addEventListener('click', function () {
    Barcode.cancel();
});
overlay.add(cancelButton);
    
var scannedBarcodes = {};
var scannedBarcodesCount = 0;

function reset() {
    scannedBarcodes = {};
    scannedBarcodesCount = 0;
    cancelButton.title = 'Cancel';
}
Barcode.addEventListener('error', function (e) {
    Ti.API.debug('GLEB - SCAN - Error');
});
Barcode.addEventListener('cancel', function (e) {
    Ti.API.debug('GLEB - SCAN - Cancel ');
});
Barcode.addEventListener('success', function (e) {
    Ti.API.debug('GLEB - SCAN - Success called with barcode: ' + e.result);
    if (!scannedBarcodes['' + e.result]) {
        scannedBarcodes[e.result] = true;
        scannedBarcodesCount += 1;
        cancelButton.title = 'Finished (' + scannedBarcodesCount + ' Scanned)';
    }
});
    
  
    
function parseContentType(contentType) {
    switch (contentType) {
        case Barcode.URL:
            return 'URL';
        case Barcode.SMS:
            return 'SMS';
        case Barcode.TELEPHONE:
            return 'TELEPHONE';
        case Barcode.TEXT:
            return 'TEXT';
        case Barcode.CALENDAR:
            return 'CALENDAR';
        case Barcode.GEOLOCATION:
            return 'GEOLOCATION';
        case Barcode.EMAIL:
            return 'EMAIL';
        case Barcode.CONTACT:
            return 'CONTACT';
        case Barcode.BOOKMARK:
            return 'BOOKMARK';
        case Barcode.WIFI:
            return 'WIFI';
        default:
            return 'UNKNOWN';
    }
}
    
function parseResult(event) {
    var msg = '';
    switch (event.contentType) {
        case Barcode.URL:
            msg = 'URL = ' + event.result;
            break;
        case Barcode.SMS:
            msg = 'SMS = ' + JSON.stringify(event.data);
            break;
        case Barcode.TELEPHONE:
            msg = 'Telephone = ' + event.data.phonenumber;
            break;
        case Barcode.TEXT:
            msg = 'Text = ' + event.result;
            break;
        case Barcode.CALENDAR:
            msg = 'Calendar = ' + JSON.stringify(event.data);
            break;
        case Barcode.GEOLOCATION:
            msg = 'Geo = ' + JSON.stringify(event.data);
            break;
        case Barcode.EMAIL:
            msg = 'Email = ' + event.data.email + '\nSubject = ' + event.data.subject + '\nMessage = ' + event.data.message;
            break;
        case Barcode.CONTACT:
            msg = 'Contact = ' + JSON.stringify(event.data);
            break;
        case Barcode.BOOKMARK:
            msg = 'Bookmark = ' + JSON.stringify(event.data);
            break;
        case Barcode.WIFI:
            return 'WIFI = ' + JSON.stringify(event.data);
        default:
            msg = 'unknown content type';
            break;
    }
    return msg;
}
    
    
reset();
// Note: while the simulator will NOT show a camera stream in the simulator, you may still call "Barcode.capture"
// to test your barcode scanning overlay.
Barcode.capture({
    animate: true,
    overlay: overlay,
    showCancel: false,
    showRectangle: false,
    keepOpen: true/*,
acceptedFormats: [
    Barcode.FORMAT_QR_CODE
]*/
});

}

exports.openIntent = function(e){ 
    Ti.API.debug('GLEB - openIntent Event: '+JSON.stringify(e));    
    Ti.API.debug('GLEB - Intent: '+e.intent);   
    var glebandroidnative = require('es.gleb.androidnative');
    
    if (glebandroidnative.isAppInstalled(e.intent)){        
        if (e.intent!="com.google.zxing.client.android"){            
            var cName = glebandroidnative.getClassName(e.intent);
            Ti.API.debug('GLEB - YEAHHH: '+cName);        
            var intent = Ti.Android.createIntent({
                action: Ti.Android.ACTION_MAIN,
                className: cName,       
                packageName: e.intent
                });
            intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
            var activity = Ti.Android.currentActivity;
            activity.startActivity(intent);            
        }
        else{
            var intent = Ti.Android.createIntent({action: "com.google.zxing.client.android.SCAN"});     
            intent.putExtra("SCAN_MODE", "ONE_D_MODE");
            var activity = Ti.Android.currentActivity;  
            activity.startActivityForResult(intent, function(e) {       
                Ti.API.debug('GLEB - Intent Result: '+JSON.stringify(e));       
                if (e.resultCode == Ti.Android.RESULT_OK) {
                    var contents = e.intent.getStringExtra("SCAN_RESULT");
                    var format = e.intent.getStringExtra("SCAN_RESULT_FORMAT");
                    Ti.API.debug('GLEB - Intent RESULT: '+contents+' format:'+format);
                    var n = Ti.UI.createNotification({message: "Contents: " + contents + ", Format: " + format, zIndex:10});
                    n.duration = Ti.UI.NOTIFICATION_DURATION_SHORT;                     
                    n.show();
                } 
                else if (e.resultCode == Ti.Android.RESULT_CANCELED) {
                    var n = Ti.UI.createNotification({message: "Scan canceled!", zIndex:10});
                    n.duration = Ti.UI.NOTIFICATION_DURATION_SHORT;                     
                    n.show();           
                }
                else if (e.error) {  
                    Ti.Platform.openURL('market://details?id='+e.intent);
                }
                });
           }       
    }
    else  Ti.Platform.openURL('market://details?id='+e.intent);
}