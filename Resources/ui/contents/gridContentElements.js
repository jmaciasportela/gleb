// Content View mapea los elementos del JSON a elementos UI de Titanium
exports.gridContentView = function(content) {
	var result=[];	
	var style = require('ui/styles/styleContent');	
	
	// Vamos recorriendo cada elemento content de la vista market
	for (i in content) {
		item=content[i];		
		var localStyle = style.getStyleContent(item.style || {});

		if( item.type == 'button' ){
			    button = Ti.UI.createButton({
						name: item.name,
						height:'auto',
						width:'auto',					
						color: localStyle.color,
						backgroundColor: localStyle.backgroundColor,
						backgroundImage: localStyle.backgroundImage,
						action: item.action,
						winId: item.winId,
						url: item.url,
						intent: item.intent,
						method: item.method,
						methodParams: item.methodParams,
						labelH1: item.labelH1,
						labelH2: item.labelH2
				});
						
	   			if (item.action && item.action != '') {
					button.addEventListener('click', function(e){
		    			// dentro de e.source va la accion que tendremos que tratar más adelante.		   
						Ti.API.debug("GLEB - Has hecho click con action:"+ JSON.stringify(e));
						Titanium.Media.vibrate([ 0, 100]);
						if (e.source.action == 'openWebView') {
							Ti.API.debug("GLEB - openWebView:"+e.source.url);
							Ti.App.fireEvent('gleb_openWebView',{"url":e.source.url});
						}   
						else if (e.source.action == 'openWin') {
							Ti.API.debug("GLEB - openWin:"+e.source.winId);
							Ti.App.fireEvent('gleb_openWin',{"winId":e.source.winId});
						}
						else if (e.source.action == 'openIntent') {
							Ti.API.debug("GLEB - openIntent:"+e.source.intent);
							Ti.App.fireEvent('gleb_openIntent',{"intent":e.source.intent});
						} 
						else if (e.source.action == 'execMethod') {
							Ti.API.debug("GLEB - raising custom method:"+e.source.method);
							Ti.App.fireEvent(e.source.method,e.source.methodParams);
						}	 			
			     		else {
			     			Ti.App.fireEvent('gleb_buttonClick',e.source);
			     		}					 
			     		//Ti.API.debug("GLEB - Button :"+ JSON.stringify(button));
		    		});
	   			}
			result.push(button);
		}
		else {
			Ti.API.error("Unsupported view content type="+item.type);
		}
	}
	return result;
};