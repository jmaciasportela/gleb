/**
 * list
 * Returns a list with autorefresh market styled
 * 
 * @param args      JSON to construct this View
  * 
 * @return Ti.UI.View list Type with auto refresh
 */

module.exports = function(params){  


// Para controlar cuando se está mostrando el row del PULL VIEW
var pulling = false;

/* MUY IMPORTANTE, creamos un container para almacenar el scrollview, para poder actualizar el contenido del scrollView de una forma comoda con un remove y un add del mismo
 * Se podria elimininar elemento por elemento de la vista sin usar el container, pero hay un leak y a veces tarda mas en eliminarse un elemento que en avanzar a la siguiente 
 * eliminación y se detiene el bucle.
 * Mucho mejor cepillarse la vista por completo.
 */
var containerView = Ti.UI.createView({
    name: params.name,
    borderWidth: 0,
    backgroundColor: params.style.backgroundColor || "transparent",
    layout: "vertical",
    width: Ti.UI.FILL,
    height: Ti.UI.FILL
}); 

// Creamos el header de la tabla. FIJO
var header = Ti.UI.createView({
    backgroundColor:"#575252",
    width: Ti.App.glebUtils._p(320),
    height:Ti.App.glebUtils._p(30),
    top:Ti.App.glebUtils._p(0)
});
var headerTitle = Ti.UI.createLabel({
    text: Ti.App.glebUtils.textoClaro(params.headerTitle),
    left:Ti.App.glebUtils._p(0),
    width:Ti.UI.FILL,
    top:Ti.App.glebUtils._p(2),
    height:"auto",
    color:"white",
    textAlign:"center",
    font:{fontSize:Ti.App.glebUtils._p(18),fontWeight:"bold"},
    shadowColor:"#A7A7A7",
    shadowOffset:{x:Ti.App.glebUtils._p(1),y:Ti.App.glebUtils._p(1)}
});
header.add(headerTitle);
//Añadmos el header al container
containerView.add(header);


containerView._get = function() {
    
    //Ti.API.debug('GLEB - LIST PARAMS:' +JSON.stringify(params));
    
     /* listContentElements es el que se encarga de transformar los elementos del content del UI JSON en elementos de Titanium. Se le pasa el array content  []
     *  styleView es el que se encarga de recuperar el estilo de la vista grid.
     */
    var contentView = require('ui/contents/listContentElements');
    var style = require('ui/styles/styleView');
    
    /* Creamos el estilo y los elementos de la primera llamada*/
    
    var localStyle = style.getStyleView(params.style || {});
    
    //Recibimos Params 
    Ti.API.debug('GLEB - Actualizando vista: '+params.name);

    if (params.data) {
        var localData = contentView.listContentView(params.data);               
    }
    else {
        //No vienen contents en el UI JSON
        //var localData = contentView.listContentView(params.content);
    }   
        
    //Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
    if (containerView.children[1]) containerView.remove (containerView.children[1]);
    //Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
    /* Añadimos el scrollView al container View */    
    containerView.add(populateView(localData, localStyle));
    //Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
    return containerView;
};


containerView._refresh = function (e){
    Ti.App.fireEvent("gleb_openActivityIndicator",{"text":"Actualizando lista ..."});
    Ti.API.debug("GLEB - Actualizando list: "+params.name);     
    require("clients/glebAPI").getView(params.name, containerView._get );
}   

return containerView._get();



function formatDate()
{
    var d = new Date;   
    var hour=d.getHours();
    var min = d.getMinutes();
    if (min< 10){
       min = "0"+min;
    }
    datestr=' '+hour+':'+min;
    return datestr;
}
        

function populateView (data, style){
        // Creamos el scrollview que va a contener el tableView
        Ti.API.debug("GLEB - VIEW NAME: "+params.name); 

        var scrollView = Ti.UI.createScrollView({
            zIndex:2,
            height: Ti.App.glebUtils._p(Ti.App.Properties.getInt("platformHeight")),
            width: Ti.UI.FILL,
            showVerticalScrollIndicator: true,
            backgroundColor: params.style.backgroundColor || '#ccc',            
            scrollType: "vertical",
            name: params.name,
            contentOffset: {x: 0, y: Ti.App.glebUtils._p(60)},
            layout: "vertical"  
        });     
        
        //Ti.API.debug('GLEB - DATA LENGTH:'+data.length);

        
        ///// CREAMOS EL PULL VIEW ROW      
        /*
        row = Ti.UI.createTableViewRow({
                width: "100%",
                height: Ti.App.glebUtils._p(60),
                backgroundColor: '#90EE90',
                color:"#BFBFBF"
        });
        */
        
        row = Ti.UI.createView({
                width: "100%",
                height: Ti.App.glebUtils._p(60),
                backgroundColor: '#90EE90',
                color:"#BFBFBF"
        });
        
        var arrow = Ti.UI.createView({
            backgroundImage:Titanium.Filesystem.resourcesDirectory+"images/refreshArrow.png",
            width:Ti.App.glebUtils._p(48),
            height:Ti.App.glebUtils._p(48),
            bottom:Ti.App.glebUtils._p(6),
            left:Ti.App.glebUtils._p(10)
        });
        
        var arrow2 = Ti.UI.createView({
            backgroundImage:Titanium.Filesystem.resourcesDirectory+"images/refreshArrow.png",
            width:Ti.App.glebUtils._p(48),
            height:Ti.App.glebUtils._p(48),
            bottom:Ti.App.glebUtils._p(6),
            right:Ti.App.glebUtils._p(10)
        });
         
        var statusLabel = Ti.UI.createLabel({
            text:"Empuja para actualizar",
            left:Ti.App.glebUtils._p(60),
            width: Ti.App.glebUtils._p(200),
            top:Ti.App.glebUtils._p(8),
            height:"auto",
            color:"#576c89",
            textAlign:"center",
            font:{fontSize:Ti.App.glebUtils._p(13),fontWeight:"bold"},
            shadowColor:"#999",
            shadowOffset:{x:Ti.App.glebUtils._p(1),y:Ti.App.glebUtils._p(1)}
        });
         
        var lastUpdatedLabel = Ti.UI.createLabel({
            text:"Ultima actualización: "+formatDate(),
            left:Ti.App.glebUtils._p(60),
            width:Ti.App.glebUtils._p(200),
            top:Ti.App.glebUtils._p(30),
            height:"auto",
            color:"#576c89",
            textAlign:"center",
            font:{fontSize:Ti.App.glebUtils._p(12),fontWeight:"bold"},
            shadowColor:"#999",
            shadowOffset:{x:Ti.App.glebUtils._p(1),y:Ti.App.glebUtils._p(1)}
        });
        

        row.add (arrow);
        row.add (arrow2);
        row.add (statusLabel);
        row.add (lastUpdatedLabel);
        
        //Ti.API.debug('GLEB - TABLEDATA A:'+JSON.stringify(data));
        // Añadimos el PULL VIEW como primer row de la tabla
        data.unshift(row);
        
        //Ti.API.debug("GLEB - TAMAÑO PROVISIONAL: "+data.length);
        //Ti.API.debug("GLEB - TAMAÑO PROVISIONAL: "+data.length * Ti.App.glebUtils._p(60));
        //Ti.API.debug("GLEB - TAMAÑO FIJO : "+Ti.App.glebUtils._p(900));
        
        if(data.length * Ti.App.glebUtils._p(60) < Ti.App.glebUtils._p(900)) {
            var rowAux = Ti.UI.createView({
                    width: "100%",
                    height: Ti.App.glebUtils._p(900) - (data.length * Ti.App.glebUtils._p(60)),
                    backgroundColor: 'transparent'
            });
            data.push(rowAux);
        }           

        for(i=0;i<data.length;i++){
            //Ti.API.debug('GLEB - ROW: '+data[i]);
            scrollView.add(data[i]);
        }
        
         

        
        //Creamos la vista de la tabla  
        /*
        var table = new Titanium.UI.createTableView({
            backgroundColor: style.backgroundColor,
            color:"black",
            //height: Ti.App.glebUtils._p(1000),//,Ti.App.glebUtils._p(Ti.App.Properties.getInt('platformHeight')),
            layout: 'vertical',
            width: Ti.UI.FILL,
            zIndex:1,
            data: data,
            borderWidth: 5,
            borderColor: "blue"
        });
        */
        /*
        var table = new Titanium.UI.createView({
            backgroundColor: "yellow",
            color:"black",
            height: Ti.App.glebUtils._p(1000),//,Ti.App.glebUtils._p(Ti.App.Properties.getInt('platformHeight')),
            layout: 'vertical',
            width: Ti.UI.FILL,
            left: 50,
            right: 50,
            borderWidth: 5,
            borderColor: "blue"
        });         
        

        //Ti.API.debug('GLEB - TABLEDATA B:'+JSON.stringify(data));     
        //Añadimos los datos a la vista tabla
        //table.setData (data);     
        
        //table.setHeight (Titanium.UI.SIZE);
        //Ya tenemos la vista tabla lista
        scrollView.add(table);
        */
        // update the offset value whenever scroll event occurs
        var offset = 0;
        scrollView.addEventListener('scroll', function(e) {
            if (e.y!=null) {
                offset = e.y;
                Ti.API.debug('GLEB - LIST VIEW offset: '+offset+"pulling: "+pulling);               
                if (offset <= Ti.App.glebUtils._p(30) && !pulling){
                    pulling = true;
                    var t = Ti.UI.create2DMatrix();
                    t = t.rotate(-180);         
                    arrow.animate({transform:t,duration:300});
                    arrow2.animate({transform:t,duration:300});     
                }       
                else if (offset == 0 && pulling)
                {           
                    statusLabel.text = "Suelta para refrescar...";
                }
                else if (pulling && offset > Ti.App.glebUtils._p(60))
                {
                    pulling = false;                    
                }
                else if (pulling && offset > Ti.App.glebUtils._p(30)){
                    var t = Ti.UI.create2DMatrix();
                    t = t.rotate(-180);
                    arrow.animate({transform:t,duration:300});
                    arrow2.animate({transform:t,duration:300});
                    statusLabel.text = "Empuja para actualizar";
                }
            }   
        });             
        
        // set the initial position of the scrollView's content
        /*
        init = setInterval(function(e){
            Ti.API.debug('GLEB - LIST VIEW check if '+offset+' = '+Ti.App.glebUtils._p(60));            
            if (offset==Ti.App.glebUtils._p(60)) {
                Ti.API.debug('GLEB - LIST VIEW we have just done what the scrollView\'s contentOffset should be doing');
                clearInterval(init);
            }
            scrollView.scrollTo(0,Ti.App.glebUtils._p(60));
        },100);
        */
        
        Ti.App.addEventListener('setPullDownScroll',function(e){
            if (e.name==params.name){
                Ti.API.debug('GLEB - LIST setPullDownScroll EVENT DONE');
                scrollView.scrollTo(0,Ti.App.glebUtils._p(60));
            }
        }); 
        
        var alertDialog = Titanium.UI.createAlertDialog({
             title: 'System Message',
            buttonNames: ['OK']
        });
        
        scrollView.addEventListener('touchend', function() {
            if (offset<=Ti.App.glebUtils._p(10)) {
                Ti.API.info('REFRESH !!!!');
                containerView._refresh();               
                scrollView.scrollTo(0,Ti.App.glebUtils._p(60));
                lastUpdatedLabel.text="Ultima actualización: "+formatDate();
                statusLabel.text = "Empuja para actualizar";
            }
            else {
                //scrollView.scrollTo(0,50);
                Ti.API.info('Dont refresh, go back to base');
            } 
        });

    return scrollView;
}
};

