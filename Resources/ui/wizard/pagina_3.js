module.exports= function(){

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
		text:'Paso 3 de 3',
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
		top: Ti.App.glebUtils._p(120),
		font: { fontSize: Ti.App.glebUtils._p(14) },
		text: 'Ya casi hemos terminado. Introduce tu nickname para identificarte.',
		height:'auto',
		width:'auto',
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});

	var nick = Ti.UI.createTextField({
		color: 'black',
        top: Ti.App.glebUtils._p(200),
        font: { fontSize:Ti.App.glebUtils._p(14)},
        width: Ti.App.glebUtils._p(220),
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        hintText: (Ti.App.Properties.hasProperty("nickname"))?Ti.App.Properties.getString("nickname"):"Nickname",
        value: (Ti.App.Properties.hasProperty("nickname"))?Ti.App.Properties.getString("nickname"):"",
        returnKeyType: Ti.UI.RETURNKEY_DONE
	});
	nick.addEventListener('blur',function(e){
		Ti.API.info("Telf on blur:"+JSON.stringify(e));
    	Ti.App.Properties.setString("nickname",e.value);
   	});


	var buttonSkip = Titanium.UI.createButton({
	   title: 'Salir',
	   bottom: Ti.App.glebUtils._p(5),
	   left: Ti.App.glebUtils._p(15),
	   width: Ti.App.glebUtils._p(90),
	   height: Ti.App.glebUtils._p(40),
	   font: { fontSize: Ti.App.glebUtils._p(14)}
	});
	buttonSkip.addEventListener('click',function(){
		var activity = Titanium.Android.currentActivity;
    	activity.finish();
	});

	var buttonRight = Titanium.UI.createButton({
	   title: 'Fin',
	   bottom: Ti.App.glebUtils._p(5),
	   right: Ti.App.glebUtils._p(15),
	   width: Ti.App.glebUtils._p(90),
	   height: Ti.App.glebUtils._p(40),
	   font: { fontSize: Ti.App.glebUtils._p(14)}
	});
	buttonRight.addEventListener('click',function(){
		if (nick.value.length==""){
			var dialog = Ti.UI.createAlertDialog({
    			message: 'Has de introducir un nickname',
    			ok: 'Continuar',
    			title: 'Nickname incorrecto'
  				}).show();
				nick.focus();
		}
		else {
		    Ti.App.glebUtils.openActivityIndicator({"text":"Creando usuario ..."});
			Ti.API.info("GLEB - Registrando usuario en GLEB server");
            require("clients/glebAPI").registerClient();

			//require("plugins/pushACS").pushACS();
		}
	});

	Ti.App.addEventListener('gleb_registerClient_error',function(){
	    Ti.App.glebUtils.closeActivityIndicator();
	    var dialog = Ti.UI.createAlertDialog({
	        cancel: 0,
	        buttonNames: ['CANCEL', 'OK'],
	        message: '¿Desea reintentar el registro?',
	        title: 'Error en el registro'
	      });
	      dialog.addEventListener('click', function(e){
	        if (e.index === e.source.cancel){
	          Ti.API.info('The cancel button was clicked');
	        }
	        if (e.index === 1){
                Ti.App.glebUtils.openActivityIndicator({"text":"Creando usuario ..."});
				//require("plugins/pushACS").pushACS();
				require("clients/glebAPI").registerClient();
	        }
	      });
	      dialog.show();
	});

	view.add(header);
	view.add(paso);
	view.add(description);
	view.add(nick);
    view.add(buttonSkip);
    view.add(buttonRight);
    return view;
};
