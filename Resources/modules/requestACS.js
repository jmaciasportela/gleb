exports.receivePush = function(e) {
    Ti.API.debug('GLEB - ACS - PUSH Received:'+JSON.stringify(e));
    payload = JSON.parse(e.payload);    
    if (payload.custom.msg!="")alert (payload.custom.msg);    
    switch(payload.custom.pushId){
        
        //c2dm_0000 = CHAT 
        case "0000":            
            //alert(payload.custom.from+" : "+payload.custom.msg);
            Ti.API.debug('GLEB - PUSH - isChatOpen:' + Ti.App.Properties.getBool('isChatOpen'));            
            if (Ti.App.Properties.getBool('isChatOpen')) Ti.App.fireEvent('gleb_message');
            else Ti.App.fireEvent('gleb_newMessage');
        break;
        
        //c2dm_0001 = VIBRADOR
        case "0001":
            Titanium.Media.vibrate([ 0, 500, 100, 500, 100, 500 ] );    
            Ti.API.info('GLEB - C2DM:' + payload.custom.pushId);
            //require("clients/glebAPI").confirmPUSH(payload.custom.uuid);
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
            require("clients/glebAPI").updateStatus(payload.custom.uuid, "Update status from push");
        break;
        
        //c2dm_0005 = Enviar fichero tracking diario
        case "0005":
            require("clients/glebAPI").uploadTracking("Upload tracking");
        break;
        
        //c2dm_0006 = Enviar fichero tracking diario
        case "c2dm_0006":
            alert("No comment");
        break;          
        }      
}