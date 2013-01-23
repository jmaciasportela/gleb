var _windowStack = [];
var _navGroup = null;

exports.open = function(windowToOpen) {
	Ti.API.debug("Open function.");
	//add the window to the stack of windows managed by the controller
	_windowStack.push(windowToOpen);
	Ti.API.debug("Tamano justo después de hacer un push = " + _windowStack.length);

	windowToOpen.addEventListener('close', function() {
		Ti.API.debug("Event 'close': " + this.title);
		_windowStack.pop();
		Ti.API.debug("Tamano justo después de hacer un pop = " + _windowStack.length);

		// close dependent window ?
		if (this.toClose) {
			 Ti.API.debug("Invoke close on dependent window:" + this.toClose.title);
			 // close "parent" window, do not use animation (it looks wierd with animation)
			 (_navGroup) ? _navGroup.close(this.toClose, {animated : false}) : this.toClose.close();
		}
		
		Ti.API.debug("End event 'close'. Stack: " + _windowStack.map(function(v) {return v.title}));
	});

	windowToOpen.addEventListener('set.to.close', function(dict) {
		Ti.API.debug("Event 'set.to.close': " + this.title);
		this.toClose = dict.win;
	});

	//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
	windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;

	//This is the first window
	if (_windowStack.length === 1) {
		if (Ti.Platform.osname === 'android') {
			windowToOpen.exitOnClose = false;
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
	Ti.API.debug("End Open. Stack: " + _windowStack.map(function(v) {return v.title}));
};

//go back to the initial window of the NavigationController
exports.home = function() {
	Ti.API.debug("Home function.");
	if (_windowStack.length > 1) {
		// setup chain reaction
		for (var i = _windowStack.length - 1; i > 1; i--)
			// set dependent window
			_windowStack[i].fireEvent('set.to.close', {win: _windowStack[i - 1]});

        // start chain reaction, close first window
		(_navGroup) ? _navGroup.close(_windowStack[_windowStack.length - 1]) : _windowStack[_windowStack.length - 1].close();
	}
	Ti.API.debug("End Home. Stack: " + _windowStack.map(function(v) {return v.title}));
};


exports.clean = function() {
    Ti.API.debug("Clean function.");
    if (_windowStack.length > 1) {
        // setup chain reaction
        for (var i = _windowStack.length - 1; i > 1; i--)
            // set dependent window
            _windowStack[i].fireEvent('set.to.close', {win: _windowStack[i - 1]});

        // start chain reaction, close first window
        (_navGroup) ? _navGroup.close(_windowStack[_windowStack.length - 1]) : _windowStack[_windowStack.length - 1].close();
    }
    _windowStack[0].close();
    _windowStack.pop();
    _windowStack = null;
    _navGroup = null;
    _windowStack = [];
};


//go back to the initial window of the NavigationController
exports.length = function() {
    return _windowStack.length;
};

