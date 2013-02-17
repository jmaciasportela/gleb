// Content View mapea los elementos del JSON a elementos UI de Titanium
exports.listContentView = function(content) {
var result=[];  
var style = require('ui/styles/styleContent');  
var actionFactory = require('ui/actions/actionFactory');    


for (i in content) {
        item=content[i];        
        //Leemos el estilo del elemento que vamos a añadir y le aplicamos unos valores por defecto
        var localStyle = style.getStyleContent(item.style || {});

        if(item.type == 'row'){
                row = Ti.UI.createView({
                        name: item.name,
                        width: Ti.UI.FILL,
                        height: Ti.UI.SIZE,                     
                        backgroundColor: localStyle.backgroundColor,
                        borderWidth: localStyle.borderWidth,
                        borderColor: localStyle.borderColor,
                        action: item.action,
                        winId: item.winId,
                        url: item.url,
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
                        left: Ti.App.glebUtils._p(10),
                        touchEnabled:false
                });             
                row.add(BS);    
                
                var leftPosition = parseInt(item.iconWidth)+20;
                
                var label1 = Ti.UI.createLabel({
                    text: Ti.App.glebUtils.textoClaro(item.labelH1),
                    color: localStyle.labelH1Color,
                    font: { fontSize: localStyle.labelH1Size+"dp", fontWeight:localStyle.labelH1Weight},
                    height:'auto',
                    width:Ti.UI.FILL,                   
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                    left: leftPosition+"dp",
                    touchEnabled:false
                });     
                row.add(label1);    
            
                //Si en el JSON se indica algún tipo de acción asociada al item, se le añade en este punto del código                                               
                if (item.action && item.action != '') {
                    actionFactory.addAction(row, content[i]);
                }  
                
                //Si en el JSON se informa el parámetro "share", entonces se añadirá el intent correspondiente asociado al evento longclick del item                                               
                if (item.share && item.share != '') {
                    actionFactory.addShareData(button, item.share);
                }                                 
    
            result.push(row); 
        }
        else {
            Ti.API.error("Unsupported view content type="+item.type);
        }
    }
    return result;
};