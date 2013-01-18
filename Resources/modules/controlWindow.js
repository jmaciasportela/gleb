/**
* Module to control window stack
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

var windows = [];

exports.createWindow = function (content){

    var win = new Titanium.UI.createWindow({
              orientationModes : [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT],
           });    
    if (content != null) win.add (content);
    win.addEventListener('android:back', function(){
        if (windows.length >0){   
            windows[windows.length - 1].close();  
            Ti.App.glebUtils.machaca(windows[windows.length - 1]);   
            windows[windows.length - 1] = null;        
            windows.pop();
            Ti.API.debug("GLEB - UICONTROL - Quedan ventanas: " + windows.length);  
        }
        else{
            alert("Use el boton home de su terminal");
        }
    });    
    windows.push(win);   
    Ti.API.debug("GLEB - UICONTROL - Current windows length: " + windows.length);
    return win;        
}

exports.getWindowsLenght = function() { 
return windows.length;    
}

exports.closeWindow = function(id) { 
    windows[id].close();
    Ti.App.glebUtils.machaca(windows[id]);
    windows[id] = null;        
    windows.splice(id,1);
}
