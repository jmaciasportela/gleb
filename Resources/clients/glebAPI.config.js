// Fichero de configuración

//Endpoints
var protocol = "https";
var host = "gleb.es";
var port = "443";

//sendSMS
exports.sendSMS_url =  protocol +"://"+host+":"+port+"/gleb2/sendSMS.php";

//validate
exports.validate_url =  protocol +"://"+host+":"+port+"/gleb2/validate.php";

//getMenus
exports.getMenus_url = protocol +"://"+host+":"+port+"/gleb2/getMenus.php";

//getView
exports.getView_url = protocol +"://"+host+":"+port+"/gleb2/getView.php";

//getWindow
exports.getWindow_url = protocol +"://"+host+":"+port+"/gleb2/getWindow.php";

//getMenuVersion
exports.getMenuVersion_url = protocol +"://"+host+":"+port+"/gleb2/getMenuVersion.php";

//registerClient
exports.registerClient_url = protocol +"://"+host+":"+port+"/gleb2/registerUser.php";

//updateStatus
exports.updateStatus_url = protocol +"://"+host+":"+port+"/gleb2/updateStatus.php";

//confirmPUSH
exports.confirmPUSH_url = protocol +"://"+host+":"+port+"/gleb2/confirmC2DM.php";

//setGCMId
exports.setGCMId_url = protocol +"://"+host+":"+port+"/gleb2/setGCMId.php";

//setACSId
exports.setACSId_url = protocol +"://"+host+":"+port+"/gleb2/setACSId.php";

//uploadTracking
exports.uploadTracking_url = protocol +"://"+host+":"+port+"/gleb2/uploadTracking/upload.php";

//sendForm
exports.sendForm_url = protocol +"://"+host+":"+port+"/gleb2/forms/forms.php";

//uploadImage
exports.uploadImage_url = protocol +"://"+host+":"+port+"/gleb2/upload/upload.php";

//uploadSignature
exports.uploadSignature_url = protocol +"://"+host+":"+port+"/gleb2/upload/upload.php";

//getURLs
exports.getGlebURLs_url = protocol +"://"+host+":"+port+"/gleb2/getGlebURLs.php";
