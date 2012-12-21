// Content View mapea los elementos del JSON a elementos UI de Titanium

exports.marketContentView = function(content) {
	var result=[];	
	var style = require('ui/styles/styleContent');	
	
	// Vamos recorriendo cada elemento content de la vista market
	for (i in content) {
		item=content[i];		
		var localStyle = style.getStyleContent(item.style || {});

		if( item.type == 'button' ){
			    button = Ti.UI.createButton({
						name: item.name,
						title:item.text,
						text: item.subtext,
						height:'auto',
						width:'auto',					
						color: localStyle.color,
						backgroundColor: localStyle.backgroundColor,
						backgroundImage: Ti.App.glebUtils.replaceCadena(localStyle.backgroundImage),
						action: item.action,
						winId: item.winId,
						url: item.url,
						intent: item.intent,
						method: item.method,
						methodParams: item.methodParams
					});		
				// Tratamiento especial para el boton con nombre locationMap, para que se update la imagen de fondo al pulsar 							
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
    					Ti.App.fireEvent('gleb_openActivityIndicator',{"text":"Cargando Mapa..."});
    					Ti.App.fireEvent('gleb_openDailyMap');
	    			});
	   			}							
	   			if (button.name!='locationMap' && item.action) {
	    			button.addEventListener('click', function(e){
	    			// dentro de e.source va la accion que tendremos que tratar más adelante.		   
					Ti.API.debug("GLEB - Has hecho click con action:"+ JSON.stringify(e));
					Titanium.Media.vibrate([ 0, 100]);
					if (e.source.action == 'raiseEvent') {
						Ti.App.fireEvent('gleb_openActivityIndicator',{"text":"Cargando"});
						Ti.API.debug("GLEB - raising custom event:"+e.source.eventName);
						Ti.App.fireEvent(e.source.eventName,e);
					}
					else if (e.source.action == 'openWebView') {
						Ti.App.fireEvent('gleb_openActivityIndicator',{"text":"Cargando"});
						Ti.API.debug("GLEB - openWebView:"+e.source.url);
						Ti.App.fireEvent('gleb_openWebView',e);
					}   
					else if (e.source.action == 'openWin') {
						Ti.App.fireEvent('gleb_openActivityIndicator',{"text":"Cargando"});
						Ti.API.debug("GLEB - openWin:"+e.source.winId);
						Ti.App.fireEvent('gleb_openWin',e);
					}
					else if (e.source.action == 'openIntent') {
						Ti.App.fireEvent('gleb_openActivityIndicator',{"text":"Cargando"});
						Ti.API.debug("GLEB - openIntent:"+e.source.intent);
						Ti.App.fireEvent('gleb_openIntent',e.source);
					} 	 			
		     		else {
		     			Ti.API.debug("GLEB - Click on button withouth action");
		     			//Ti.App.fireEvent('refreshMarketView',e.source);
		     		}					 
		     		//Ti.API.debug("GLEB - Button :"+ JSON.stringify(button));
	    			});
					/*	    		 
	    		 	button.addEventListener('longclick', function(e){
	    			// dentro de e.source va la accion que tendremos que tratar más adelante.		   
					Ti.API.debug("GLEB - Evento LongClick:"+ JSON.stringify(e));
					Titanium.Media.vibrate([ 0, 100]);
					var n = Ti.UI.createNotification({message:"Evento long Click"});
					// Set the duration to either Ti.UI.NOTIFICATION_DURATION_LONG or NOTIFICATION_DURATION_SHORT
					n.duration = Ti.UI.NOTIFICATION_DURATION_SHORT;							
					n.show();					
	    			});	 
	    			*/
	   			}
			result.push(button);
		}
		else {
			Ti.API.error("Unsupported view content type="+item.type);
		}
	}
	return result;
};