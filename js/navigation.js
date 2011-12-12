var Navigation = new Class({
	Implements: Options,
	options: {
		
	},

	initialize: function(el, options){
		this.setOptions(options);
		this.el = document.id(el) || document.getElement(el);
		this.progress = this.buildStatusInfo($('statusinfo'));
		
		this.attachEvents();
	},
	
	show: function(){
		this.el.getElement('h1').fade('out');
		this.el.getElement('ul').fade('in');
		if (DZarovny.nav.progress.retrieve('DZarovny.firstclick', false)) this.progress.fade('out');
	},
	
	hide: function(){
		this.el.getElement('h1').fade('in');
		this.el.getElement('ul').fade('out');
		if (DZarovny.nav.progress.retrieve('DZarovny.firstclick', false)) this.progress.fade('in');
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
