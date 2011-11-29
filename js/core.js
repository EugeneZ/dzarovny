// hide semantic elements we don't want when the JS is on
window.addEvent('domready', function(){
	// enable js-only CSS
	document.getElement('body').addClass('js');
	
	// accordion
	new Fx.Accordion($$('nav > ul > li > a:not(.single)'), $$('nav ul li ul'), {
		display: -1
	});
	
	// reposition menu
	var navPosition = function(){
		var nav        = document.id('navWrapper');
		var logo       = document.getElement('nav h1');
		var menu       = document.getElement('nav ul').setStyle('position', 'absolute').setStyle('top', 0);
		var windowSize = window.getSize();
		var imageSize  = document.getElement('#main ul li ul li').getSize().x;
		var menuSize   = nav.measure(function(){ return menu.getSize().y; });
		var logoMargin = (windowSize.y - logo.getSize().y) / 2;
		var menuMargin = (windowSize.y - menuSize) / 2;
		var navWidth   = (windowSize.x - imageSize) / 2; 
		
		logo.setStyle('margin-top', logoMargin);
		menu.setStyle('margin-top', menuMargin);
		nav .setStyle('width'     , navWidth);
	};
	navPosition();
	
	// do smart objects
	var portfolio = new Portfolio('portfolio');
	var nav = new Navigation('nav');
	
	window.addEvent('resize', function(){
		navPosition();
		portfolio.setCache();
		portfolio.configureMargins();
		if (portfolio.active){
			portfolio.goto(portfolio.find(portfolio.active));
		}
	});
});