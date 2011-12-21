var DZarovny = {
	// variables and caches
	sampleImage: false,
	loaded: false,
	navEl : null,
	
	domready: function(){
		document.getElement('body').addClass('js');
		DZarovny.navEl        = document.id('navWrapper');
		DZarovny.portfolio    = new Portfolio('portfolio', { 'instructions': 'Use keyboard to navigate.</br>Lower right corner for info.'}); //<-- put html between the quotes there to have it appear in the instructions
		DZarovny.nav          = new Navigation('nav');
		DZarovny.nav.progress.fade('hide').store('DZarovny.firstclick', false);
		
		DZarovny.portfolio.addEvent('navigate', function(x, y){
			var progressEl    = DZarovny.nav.progress.getElement('#longbar');
			var progressWidth = progressEl.getParent().getSize().x;
			var percent       = DZarovny.portfolio.getProgressPercent();
			progressEl.tween('margin-left', (progressWidth * percent).round() + ((DZarovny.portfolio.getProgressStep() * progressWidth) * percent).ceil().limit(0, progressWidth - progressEl.getSize().x));
			
			DZarovny.nav.progress.getElement('#category').set('text', DZarovny.portfolio.getCategoryName());
			
			DZarovny.nav.hide();
			
			// first click, reshow the progress element
			if (!DZarovny.nav.progress.retrieve('DZarovny.firstclick', false)) {
				DZarovny.nav.progress.fade('in');
				DZarovny.nav.progress.store('DZarovny.firstclick', true);
			}
		});
		
		DZarovny.initNav(true);
		DZarovny.initMenu();
		DZarovny.initProgress();
		DZarovny.initMoreInfo();
	},
	
	load: function(){
		DZarovny.loaded = true;
		DZarovny.initNav(true);
		DZarovny.removeProgress();
		DZarovny.portfolio.configureMargins();
	},
	
	resize: function(){
		DZarovny.initNav();
		DZarovny.portfolio.setCache();
		DZarovny.portfolio.configureMargins();
		if (DZarovny.portfolio.active){
			DZarovny.portfolio.go(DZarovny.portfolio.active);
		}
	},
	
	initNav: function(firstrun){
		var logo       = DZarovny.navEl.getElement('nav h1');
		var menu       = DZarovny.navEl.getElement('nav ul').setStyle('position', 'absolute').setStyle('top', 0);
		var windowSize = window.getSize();
		var menuSize   = DZarovny.navEl.measure(function(){ return menu.getSize().y; });
		var logoMargin = (windowSize.y - logo.getSize().y) / 2;
		var menuMargin = (windowSize.y - menuSize) / 2;

		logo.setStyle('margin-top', logoMargin);
		menu.setStyle('margin-top', menuMargin);
		
		if (firstrun){ 
			logo.fade('hide');
		}
		
		if (DZarovny.sampleImage) {
			var imageSize  = DZarovny.sampleImage.getElement('!li').getSize().x;
			var navWidth   = (windowSize.x - imageSize) / 2;
			
			if (firstrun){
				DZarovny.navEl.setStyle('width', navWidth);
				logo.fade('in');
			} else {
				DZarovny.navEl.tween('width', navWidth);
			}
		};
	},
	
	initMenu: function(){
		DZarovny.menu = new Fx.Accordion($$('nav > ul > li > a:not(.single)'), $$('nav ul li ul'), {
			display: -1
		});
	},
	
	initProgress: function(){
		DZarovny.portfolio.el.getElements('ul li ul').each(function(category){
			var menuItem = DZarovny.navEl.getElement('a[href$=' + category.getPrevious().getElement('a').get('name') + ']');
			var imgs = category.getElements('img');
			var total = 0;
			
			if (menuItem){
				imgs.each(function(img){
					img.addEvent('load', function(){
						
						// after the first image is loaded, we now know about the image dimensions (other code uses this flag)
						if (!DZarovny.sampleImage){
							DZarovny.sampleImage = this;
							DZarovny.initNav(true);
						}
						
						// grow progress while categories are loading
						if (!DZarovny.loaded){
							var percent = String.from(((total++/imgs.length) * 100).round());
							if (percent.length == 1){
								percent = '0' + percent;
							}
							menuItem.retrieve('percent', new Element('span.percent')).inject(menuItem).set('text', percent);
						}
					});
				});
			}
		});
	},
	
	removeProgress: function(){
		DZarovny.navEl.getElements('span.percent').destroy();
	},
	
	initMoreInfo: function(){
		DZarovny.portfolio.el.getElements('img').each(function(img){
			if (!img.retrieve('DZarovny.infotab')){
				var text    = img.getElement('! a ~ p');
				if (text){
					text.fade('hide');
					var infotab = new Element('div.infotab').inject(text.getParent(), 'top')
						.addEvents({
							'mouseenter': function(){
								text.fade('in');
							},
							'mouseleave': function(){
								text.fade('out');
							}
						});
					
					img.store('DZarovny.infotab', infotab);
				}
			}
		});
	}
};

window.addEvent('domready', DZarovny.domready);
window.addEvent('load'    , DZarovny.load);
window.addEvent('resize'  , DZarovny.resize);