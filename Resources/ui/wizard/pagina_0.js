exports._get = function(){
	
	var view = Ti.UI.createView({
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 5,
		opacity: 1,
		backgroundColor: 'transparent'		
	});		
	var bienvenida = Ti.UI.createImageView({
  		image:'../../images/gleb.png',
		height: Ti.App.glebUtils._p(75),
		width: Ti.App.glebUtils._p(260),
		top: Ti.App.glebUtils._p(15),
		lef: Ti.App.glebUtils._p(30)
	});	
	var label = Ti.UI.createLabel({
		color:'#fff',
		top: Ti.App.glebUtils._p(100),
		left: Ti.App.glebUtils._p(15),
		right: Ti.App.glebUtils._p(15),	
		font: { fontSize:Ti.App.glebUtils._p(14) },
		text: 'GEOLOCALIZACIÓN DE ESTACIONES BASE',
		height:'auto',
		width:'auto',
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	var description = Ti.UI.createLabel({
		color:'#fff',
		top: Ti.App.glebUtils._p(130),
		left: Ti.App.glebUtils._p(15),
		right: Ti.App.glebUtils._p(15),	
		font: { fontSize:Ti.App.glebUtils._p(12)},
		text: 'PERFIL BÁSICO: Chequeo de cobertura en tu localización de servicio de acceso a Internet de Iberbanda.\n\nPERFIL IBERBANDA: muestra información en tiempo real sobre las estaciones base cercanas a tu ubicación con datos exactos de orientación, distancia y localización mediante realidad aumentada, así como el envío de documentos/fotos a ftp/email etc.\n\nPERFIL TECNICO: Además de lo anterior, permite la recepción de ordenes de trabajo asignado, así como de nuevas ordenes de trabajo en un perímetro predefinido, geo-localización de compañeros cercanos. Genera rutas de desplazamiento hasta las ubicaciones recibidas mediante software de navegación.Introducción de gastos de repostajes, dietas, control de peajes, cambios de vehículos, etc.',
		height:'auto',
		width:'auto',
	    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	
	//Add behavior for UI
	label.addEventListener('click', function(e) {
		alert(e.source.text);
	});	
	
   var buttonLeft = Titanium.UI.createButton({
	   title: 'Prev',
	   bottom: Ti.App.glebUtils._p(5),
	   left: Ti.App.glebUtils._p(15),
	   width: Ti.App.glebUtils._p(90),
	   height: Ti.App.glebUtils._p(40),
	   font: { fontSize: Ti.App.glebUtils._p(12)},
	   enabled: false
	});
	buttonLeft.addEventListener('click',function(){require('ui/wizard').toLeft();});
	
	
	var buttonSkip = Titanium.UI.createButton({   		
	   title: 'Saltar',
	   bottom: Ti.App.glebUtils._p(5),
	   left: Ti.App.glebUtils._p(115),
	   width: Ti.App.glebUtils._p(90),
	   height: Ti.App.glebUtils._p(40),	
	   font: { fontSize: Ti.App.glebUtils._p(12)},   
	});
	buttonSkip.addEventListener('click',function(){		
		var activity = Titanium.Android.currentActivity;
    	activity.finish();			
	});	
		
	var buttonRight = Titanium.UI.createButton({   		
	   title: 'Sig',
	   bottom: Ti.App.glebUtils._p(5),
	   right: Ti.App.glebUtils._p(15),
	   width: Ti.App.glebUtils._p(90),
	   height: Ti.App.glebUtils._p(40),	   
	   font: { fontSize: Ti.App.glebUtils._p(12)},
	});
	buttonRight.addEventListener('click',function(){require('ui/wizard').toRight();});	
	
	view.add(bienvenida);	
	view.add(label);	
	view.add(description);
    view.add(buttonLeft);
    view.add(buttonSkip);
    view.add(buttonRight);    
    return view;    
};
