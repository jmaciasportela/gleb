/**
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

var bulb;
var status;
var date;

exports._get = function(){  

Ti.API.debug('GLEB - Cargando status View');
	// create UI components
	var view = Ti.UI.createView({		
		backgroundImage: '../../images/statusBar.png',
		height: Ti.App.glebUtils._p(40),		
		touchEnabled: true,
		borderRadius: 0
	});

    acs = Ti.UI.createImageView({
        top: Ti.App.glebUtils._p(0),
        left: Ti.App.glebUtils._p(30),
        width: Ti.App.glebUtils._p(100),
        height: Ti.App.glebUtils._p(40),
        image: '../../images/ACS_off.png'
    });
    
    gcm = Ti.UI.createImageView({
        top: Ti.App.glebUtils._p(0),
        right: Ti.App.glebUtils._p(25),
        width: Ti.App.glebUtils._p(110),
        height: Ti.App.glebUtils._p(40),
        image: '../../images/GCM_off.png'
    });    
/*
    status = Ti.UI.createLabel({
        name:"latitud",
        color:'red',
        text:'NOT ONLINE',
        height:'auto',
        width:Ti.App.glebUtils._p(80),
        top:Ti.App.glebUtils._p(4),
        left:Ti.App.glebUtils._p(75),
        shadowColor:'#000',
        shadowOffset:{x:Ti.App.glebUtils._p(3),y:Ti.App.glebUtils._p(3)},       
        font:{fontSize:Ti.App.glebUtils._p(14)},
        textAlign:'left'      
        });

    var d = Ti.App.glebUtils.getCurrentDate();

    date = Ti.UI.createLabel({
        name:"latitud",
        color:'#fff',
        text: "Ultima actualización: "+ d[0] + "-" + d[1] + "-" + d[2] + " a las "+ d[3] + ":" + d[4], 
        height:'auto',
        width:Ti.App.glebUtils._p(200),
        top:Ti.App.glebUtils._p(20),
        left:Ti.App.glebUtils._p(75),
        shadowColor:'#000',
        shadowOffset:{x:Ti.App.glebUtils._p(3),y:Ti.App.glebUtils._p(3)},       
        font:{fontSize:Ti.App.glebUtils._p(10)},
        textAlign:'left'      
        });           		
		
	var buttonLeft = Titanium.UI.createButton({   		
		backgroundColor: 'transparent',
   		top: '0dp',
   		width: '40dp',
   		height: '40dp',
   		left: '0dp'
		});
		buttonLeft.addEventListener('click',function(){require("ui/statusBar").statusBarToLeft();});	
	
				
	var buttonRight = Titanium.UI.createButton({   		
		backgroundColor: 'transparent',
   		top: '0dp',
   		width: '40dp',
   		height: '40dp',
   		left: '290dp'
		});
		buttonRight.addEventListener('click',function(){require("ui/statusBar").statusBarToRight();});
*/
    view.add(acs);
    view.add(gcm);
    /*
    view.add(status);
    view.add(date);		
	view.add(buttonLeft);
	view.add(buttonRight);
	*/
    return view;
}

exports.setStatusACS = function(text){
    Ti.API.debug('GLEB - Cargando status View ACS:'+text);
    if (text == "online"){
        acs.image = '../../images/ACS_on.png';
    }
    else if (text=="not online"){        
        acs.image = '../../images/ACS_off.png';
    } 
}

exports.setStatusGCM = function(text){    
    Ti.API.debug('GLEB - Cargando status View GCM:'+text);
    if (text == "online"){     
        gcm.image = '../../images/GCM_on.png';
    }
    else if (text=="not online"){        
        gcm.image = '../../images/GCM_off.png';
    } 
}


/*
exports.setLastUpdate = function(){    
    var d = Ti.App.glebUtils.getCurrentDate();
    date.text = "Ultima actualización: "+ d[0] + "-" + d[1] + "-"+ d[2] + " a las "+ d[3]+":" + d[4]
}
*/