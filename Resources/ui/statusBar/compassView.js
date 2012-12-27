/**
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

module.exports = function(){  
	
Ti.API.info('GLEB - Cargando Compass View');
	// create UI components
	var view = Ti.UI.createView({		
		backgroundImage: '../../images/statusBar.png',
		height: Ti.App.glebUtils._p(40),		
		touchEnabled: true,
		borderRadius: 0
	});

	var flecha = Ti.UI.createImageView({
		top: Ti.App.glebUtils._p(5),
		left: Ti.App.glebUtils._p(40),
		width: Ti.App.glebUtils._p(32),
		height: Ti.App.glebUtils._p(32),
  		image: '../../images/flecha.png'
	});
	
	var flecha2 = Ti.UI.createImageView({
		top: Ti.App.glebUtils._p(5),
		right: Ti.App.glebUtils._p(40),
		width: Ti.App.glebUtils._p(32),
		height: Ti.App.glebUtils._p(32),
  		image: '../../images/flecha.png'
	});
		
	var orientacion = Ti.UI.createLabel({
		name:"Compass",
		color:'#fff',
		text:'Compass',
		height:'auto',
		width:Ti.App.glebUtils._p(80),
        top:Ti.App.glebUtils._p(20),
        left:Ti.App.glebUtils._p(120),
    	shadowColor:'#000',
    	shadowOffset:{x:Ti.App.glebUtils._p(3),y:Ti.App.glebUtils._p(3)},    	
    	font:{fontSize:Ti.App.glebUtils._p(18),fontWeight:"bold"},
    	textAlign:'center'		
		});
	var orientacion_value = Ti.UI.createLabel({
		name:"latitud_value",
		text: Ti.App.Properties.getInt('initialDegrees').toString().split(".")[0]+"º",
		color:'#fff',		
		height:'auto',
		width:Ti.App.glebUtils._p(200),
        top:'0dp',
        left:Ti.App.glebUtils._p(60),
    	shadowColor:'#000',
    	shadowOffset:{x:Ti.App.glebUtils._p(3),y:Ti.App.glebUtils._p(3)},    	
    	font:{fontSize:Ti.App.glebUtils._p(30),fontWeight:"bold"},
    	textAlign:'center'		
		});	
	
	var buttonLeft = Titanium.UI.createButton({   		
		backgroundColor: 'transparent',
		top: Ti.App.glebUtils._p(0),
		width: Ti.App.glebUtils._p(40),
		height: Ti.App.glebUtils._p(40),
		left: Ti.App.glebUtils._p(25)
		});
		buttonLeft.addEventListener('click',function(){require("ui/statusBar").statusBarToLeft();});	

			
	var buttonRight = Titanium.UI.createButton({   		
		backgroundColor: 'transparent',
		top: Ti.App.glebUtils._p(0),
		width: Ti.App.glebUtils._p(40),
		height: Ti.App.glebUtils._p(40),
		left: Ti.App.glebUtils._p(290)
		});
		buttonRight.addEventListener('click',function(){require("ui/statusBar").statusBarToRight();});			
		
		var initialDegrees  = Ti.App.Properties.getInt('initialDegrees');
		
	//view.add(orientacion);
	view.add(orientacion_value);
	view.add(flecha);
	view.add(flecha2);
	view.add(buttonRight);
	view.add(buttonLeft);
	
	var moving = false;
	var last = 0;	
	Ti.App.addEventListener("gleb_compassUpdated",function(e){	
		
        Titanium.API.debug("GLEB - moving:"+moving+"  last:"+last+"  e:"+e.value);
	   	orientacion_value.text = e.value.toString().split(".")[0]+"º";
	    if (!moving){
	    	moving = true;
		    var t = Ti.UI.create2DMatrix();
			t = t.rotate(last,-e.value);			
			flecha.animate({transform:t,duration:200,autoreverse:false}, function(){moving = false;});
			flecha2.animate({transform:t,duration:200,autoreverse:false}, function(){moving = false;});
			last = -e.value;
			}
	});
		

return view;
}
