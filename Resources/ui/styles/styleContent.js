exports.getStyleContent = function(params) {
    var style={};
    style.backgroundColor = params.backgroundColor || "transparent";
    
    //Referenciamos imagenes al resouce directory:
    var RegexUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (RegexUrl.test (params.backgroundImage)){
        //Ti.API.debug("GLEB - remote backgroundImage "+params.backgroundImage);
        style.backgroundImage = params.backgroundImage || "";       
    }
    else {
        //Ti.API.debug("GLEB - local backgroundImage "+Titanium.Filesystem.resourcesDirectory+params.backgroundImage);
        style.backgroundImage = Titanium.Filesystem.resourcesDirectory+params.backgroundImage || "";
    }   
            
    style.borderWidth   = params.borderWidth || 2;
    style.borderColor   = params.borderColor || "#000";
    style.color         = params.color || "#000";
    style.iconWidth     = params.iconWidth || 50;
    style.iconHeight    = params.iconHeight || 50;
    style.labelH1Size   = params.labelH1Size    || 16;
    style.labelH1Color  = params.labelH1Color   || "#000";
    
    if(params.labelH1TextAlign == "LEFT"){
        style.labelH1TextAlign = Titanium.UI.TEXT_ALIGNMENT_LEFT;
    }
    else if(params.labelH1TextAlign == "RIGHT"){
        style.labelH1TextAlign = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
    }
    else{
        style.labelH1TextAlign = Titanium.UI.TEXT_ALIGNMENT_CENTER;
    }
    
    if(params.labelH1VerticalAlign == "TOP"){
        style.labelH1VerticalAlign = Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP;
    }
    else if(params.labelH1VerticalAlign == "BOTTOM"){
        style.labelH1VerticalAlign = Titanium.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM;
    }
    else{
        style.labelH1VerticalAlign = Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER;
    }
    
    style.labelH1VerticalAlign  = Titanium.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM;
    style.labelH1Weight = params.labelH1Weight  || "normal";
    style.labelH2Size   = params.labelH2Size    || 12;
    style.labelH2Color  = params.labelH2Color   || "#000";
    style.labelH2Weight = params.labelH2Weight  || "normal";
    style.labelH3Size   = params.labelH3Size    || 12;
    style.labelH3Color  = params.labelH3Color   || "#000";
    style.labelH3Weight = params.labelH3Weight  || "normal";
    style.labelH4Size   = params.labelH4Size    || 12;
    style.labelH4Color  = params.labelH4Color   || "#000";
    style.labelH4Weight = params.labelH4Weight  || "normal";
    
    return style;
};

