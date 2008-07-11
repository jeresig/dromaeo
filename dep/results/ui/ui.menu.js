/* jQuery UI Menu
 */

(function($){

	//If the UI scope is not availalable, add it
	$.ui = $.ui || {};
	
	$.fn.menu = function(options) {	// Constructor for the menu method
		return this.each(function() {
			new $.ui.menu(this, options);	
		});
	}
	
	$.fn.menuItemDisable = function(options) {	// Constructor for the menu method
		return this.each(function() {
			new $.ui.menu.prototype.menuItemDisable(this, options);	
		});
	}
	
	$.fn.menuItemEnable = function(options) {	// Constructor for the menu method
		return this.each(function() {
			new $.ui.menu.prototype.menuItemEnable(this, options);	
		});
	}
	
	$.ui.menu = function(el, options) {
		
		var self = this;
		
		self.options = {};
		
		$.extend(self.options, {
			menu: 'none',
			trigger: 'click',	// Context to attach to menu
			noHoverIntent: false,
			delay: 500,		
			show: {opacity:'show'},		// Animation object to show menu
			hide: {opacity:'hide'},		// Animation object to hide menu
			speed: 'slow',
			// Delay for animation
			contextTitle: "Context Menu",
			_menuItemEnable: function(h, p, c, t, e) {
				self.menuItemEnable.apply(t, [self, e]); // Trigger the menuItemEnable callback				
			},
			_menuItemDisable: function(h, p, c, t, e) {
				self.menuItemDisable.apply(t, [self, e]); // Trigger the menuItemDisable callback
			},
			_menuItemClick: function(h, p, c, t, e) {
				self.menuItemClick.apply(t, [self, e]); // Trigger the menuItemClick callback				
			},
			_menuItemOver: function(h, p, c, t, e) {
				self.menuItemOver.apply(t, [self, e]); // Trigger the menuItemOver callback
			},
			_menuItemOut: function(h, p, c, t, e) {
				self.menuItemOut.apply(t, [self, e]); // Trigger the menuItemOut callback				
			},
			_menuOpen: function(h, p, c, t, e) {
				self.menuOpen.apply(t, [self, e]); // Trigger the menuOpen callback
			},
			_menuClose: function(h, p, c, t, e) {
				self.menuClose.apply(t, [self, e]); // Trigger the menuClose callback				
			},
			_submenuOpen: function(h, p, c, t, e) {
				self.submenuOpen.apply(t, [self, e]); // Trigger the submenuOpen callback
			},
			_submenuClose: function(h, p, c, t, e) {
				self.submenuClose.apply(t, [self, e]); // Trigger the submenuClose callback
			},
			_submenuClose: function(h, p, c, t, e) {
				self.submenuClose.apply(t, [self, e]); // Trigger the submenuClose callback
			},
			_menuStyle: function(h, p, c, t, e) {
				self.menuStyle.apply(t, [self, e]); // Trigger the submenuClose callback
			},
			buttons: {},
			hovers: {}
		},options);
		if (self.options.trigger == 'hover' && self.options.noHoverIntent == false) {
			self.options.trigger = hoverType();	// If not overidden, check to if hoverIntent is available
		}
		self.options.hovertype = hoverType();
		$(self.options.menu).appendTo(el);	// This makes sure our menu is attached in the DOM to the parent to keep things clean
		$().triggerHandler("menuStyle", [null, {options: self.options}], self.menuStyle);	// Pass the menu in to recieve it's makeover
		
		
		if (self.options.trigger == 'click' || self.options.trigger == 'hover' || self.options.trigger == 'hoverIntent'){
			$(el)[self.options.trigger](function(event){
				self.ctrlPressed=event.ctrlKey;
				self.altPressed=event.atlKey
				self.options.elPosition= self.getPos(event, self.options, this);	// to get around elPosition has no properties			
								
				$().triggerHandler("menuOpen", [event, {options: self.options}], self.menuOpen);
		
				$(self.options.menu)[self.options.hovertype](function(){
					$().triggerHandler("submenuOpen", [null, {options: self.options}], self.submenuOpen);
				}, function(){
					$().triggerHandler("menuClose", [null, {options: self.options}], self.menuClose);
				});
			}, function(){
				$().triggerHandler("menuClose", [null, {options: self.options}], self.menuClose);
			});
			
		} else {
			$(el).bind(self.options.trigger, function(event){
				self.event = event;
				self.ctrlPressed=event.ctrlKey;
				self.altPressed=event.atlKey
				self.options.elPosition= self.getPos(event, self.options, this);	// to get around elPosition has no properties			
		
				event.preventDefault();
				event.stopPropagation();
				
				$().triggerHandler("menuOpen", [self.event, {options: self.options}], self.menuOpen);
		
				$(self.options.menu)[self.options.hovertype](function(){
					$().triggerHandler("submenuOpen", [null, {options: self.options}], self.submenuOpen);
				}, function(){
					$().triggerHandler("menuClose", [null, {options: self.options}], self.menuClose);
				});
			});
		}
		$('a', $(self.options.menu).children('li')).bind('click', function(ev){
			$().triggerHandler(this.className, [self.event, {item:this}], self.options.buttons[this.className]);
			return false;
		});
		$('a', $(self.options.menu))[self.options.hovertype](function(ev){
			$().triggerHandler("menuItemOver", [ev, {item:this}], self.options.menuItemOver);
			$().triggerHandler(this.className, [ev, {item:this}], self.options.hovers[this.className]);
		}, function(ev){
			// None
		});
		return false;
		}
	
	$.extend($.ui.menu.prototype, {
		menuStyle : function(event, options){
			$(options.options.menu).addClass('ui-menu-items').children('li').addClass('ui-menu-item');	//Apply first level and child items
			var parents = $('ul', options.options.menu).addClass('ui-menu-items').parent('li').addClass('ui-menu-item-parent')	// Apply sublevels
			var node = $('li', options.options.menu).addClass('ui-menu-item');	// Finish up any unmatched items
			if (options.options.trigger == 'contextmenu'){
				$(options.options.menu).prepend('<span class="ui-context-header">' + options.options.contextTitle + '</span>');
			}
			return false;
		},
		getPos : function(event, options, menu){
			var oPos = menu;
			if (options.trigger == 'contextmenu') {
				oPos.top = event.clientY;
				oPos.left = event.clientX;
			} else {
				var thispos = $(menu).offset();
				oPos.top = thispos.top + $(oPos).height();
				oPos.left = thispos.left;
			}
			return oPos;
		},
		submenuOpen : function(event, options) {
			$('li', options.options.menu)[options.options.hovertype](
				function(ev){
					x = $(this).offset();
					$(this).find('>ul').css({position:'absolute', top:x.top, left:$(options.options.menu).width()})
							.animate(options.options.show,options.options.speed);
					$(this).triggerHandler("submenuOpen", [ev, {item:this}], options.options.submenuOpen);
				},
				function(ev){
					$(this).find('>ul').animate(options.options.hide,options.options.speed);
					$(this).triggerHandler("submenuClose", [ev, {item:this}], options.options.submenuClose);
				}
			);
			return false;
		},
		menuOpen : function(event,options){
			$(options.options.menu).css({position: 'absolute', top: options.options.elPosition.top, left: options.options.elPosition.left})
				.animate(options.options.show, options.options.speed);
			return false;
		},
		menuClose : function(event, options){
			$(options.options.menu).animate(options.options.hide,options.options.speed);
			$(options.options.menu).triggerHandler("menuClose", [null, {item: options.options.menu}], options.options.menuClose);
			return false;
		},
		menuItemDisable : function (el, options) {
			return $(el).each(function(){
				var t = $('a', this).text();
				$('a', el).hide();
				$(el).append('<span class="ui-menu-item-disabled">' + t + '</span>');
				$(el).triggerHandler("menuItemDisabled", [null, {item:el}], options.menuItemDisabled);
			});
		},
		menuItemEnable : function (el, options) {
			return $(el).each(function(){
				$('span', el).remove();
				$('a', el).show();
				$(el).triggerHandler("menuItemEnabled", [null, {item:el}], options.menuItemEnabled);
			});
		}
	});
	
	
	$.extend($.fn, {
		menuItemAdd : function (item) {
			
			var item = $.extend({
				position: 'insertAfter'
			}, item);
			
			var append = $('<li id="' + item.id + '" class="ui-menu-item"><a href="' + item.href + '" class="' + item.linkclass + '">' + item.linktext + '</a>');
			$(append)[item.position](this); // FIXME: This appends after in IE, but can append after the wrong element

			if(item&&item.buttons){	// Check to see if the menu has a buttons object
      			append.find('a').bind('click', function(){
	  				if (item.buttons[this.className]) {
        				item.buttons[this.className]();	//If the classname of the link has a matching function, execute
					}
				});
			}
        	if(item&&item.hovers){	// Check to see if the menu has a buttons object
	      		append.find('a')[htype](function(){
		  			if (item.hovers[this.className]){
        					item.hovers[this.className]();	//If the classname of the link has a matching function, execute
        			}
      			}, function(){});	// Do nothing at the moment
      		}
		}
	});
	
	function hoverType() {	// Helper function, finds out if hoverIntent exists
		if (typeof $.fn.hoverIntent != 'undefined') {
			var htype = 'hoverIntent';
		} else {
			var htype = 'hover';
		}
		return htype;
	}
})($);
