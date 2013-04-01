	// Content View mapea los elementos del JSON a elementos UI de Titanium

exports.listMarketContentView = function(content) {
    var result=[];  
    var style = require('ui/styles/styleContent');  
    var actionFactory = require('ui/actions/actionFactory');
    
    // Vamos recorriendo cada elemento content de la vista market
    for (i in content) {
        item=content[i];        
        var localStyle = style.getStyleContent(item.style || {});
        if( item.type && item.type == 'item'){
        		var numLineasLabelH3 = 0;
                button = Ti.UI.createView({
                        name: item.name || '',
                        layout: 'vertical',
                        height: Ti.UI.SIZE,    
                        width: Ti.App.glebUtils._p(160),                 
                        backgroundColor: localStyle.backgroundColor,                        
                        action: item.action || '',
                        winId: item.winId || '',
                        url: item.url || '',
                        method: item.method || '',
                        methodParams: item.methodParams || '',
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
				
				if(item.icon && (item.labelH3 || item.labelH4)){
					button2 = Ti.UI.createView({
                        //layout: 'horizontal',
                        height: Ti.UI.SIZE,    
                        width: Ti.App.glebUtils._p(160),                 
                        backgroundColor: localStyle.backgroundColor   
                    });  
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
	                button2.add(BS);
	                
	                if(item.labelH3){
	                	var anchoTotal = Ti.App.Properties.getInt("platformWidth")*0.5 - (Ti.App.glebUtils._p(5));
	                	anchoIcono=Ti.App.glebUtils.convertDpToPixel(localStyle.iconWidth) + (Ti.App.glebUtils._p(5));
	                	var anchoDisponible = anchoTotal - anchoIcono;
	                	numLineasLabelH3 = (item.labelH3.length * localStyle.labelH3Size) / anchoDisponible;
						if((item.labelH3.length * localStyle.labelH3Size) % anchoDisponible > 0){
							numLineasLabelH3++;
						}
		                var label3 = Ti.UI.createLabel({
		                    color:localStyle.labelH3Color,
		                    top: Ti.App.glebUtils._p(2),
		                    font: {fontSize: localStyle.labelH3Size+"dp", fontWeight:localStyle.labelH3Weight},
		                    text: item.labelH3,
		                    height: Ti.UI.SIZE,    
		                    width:Ti.UI.FILL,                   
		                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		                    left: (Ti.App.glebUtils.convertDpToPixel(localStyle.iconWidth) + Ti.App.glebUtils._p(10)),
		                    touchEnabled:false,
		                });
		                button2.add(label3);
					}
	                
	                Ti.API.debug("GLEB - LISTMARKET - anchoDisponible: "+anchoDisponible);
	                Ti.API.debug("GLEB - LISTMARKET - localStyle.labelH3Size: "+localStyle.labelH3Size);
	                Ti.API.debug("GLEB - LISTMARKET - item.labelH3.length: "+item.labelH3.length);
			    	Ti.API.debug("GLEB - LISTMARKET - numLineasLabelH3: "+numLineasLabelH3);
			    	Ti.API.debug("GLEB - LISTMARKET - numLineasLabelH3: "+parseInt(numLineasLabelH3));
    	
	                if(item.labelH4){
		                var label4 = Ti.UI.createLabel({
		                    color:localStyle.labelH4Color,
		                    top: ((Ti.App.glebUtils.convertDpToPixel(localStyle.labelH3Size) * parseInt(numLineasLabelH3)) + Ti.App.glebUtils._p(5)),
		                    font: {fontSize: localStyle.labelH4Size+"dp", fontWeight:localStyle.labelH4Weight},
		                    text: item.labelH4,
		                    height: Ti.UI.SIZE,    
		                    width:Ti.UI.FILL,                   
		                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		                    left: (Ti.App.glebUtils.convertDpToPixel(localStyle.iconWidth) + Ti.App.glebUtils._p(10)),
		                    touchEnabled:false,
		                });
		                button2.add(label4);
					}
					button.add(button2);
                    
				}
				else if(item.icon){
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
				else{
					//Si no existe icono, no tenemos que preocuparnos de poner el label3 y label4 a la derecha de dicho icono
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

	//Como ancho disponible tenemos la mitad del ancho de la pantalla, menos el margen que dejamos a la izquierda
	var anchoDisponible = Ti.App.Properties.getInt("platformWidth")*0.5 - (Ti.App.glebUtils._p(5));
	//Necesito conocer previamente el ancho del icono
	var anchoIcono = 0;
	if(item.icon){
		//Al ancho del icono le añadimos el margen que dejaremos a la derecha
    	anchoIcono=Ti.App.glebUtils.convertDpToPixel(localStyle.iconWidth) + (Ti.App.glebUtils._p(5));
    	Ti.API.debug("GLEB - LISTMARKET - anchoIcono en PIXEL: "+Ti.App.glebUtils.convertDpToPixel(localStyle.iconWidth));
	}
	var tmpValue = 0;
	var numLines = 0;
	var heightLabel3 = 0;
	var heightLabel4 = 0;
	var heightIcon = 0;
	
	
	if(item.labelH1){
		tmpValue = item.labelH1.length * localStyle.labelH1Size;
		numLines = tmpValue / anchoDisponible;
		
		if(tmpValue % anchoDisponible > 0){
			numLines++;
		}
    	button.tamano+=((parseInt(numLines) * localStyle.labelH1Size) + Ti.App.glebUtils._p(2));
    	Ti.API.debug("GLEB - LISTMARKET - displayConstant: "+Ti.App.Properties.getDouble('displayConstant'));
    	Ti.API.debug("GLEB - LISTMARKET - AnchoDisponible: "+anchoDisponible);
    	Ti.API.debug("GLEB - LISTMARKET - AnchoIcono: "+anchoIcono);
    	Ti.API.debug("GLEB - LISTMARKET - label1 Num caracteres: "+item.labelH1.length);
    	Ti.API.debug("GLEB - LISTMARKET - label1 tamanoTexto(dp): "+localStyle.labelH1Size);
    	Ti.API.debug("GLEB - LISTMARKET - label1 Lineas: "+parseInt(numLines));
    	Ti.API.debug("GLEB - LISTMARKET - label1 numLines * localStyle.labelH1Size: "+parseInt(numLines) * localStyle.labelH1Size);
    }                            
    if(item.labelH2){
        tmpValue = item.labelH2.length * localStyle.labelH2Size;
		numLines = tmpValue / anchoDisponible;
		if(tmpValue % anchoDisponible > 0){
			numLines++;
		}
    	button.tamano+=((parseInt(numLines) * localStyle.labelH2Size) + Ti.App.glebUtils._p(2));
    }
    if(item.labelH3){
        tmpValue = item.labelH3.length * localStyle.labelH3Size;
		numLines = tmpValue / (anchoDisponible - anchoIcono);
		if(tmpValue % (anchoDisponible - anchoIcono) > 0){
			numLines++;
		}
    	heightLabel3=((parseInt(numLines) * localStyle.labelH3Size) + Ti.App.glebUtils._p(2));
	}
    if(item.labelH4){
        tmpValue = item.labelH4.length * localStyle.labelH4Size;
		numLines = tmpValue / (anchoDisponible - anchoIcono);
		if(tmpValue % (anchoDisponible - anchoIcono) > 0){
			numLines++;
		}
    	heightLabel4=((parseInt(numLines) * localStyle.labelH4Size) + Ti.App.glebUtils._p(2));
	}
    if(item.icon){
    	heightIcon=((Ti.App.glebUtils.convertDpToPixel(localStyle.iconHeight)) + Ti.App.glebUtils._p(2));
	}
	
	if((heightLabel3 + heightLabel4) < heightIcon){
		button.tamano+=heightIcon;
	}
	else{
		button.tamano+=(heightLabel3 + heightLabel4);
	}
}
};
