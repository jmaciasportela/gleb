/**
 * Market
 * Returns a list with autorefresh market styled
 * 
 * @param args		JSON to construct this View
  * 
 * @return Ti.UI.View Market Type with auto refresh
 */

module.exports = function(params){	


/* MUY IMPORTANTE, creamos un container para almacenar el scrollview, para poder actualizar el contenido del scrollView de una forma comoda con un remove y un add del mismo
 * Se podria elimininar elemento por elemento de la vista sin usar el container, pero hay un leak y a veces tarda mas en eliminarse un elemento que en avanzar a la siguiente 
 * eliminación y se detiene el bucle.
 * Mucho mejor cepillarse la vista por completo.
 */
var containerView = Ti.UI.createView({
	name: params.name,
	borderWidth: 0,	
	backgroundColor: params.style.backgroundColor || "transparent",	
	backgroundImage: 'images/background.png',
	layout: "vertical",
	width: Ti.UI.FILL
}); 


containerView._get = function() {
	
	//Recibimos Params 
	Ti.API.debug('GLEB - Actualizando vista: '+params.name);
	
	/*
	 *  marketContentElements es el que se encarga de transformar los elementos del content del UI JSON en elementos de Titanium. Se le pasa el array content  []
	 *  marketStyleElements es el que se encarga de aplicar los estilos por defecto de la propia vista y de los elementos permitidos en la vista market.
	 */
	var contentView = require('ui/contents/marketContentElements');
	var style = require('ui/styles/styleView');
	
	/* Creamos el estilo y los elementos de la primera llamada*/
	var localStyle = style.getStyleView(params.style || {});
	
	if (params.data) {
		var localData = contentView.marketContentView(params.data);				
	}
	else {
		//No vienen contents en el UI JSON
		//var localData = contentView.marketContentView(params.content);
	}	
	
	//Ti.API.debug("GLEB - OJO al local Data: "+JSON.stringify(localData));	
		
	Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
	if (containerView.children[1]) containerView.remove (containerView.children[1]);
	Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
	/* Añadimos el scrollView al container View */    
    containerView.add(populateView(localData, localStyle));
	Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
	return containerView;
};


containerView._refresh = function (e){
	Ti.App.fireEvent("gleb_openActivityIndicator",{"text":"Actualizando contenido ..."});
	Ti.API.debug("GLEB - Actualizando Market: "+params.name);		
	require("clients/glebAPI").getView(params.name, containerView._get );
}	


return containerView._get();


/* Funcion que se encaga de crear la vista scroll vertical e ir añadiendo los elementos
 * Lo he metido en una funcion para poder llamarlo facilmente desde el listener de actualizar vista
 */
function populateView (data, style){	
	//Ti.API.debug("GLEB - DATA: "+JSON.stringify(data));
	//Ti.API.debug("GLEB - STYLE: "+JSON.stringify(style));			
	
    var view = Ti.UI.createScrollView({
		backgroundColor: params.style.backgroundColor || "transparent",
        scrollType: "vertical",
        data: data,
        contentHeight: "auto",
		contentWidth: "auto",
		width: Ti.UI.FILL,
		name: params.name
    });
        
    //Ti.API.debug("GLEB - MARKET VIEW INICIAL:"+JSON.stringify(view));
    /*
     * Devolver cada fila tipo market
     */
    var _fila = function(elements, _top, i){
    	var row = Ti.UI.createView({
            layout: "horizontal",
            focusable: false,
            top: _top,
            width: Ti.UI.FILL,
            height: "auto",
            name: "market_row_"+i
            //backgroundColor:'green',
        });
        //Ti.API.info(elements);
        elements[0].width=Ti.App.glebUtils._p(320);        
        if (elements[1] ){
        	elements[1].width=Ti.App.glebUtils._p(160);
        	elements[0].width=Ti.App.glebUtils._p(160);        	
        	//Ti.API.info("Creating market... add 2 buttons");
        	row.add(elements[0])
        	row.add(elements[1]);
        }
        else {
        	row.add(elements[0]);
        	//Ti.API.info("Creating market... add 1 button");
        }        
        return row;
    }

    ////// COMIENZA EL PROCESO RECURSIVO
    var half=false;
    var previous=-1;
    var y=0,j=0;
    
    // Esto no se puede calcular a base de dp porque tienen que ser enteros para poder sumar y restar
    var _firsttop=Ti.App.glebUtils._p(2);
    var height=Ti.App.glebUtils._p(80);
    var ySpace=Ti.App.glebUtils._p(2);
    
    // Por cada elemento definido en la scroll view que se los hemos pasado en la definicion de la vista procesados a traves del contentView !!
    for( i in view.data ){
    	item=params.data[i]; // Es cada elemento de la seccion content del UI.json
    	obj=view.data[i];    	
    	//Ti.API.debug("OBJ:"+JSON.stringify(obj));
	    //Ti.API.debug("ITEM: "+JSON.stringify(item));
    	var _top=y*(height+ySpace)-(j*ySpace)+_firsttop;

		//Ti.API.info("Creating market... i="+ i + " y="+y+" size="+item['size']);
		
		if(item['size'] == "2x1")  {
			//Ti.API.info("Add 2x1");
			obj.height = Ti.App.glebUtils._p(80);
			obj.width = Ti.App.glebUtils._p(320);
			//Ti.API.info(JSON.stringify(obj));
			row = _fila( [obj, null], _top, i);
			view.add(row);
			y++;
			half=false;
		    //Ti.API.debug("GLEB - OBJ 2x1:"+JSON.stringify(obj));
		}

		else if( item['size'] == "2x2")  {
			//Ti.API.info("Add 2x2");
			obj.height = Ti.App.glebUtils._p(160);
			obj.width = Ti.App.glebUtils._p(320);
			//Ti.API.debug("GLEB - OBJETO 2x2:"+JSON.stringify(obj));			
			row = _fila( [obj, null], _top, i);
			//row.height=Ti.App.glebUtils._p(160);
			view.add(row);			
			y+=2;
			j++;
			half=false;
		}
		else if (!half && item['size'] == "1x1" ){
			//Ti.API.info("First 1x1");
			previous=i;
			half=true;
			continue;
		}
		else if( half && item['size'] == "1x1" ){
			//Ti.API.info("Second 1x1");
			obj.height = Ti.App.glebUtils._p(80);
			obj.width = Ti.App.glebUtils._p(160);
			//Ti.API.info(JSON.stringify(obj));			
			prevobj = view.data[previous];
			prevobj.height = Ti.App.glebUtils._p(80);
			prevobj.width = Ti.App.glebUtils._p(80);
			view.add( _fila( [prevobj, obj], _top, i) );
			previous=-1;
			half=false;
			y++;
		}
		else {
			Ti.API.info("Unknow size="+item['size']);
		}
    }
    
    return view;
} // Fin function populateView

};

