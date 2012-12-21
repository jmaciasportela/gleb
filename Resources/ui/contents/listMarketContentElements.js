// Content View mapea los elementos del JSON a elementos UI de Titanium

exports.listMarketContentView = function(content) {
	var result=[];	
	var style = require('ui/styles/styleContent');	
	
	// Vamos recorriendo cada elemento content de la vista market
	for (i in content) {
		item=content[i];		
		var localStyle = style.getStyleContent(item.style || {});
		if( item.type == 'item'){
			    button = Ti.UI.createView({
						name: item.name,
						height:Ti.App.glebUtils._p(80),
						width:Ti.App.glebUtils._p(160),					
						color: localStyle.color,
						backgroundColor: localStyle.backgroundColor,						
						action: item.action,
						winId: item.winId,
						url: item.url,
						intent: item.intent,
						method: item.method,
						methodParams: item.methodParams		
					});		
											
				var label1 = Ti.UI.createLabel({
					color: localStyle.color,
					top: Ti.App.glebUtils._p(2),
					font: {fontSize:Ti.App.glebUtils._p(12)},
					text: item.labelH1,
					height:Ti.App.glebUtils._p(18),
					width:Ti.UI.FILL,					
	    			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	    			left:Ti.App.glebUtils._p(5),
	    			//left: "115dp",
	    			touchEnabled:false,
				});
				button.add(label1);		
				
				var label2 = Ti.UI.createLabel({
					color:localStyle.color,
					top: Ti.App.glebUtils._p(22),
					font: {fontSize:Ti.App.glebUtils._p(12)},
					text: item.labelH2,
					height:Ti.App.glebUtils._p(18),
					width:Ti.UI.FILL,					
	    			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	    			left:Ti.App.glebUtils._p(5),
	    			//left: "115dp",
	    			touchEnabled:false,
				});
				button.add(label2);	
				
				var label3 = Ti.UI.createLabel({
					color:localStyle.color,
					top: Ti.App.glebUtils._p(45),
					font: {fontSize:Ti.App.glebUtils._p(10)},
					text: item.labelH3,
					height:Ti.App.glebUtils._p(15),
					width:Ti.UI.FILL,					
	    			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	    			left: Ti.App.glebUtils._p(55),
	    			//left: "115dp",
	    			touchEnabled:false,
				});
				button.add(label3);
				
				var label4 = Ti.UI.createLabel({
					color:localStyle.color,
					top: Ti.App.glebUtils._p(63),
					font: {fontSize:Ti.App.glebUtils._p(10)},
					text: item.labelH4,
					height:Ti.App.glebUtils._p(15),
					width:Ti.UI.FILL,					
	    			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	    			left: Ti.App.glebUtils._p(55),
	    			//left: "115dp",
	    			touchEnabled:false,
				});
				button.add(label4);
				
				//Referenciamos imagenes al resouce directory:
				var RegexUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
				if (RegexUrl.test (item.icon)) var imagePath = item.icon;				
				else var imagePath = Titanium.Filesystem.resourcesDirectory+item.icon;
				BS = Ti.UI.createImageView({
					image: imagePath,
  					backgroundColor: "transparent",
  					height: Ti.App.glebUtils._p(40),
					width: Ti.App.glebUtils._p(40),						
					top: Ti.App.glebUtils._p(40),
					left: Ti.App.glebUtils._p(5),
					touchEnabled:false
				});				
				button.add(BS);
				
				if (item.action && item.action != '') {
	    			button.addEventListener('click', function(e){
	    			Titanium.Media.vibrate([ 0, 100]);
	    			if (e.source.action == 'openWebView') {
						Ti.API.debug("GLEB - openWebView:"+e.source.url);
						Ti.App.fireEvent('gleb_openWebView',e.source);
					}   
					else if (e.source.action == 'openWin') {
						Ti.API.debug("GLEB - openWin:"+e.source.winId);
						Ti.App.fireEvent('gleb_openWin',{"winName":e.source.winId});
					}
					else if (e.source.action == 'openIntent') {
						Ti.API.debug("GLEB - openIntent:"+e.source.intent);
						Ti.App.fireEvent('gleb_openIntent',e.source);
					} 
					else if (e.source.action == 'execMethod') {
						Ti.API.debug("GLEB - raising custom method:"+e.source.method);
						Ti.App.fireEvent(e.source.method,e.source.methodParams);
					}	 			
		     		else {
		     			//Si la acción indicada no es ninguna de las permitidas, no hacemos nada
		     		}
		     		//Ti.API.debug("EVENT "+JSON.stringify(e));		     	
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