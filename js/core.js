var DZarovny = {
	// variables and caches
	sampleImage: false,
	loaded     : false,
	navEl      : null,
	
	domready: function(){
		document.getElement('body').addClass('js');
		DZarovny.navEl        = document.id('navWrapper');
		DZarovny.portfolio    = new Portfolio('portfolio', { 'instructions': 
			'<img src="images/Style/keys.png"/></br>Use your keyboard arrows to navigate and hold the spacebar to display info.'
		}); //<-- put html above to have it appear in the instructions
		DZarovny.nav          = new Navigation('nav');
		DZarovny.nav.progress.fade('hide').store('DZarovny.firstclick', false);
		
		DZarovny.portfolio.addEvent('navigate', function(x, y){
			var progressEl    = DZarovny.nav.progress.getElement('#bullet');
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
			
			// if ther spacebar is being held down, show the info right away
			if (DZarovny.keydown){
				DZarovny.moreInfoShow();
				DZarovny.keydown = false;
			}
		});
		
		DZarovny.initNav(true);
		DZarovny.initMenu();
		DZarovny.initProgress();
		DZarovny.initMoreInfo();
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
	
	initNav: function(firstrun){
		var logo       = DZarovny.navEl.getElement('nav h1');
		var menu       = DZarovny.navEl.getElement('nav ul').setStyle('position', 'absolute').setStyle('top', 0);
		var windowSize = window.getSize();
		
		if (firstrun){
			logo.fade('hide');
		}
		
		if (DZarovny.sampleImage) {
			var imageSize  = DZarovny.sampleImage.getElement('!li').getSize();
			var navWidth   = ((windowSize.x - imageSize.x) / 2);
			var navMargin  = ((windowSize.y - imageSize.y) / 2) - (imageSize.y * 0.2); //<-- percent offset from the top of the image
			
			if (firstrun){
				DZarovny.navEl.setStyles({
					'width'     : navWidth,
					'margin-top': navMargin
				});
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
		DZarovny.portfolio.el.getElements('ul > li > ul').each(function(category){
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
							var percent = String.from(((++total/imgs.length) * 100).round());
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
				var text    = img.getElement('! a ~ div');
				if (text){
					text.fade('hide');
					var infotab = new Element('span.infotab').inject(text.getParent(), 'top').store('DZarovny.text', text)
						.addEvents({
							'click': function(){
								if (!this.retrieve('DZarovny.clicked', false)){
									this.store('DZarovny.clicked', true);
									text.fade('in');
								} else {
									this.store('DZarovny.clicked', false);
									text.fade('out');
								}
							}
						});
					
					img.store('DZarovny.infotab', infotab);
				}
			}
		});
		
		DZarovny.keydown = false;
		
		window.addEvent('keydown', function(e){
			if (e.key == 'space'){
				e.preventDefault();
				if (!DZarovny.keydown){
					DZarovny.moreInfoShow();
					DZarovny.keydown = true;
					DZarovny.spacePressed = true;
				}
			}
		});
		
		window.addEvent('keyup', function(e){
			if (e.key == 'space'){
				e.preventDefault();
				DZarovny.moreInfoHide();
				DZarovny.keydown = false;
			}
		});
		
	},
	
	moreInfoShow: function(){
		var el = DZarovny.portfolio.getCurrentSlide().getElement('span.infotab');
		if (el && !el.retrieve('DZarovny.clicked', false)){
			el.store('DZarovny.clicked', true);
			el.retrieve('DZarovny.text').fade('in');
		}
	},
	
	moreInfoHide: function(){
		var el = DZarovny.portfolio.getCurrentSlide().getElement('span.infotab');
		if (el && el.retrieve('DZarovny.clicked', false)){
			el.store('DZarovny.clicked', false);
			el.retrieve('DZarovny.text').fade('out');
		}
	}
};

window.addEvent('domready', DZarovny.domready);
window.addEvent('load'    , DZarovny.load);
window.addEvent('resize'  , DZarovny.resize);

// preload background image so that it loads faster (relies on JS being in the head tag)
new Asset.image('images/black_paper.png'); // should be the same background image from the top of type.css
