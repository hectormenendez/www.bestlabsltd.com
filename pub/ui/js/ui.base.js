// base methods for element handling.
var fn = {};

/**
 * Make an element appear to say no.
 * @author Hector Menendez <h@cun.mx>
 * @licence http://etor.mx/licence.txt
 * @adapted 2011/SEP/14 16:46  It was a standalone jQuery plugin.
 * @created 2011/MAY/01 00:00
 */
fn.sayno = function(){
	var ml = parseInt(this.element.css('margin-left'),10);
	// target distances
	var td = [ml - this.settings.distance, ml + this.settings.distance];
	// callback
	var self = this;
	var cb = function(d){
		self.element.animate({ 'margin-left' : d }, self.settings.speed);
	};
	var i;
	// alternate calling cb.
	for (i=0; i < ((this.settings.times*2)-1); i++)  cb(td[i%2]);
	// restore original margin.
	cb(ml);
	this.core.log('No.','sayno');
};
fn.sayno.prototype = {
	constructor:fn.sayno,

	defaults:{
		speed    : 100, // speed of movement in ms.
		times    : 3,   // how many times?
		distance : 10   // how many pixels to move the object?
	},

	update: fn.sayno    // this will be automatically called when the plugin
	                    // targets an element that's already been constructed.
};



// methods available in core scope (core functionality);
var core = {};
/**
 * @author Hector Menendez <h@cun.mx>
 * @licence http://etor.mx/licence.txt
 * @created 2011/SEP/01 13:50
 */
core.loader = function(){};
core.loader.prototype = {
	constructor: core.loader,

	defaults:{
		speed:0
	},


	enabled:true, // ui starts with loader shown.

	/**
	 * @author Hector Menendez <h@cun.mx>
	 * @licence http://etor.mx/licence.txt
	 * @updated 2011/SEP/10 16:53   Overlay moved to its own method.
	 * @updated 2011/SEP/10 05:15   Using prototype now.
	 * @updated 2011/SEP/09 05:15   Moved to ui.base.js
	 * @created 2011/SEP/01 08:33
	 */
	show : function(speed){
		if (this.enabled) return;
		this.enabled = true;
		if (speed === undefined) speed = this.defaults.speed;
		this.core.overlay.show(speed);
		this.core.$loader.show().css('opacity',0)
			.animate({'opacity' : this.core.$overlay.opacity}, speed);
		this.core.log('Shown.','loader');
	},

	/**
	 * @author Hector Menendez <h@cun.mx>
	 * @licence http://etor.mx/licence.txt
	 * @updated 2011/SEP/10 16:59   Overlay moved to its own method.
	 * @updated 2011/SEP/10 01:58   Using prototype now.
	 * @updated 2011/SEP/09 05:16   Moved to ui.base.js
	 * @created 2011/SEP/01 13:55
	 */
	hide : function(speed){
		if (!this.enabled) return;
		this.enabled = false;
		if (speed === undefined) speed = this.defaults.speed;
		this.core.overlay.hide(speed);
		this.core.$loader.animate({ 'opacity' : 0 }, speed, function(){
			$(this).hide().css('opacity',1);
		});
		this.core.log('Hidden.','loader');
	}

};

/**
 * @author Hector Menendez <h@cun.mx>
 * @licence http://etor.mx/licence.txt
 * @created 2011/SEP/10 16:47
 */
core.overlay = function(){};
core.overlay.prototype = {
	constructor:core.overlay,

	defaults:{
		speed:0
	},

	enabled: true,  // ui starts with overlay shown.

	/**
	 * @author Hector Menendez <h@cun.mx>
	 * @licence http://etor.mx/licence.txt
	 * @created 2011/SEP/10 16:49
	 */
	show:function(speed){
		if (this.enabled) return;
		    this.enabled = true;
		if (speed === undefined) speed = this.defaults.speed;
		this.core.$overlay.show().css('opacity', 0)
			.animate({'opacity' : this.core.$overlay.opacity}, speed);
		this.core.log('Shown.','overlay');
	},

	/**
	 * @author Hector Menendez <h@cun.mx>
	 * @licence http://etor.mx/licence.txt
	 * @created 2011/SEP/10 16:55
	 */
	hide:function(speed){
		if (!this.enabled) return;
		     this.enabled = false;
		if (speed === undefined) speed = this.defaults.speed;
		var self = this;
		this.core.$overlay.animate({ 'opacity' : 0 }, speed, function(){
			// restore opacity to original value.
			$(this).hide().css('opacity', self.core.$overlay.opacity);
		});
		this.core.log('Hidden.','overlay');
	}
};

/**
 * @author Hector Menendez <h@cun.mx>
 * @licence http://etor.mx/licence.txt
 * @created 2011/SEP/07 18:08
 */
core.tooltip = function(){};
core.tooltip.prototype = {

	constructor:core.tooltip,

	defaults:{
		time:333
	},

	/**
	 * @author Hector Menendez <h@cun.mx>
	 * @licence http://etor.mx/licence.txt
	 * @created 2011/SEP/11 02:12
	 */
	enable:function(context, message){
		// if no contexts is sent trigger error.
		if (!context instanceof jQuery)
			return this.core.error('Invalid context.','tooltip');
		if (!message || !message.length)
			return this.core.error('A message is expected.','tooltip');
		// if there is two or more whitespaces after a dot, transform'em to newline.
		message = message.replace(/(?:([\.\:\;\>])|\s+\-)\s{2,}/g,"$1\n");

		var self = this;

		var show = function(e){
			var o = $(this);
			var f = o.offset();
			self.timeout = window.setTimeout(function(){
				self.core.$tooltip
					.css('opacity',0)
					.show()
					.html(message)
					.css({
						top: f.top  + (o.height()/2),
						left: f.left + (o.width()/2)
					})
					.animate({opacity:1},'fast');
			},self.defaults.time);
		};

		var hide = function(e){
			window.clearTimeout(self.timeout);
			delete self.timeout;
			self.core.$tooltip.hide().html('');
		};

		// bind events
		context.bind('mouseover', show);
		context.bind('mouseout',  hide);
		this.core.log('Enabled "'+ message.substr(0,25) + '…".','tooltip');
	}

};

/**
 * Prepare Text Inputs and Textareas.
 *
 * @author Hector Menendez <h@cun.mx>
 * @licence http://etor.mx/licence.txt
 * @updated 2011/SEP/14 16:24    Removed padding, an created a method out of it.
 * @created 2011/SEP/07 00:23
 */
core.textinput = function(context){

	var self = this;

	// make sure we've a correct context.
	if (typeof context != 'object' || !context instanceof jQuery)
		context = self.core.$body;
	this.padding(context);
	context.find(
		'.ui-textarea,'+
		'.ui-input[type="text"],'+
		'.ui-input[type="password"]'
	).each(function(){
		var $this = $(this);
		// does this element has a label?
		var label = $this.siblings('.ui-label').last();
		if (!label.length) return;
		// a label should only contain a text element, make sure that's the case.
		var cont = label.contents()
			.filter(function(){ return this.nodeType == 3; })
			.first().get(0).nodeValue;
		label.html('<span>'+cont+'</span>');
		// if a title element is present, enable tooltip.
		var title = null;
		var help  = null;
		if ((title = label.attr('title'))){
			label.removeAttr('title');
			help  = $('<span class="ui-label-help">?</span>').appendTo(label);
			self.core.tooltip.enable(help, title);
		}
		var regex = null;
		if ((regex = label.attr('data-limit'))) regex = new RegExp(regex,'g');
		// if the element has a character maxcount, generate it and set its event.
		var maxch;
		if ((maxch = parseInt(label.attr('data-count'),10))){
			$('<span class="ui-label-count">'+maxch+'</span>').appendTo(label);
		}
		// set event only if necessary
		if (regex || maxch){
			var count = label.find('.ui-label-count').last();
			$this.keypress(function(e){
				var len = maxch-this.value.length - (e.charCode===0? 0 : 1);
				if (len > -1) count.html(len);
				// allow non printable keys
				if (e.charCode === 0) return true;
				var key = String.fromCharCode(e.charCode);
				// if a regex exists, limit keys.
				if (regex && !key.match(regex)) {
					e.stopImmediatePropagation();
					return false;
				}
				// continue only if a maxch isset.
				if (!maxch) return true;
				if (len > -1) {
					if (len > 0) count.attr('class','ui-label-count');
					if (len < parseInt(maxch/3,10)){
						if (len < 10) count.addClass('ui-label-count-halt');
						else          count.addClass('ui-label-count-warn');
					}
				} else return false;
			});
		}
	});
	this.core.log('Enabled using "' + context.selector + '" as context.','textinput');
};
core.textinput.prototype = {
	constructor: core.textinput,

	defaults:{},

	enable: core.textinput,

	/**
	 * Moved out from constructor, so it can be called externally.
	 * @author Hector Menendez <h@cun.mx>
	 * @licence http://etor.mx/licence.txt
	 * @created 2011/SEP/14 16:23
	 */
	padding: function(context){
		var self = this;
		this.core.log('Adjusting padding.','textinput');
		// make sure we've a correct context.
		if (typeof context != 'object' || !context instanceof jQuery)
			context = self.core.$body;
		return context.find(
			'.ui-textarea,'+
			'.ui-input[type="text"],'+
			'.ui-input[type="password"]'
		).each(function(){
			var $this = $(this).width('100%');
			// allow a couple ms to the property so the width populates
			setTimeout(function(){
				var width = $this.outerWidth();
				// Add a padding of .5em without compromising width;
				var em = parseInt($this.css('font-size'),10);
				if (!em) em = self.core.em;
				var pad = (em*100)/width;
				// we only need two decimal digits, get rid of everything else.
			    pad = Math.round(pad*100+((pad*1000)%10>4?1:0))/100;
				$this.css({
					'text-indent'   : '0 !important',
					'width'         : 100-pad + '% !important',
					'padding-left'  :  pad/2  + '% !important',
					'padding-right' :  pad/2  + '% !important'
				});
			},25);
			return;
		});
	}
};
