var Navigation = new Class({
	Implements: Options,
	options: {
		
	},

	initialize: function(el, options){
		this.setOptions(options);
		this.el = document.id(el) || document.getElement(el);
		
		this.el.addEvent('mouseenter', function(e){
			e.preventDefault();
			
			this.el.getElement('h1').fade('out');
			this.el.getElement('ul').fade('in');
		}.bind(this));
		
		this.el.addEvent('mouseleave', function(e){
			e.preventDefault();
			
			this.el.getElement('h1').fade('in');
			this.el.getElement('ul').fade('out');
		}.bind(this));
		
		
	}
});
