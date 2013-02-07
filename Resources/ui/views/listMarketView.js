/**
 * listMarket
 * Returns a list with autorefresh market styled
 * 
 * @param args      JSON to construct this View
  * 
 * @return Ti.UI.View listMarket Type with auto refresh
 */

module.exports = function(params){  

var containerView = Ti.UI.createView({
    name: params.name,
    borderWidth: 0,
    backgroundColor: params.style.backgroundColor || "transparent",
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
    text: params.headerTitle,   
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

var buttonVolver = Titanium.UI.createButton({           
    backgroundColor: 'white',
    borderColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    title: 'VOLVER',
    font:{fontSize:Ti.App.glebUtils._p(20),fontWeight:"bold"},
});
buttonVolver.addEventListener('click',function(){
    Titanium.Media.vibrate([ 0, 100]);
    alert ("HUNDIDO");
    containerView._refresh ();
    });     

var loadListMarketMainWin = false;

containerView._get = function() {
    
    //Recibimos Params 
    Ti.API.debug('GLEB - Actualizando vista: '+params.name);
    
    // Pedimos otros dos modulos para procesar cositas
    var contentView = require('ui/contents/listMarketContentElements');
    var style = require('ui/styles/styleView');
    
    /* Creamos el estilo y los elementos de la primera llamada*/
    var localStyle = style.getStyleView(params.style || {});
    
    if (params.data) {
        var localData = contentView.listMarketContentView(params.data);             
    }
    else {
        //No vienen contents en el UI JSON
        //var localData = contentView.listMarketContentView(params.content);
    }   
        
    //Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
    if (containerView.children[1]) containerView.remove (containerView.children[1]);
    //Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
    /* Añadimos el scrollView al container View */    
    containerView.add(populateView(localData, localStyle));
    //Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
    if(loadListMarketMainWin){
    	Ti.App.glebUtils.closeActivityIndicator();
    }
    loadListMarketMainWin = true;
    return containerView;
};


containerView._refresh = function (e){
    Ti.App.glebUtils.openActivityIndicator({"text":"Actualizando lista ..."});
    Ti.API.debug("GLEB - Actualizando listMarket: "+params.name);       
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
	
	var rowsArray = [];
    // Creamos el scrollview que va a contener el tableView 
    sView = Ti.UI.createScrollView({
        zIndex:2,
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,      
        showVerticalScrollIndicator:false,
        backgroundColor: params.style.backgroundColor || '#ccc',
        scrollType: "vertical",
        name: params.name,
        layout: "vertical",
        data:data
    });

    //Comprobamos si esta vista tiene que llevar la barra de refresco
    if((params.refresh) && (params.refresh.toUpperCase() == 'ON'))
    {
    	//OBTENEMOS EL PULL VIEW ROW PARA EL REFRESCO DE LA VISTA
		var RefreshBar = require('ui/refreshBar');
		var refreshBarListMarketView = new RefreshBar();
        
        sView.setContentOffset({x: 0, y: Ti.App.glebUtils._p(60)});
        sView.add(refreshBarListMarketView);
    }  
    
    
    //////////// PARTE DEL MARKET
    // Por cada elemento definido en la scroll view que se los hemos pasado en la definicion de la vista procesados a traves del contentView !!
    var i = 0;
    for(j in sView.data){       
        if (sView.data[i]){
            //Ti.API.debug("GLEB - listMarket añadiendo fila "+j);
            objA=sView.data[i];  
            objB=sView.data[i+1];
            var fila = Ti.UI.createView({
                layout: "horizontal",
                focusable: false,
                width: Ti.UI.FILL,
                height: Ti.App.glebUtils._p(80),
                name: "market_row_"+j,
                backgroundColor:'transparent',
            });
            fila.add(objA);
            if (objB)fila.add(objB);        
            sView.add(fila);
            i= i+2;
        }
    }
    
    ////////// FINDE LA PARTE DEL MARKET

    // update the offset value whenever scroll event occurs
    if((params.refresh) && (params.refresh.toUpperCase() == 'ON'))
    {
    	//Añadimos un relleno transparente a la vista
        if( (((rowsArray.length/2)+1) * Ti.App.glebUtils._p(60)) < Ti.App.glebUtils._p(900)) {
            var rowAux = Ti.UI.createView({
                    width: "100%",
                    height: Ti.App.glebUtils._p(900) - (rowsArray.length * Ti.App.glebUtils._p(60)),
                    backgroundColor: 'transparent'
            });
            sView.add(rowAux);
        } 
        
        // update the offset value whenever scroll event occurs
  		RefreshBar.addListenersRefreshBar(refreshBarListMarketView, sView, containerView);
  	}
  	
  	for(i=0;i<rowsArray.length;i++){
        //Ti.API.debug('GLEB - ROW: '+data[i]);
        sView.add(rowsArray[i]);
    }
        
    Ti.API.debug('GLEB - SCROLLVIEW TYPE: '+sView);
    return sView;
}

}



