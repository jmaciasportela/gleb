//////////////////////////////////////////////////////////////////////////////////////////////////////////
// SETUP Inicial
/////////////////////////////////////////////////////////////////////////////////////////////////////////

Ti.API.info('GLEB - CONFIG - Width x Height: ' + Ti.Platform.displayCaps.platformWidth + ' x ' + Ti.Platform.displayCaps.platformHeight);
Ti.API.info('GLEB - CONFIG - DPI: ' + Ti.Platform.displayCaps.dpi);

Ti.App.Properties.setBool('isTablet', Ti.Platform.osname === 'ipad' || (Ti.Platform.osname === 'android' && (Ti.Platform.displayCaps.platformWidth > 899 || Ti.Platform.displayCaps.platformHeight > 899)));

if (!Ti.App.Properties.hasProperty('tUpload') || Ti.App.Properties.getString('tUpload')=="") Ti.App.Properties.setString('tUpload',"60000");
if (!Ti.App.Properties.hasProperty('tTracking') || Ti.App.Properties.getString('tTracking')=="") Ti.App.Properties.setString('tTracking',"60000");

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


Ti.App.Properties.removeProperty('dailyNotifications');
Ti.App.Properties.setString('dailyNotifications', '{"initial": "saved"}'); 

Ti.App.Properties.setString('lastLatitudeGLEB','');
Ti.App.Properties.setString('lastLongitudeGLEB','');

Ti.App.Properties.setBool('actInd', false);
Ti.App.Properties.setBool ('avisoGPS',false);
Ti.App.Properties.setBool ('GPSOff', true);
Ti.App.Properties.setInt('initialDegrees',0);
Ti.App.Properties.setString('prevTimestamp','0');
Ti.App.Properties.setBool('isChatOpen',false);
Ti.App.Properties.setBool('onAction', false);

Ti.App.Properties.setBool("actionsON", false);
setTimeout (function(){ Ti.App.Properties.setBool("actionsON", true), require('plugins/bootAction').checkAction()}, 10000);

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

// URL ENDPOINTS
if (!Ti.App.Properties.getString("sendSMS_url")) Ti.App.Properties.setString("sendSMS_url", require("clients/glebAPI.config").sendSMS_url);
if (!Ti.App.Properties.getString("validate_url")) Ti.App.Properties.setString("validate_url", require("clients/glebAPI.config").validate_url);
if (!Ti.App.Properties.getString("getMenus_url")) Ti.App.Properties.setString("getMenus_url", require("clients/glebAPI.config").getMenus_url);
if (!Ti.App.Properties.getString("getView_url")) Ti.App.Properties.setString("getView_url", require("clients/glebAPI.config").getView_url);
if (!Ti.App.Properties.getString("getWindow_url")) Ti.App.Properties.setString("getWindow_url", require("clients/glebAPI.config").getWindow_url);
if (!Ti.App.Properties.getString("getMenuVersion_url")) Ti.App.Properties.setString("getMenuVersion_url", require("clients/glebAPI.config").getMenuVersion_url);
if (!Ti.App.Properties.getString("registerClient_url")) Ti.App.Properties.setString("registerClient_url", require("clients/glebAPI.config").registerClient_url);
if (!Ti.App.Properties.getString("updateStatus_url")) Ti.App.Properties.setString("updateStatus_url", require("clients/glebAPI.config").updateStatus_url);
if (!Ti.App.Properties.getString("confirmPUSH_url")) Ti.App.Properties.setString("confirmPUSH_url", require("clients/glebAPI.config").confirmPUSH_url);
if (!Ti.App.Properties.getString("setGCMId_url")) Ti.App.Properties.setString("setGCMId_url", require("clients/glebAPI.config").setGCMId_url);
if (!Ti.App.Properties.getString("uploadTracking_url")) Ti.App.Properties.setString("uploadTracking_url", require("clients/glebAPI.config").uploadTracking_url);
if (!Ti.App.Properties.getString("sendForm_url")) Ti.App.Properties.setString("sendForm_url", require("clients/glebAPI.config").sendForm_url);
if (!Ti.App.Properties.getString("getGlebURLs_url")) Ti.App.Properties.setString("getGlebURLs_url", require("clients/glebAPI.config").getGlebURLs_url);

