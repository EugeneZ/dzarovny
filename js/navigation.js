var Navigation = new Class({
	Implements: Options,
	options: {
		link: 'ignore'
	},

	initialize: function(el, options){
		this.setOptions(options);
		this.el = document.id(el) || document.getElement(el);
		this.progress = this.buildStatusInfo($('statusinfo'));
		
		this.attachFx();
		this.attachEvents();
		this.hide(true);
	},
	
	show: function(nofx){
		var method = nofx ? 'set':'start';
		
		this.fx.show[method](this.fx.showCache).chain(function(){
			this.el.getElements('> ul').fade(nofx ? 'show':'in');
		
			// progress needs special treatment
			if (this.progress.retrieve('DZarovny.firstclick', false)) {
				this.progress.fade(nofx ? 'hide':'out');
			} else {
				this.progress.fade('hide');
			}
		}.bind(this));
	},
	
	hide: function(nofx){
		var method = nofx ? 'set':'start';
		
		this.fx.hide[method](0).chain(function(){
			this.el.getElements('> *:not(ul)').fade(nofx ? 'show':'in');
		
			// progress needs special treatment
			if (this.progress.retrieve('DZarovny.firstclick', false)) {
				this.progress.fade(nofx ? 'show':'in');
			} else {
				this.progress.fade('hide');
			}
		}.bind(this));
	},
	
	attachFx: function(){
		this.el.getElements('> *').set('tween', { link: this.options.link });
		var els = this.el.getElements('> *:not(ul)');
		this.fx = {};
		this.fx.show = new Fx.Elements(els, {
			property: 'opacity',
			link: this.options.link
		});
		this.fx.hide = new Fx.Tween(this.el.getElement('> ul'), {
			property: 'opacity',
			link: this.options.link
		});
		
		this.fx.showCache = {};
		els.length.times(function(i){
			this.fx.showCache[i] = { 'opacity': [1, 0] };
		}.bind(this));
	},
	
	attachEvents: function(){
		this.el.addEvent('mouseenter', function(e){
			e.preventDefault();
			this.show();
		}.bind(this));
		
		this.el.addEvent('mouseleave', function(e){
			e.preventDefault();
			this.hide();
		}.bind(this));
		
		this.el.getElement('h1').addEvent('click', function(e){
			e.preventDefault();
			this.show();
		}.bind(this));
	},
	
	buildStatusInfo: function(el){
		var img      = new Element('img', { 'src': 'images/Style/longbar.png' }).set('tween', { 'link': 'cancel' });
		var bg       = new Element('div#longbar').adopt(img);
		var progress = new Element('div#progress').adopt(bg);
		var category = new Element('div#category');
		var label    = new Element('div#label').adopt(category).adopt(progress);
		
		label.replaces(el);
		progress.inject(progress, 'after');
		
		return label;
	},
	
	toElement: function(){
		return this.el;
	}
});
