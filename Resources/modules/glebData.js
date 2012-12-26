/**
* Module to control gleb JSON stack
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

var data;
var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'ui');                     
var f = Titanium.Filesystem.getFile(uiDir.resolve(), "gui.json");

//Comprueba si existen datos globales
exports.checkGUI = function(){    
    if (f.exists()) return true;
    else return false;
}

exports.getGUI = function(){    
    if (f.exists()){
        var content = f.read();
        data = JSON.parse(content.text); //UI JSON
        return data;
    }
    return null;
}

// POR REVISAR
exports.setGUI = function(){    
    if (f.exists()) return true;
    else return false;
}

// POR REVISAR
exports.updateGUI = function(){
    if (f.exists()) return true;
    else return false;
}


