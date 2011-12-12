var DZarovny = {
	// variables and caches
	loaded: false,
	navEl : null,
	
	domready: function(){
		document.getElement('body').addClass('js');
		DZarovny.navEl        = document.id('navWrapper');
		DZarovny.portfolio    = new Portfolio('portfolio');
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
		
		DZarovny.initNav();
		DZarovny.initMenu();
		DZarovny.initProgress();
	},
	
	load: function(){
		DZarovny.loaded = true;
		DZarovny.initNav();
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
	
	initNav: function(){
		var logo       = DZarovny.navEl.getElement('nav h1');
		var menu       = DZarovny.navEl.getElement('nav ul').setStyle('position', 'absolute').setStyle('top', 0);
		var windowSize = window.getSize();
		var menuSize   = DZarovny.navEl.measure(function(){ return menu.getSize().y; });
		var logoMargin = (windowSize.y - logo.getSize().y) / 2;
		var menuMargin = (windowSize.y - menuSize) / 2;

		logo.setStyle('margin-top', logoMargin);
		menu.setStyle('margin-top', menuMargin);
		
		if (DZarovny.loaded) {
			var imageSize  = document.getElement('#main ul li ul li').getSize().x;
			var navWidth   = (windowSize.x - imageSize) / 2;
			DZarovny.navEl.tween('width', navWidth);
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
					new Asset.image(img.src, { events: { load: function(){
						if (!DZarovny.loaded){
							var percent = String.from(((total++/imgs.length) * 100).round());
							if (percent.length == 1){
								percent = '0' + percent;
							}
							menuItem.retrieve('percent', new Element('span.percent')).inject(menuItem).set('text', percent);
						}
					} }});
				});
			}
		});
	},
	
	removeProgress: function(){
		DZarovny.navEl.getElements('span.percent').destroy();
	}
};

window.addEvent('domready', DZarovny.domready);
window.addEvent('load'    , DZarovny.load);
window.addEvent('resize'  , DZarovny.resize);