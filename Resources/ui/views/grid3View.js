/**
 * grid3
 * Returns a grid with autorefresh market styled
 * 
 * @param args		JSON to construct this View
  * 
 * @return Ti.UI.View grid3 Type with auto refresh
 */

module.exports = function(params){	


/* MUY IMPORTANTE, creamos un container para almacenar el scrollview, para poder actualizar el contenido del scrollView de una forma comoda con un remove y un add del mismo
 * Se podria elimininar elemento por elemento de la vista sin usar el container, pero hay un leak y a veces tarda mas en eliminarse un elemento que en avanzar a la siguiente 
 * eliminación y se detiene el bucle.
 * Mucho mejor cepillarse la vista por completo.
 */
var containerView = Ti.UI.createView({
	borderWidth: 0,
	backgroundColor: "transparent",		
	layout: "vertical",
	width: Ti.UI.FILL,
	name: params.name		
}); 

containerView._get = function(params) {
	
	/*
	 *  gridContentElements es el que se encarga de transformar los elementos del content del UI JSON en elementos de Titanium. Se le pasa el array content  []
	 *  styleView es el que se encarga de recuperar el estilo de la vista grid.
	 */
	var contentView = require('ui/contents/gridContentElements');
	var style = require('ui/styles/styleView');
	
	////var utils = require("global_functions");
	
	
	/* Creamos el estilo y los elementos de la primera llamada*/
	//Ti.API.info("Creating view style... "+ this.name);
	var localStyle = style.getStyleView(params.style || {});
		
	//Recibimos Params 
	Ti.API.debug('GLEB - Actualizando vista: '+params.name);

	if (params.content) {
		var localData = contentView.gridContentView(params.content);				
	}
	else {
		//No vienen contents en el UI JSON
		//var localData = contentView.gridContentView(params.content);
	}
	
	//Ti.API.debug("GLEB - OJO al local Data: "+JSON.stringify(localData));	
		
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
	Ti.API.debug("GLEB - Actualizando grid3: "+params.name);		
	require("clients/glebAPI").getView(params.name, containerView._get );
}	

return containerView._get(params);


/* Funcion que se encaga de crear la vista scroll vertical e ir añadiendo los elementos
 * Lo he metido en una funcion para poder llamarlo facilmente desde el listener de actualizar vista
 */
function populateView (data, style){	
	//Ti.API.debug("GLEB - DATA: "+JSON.stringify(data));
	//Ti.API.debug("GLEB - STYLE: "+JSON.stringify(style));	
    
    var view = Ti.UI.createScrollView({
		borderWidth: 0,
		backgroundColor: style.backgroundColor,
		borderRadius: 0,
        scrollType: "vertical",
        data: data,
        contentHeight: "auto",
		contentWidth: "auto",
		width: Ti.UI.FILL,
		name: params.name
    });

	//Tamaño del Grid	
    var xGrid = 3;
    var objSetIndex = 0;
    var yGrid = data.length/xGrid;
    
    //Ti.API.info("GlebGridView xGrid="+xGrid);
    //Ti.API.info("GlebGridView yGrid="+yGrid);
 
    for (var y=0; y<yGrid; y++){
    	//Ti.API.info("Procesando Fila="+y);

        for (var x=0; x<xGrid; x++){
        	//Ti.API.info("Procesando Elemento="+x+" de la Fila="+y);
            if(data[objSetIndex]){
            	var _top= Ti.App.glebUtils._p(8)+(y*(Ti.App.glebUtils._p(104))); //y*(view.cellHeight+view.ySpacer)+_firsttop;
    			var _left = Ti.App.glebUtils._p(8)+(x*(Ti.App.glebUtils._p(104)));      
    			//Ti.API.info("GLEB- Set element possition, top:"+_top+" left:"+_left);
            	newobj=data[objSetIndex];
            	newobj.width=Ti.App.glebUtils._p(96);
        		newobj.height=Ti.App.glebUtils._p(96);        		
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

