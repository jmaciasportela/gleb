/**
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

module.exports = function(){  
    	
	// create UI components
	var view = Ti.UI.createView({		
		backgroundImage: '../../images/statusBar.png',
		height: Ti.App.glebUtils._p(40),		
		touchEnabled: true,
		borderRadius: 0
	});

	var recarga = Titanium.UI.createButton({   		
   		top: Ti.App.glebUtils._p(4),
   		title: "Recarga",   		
   		left: Ti.App.glebUtils._p(30),   		
   		height: Ti.App.glebUtils._p(36),
   		width: Ti.App.glebUtils._p(120),   		
		});
		recarga.addEventListener('click',function(){	
	   		require("modules/initFlow").gleb_reInit();	   				
		});	

    var salir = Titanium.UI.createButton({        
        top: Ti.App.glebUtils._p(4),
        title: "Salir",                
        right: Ti.App.glebUtils._p(30),
        height: Ti.App.glebUtils._p(36),
        width: Ti.App.glebUtils._p(120),
        });
        salir.addEventListener('click',function(){
            require('plugins/newgps').stop(); 
            require("modules/initFlow").servicioGLEBSTOP();
            var activity = Titanium.Android.currentActivity;
            activity.finish();      
        });	
		
	// assemble view hierarchy
	view.add(recarga);
    view.add(salir);	
    return view;
}
