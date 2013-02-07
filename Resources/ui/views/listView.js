/**
 * list
 * Returns a list with autorefresh market styled
 * 
 * @param args      JSON to construct this View
  * 
 * @return Ti.UI.View list Type with auto refresh
 */

module.exports = function(params){  

/* MUY IMPORTANTE, creamos un container para almacenar el scrollview, para poder actualizar el contenido del scrollView de una forma comoda con un remove y un add del mismo
 * Se podria elimininar elemento por elemento de la vista sin usar el container, pero hay un leak y a veces tarda mas en eliminarse un elemento que en avanzar a la siguiente 
 * eliminación y se detiene el bucle.
 * Mucho mejor cepillarse la vista por completo.
 */
var containerListView = Ti.UI.createView({
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
containerListView.add(header);


var loadListMainWin = false;

containerListView._get = function() {
    
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
        
    //Ti.API.debug('GLEB - Container views childrens: '+containerListView.getChildren());
    if (containerListView.children[1]) containerListView.remove (containerListView.children[1]);
    //Ti.API.debug('GLEB - Container views childrens: '+containerListView.getChildren());
    /* Añadimos el scrollView al container View */    
    containerListView.add(populateView(localData, localStyle));
    //Ti.API.debug('GLEB - Container views childrens: '+containerListView.getChildren());
    if(loadListMainWin){
    	Ti.App.glebUtils.closeActivityIndicator();
    }
    loadListMainWin = true;
    return containerListView;
};


containerListView._refresh = function (e){
    Ti.App.glebUtils.openActivityIndicator({"text":"Actualizando lista ..."});
    Ti.API.debug("GLEB - Actualizando list: "+params.name);     
    require("clients/glebAPI").getView(params.name, containerListView._get );
}   

return containerListView._get();



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
        layout: "vertical"  
    });     
    
    
    //Comprobamos si esta vista tiene que llevar la barra de refresco
    if((params.refresh) && (params.refresh.toUpperCase() == 'ON'))
    {
    	//OBTENEMOS EL PULL VIEW ROW PARA EL REFRESCO DE LA VISTA
		var RefreshBar = require('ui/refreshBar');
		var refreshBarListView = new RefreshBar();
        // Añadimos el PULL VIEW como primer row de la tabla
        data.unshift(refreshBarListView);
   		
   		//Añadimos un relleno transparente a la vista
        if(data.length * Ti.App.glebUtils._p(60) < Ti.App.glebUtils._p(900)) {
            var rowAux = Ti.UI.createView({
                    width: "100%",
                    height: Ti.App.glebUtils._p(900) - (data.length * Ti.App.glebUtils._p(60)),
                    backgroundColor: 'transparent'
            });
            data.push(rowAux);
        }  
        
        scrollView.setContentOffset({x: 0, y: Ti.App.glebUtils._p(60)});
    }        

    for(i=0;i<data.length;i++){
        //Ti.API.debug('GLEB - ROW: '+data[i]);
        scrollView.add(data[i]);
    }
    
    if((params.refresh) && (params.refresh.toUpperCase() == 'ON'))
    {
        // update the offset value whenever scroll event occurs
  		RefreshBar.addListenersRefreshBar(refreshBarListView, scrollView, containerListView);
  	}

    return scrollView;
}
};

