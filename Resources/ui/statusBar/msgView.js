/**
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

module.exports = function(){  

Ti.API.info('GLEB - Cargando msgView View');
	// create UI components
	var view = Ti.UI.createView({		
		backgroundImage: '../../images/statusBar.png',
		height: '40dp',		
		touchEnabled: true,
		borderRadius: 0
	});

	var status_label = Ti.UI.createLabel({
		name:"status_value",
		text:"Estado",
		color:'#fff',		
		height:'auto',
		width:'45dp',
        top:'5dp',
        left:'28dp',
    	shadowColor:'#000',
    	shadowOffset:{x:3,y:3},    	
    	font:{fontSize:20},
    	textAlign:'center'		
		});

	var msg_label = Ti.UI.createLabel({
		name:"msg_value",
		text:"Preparado",
		color:'#fff',		
		height:'auto',
		width:'225dp',
        top:'5dp',
        left:'59dp',
    	shadowColor:'#000',
    	shadowOffset:{x:3,y:3},    	
    	font:{fontSize:20},
    	textAlign:'center'		
		});
		
		
	// assemble view hierarchy
	view.add(status_label);
	view.add(msg_label);

		
	Ti.API.info('GLEB - Elementos añadidos a la vista');

	Ti.App.addEventListener("gleb_showMSG_txt",function(e){
		Ti.API.info("GLEB - Event gleb_showMSG - "+JSON.stringify(e));
		msg_label.text  = e;
	});



return view;
}
