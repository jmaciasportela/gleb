exports._get = function(){

	var view = Ti.UI.createView({
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 5,
		opacity: 1,
		backgroundColor: 'transparent'	
		});
	
	var header = Ti.UI.createImageView({
  		image:'../../images/wizard_header.png',
  		backgroundColor: 'transparent',
		height:Ti.App.glebUtils._p(60),
		width:Ti.App.glebUtils._p(320),
		top: Ti.App.glebUtils._p(0),
		left: Ti.App.glebUtils._p(0)
	});
	

	var paso = Ti.UI.createLabel({
		text:'Paso 1 de 3',
		top:Ti.App.glebUtils._p(68),
		left:Ti.App.glebUtils._p(8),
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white',
		font: { fontSize:Ti.App.glebUtils._p(10)}
	});	

	var description = Ti.UI.createLabel({
		color:'#fff',
		top: Ti.App.glebUtils._p(100),
		left: Ti.App.glebUtils._p(15),
		right: Ti.App.glebUtils._p(15),	
		font: { fontSize: Ti.App.glebUtils._p(14) },
		text: 'El registro solo requiere 3 pasos. Para empezar necesitamos validar tu número de teléfono móvil.', 
		height:'auto',
		width:'auto',
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});

	var linkE = Titanium.UI.createLabel({
		top: Ti.App.glebUtils._p(160),
        text: "Más Información",
        color: "blue",
        font: {
            fontSize: Ti.App.glebUtils._p(16),
            fontWeight: 'bold'
        },
        width: 'auto',
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
 
	linkE.addEventListener('click', function(e){
    	require('ui/wizard').toLeft();
	});	
	
	

	var labelTelf = Ti.UI.createLabel({
		text:'Introduzca su número de telefono',
		top:Ti.App.glebUtils._p(190),
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white',
		font: { fontSize:Ti.App.glebUtils._p(16)}
		});	
	
	var prefix = Ti.UI.createTextField({
		color: 'black',
        top: Ti.App.glebUtils._p(220),
        font: { fontSize:Ti.App.glebUtils._p(14)},        
        width: Ti.App.glebUtils._p(60),
        left: Ti.App.glebUtils._p(20),
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        enabled: false,
        focusable: false,
        value: "+34"
	});
	var telf = Ti.UI.createTextField({
		color: 'black',
        top: Ti.App.glebUtils._p(220),
        font: { fontSize:Ti.App.glebUtils._p(14)},        
        width: Ti.App.glebUtils._p(210),
        left: Ti.App.glebUtils._p(90),
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        keyboardType: Titanium.UI.KEYBOARD_PHONE_PAD,
        value: (Ti.App.Properties.hasProperty("telf"))?Ti.App.Properties.getString("telf"):"",
        hintText: (Ti.App.Properties.hasProperty("telf"))?Ti.App.Properties.getString("telf"):"Teléfono"
	});
	
	telf.addEventListener('change',function(e){		
		Ti.API.info("Telf on change:"+JSON.stringify(e));
		Ti.App.Properties.setString("telf",e.value);
		Ti.App.Properties.setString("pushUser","GLEB"+e.value);
		Ti.App.Properties.setString("pushUserPassword",Ti.Utils.base64encode("GLEB"+e.value));		
   	});

	telf.addEventListener('blur',function(e){		
		Ti.API.info("Telf on blur:"+JSON.stringify(e));		
		if (e.value!=""){	
			var phoneNumberPattern = /0{0,3}346[0-9]{8}/;	
			Ti.API.info("Telf: +34"+e.value);
			if (!phoneNumberPattern.test("+34"+e.value)){
			  var dialog = Ti.UI.createAlertDialog({
	    		message: 'El número introducido no es valido',
	    		ok: 'Continuar',
	    		title: 'Número incorrecto'
	  			}).show();		
				telf.focus();	
			}
			else {
				Ti.App.Properties.setString("telf",e.value);
				Ti.App.Properties.setString("pushUser","GLEB"+e.value);
				Ti.App.Properties.setString("pushUserPassword",Ti.Utils.base64encode("GLEB"+e.value));		
			}
		} // FIN DEL IF
   	});

	
   var buttonLeft = Titanium.UI.createButton({
	   title: 'Info',
	   bottom: Ti.App.glebUtils._p(5),
	   left: Ti.App.glebUtils._p(15),
	   width: Ti.App.glebUtils._p(90),
	   height: Ti.App.glebUtils._p(40),
       font: { fontSize: Ti.App.glebUtils._p(14)},	   
	   enabled: true
	});
	buttonLeft.addEventListener('click',function(){require('ui/wizard').toLeft();});
	
	
	var buttonSkip = Titanium.UI.createButton({   		
	   title: 'Salir',
	   bottom: Ti.App.glebUtils._p(5),
	   left: Ti.App.glebUtils._p(115),
	   width: Ti.App.glebUtils._p(90),
	   height: Ti.App.glebUtils._p(40),
	   font: { fontSize: Ti.App.glebUtils._p(14)}
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
	   font: { fontSize: Ti.App.glebUtils._p(14)}
	});
	buttonRight.addEventListener('click',function(){		
		if (telf.value==""){
			var dialog = Ti.UI.createAlertDialog({
    			message: 'Has de introducir tu número de telefono',
    			ok: 'Continuar',
    			title: 'Número incorrecto'
  				}).show();		
				telf.focus();			
		}
		else {
			Ti.App.fireEvent('gleb_closeActivityIndicator');
			Ti.API.info("Enviando codigo de verificación al numero "+Ti.App.Properties.getString("telf"));
			Ti.App.fireEvent('gleb_openActivityIndicator',{"text":"Enviando código ..."});			
			require("plugins/glebAPI").sendSMS(Ti.App.Properties.getString("telf"));		
		}
			
	});	
			
	view.add(header);
	view.add(paso);
	view.add(description);
	view.add(linkE);
	view.add(labelTelf);
	view.add(prefix);
	view.add(telf);	
	view.add(buttonLeft);
    view.add(buttonSkip);
    view.add(buttonRight);      
    return view;    
};
