/**
 * Return a refresh bar
 */

module.exports = function(){  
	//PULL VIEW ROW PARA EL REFRESCO DE LA VISTA
	var row = Ti.UI.createView({
	        width: "100%",
	        height: Ti.App.glebUtils._p(60),
	        backgroundColor: '#90EE90',
	        color:"#BFBFBF"
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
	    text:"Desliza hacia abajo para refrescar",
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
	
	row.add (arrow);
	row.add (arrow2);
	row.add (statusLabel);
	row.add (lastUpdatedLabel);

	return row;
};

//Función privada del módulo para obtener la fecha del sistema
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

    
//Registramos un evento posicionar correctamente el scrollView después de cada refresco   
Ti.App.addEventListener('setPullDownScroll',function(e){
    if (e.name==params.name){
        Ti.API.debug('GLEB - LIST setPullDownScroll EVENT DONE');
        scrollView.scrollTo(0,Ti.App.glebUtils._p(60));
    }
});     

module.exports.addListenersRefreshBar = function (row, scrollView, containerView){     
        // update the offset value whenever scroll event occurs
        var offset = 0;
        // Para controlar cuando se está mostrando el row del PULL VIEW
        var pulling = false;
        scrollView.addEventListener('scroll', function(e) {
            if (e.y!=null) {
                offset = e.y;
                Ti.API.debug('GLEB - LIST VIEW offset: '+offset+"pulling: "+pulling);               
                if (offset <= Ti.App.glebUtils._p(10) && !pulling){
                    pulling = true;  
                }       
                else if (offset == 0 && pulling)
                {           
                    row.getChildren()[2].text = "Suelta para refrescar...";
                    var t = Ti.UI.create2DMatrix();
                    t = t.rotate(-180);         
                    row.getChildren()[0].animate({transform:t,duration:300});
                    row.getChildren()[1].animate({transform:t,duration:300});     
                }
                else if (pulling && offset > Ti.App.glebUtils._p(10)){
                	pulling = false;
                    var t = Ti.UI.create2DMatrix();
                    t = t.rotate(0);
                    row.getChildren()[0].animate({transform:t,duration:300});
                    row.getChildren()[1].animate({transform:t,duration:300});
                    row.getChildren()[2].text = "Desliza hacia abajo para refrescar";
                }
            }   
        });             
        
        var intervalIsRunning = false;
        scrollView.addEventListener('touchend', function(e) {
        	if (!intervalIsRunning) {
		        //Ti.API.info('started');
		        intervalIsRunning = true;
		        var i = setInterval(function() {
		            if (e.y != offset) {
		                e.y = offset; 
		            } else {
		                clearInterval(i);
		                intervalIsRunning = false;
		                //Acciones a ejecutar cuando se para el scrollView
			            if (offset==Ti.App.glebUtils._p(0)) {
			                Ti.API.info('REFRESH !!!!');
			                containerView._refresh();               
			                scrollView.scrollTo(0,Ti.App.glebUtils._p(60));
			                row.getChildren()[3].text="Ultima actualización: "+formatDate();
			                row.getChildren()[2].text = "Desliza hacia abajo para refrescar";
			            }
			            else if (offset<Ti.App.glebUtils._p(60)){
			                scrollView.scrollTo(0,Ti.App.glebUtils._p(60));
			                Ti.API.info('Dont refresh, go back to base');
			            }
			        }
			   }, 50);
			} 
        });
};


