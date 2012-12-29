/**
* Plugin to control heading
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

exports.executeAction = function (pushId, message, payload, serial){
 
Ti.API.debug("GLEB - PUSHACTIONS - Execute action: " + pushId); 
 
switch(pushId){        
    //IMPORTAN ALERT !!!
    case "0000":
        Ti.API.debug("GLEB - PUSHACTIONS - Play sound: " + Titanium.Filesystem.resourcesDirectory+"audio/sirena.mp3");
        var dialog = Ti.UI.createAlertDialog({
            message: message,
            ok: 'OK',
            title: 'IMPORTANT ALERT'
        });
        dialog.show();
        Titanium.Media.vibrate([ 0, 500, 100, 500, 100, 500]);
        var player = Ti.Media.createSound({url:Titanium.Filesystem.resourcesDirectory+"audio/sirena.mp3"});
        player.play();
    break;
    
    //c2dm_0001 = VIBRADOR
    case "0001":
        Titanium.Media.vibrate([ 0, 500, 100, 500, 100, 500 ] );    
        Ti.API.info('GLEB - PUSHACTIONS:' + payload.custom.pushId);
        require("clients/glebAPI").confirmPUSH(payload.custom.uuid);
        //Ti.App.fireEvent('gleb_vibrate');
    break;  
    
    //c2dm_0002 = APAGA GPS
    case "0002":
        Ti.App.fireEvent('pauseLocation');
    break;
    
    //c2dm_0003 = ENCIENDE GPS
    case "0003":
        Ti.App.fireEvent('resumeLocation');
    break;
    
    //c2dm_0004 = ACTUALIZA POSICION
    case "0004":
        require("clients/glebAPI").updateStatus(payload.custom.uuid);
    break;
    
    //c2dm_0005 = Enviar fichero tracking diario
    case "0005":
        require("clients/glebAPI").uploadTracking();
    break;
    
    //c2dm_0006 = Enviar fichero tracking diario
    case "c2dm_0006":
        alert("No comment");
    break;          
}


    var db = Ti.Database.install(Titanium.Filesystem.resourcesDirectory+'sql/actions.sqlite','actions');  

    try {
       var rows = db.execute("DELETE from actions WHERE serial='"+serial+"'");
       Ti.API.error("GLEB - PUSHACTIONS - Borrando action con serial: "+serial);
    }
    catch (err){
        Ti.API.error("GLEB - PUSHACTIONS - Fail to select db rows");
    }
    db.close();
    Ti.App.Properties.setBool('onAction', false);      
}
