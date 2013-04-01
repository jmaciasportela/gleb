// Content View mapea los elementos del JSON a elementos UI de Titanium

var MapView = require('ui/views/mapView');

exports.marketContentView = function(content) {
    var result=[];  
    var style = require('ui/styles/styleContent');  
    var actionFactory = require('ui/actions/actionFactory');    
    
    // Vamos recorriendo cada elemento content de la vista market
    for (i in content) {
        item=content[i];        
        var localStyle = style.getStyleContent(item.style || {});

        if( item.type && item.type == 'button' ){
                button = Ti.UI.createButton({
                        name: item.name || '',
                        height:'auto',
                        width:'auto',                   
                        backgroundColor: localStyle.backgroundColor,
                        backgroundImage: Ti.App.glebUtils.replaceCadena(localStyle.backgroundImage),
                        action: item.action || '',
                        winId: item.winId || '',
                        url: item.url || '',
                        method: item.method || '',
                        methodParams: item.methodParams || ''
                    });     
                
                // Tratamiento especial para el boton con nombre locationMap, para que se update la imagen de fondo al pulsar         
                /*                  
                if (button.name=='locationMap'){
                    Ti.API.debug("GLEB - Add event click to locationMap");
                    button.addEventListener('click', function(e){
                    // dentro de e.source va la accion que tendremos que tratar más adelante.          
                    Ti.API.debug("GLEB - Has hecho click con action:"+ JSON.stringify(e));
                    Titanium.Media.vibrate([ 0, 100]);                  
                    if (e.source.name == 'locationMap' && e.source.action == 'raiseEvent') {
                        Ti.API.debug("GLEB - LocationMap Updating");
                        Ti.API.debug("GLEB - Button background image:" + e.source.backgroundImage);
                        //http://maps.google.com/maps/api/staticmap?center='.$row[lastLatitude].','.$row[lastLongitude].'&zoom=15&size=320x80&maptype=roadmap&markers=color:blue|label:A|'.$row[lastLatitude].','.$row[lastLongitude].'&sensor=false"
                        if (Ti.Network.online) {
                            //Ti.API.debug("GLEB - Button background updating image:"+Titanium.Filesystem.resourcesDirectory+"images/market/updatingMap.png" );
                            //e.source.backgroundImage =Titanium.Filesystem.resourcesDirectory+"images/market/updatingMap.png";
                            var n = Ti.UI.createNotification({message:"Actualizando mapa de localización"});
                            n.duration = Ti.UI.NOTIFICATION_DURATION_SHORT;                         
                            n.show();
                            Ti.API.debug("GLEB - Button background new image http://maps.google.com/maps/api/staticmap?center="+Ti.App.Properties.getString('lastLatitude')+","+Ti.App.Properties.getString('lastLongitude')+"&zoom=15&size=320x80&maptype=roadmap&markers=color:blue|label:A|"+Ti.App.Properties.getString('lastLatitude')+","+Ti.App.Properties.getString('lastLongitude')+"&sensor=false");
                            e.source.backgroundImage = "http://maps.google.com/maps/api/staticmap?center="+Ti.App.Properties.getString('lastLatitude')+","+Ti.App.Properties.getString('lastLongitude')+"&zoom=15&size=320x80&maptype=roadmap&markers=color:blue|label:A|"+Ti.App.Properties.getString('lastLatitude')+","+Ti.App.Properties.getString('lastLongitude')+"&sensor=false";
                        }
                        else {
                            // Create a notification
                            var n = Ti.UI.createNotification({message:"No tienes conexión de datos"});                          
                            n.duration = Ti.UI.NOTIFICATION_DURATION_SHORT;                         
                            n.show();
                        }                                               
                    }
                    });                 
                    button.addEventListener('longclick', function(e){
                    	Ti.API.debug("GLEB - Has hecho longclick con action:"+ JSON.stringify(e));
                    	Ti.App.glebUtils.openActivityIndicator({"text":"Cargando Mapa ..."});
                        Ti.App.fireEvent('gleb_openDailyMap');
                    });
                }                           
                */
                               
                //Si en el JSON se indica algún tipo de acción asociada al item, se le añade en este punto del código                                               
                if (button.name!='locationMap' && item.action && item.action != '') {
                    actionFactory.addAction(button, content[i]);
                }   
                
                //Si en el JSON se informa el parámetro "share", entonces se añadirá el intent correspondiente asociado al evento longclick del item                                               
                if (button.name!='locationMap' && item.share && item.share != '') {
                    actionFactory.addShareData(button, item.share);
                }
                
            result.push(button);
        }
        else {
            Ti.API.error("Unsupported view content type="+item.type);
        }
    }
    return result;
};