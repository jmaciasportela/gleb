module.exports= function(){

	var view = Ti.UI.createView({
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 5,
		opacity: 1,
		backgroundColor: 'transparent'
		});

	view.msisdn = function (num){
		Ti.API.info('GLEB - Metiendo el telefono en la vista 2 del wizard');
		description2.text ="+34 "+ num;
	}

	var header = Ti.UI.createImageView({
  		image:'../../images/wizard_header.png',
  		backgroundColor: 'transparent',
		height:Ti.App.glebUtils._p(60),
		width:Ti.App.glebUtils._p(320),
		top: Ti.App.glebUtils._p(0),
		left: Ti.App.glebUtils._p(0)
	});

	var paso = Ti.UI.createLabel({
		text:'Paso 2 de 3',
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
		font: { fontSize: Ti.App.glebUtils._p(14) },
		text: 'Se ha enviado un código de validación al telefono:',
		height:'auto',
		width:'auto',
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});

	var description2 = Ti.UI.createLabel({
		color:'#fff',
		top: Ti.App.glebUtils._p(130),
		font: { fontSize: Ti.App.glebUtils._p(20) },
		text: "",
		height:'auto',
		width:'auto',
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});


	function reFresh()
	{
	  description2.text = "+34 "+Ti.App.Properties.getString("telf");
	}
	var repeticion = setInterval(reFresh,333);

	var description3 = Ti.UI.createLabel({
		color:'#fff',
		top: Ti.App.glebUtils._p(170),
		font: { fontSize: Ti.App.glebUtils._p(14) },
		text: 'Esto puede tardar unos segundos',
		height:'auto',
		width:'auto',
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});



	var labelCode = Ti.UI.createLabel({
		text:'Introduzca el código recibido',
		top:Ti.App.glebUtils._p(200),
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white',
		font: { fontSize:Ti.App.glebUtils._p(16)}
		});

	var code = Ti.UI.createTextField({
		color: 'black',
        top: Ti.App.glebUtils._p(230),
        font: { fontSize:Ti.App.glebUtils._p(14)},
        width: Ti.App.glebUtils._p(100),
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        keyboardType: Titanium.UI.KEYBOARD_PHONE_PAD,
        hintText: "Código",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER
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
	   title: 'Sig',
	   bottom: Ti.App.glebUtils._p(5),
	   right: Ti.App.glebUtils._p(15),
	   width: Ti.App.glebUtils._p(90),
	   height: Ti.App.glebUtils._p(40),
	   font: { fontSize: Ti.App.glebUtils._p(14)}
	});
	buttonRight.addEventListener('click',function(){
		if (code.value.length!=4){
			var dialog = Ti.UI.createAlertDialog({
    			message: 'Has de introducir el código correctamente',
    			ok: 'Continuar',
    			title: 'Código incorrecto'
  				}).show();
				code.focus();
		}
		else {
			clearInterval(repeticion);
            Ti.App.glebUtils.openActivityIndicator({"text":"Enviando código ..."});
			require("clients/glebAPI").validate(code.value,Ti.App.Properties.getString("telf"));
		}
	});

	view.add(header);
	view.add(paso);
	view.add(description);
	view.add(description2);
	view.add(description3);
	view.add(labelCode);
	view.add(code);
    view.add(buttonSkip);
    view.add(buttonRight);
    return view;
};
