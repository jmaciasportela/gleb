var _windowStack = [];
var _navGroup = null;

exports.open = function(/*Ti.UI.Window*/windowToOpen) {
	Ti.API.log("Open function.");
	//add the window to the stack of windows managed by the controller
	_windowStack.push(windowToOpen);
	Ti.API.log("Tamano justo después de hacer un push = " + _windowStack.length);

	windowToOpen.addEventListener('close', function() {
		Ti.API.log("Event 'close': " + this.title);
		_windowStack.pop();
		Ti.API.log("Tamano justo después de hacer un pop = " + _windowStack.length);
		
		// close dependent window ?
		if (this.toClose) {
			 Ti.API.log("Invoke close on dependent window:" + this.toClose.title);
			 // close "parent" window, do not use animation (it looks wierd with animation)
			 (_navGroup) ? _navGroup.close(this.toClose, {animated : false}) : this.toClose.close();
		}
		
		Ti.API.log("End event 'close'. Stack: " + _windowStack.map(function(v) {return v.title}));
	});
	
	windowToOpen.addEventListener('set.to.close', function(dict) {
		Ti.API.log("Event 'set.to.close': " + this.title);
		this.toClose = dict.win;
	});

	//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
	windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;

	//This is the first window
	if (_windowStack.length === 1) {
		if (Ti.Platform.osname === 'android') {
			windowToOpen.exitOnClose = true;
			windowToOpen.open();
		} else {
			_navGroup = Ti.UI.iPhone.createNavigationGroup({
				window : windowToOpen
			});
			var containerWindow = Ti.UI.createWindow();
			containerWindow.add(_navGroup);
			containerWindow.open();
		}
	}
	//All subsequent windows
	else {
		if (Ti.Platform.osname === 'android') {
			windowToOpen.open();
		} else {
			_navGroup.open(windowToOpen);
		}
	}
	Ti.API.log("End Open. Stack: " + _windowStack.map(function(v) {return v.title}));
};

//go back to the initial window of the NavigationController
exports.home = function() {
	Ti.API.log("Home function.");
	if (_windowStack.length > 1) {
		// setup chain reaction
		for (var i = _windowStack.length - 1; i > 1; i--)
			// set dependent window
			_windowStack[i].fireEvent('set.to.close', {win: _windowStack[i - 1]});
        
        // start chain reaction, close first window
		(_navGroup) ? _navGroup.close(_windowStack[_windowStack.length - 1]) : _windowStack[_windowStack.length - 1].close();
	}
	Ti.API.log("End Home. Stack: " + _windowStack.map(function(v) {return v.title}));
};
