/**
 * Market
 * Returns a list with autorefresh form styled
 * 
 * @param args      JSON to construct this View
  * 
 * @return Ti.UI.View Form Type with auto refresh
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
    
    //Recibimos Params 
    Ti.API.debug('GLEB - Actualizando vista: '+params.name);
    
    /*
     *  formContentElements es el que se encarga de transformar los elementos del content del UI JSON en elementos de Titanium. Se le pasa el array content  []
     *  styleView es el que se encarga de aplicar los estilos por defecto de la vista.
     */
    var contentView = require('ui/contents/formContentElements');
    var style = require('ui/styles/styleView');
    
    /* Creamos el estilo y los elementos de la primera llamada*/
    var localStyle = style.getStyleView(params.style || {});
    
    if (params.data) {
        var localData = contentView.formContentView(params.data);               
    }
    else {
        //No vienen contents en el UI JSON
        //var localData = contentView.formContentView(params.content);
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
    Ti.App.fireEvent("gleb_openActivityIndicator",{"text":"Actualizando contenido ..."});
    Ti.API.debug("GLEB - Actualizando Form: "+params.name);     
    require("clients/glebAPI").getView(params.name, containerView._get );
}   


return containerView._get();


/* Funcion que se encaga de crear la vista scroll vertical e ir añadiendo los elementos
 * Lo he metido en una funcion para poder llamarlo facilmente desde el listener de actualizar vista
 */
function populateView (data, style){    

    //TODO PENDIENTE DE CODIFICAR LA FORMA DE PINTAR LOS CONTENTS DEL FORMVIEW  
    
    //Ti.API.debug('GLEB - VAMOS A PINTAR EL FORMULARIO: ' + JSON.stringify(data));
    
    var view = Ti.UI.createScrollView({
            zIndex:2,
            //height: Ti.App.glebUtils._p(Ti.App.Properties.getInt("platformWidth")),
            width: Ti.UI.FILL,
            showVerticalScrollIndicator: true,
            backgroundColor: params.style.backgroundColor || "#ccc",                
            scrollType: "vertical",
            name: params.name,
            //contentOffset: {x: 0, y: Ti.App.glebUtils._p(60)},
            layout: "vertical",
            data: data
        });     
    
    row = Ti.UI.createView({
            width: "auto",
            height: "auto"
    });
    
   
    for(i=0;i<data.length;i++){
        //Ti.API.debug('GLEB FORMULARIO- El tamano de result es: '+data.length);
        //Ti.API.debug('GLEB FORMULARIO- Cada item del result : '+JSON.stringify(view.data[i]));
        row.add(data[i]);
    }
    
    view.add(row);
        
    return view;
} // Fin function populateView

};

