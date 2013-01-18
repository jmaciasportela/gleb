/**
 * listMarket
 * Returns a list with autorefresh market styled
 * 
 * @param args		JSON to construct this View
  * 
 * @return Ti.UI.View listMarket Type with auto refresh
 */

module.exports = function(params){	
	
// Para controla cuando se esta mostrando el row del PULL VIEW
var pulling = false;

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
		
	Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
	if (containerView.children[1]) containerView.remove (containerView.children[1]);
	Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
	/* Añadimos el scrollView al container View */    
    containerView.add(populateView(localData, localStyle));
	Ti.API.debug('GLEB - Container views childrens: '+containerView.getChildren());
	return containerView;
};


containerView._refresh = function (e){
	Ti.App.fireEvent("gleb_openActivityIndicator",{"text":"Actualizando lista ..."});
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
	//if (scrollView !== null) scrollView = null; //Ti.App.glebUtils.machaca (scrollView);
	//if (containerView.children[1]) containerView.remove (containerView.children[1]);	    
	// Creamos el scrollview que va a contener el tableView	
	//Ti.API.debug("GLEB - VIEW NAME: "+data.name);	
	//Ti.API.debug("GLEB - VIEW DATA: "+JSON.stringify(data));
	sView = Ti.UI.createScrollView({
		zIndex:2,
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,		
		showVerticalScrollIndicator:false,
	    backgroundColor: params.style.backgroundColor || '#ccc',
	    scrollType: "vertical",
		name: params.name,
		contentOffset: {x: 0, y: Ti.App.glebUtils._p(60)},
		data: data
	});

	///// CREAMOS EL PULL VIEW ROW		
	row = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.App.glebUtils._p(60),
			backgroundColor: '#90EE90',
			color:"#BFBFBF",
			top: Ti.App.glebUtils._p(0)
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


	row.add(arrow);
	row.add(arrow2);
	row.add(statusLabel);
	row.add(lastUpdatedLabel);
	sView.add(row);
		
		
		//////////// PARTE DEL MARKET
    // Esto no se puede calcular a base de dp porque tienen que ser enteros para poder sumar y restar
    var _firsttop=Ti.App.glebUtils._p(2);
    var height=Ti.App.glebUtils._p(80);
    var ySpace=Ti.App.glebUtils._p(2);

    // Por cada elemento definido en la scroll view que se los hemos pasado en la definicion de la vista procesados a traves del contentView !!
    var i = 0;
    for(j in sView.data){    	
    	if (sView.data[i]){
	    	Ti.API.debug("GLEB - listMarket añadiendo fila "+j);
	    	objA=sView.data[i];  
	        objB=sView.data[i+1];
	    	//Ti.API.debug("OBJ:"+JSON.stringify(objA));
	    	//Ti.API.debug("OBJ:"+objB);		    
	    	var _top=j*(height+ySpace)+_firsttop+Ti.App.glebUtils._p(60);			
			var fila = Ti.UI.createView({
	            layout: "horizontal",
	            focusable: false,
	            top: _top,
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
		var offset = 0;
		sView.addEventListener('scroll', function(e) {
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
		
		
		sView.addEventListener('touchend', function() {
			if (offset<=Ti.App.glebUtils._p(10)) {
				Ti.API.debug('REFRESH !!!!');
				containerView._refresh();
				sView.scrollTo(0,Ti.App.glebUtils._p(60));
				lastUpdatedLabel.text="Ultima actualización: "+formatDate();
				statusLabel.text = "Empuja para actualizar";
			}
			else {
				//sView.scrollTo(0,50);
				Ti.API.debug('Dont refresh, go back to base');
			} 
		});
		
	Ti.API.debug('GLEB - SCROLLVIEW TYPE: '+sView);
	return sView;
}

}



