/**
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

var bulb;
var status;
var date;

exports._get = function(){  

Ti.API.info('GLEB - Cargando msgView View');
	// create UI components
	var view = Ti.UI.createView({		
		backgroundImage: '../../images/statusBar.png',
		height: Ti.App.glebUtils._p(40),		
		touchEnabled: true,
		borderRadius: 0
	});

    bulb = Ti.UI.createImageView({
        top: Ti.App.glebUtils._p(5),
        left: Ti.App.glebUtils._p(30),
        width: Ti.App.glebUtils._p(32),
        height: Ti.App.glebUtils._p(32),
        image: '../../images/bulb_red.png'
    });

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

    view.add(bulb);
    view.add(status);
    view.add(date);		
	view.add(buttonLeft);
	view.add(buttonRight);
    return view;
}

exports.setStatus = function(text){
    Ti.API.debug('GLEB - STATUS BAR - Set '+text);
    if (text == "online"){
        status.text = "ONLINE";
        status.color = "#23FF17";
        bulb.image = '../../images/bulb_green.png';
    }
    else if (text=="not online"){
        status.text = "NOT ONLINE";
        status.color = "red";
        bulb.image = '../../images/bulb_red.png';
    }
    
    var d = Ti.App.glebUtils.getCurrentDate();
    date.text = "Ultima actualización: "+ d[0] + "-" + d[1] + "-"+ d[2] + " a las "+ d[3]+":" + d[4] 
}
/*
exports.setLastUpdate = function(){    
    var d = Ti.App.glebUtils.getCurrentDate();
    date.text = "Ultima actualización: "+ d[0] + "-" + d[1] + "-"+ d[2] + " a las "+ d[3]+":" + d[4]
}
*/