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
			
	style.borderWidth = params.borderWidth || 0;
	style.borderColor = params.borderColor || "#000";
	style.color = params.color || "#000";
	style.iconWidth = params.iconWidth || 10;
	style.iconHeight = params.iconHeight || 5;
	style.labelH1Color = params.labelH1Color 	|| "#000";
	style.labelH1Style = params.labelH1Style 	|| "normal";
	style.labelH1Weight = params.labelH1Weight 	|| "normal";
	style.labelH2Color = params.labelH2Color 	|| "#000";
	style.labelH2Style = params.labelH2Style 	|| "normal";
	style.labelH2Weight = params.labelH2Weight 	|| "normal";
	style.labelH3Color = params.labelH3Color 	|| "#000";
	style.labelH3Style = params.labelH3Style 	|| "normal";
	style.labelH3Weight = params.labelH3Weight 	|| "normal";
	style.labelH4Color = params.labelH4Color 	|| "#000";
	style.labelH4Style = params.labelH4Style 	|| "normal";
	style.labelH4Weight = params.labelH4Weight 	|| "normal";
	
	return style;
};

