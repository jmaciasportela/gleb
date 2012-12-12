// Fichero de configuración

//Endpoints
var protocol = "http";
var host = "thinetic.com";
var port = "80";

//sendSMS
exports.sendSMS_url =  protocol +"://"+host+":"+port+"/gleb/sendSMS.php";

//validate
exports.validate_url =  protocol +"://"+host+":"+port+"/gleb/validate.php";

//getMenus
exports.getMenus_url = protocol +"://"+host+":"+port+"/gleb/getMenus.php";

//getView
exports.getView_url = protocol +"://"+host+":"+port+"/gleb/getView.php";

//getWindow
exports.getWindow_url = protocol +"://"+host+":"+port+"/gleb/getWindow.php";

//getMenuVersion
exports.getMenuVersion_url = protocol +"://"+host+":"+port+"/gleb/getMenuVersion.php";
 
//registerClient
exports.registerClient_url = protocol +"://"+host+":"+port+"/gleb/registerClient.php";

//updateStatus
exports.updateStatus_url = protocol +"://"+host+":"+port+"/gleb/updateStatus.php";

//confirmPUSH
exports.confirmPUSH_url = protocol +"://"+host+":"+port+"/gleb/confirmC2DM.php";

//uploadTracking
exports.uploadTracking_url = protocol +"://"+host+":"+port+"/gleb/uploadTracking/upload.php";

//sendForm
exports.sendForm_url = protocol +"://"+host+":"+port+"/gleb/forms/forms.php";

//getURLs
exports.getGlebURLs_url = protocol +"://"+host+":"+port+"/gleb/getGlebURLs.php";
