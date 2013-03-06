//////////////////////////////////////////////////////////////////////////////////////////////////////////
// SETUP Inicial
/////////////////////////////////////////////////////////////////////////////////////////////////////////

Ti.App.Properties.setString('GPSStatus', "stopped");
Ti.App.Properties.setBool('GPSOff',false);

Ti.API.info('GLEB - CONFIG - Width x Height: ' + Ti.Platform.displayCaps.platformWidth + ' x ' + Ti.Platform.displayCaps.platformHeight);
Ti.API.info('GLEB - CONFIG - DPI: ' + Ti.Platform.displayCaps.dpi);

Ti.App.Properties.setBool('isTablet', Ti.Platform.osname === 'ipad' || (Ti.Platform.osname === 'android' && (Ti.Platform.displayCaps.platformWidth > 899 || Ti.Platform.displayCaps.platformHeight > 899)));

if (!Ti.App.Properties.hasProperty('tUpload') || Ti.App.Properties.getString('tUpload')=="") Ti.App.Properties.setString('tUpload',"15000");
if (!Ti.App.Properties.hasProperty('tTracking') || Ti.App.Properties.getString('tTracking')=="") Ti.App.Properties.setString('tTracking',"120000");

Ti.App.Properties.setString('tTracking',"120000");
Ti.App.Properties.setInt('tMaxLocation', 180000);

Ti.App.Properties.setDouble('displayConstant', Ti.Platform.displayCaps.dpi/160);
if (Ti.Platform.displayCaps.platformWidth >Ti.Platform.displayCaps.platformHeight) {
	// Orientación inicial tumbada
	Ti.App.Properties.setInt('platformWidth', Ti.Platform.displayCaps.platformHeight);
	Ti.App.Properties.setInt('platformHeight', Ti.Platform.displayCaps.platformWidth);
}
else {
	Ti.App.Properties.setInt('platformWidth', Ti.Platform.displayCaps.platformWidth);
	Ti.App.Properties.setInt('platformHeight', Ti.Platform.displayCaps.platformHeight);
}

if (!Ti.App.Properties.hasProperty("ACSpushUser"))Ti.App.Properties.setString("ACSpushUser", "");
if (!Ti.App.Properties.hasProperty("ACSpushUserId"))Ti.App.Properties.setString("ACSpushUserId", "");
if (!Ti.App.Properties.hasProperty("ACSpushUserPassword"))Ti.App.Properties.setString("ACSpushUserPassword", "");
if (!Ti.App.Properties.hasProperty("ACSdeviceToken"))Ti.App.Properties.setString("ACSdeviceToken", "");
if (!Ti.App.Properties.hasProperty("GCMpushUserId"))Ti.App.Properties.setString("GCMpushUserId", "");

Ti.App.Properties.removeProperty('dailyNotifications');
Ti.App.Properties.setString('dailyNotifications', '{"initial": "saved"}'); 

Ti.App.Properties.setString('lastLatitudeGLEB','');
Ti.App.Properties.setString('lastLongitudeGLEB','');

Ti.App.Properties.setBool('actInd', false);


var date = require('modules/utils').getCurrentDate();
if (Ti.App.Properties.getString ('avisoGPSDay') == date[0].toString()) Ti.App.Properties.setBool ('avisoGPS',true);
else Ti.App.Properties.setBool ('avisoGPS',false);

Ti.App.Properties.setInt('initialDegrees',0);
Ti.App.Properties.setString('prevTimestamp','0');
Ti.App.Properties.setBool('isChatOpen',false);
Ti.App.Properties.setBool('onAction', false);

Ti.App.Properties.setBool("actionsON", false);
setTimeout (function(){ Ti.App.Properties.setBool("actionsON", true), require('plugins/bootAction').checkAction()}, 8000);

if (!Ti.App.Properties.getString("GLEBUUID")) {
	Ti.API.debug("GLEB - CONFIG - Device MAC: "+Titanium.Platform.macaddress);
	Ti.API.debug("GLEB - CONFIG - Device UUID: "+ Titanium.Platform.id);
	if (Titanium.Platform.id == null) Ti.App.Properties.setString("GLEBUUID",Ti.Utils.base64encode(Ti.Utils.sha1(Titanium.Platform.macaddress)));
	else Ti.App.Properties.setString("GLEBUUID",Ti.Utils.base64encode(Ti.Utils.sha1(Titanium.Platform.macaddress+Titanium.Platform.id)));
}
Ti.API.info("GLEB - CONFIG - GLEBUUID: "+Ti.App.Properties.getString("GLEBUUID"));

Ti.API.info('GLEB - CONFIG - Titanium.Network.networkType: '+Titanium.Network.networkType + ' Titanium.Network.networkTypeName: '+Titanium.Network.networkTypeName+' Titanium.Network.online: '+Titanium.Network.online);
Ti.API.info('GLEB - CONFIG - Connection Status:'+ Titanium.Network.online);
Ti.App.Properties.setBool('connectionStatus', Titanium.Network.online);
Ti.App.Properties.setString('connectionName', Titanium.Network.networkTypeName);

Ti.App.Properties.setBool('registered', false);

Ti.API.debug("GLEB - CONFIG - Init DB");
var db = Ti.Database.install(Titanium.Filesystem.resourcesDirectory+'sql/queueHTTP.sqlite','queueHttpBD');  
 
try {
   rows = db.execute('SELECT * FROM HTTP_REQUESTS');
}
catch (err){
    Ti.API.error("GLEB - colaHTTP - Fail to select db rows");
    return;
}
while (rows.isValidRow()) {
    db.execute('UPDATE HTTP_REQUESTS SET STATUS="pending" WHERE STATUS!="uploaded" AND ID="' + rows.fieldByName('id') + '"');    
    Ti.API.debug("GLEB - CONFIG - Reset status to pending ID: " +rows.fieldByName('id'));
    rows.next();
}   

var n = db.execute('SELECT COUNT(*) FROM HTTP_REQUESTS');
Ti.API.debug("GLEB - CONFIG - N:"+typeof n);
Ti.API.debug("GLEB - CONFIG - N:"+JSON.stringify(n));

var limit = parseInt(n.rowCount) - 100;

Ti.API.debug("GLEB - CONFIG - LIMIT:"+limit);
if (limit > 0){
    try {
       rows = db.execute('SELECT * FROM HTTP_REQUESTS ORDER BY TIMESTAMP ASC LIMIT '+limit+';');
    }
    catch (err){
        Ti.API.error("GLEB - colaHTTP - Fail to select db rows");
        return;
    }
        
    while (rows.isValidRow()) {
        db.execute('DELETE FROM HTTP_REQUESTS ID="' + rows.fieldByName('id') + '"');    
        Ti.API.debug("GLEB - CONFIG - Reset status to pending ID: " +rows.fieldByName('id'));
        rows.next();
    }       
    
}    
   
rows.close();
db.close();
db= null;
rows = null;
Ti.App.Properties.setBool('isUploading',false);
