// Content View mapea los elementos del JSON a elementos UI de Titanium
exports.gridContentView = function(content) {
    var result=[];  
    var style = require('ui/styles/styleContent');  
    var actionFactory = require('ui/actions/actionFactory');
    
    // Vamos recorriendo cada elemento content de la vista market
    for (i in content) {
        item=content[i];        
        var localStyle = style.getStyleContent(item.style || {});

        if( item.type == 'button' ){
                button = Ti.UI.createButton({
                        name: item.name,    
                        title: item.labelH1,
                        font: {fontSize: localStyle.labelH1Size+"dp", fontWeight:localStyle.labelH1Weight },            
                        color: localStyle.labelH1Color,
                        textAlign: localStyle.labelH1TextAlign,
                        verticalAlign: localStyle.labelH1VerticalAlign,
                        backgroundColor: localStyle.backgroundColor,
                        backgroundImage: localStyle.backgroundImage,
                        action: item.action,
                        winId: item.winId,
                        url: item.url,
                        method: item.method,
                        methodParams: item.methodParams
                });
                        
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
};