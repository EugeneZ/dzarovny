var Portfolio = new Class({
	Implements: [Options, Events],
	Binds: ['navigate', 'go', 'find', 'configureMargins', 'setCache', 'up', 'down', 'left', 'right'],
	options: {
		target      : window,
		classes     : ['active', 'inactive'],
		categories  : 'ul > li > ul',
		slides      : 'li',
		offset      : [0, 0],
		link        : 'cancel',
		instructions: '',
		altsize     : [1024, 768]
	},
	initialize: function(el, options){
		this.setOptions(options);
		this.el = $(el) || $$(el);
		this.busy = false;
		this.fx = new Fx.Scroll(this.options.target, {
			'link'   : this.options.link
		});
		
		this.setCache();
		this.attachMenu();
		this.attachNavEvents();
		this.attachEdges();
		this.configureMargins();
		
		this.fx.set(0,0);
		
		// hide until first click
		this.el.fade('hide');
		
		var showEvent = function(){
			this.el.fade('in');
			this.fx.removeEvent('complete', showEvent);
		}.bind(this);
		this.fx.addEvent('complete', showEvent);
	},
	
	setCache: function(){
		this.windowSize = window.getSize();
		this.categories = this.el.getElements(this.options.categories);
		this.categories.each(function(category){
			category.slides = category.getChildren(this.options.slides);
			category.slides.set('tween', { 'link': this.options.link });
			category.slides.set('morph', { 'link': this.options.link });
		}.bind(this));
	},
	
	attachMenu: function(){
		var body = document.getElement('body');
		
		body.getElements('nav ul li a').each(function(link){
			link.addEvent('click', function(e) {
				e.stop();
			  
			  	var href = link.get('href').substring(1);
			  	if (this.go(this.find(this.el.getElement('a[name=' + href + ']')))){
			  		if (!this.instructions) {
			  			this.instructions = new Element('div#instructions').inject(document.getElement('nav')).fade('hide').set('html', this.options.instructions);
			  			this.instructions.fade('in');
			  			if (DZarovny && DZarovny.nav) DZarovny.nav.attachFx(); // bad!
			  		}
			  	}

			}.bind(this));
		}.bind(this));
	},
	
	attachNavEvents: function(){
		this.keyboard = new Keyboard({
			'events': {
				'up'   : this.up,
				'down' : this.down,
				'left' : this.left,
				'right': this.right
			}
		}).activate();
		
		/*document.addEvent('mousewheel', function(e){
			if (e.wheel > 0){
				this.left();
			} else if (e.wheel < 0){
				this.right();
			}
		}.bind(this));*/
	},
	
	attachEdges: function(){
		this.el.getElements('ul > li > ul > li > a').each(function(a){
			a.adopt(
				new Element('a.left' ).addEvent('click', this.left),
				new Element('a.up'   ).addEvent('click', this.up),
				new Element('a.down' ).addEvent('click', this.down),
				new Element('a.right').addEvent('click', this.right)
			)
		}.bind(this));
	},
	
	// Scrolls
	navigate: function(x, y){
		var coords = Array.clone(this.active || [0, 0]);
		
		if (y != 0){
			coords[0] += y;
			coords[1] = 0;
		} else {
			coords[1] += x;
		}
		
		if (coords[0] < 0 || coords[0] >= this.categories.length || coords[1] < 0 || coords[1] >= this.categories[coords[0]].slides.length) {
			return false;
		}
		
		// on first use of the keyboard, we can destroy the instructions.
		if (typeOf(this.instructions) == 'element') {
			this.instructions.destroy();
			this.instructions = true;
		}
		
		return this.go(coords, true);
	},
	
	// Scrolls the window to the coords provided. Use this.find to get coords.
	// coords - Array. Contains two values, category index and slide index.
	// force  - boolean. If true, then the coords value is not sanity checked
	// returns: nothing
	go: function(coords, force) {
		// sanity check
		if (!force && (typeOf(coords) != 'array' || coords[0] < 0 || coords[0] >= this.categories.length || coords[1] < 0 || coords[1] >= this.categories[coords[0]].length)){
			return false;
		}
		
		// external stuff... not cool TODO: Fix this
		if (DZarovny && DZarovny.moreInfoHide && DZarovny.keydown){
			DZarovny.moreInfoHide();
		}
		
		this.active  = coords;
		var next     = this.categories[this.active[0]].slides[this.active[1]];
		var nextSize = next.getSize();
		var pos      = next.getPosition();
		
		var y        = pos.y + this.options.offset[1] -((this.windowSize.y - nextSize.y) / 2)
		
		if (this.windowSize.x > this.options.altsize[0]){
			var x = pos.x + this.options.offset[0] -((this.windowSize.x - nextSize.x) / 2);
		} else {
			var x = pos.x + this.options.offset[0] - (this.windowSize.x - nextSize.x);
		}
		
		this.fx.start(x, y);
		
		this.fadeSlides(coords);
		//this.resizeSlides(coords, false);
		
		this.fireEvent('navigate', coords);
		
		return true;
	},
	
	
	// Utility methods for navigating across quickly
	up: function(e){
		if (e) e.preventDefault();
		this.navigate(0, -1);
	},
	down: function(e){
		if (e) e.preventDefault();
		this.navigate(0, 1);
	},
	left: function(e){
		if (e) e.preventDefault();
		this.navigate(-1, 0);
	},
	right: function(e){
		if (e) e.preventDefault();
		this.navigate(1, 0);
	},
	
	fadeSlides: function(coords){
		// self
		this.fadeSlide(coords, 1);
		
		// corners one direction
		this.fadeSlide([coords[0] - 1, coords[1] - 1], 0);
		this.fadeSlide([coords[0] - 1, coords[1] + 1], 0);
		this.fadeSlide([coords[0] + 1, coords[1] - 1], 0);
		this.fadeSlide([coords[0] + 1, coords[1] + 1], 0);
		
		// remainder other direction
		this.fadeSlide([coords[0] - 1, coords[1]]    , 0.25);
		this.fadeSlide([coords[0]    , coords[1] + 1], 0.25);
		this.fadeSlide([coords[0] + 1, coords[1]]    , 0.25);
		this.fadeSlide([coords[0]    , coords[1] - 1], 0.25);
	},
	
	fadeSlide: function(coords, opacity){
		if (this.categories[coords[0]]){
			if (this.categories[coords[0]].slides[coords[1]]){
				this.categories[coords[0]].slides[coords[1]].tween('opacity', opacity);
			}
		}
	},
	
	resizeSlides: function(coords, reset){
		this.resizeSlide([coords[0] - 1, coords[1]], reset);
		this.resizeSlide([coords[0]    , coords[1] + 1], reset);
		this.resizeSlide([coords[0] + 1, coords[1]], reset);
		this.resizeSlide([coords[0]    , coords[1] - 1], reset);
	},
	
	resizeSlide: function(coords, reset){
		var zoom = (4 / 6) * 100; //percent
		var stylesIn = {
			'max-width'    : [zoom, 100],
			'margin-left'  : [(100 - zoom) / 4, 0],
			'margin-right' : [(100 - zoom) / 4, 0],
			'margin-top'   : [((100 - zoom) / 4) * 1.333, 0],
			'margin-bottom': [((100 - zoom) / 4) * 1.333, 0]
		};
		var stylesOut = {
			'max-width'    : [100, zoom],
			'margin-left'  : [0, (100 - zoom) / 4],
			'margin-right' : [0, (100 - zoom) / 4],
			'margin-top'   : [0, ((100 - zoom) / 4) * 1.333],
			'margin-bottom': [0, ((100 - zoom) / 4) * 1.333]
		};
		if (this.categories[coords[0]]){
			if (this.categories[coords[0]].slides[coords[1]]){
				var el = this.categories[coords[0]].slides[coords[1]].getChildren()[0];
				if (el){
					el = el.getChildren()[0];
					el.set('morph', { 'unit': '%', 'link': 'cancel' });
					el.morph(reset ? stylesIn : stylesOut);
				}
			}
		}
	},
	
	find: function(el){
		var finder = function(slide){
			var retval = [];
			this.categories.each(function(category, i){
				var j = category.slides.indexOf(slide);
				if (j > -1){
					retval = [i, j];
				}
			});
			return retval;
		}.bind(this);
		
		if (typeOf(el) == 'element'){
			if (el.get('tag') == 'a'){
				return this.find(el.getParent(this.options.slides));
			} else if (el.get('tag') == 'li'){
				var els = el.getElements(this.options.slides);
				if (els.length){
					return finder(els[0]);
				} else {
					return finder(el);
				}
			}
		} else {
			return null;
		}
	},
	
	configureMargins: function(){
		var first = this.categories[0].slides[0];
		var imgSizeX = first.getSize().x;
		var imgSizeY = first.getSize().y;
		var peekFactorX = 0.04 * (this.windowSize.x / 1280).pow(2);
		var peekFactorY = 0.04 * (this.windowSize.y / 1024).pow(2);
		var marginBottom = ((this.windowSize.y - imgSizeY) / 2) - (imgSizeY * peekFactorY);
		
		if (this.windowSize.x > this.options.altsize[0]) {
			var marginRight = ((this.windowSize.x - imgSizeX) / 2) - (imgSizeX * peekFactorX);
		} else {
			var marginRight = 0;
		}
		
		$$('#main ul > li > ul > li').setStyle('margin-right', marginRight);
		$$('#main ul > li > ul > li').setStyle('margin-bottom', marginBottom);
		
		this.configureWidths();
	},
	
	configureWidths: function(){
		this.categories.each(function(category){
			category.slides.each(function(slide){
				var size  = slide.getSize();
				if (size.y > this.windowSize.y){
					var ratio = size.x / size.y;
					slide.setStyle('width', (this.windowSize.y * ratio) * .8);
				}
			}.bind(this));
		}.bind(this));
	},
	
	getProgressPercent: function(){
		return this.active[1] / this.categories[this.active[0]].slides.length;
	},
	
	getProgressStep: function(){
		return 1 / this.categories[this.active[0]].slides.length;
	},
	
	getCategoryName: function(){
		return document.getElement('a[href=#' + this.getCurrentSlide().getElement('! li h3 a').get('name') + ']').get('text');
	},
	
	getCurrentSlide: function(){
		return this.categories[this.active[0]].slides[this.active[1]];
	}
});
