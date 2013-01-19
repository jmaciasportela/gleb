/**
 * grid
 * Returns a grid with market styled
 * 
 * @param args      JSON to construct this View
  * 
 * @return Ti.UI.View grid Type
 */

module.exports = function(params){  

/* MUY IMPORTANTE, creamos un container para almacenar el scrollview, para poder actualizar el contenido del scrollView de una forma comoda con un remove y un add del mismo
 * Se podria elimininar elemento por elemento de la vista sin usar el container, pero hay un leak y a veces tarda mas en eliminarse un elemento que en avanzar a la siguiente 
 * eliminación y se detiene el bucle.
 * Mucho mejor cepillarse la vista por completo.
 */
var containerView = Ti.UI.createView({
    borderWidth: 0,
    backgroundColor: params.style.backgroundColor || "transparent",     
    layout: "vertical",
    width: Ti.UI.FILL,
    name: params.name       
}); 

containerView._get = function() {
    
    /*
     *  gridContentElements es el que se encarga de transformar los elementos del content del UI JSON en elementos de Titanium. Se le pasa el array content  []
     *  styleView es el que se encarga de recuperar el estilo de la vista grid.
     */
    var contentView = require('ui/contents/gridContentElements');
    var style = require('ui/styles/styleView');
    
    /* Creamos el estilo y los elementos de la primera llamada*/
    var localStyle = style.getStyleView(params.style || {});

    if (params.data) {
        var localData = contentView.gridContentView(params.data);               
    }
    else {
        //No vienen contents en el UI JSON
        //var localData = contentView.gridContentView(params.content);
    }
        
    Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
    if (containerView.children[1]) containerView.remove (containerView.children[1]);
    Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
    /* Añadimos el scrollView al container View */    
    containerView.add(populateView(localData, localStyle));
    Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
    return containerView;
};

return containerView._get();


/* Funcion que se encaga de crear la vista scroll vertical e ir añadiendo los elementos
 * Lo he metido en una funcion para poder llamarlo facilmente desde el listener de actualizar vista
 */
function populateView (data, style){    
    //Ti.API.debug("GLEB - DATA: "+JSON.stringify(data));
    //Ti.API.debug("GLEB - STYLE: "+JSON.stringify(style)); 
    
    var view = Ti.UI.createScrollView({
        //backgroundColor: style.backgroundColor,
        backgroundColor: params.style.backgroundColor || "transparent",
        scrollType: "vertical",
        data: data,
        contentHeight: "auto",
        contentWidth: "auto",
        width: Ti.UI.FILL,
        name: params.name
    });

    //Tamaño del Grid   
    var xGrid = 2;
    var objSetIndex = 0;
    var yGrid = data.length/xGrid;
    
    //Ti.API.info("GlebGridView xGrid="+xGrid);
    //Ti.API.info("GlebGridView yGrid="+yGrid);
 
    for (var y=0; y<yGrid; y++){
        //Ti.API.info("Procesando Fila="+y);

        for (var x=0; x<xGrid; x++){
            //Ti.API.info("Procesando Elemento="+x+" de la Fila="+y);
            if(data[objSetIndex]){
                var _top= Ti.App.glebUtils._p(20)+(y*(Ti.App.glebUtils._p(150))); //y*(view.cellHeight+view.ySpacer)+_firsttop;
                var _left = Ti.App.glebUtils._p(20)+(x*(Ti.App.glebUtils._p(150)));      
                //Ti.API.info("GLEB- Set element possition, top:"+_top+" left:"+_left);
                newobj=data[objSetIndex];
                newobj.width=Ti.App.glebUtils._p(130);
                newobj.height=Ti.App.glebUtils._p(130);             
                newobj.top=_top;
                newobj.left=_left;                            
                //Ti.API.info("GLEB- OBJETO:"+JSON.stringify(newobj));                
                view.add(newobj);
                objSetIndex++;
           }
        }
        
    } 
    return view;

} // Fin function populateView
};

