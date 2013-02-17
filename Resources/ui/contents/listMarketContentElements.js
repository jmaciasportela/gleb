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
                        height:Ti.App.glebUtils._p(80),
                        width:Ti.App.glebUtils._p(160),                 
                        backgroundColor: localStyle.backgroundColor,                        
                        action: item.action,
                        winId: item.winId,
                        url: item.url,
                        method: item.method,
                        methodParams: item.methodParams     
                    });     
                                            
                var label1 = Ti.UI.createLabel({
                    color: localStyle.labelH1Color,
                    top: Ti.App.glebUtils._p(2),
                    font: {fontSize: localStyle.labelH1Size+"dp", fontWeight:localStyle.labelH1Weight},
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
                    color:localStyle.labelH2Color,
                    top: Ti.App.glebUtils._p(22),
                    font: {fontSize: localStyle.labelH2Size+"dp", fontWeight:localStyle.labelH2Weight},
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
                    color:localStyle.labelH3Color,
                    top: Ti.App.glebUtils._p(45),
                    font: {fontSize: localStyle.labelH3Size+"dp", fontWeight:localStyle.labelH3Weight},
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
                    color:localStyle.labelH4Color,
                    top: Ti.App.glebUtils._p(63),
                    font: {fontSize: localStyle.labelH4Size+"dp", fontWeight:localStyle.labelH4Weight},
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