// Content View mapea los elementos del JSON a elementos UI de Titanium
exports.listContentView = function(content) {
var result=[];	
var style = require('ui/styles/styleContent');	


for (i in content) {
		item=content[i];		
		//Leemos el estilo del elemento que vamos a añadir y le aplicamos unos valores por defecto
		var localStyle = style.getStyleContent(item.style || {});
		//Ti.API.info("GLEB- LIST LOCALSTYLE:"+ JSON.stringify(localStyle));

		if(item.type == 'row'){
				row = Ti.UI.createView({
	   					name: item.name,
	   					width: Ti.UI.FILL,
	   					height: Ti.UI.SIZE,	   					
						backgroundColor: localStyle.backgroundColor,
						action: item.action,
						winId: item.winId,
						url: item.url,
						intent: item.intent,
						method: item.method,
						methodParams: item.methodParams,
						top: Ti.App.glebUtils._p(1)	
				});			
				//if (item.subTable) row.setHasChild(true);	
				
				//Referenciamos imagenes al resouce directory:
				var RegexUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
				if (RegexUrl.test (item.icon)) var imagePath = item.icon;				
				else var imagePath = Titanium.Filesystem.resourcesDirectory+item.icon;
				BS = Ti.UI.createImageView({
  						image: imagePath,
  						//defaultImage: Titanium.Filesystem.resourcesDirectory+item.defaultImage,
	  					backgroundColor: "transparent",
	  					height: item.iconHeight+"dp",
						width: item.iconWidth+"dp",						
						//top: "5dp",
						//bottom: "5dp",
						left: Ti.App.glebUtils._p(10),
						touchEnabled:false
				});				
				row.add(BS);	
				
				var leftPosition = parseInt(item.iconWidth)+20;
				
				var label1 = Ti.UI.createLabel({
					color: localStyle.color,
					//top: "5dp",
					font: { fontSize:"18dp",fontWeigh:"bold"},
					text: Ti.App.glebUtils.textoClaro(item.labelH1),
					height:'auto',
					width:Ti.UI.FILL,					
	    			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	    			left: leftPosition+"dp",
	    			//left: "115dp",
	    			touchEnabled:false
				});		
				row.add(label1);	
			
																	
	   			if (item.action && item.action != '') {
	    			row.addEventListener('click', function(e){
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
	
			result.push(row); 
		}
		else {
			Ti.API.error("Unsupported view content type="+item.type);
		}
	}
	return result;
};