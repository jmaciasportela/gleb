	// Content View mapea los elementos del JSON a elementos UI de Titanium

exports.listMarketContentView = function(content) {
    var result=[];  
    var style = require('ui/styles/styleContent');  
    var actionFactory = require('ui/actions/actionFactory');
    
    // Vamos recorriendo cada elemento content de la vista market
    for (i in content) {
        item=content[i];        
        var localStyle = style.getStyleContent(item.style || {});
        if( item.type == 'item'){
                button = Ti.UI.createView({
                        name: item.name,
                        layout: 'vertical',
                        height: Ti.UI.SIZE,    
                        width: Ti.App.glebUtils._p(160),                 
                        backgroundColor: localStyle.backgroundColor,                        
                        action: item.action,
                        winId: item.winId,
                        url: item.url,
                        method: item.method,
                        methodParams: item.methodParams,
                        tamano: 0    
                    });     
                
                if(item.labelH1){
                	var label1 = Ti.UI.createLabel({
	                    color: localStyle.labelH1Color,
	                    top: Ti.App.glebUtils._p(2),
	                    font: {fontSize: localStyle.labelH1Size+"dp", fontWeight:localStyle.labelH1Weight},
	                    text: item.labelH1,
	                    height: Ti.UI.SIZE,    
	                    width:Ti.UI.FILL,                   
	                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	                    left:Ti.App.glebUtils._p(5),
	                    touchEnabled:false,
	                });
	                button.add(label1);
                }                            
                
                if(item.labelH2){
	                var label2 = Ti.UI.createLabel({
	                    color:localStyle.labelH2Color,
	                    top: Ti.App.glebUtils._p(2),
	                    font: {fontSize: localStyle.labelH2Size+"dp", fontWeight:localStyle.labelH2Weight},
	                    text: item.labelH2,
	                    height: Ti.UI.SIZE,    
	                    width:Ti.UI.FILL,                   
	                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	                    left:Ti.App.glebUtils._p(5),
	                    touchEnabled:false,
	                });
	                button.add(label2);
				}
                
                if(item.labelH3){
	                var label3 = Ti.UI.createLabel({
	                    color:localStyle.labelH3Color,
	                    top: Ti.App.glebUtils._p(2),
	                    font: {fontSize: localStyle.labelH3Size+"dp", fontWeight:localStyle.labelH3Weight},
	                    text: item.labelH3,
	                    height: Ti.UI.SIZE,    
	                    width:Ti.UI.FILL,                   
	                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	                    left: Ti.App.glebUtils._p(5),
	                    touchEnabled:false,
	                });
	                button.add(label3);
				}
                
                if(item.labelH4){
	                var label4 = Ti.UI.createLabel({
	                    color:localStyle.labelH4Color,
	                    top: Ti.App.glebUtils._p(2),
	                    font: {fontSize: localStyle.labelH4Size+"dp", fontWeight:localStyle.labelH4Weight},
	                    text: item.labelH4,
	                    height: Ti.UI.SIZE,    
	                    width:Ti.UI.FILL,                   
	                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	                    left: Ti.App.glebUtils._p(5),
	                    touchEnabled:false,
	                });
	                button.add(label4);
				}
                
                if(item.icon){
	                //Referenciamos imagenes al resouce directory:
	                var RegexUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	                if (RegexUrl.test (item.icon)) var imagePath = item.icon;               
	                else var imagePath = Titanium.Filesystem.resourcesDirectory+item.icon;
	                BS = Ti.UI.createImageView({
	                    image: imagePath,
	                    backgroundColor: "transparent",
	                    height: localStyle.iconHeight+"dp",    
	                    width: localStyle.iconWidth+"dp",                     
	                    top: Ti.App.glebUtils._p(2),
	                    left: Ti.App.glebUtils._p(5),
	                    touchEnabled:false
	                });             
	                button.add(BS);
				}
				
				calcularTamanoButton(button, item, localStyle);
                
                //Si en el JSON se indica algún tipo de acción asociada al item, se le añade en este punto del código                                               
                if (item.action && item.action != '') {
                    actionFactory.addAction(button, content[i]);
                }  
                
                //Si en el JSON se informa el parámetro "share", entonces se añadirá el intent correspondiente asociado al evento longclick del item                                               
                if (item.share && item.share != '') {
                    actionFactory.addShareData(button, item.share);
                }                                   
            
            result.push(button);
        }
        else {
            Ti.API.error("Unsupported view content type="+item.type);
        }
    }
    return result;
    
function calcularTamanoButton(button, item, localStyle){

	//Como ancho disponible tenemos la mitad del ancho de la pantalla
	var anchoDisponible = Ti.App.Properties.getInt("platformWidth")*0.5;
	var tmpValue = 0;
	var numLines = 0;
	
	if(item.labelH1){
		tmpValue = item.labelH1.length * localStyle.labelH1Size;
		numLines = tmpValue / anchoDisponible;
		
		if(tmpValue % anchoDisponible > 0){
			numLines++;
		}
    	button.tamano+=(parseInt(numLines) * localStyle.labelH1Size);
    	Ti.API.debug("GLEB - LISTMARKET - label1 anchoDisponible: "+anchoDisponible);
    	Ti.API.debug("GLEB - LISTMARKET - label1 Num caracretes: "+item.labelH1.length);
    	Ti.API.debug("GLEB - LISTMARKET - label1 tamanoTexto: "+localStyle.labelH1Size);
    	Ti.API.debug("GLEB - LISTMARKET - label1 Lineas: "+parseInt(numLines));
    	Ti.API.debug("GLEB - LISTMARKET - label1 numLines * localStyle.labelH1Size: "+parseInt(numLines) * localStyle.labelH1Size);
    }                            
    if(item.labelH2){
        tmpValue = item.labelH2.length * localStyle.labelH2Size;
		numLines = tmpValue / anchoDisponible;
		if(tmpValue % anchoDisponible > 0){
			numLines++;
		}
    	button.tamano+=(parseInt(numLines) * localStyle.labelH2Size);
    }
    if(item.labelH3){
        tmpValue = item.labelH3.length * localStyle.labelH3Size;
		numLines = tmpValue / anchoDisponible;
		if(tmpValue % anchoDisponible > 0){
			numLines++;
		}
    	button.tamano+=(parseInt(numLines) * localStyle.labelH3Size);
	}
    if(item.labelH4){
        tmpValue = item.labelH4.length * localStyle.labelH4Size;
		numLines = tmpValue / anchoDisponible;
		if(tmpValue % anchoDisponible > 0){
			numLines++;
		}
    	button.tamano+=(parseInt(numLines) * localStyle.labelH4Size);
	}
    if(item.icon){
    	button.tamano+=localStyle.iconHeight/2;
	}
}
};
