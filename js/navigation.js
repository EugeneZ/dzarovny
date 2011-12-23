var Navigation = new Class({
	Implements: Options,
	options: {
		link: 'cancel'
	},

	initialize: function(el, options){
		this.setOptions(options);
		this.el = document.id(el) || document.getElement(el);
		this.progress = this.buildStatusInfo($('statusinfo'));
		
		this.attachFx();
		this.attachEvents();
		this.hide();
	},
	
	show: function(nofx){
		var method = nofx ? 'set':'start';
		
		this.menufx.cancel();
		this.bgfx[method](this.bgfxshow).chain(function(){
			this.menufx[method](1);
		}.bind(this));
	},
	
	hide: function(nofx){
		var method = nofx ? 'set':'start';
		
		this.bgfx.cancel();
		this.menufx[method](0).chain(function(){
			this.bgfx[method](this.bgfxhide);
		}.bind(this));
	},
	
	attachFx: function(){
		var menu  = this.el.getElement('> ul'); 
		var els   = this.el.getElements('> *:not(ul)');
		
		this.menufx = new Fx.Tween(menu, {
			property: 'opacity',
			link: this.options.link
		});
		
		this.bgfx = new Fx.Elements(els, {
			link: this.options.link
		});

		this.bgfxshow = {};
		this.bgfxhide = {};
		els.length.times(function(i){
			this.bgfxshow[i] = { 'opacity': 0, 'z-index': -1 };
			this.bgfxhide[i] = { 'opacity': 1, 'z-index': 101 };
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
		
		this.el.addEvent('click', function(e){
			e.preventDefault();
			this.show();
		}.bind(this));
	},
	
	buildStatusInfo: function(el){
		var img      = new Element('img', { 'src': 'images/Style/bullet.png' }).set('tween', { 'link': 'cancel' });
		var bg       = new Element('div#bullet').adopt(img);
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
