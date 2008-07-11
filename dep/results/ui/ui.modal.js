(function($) {

	$.ui = $.ui || {};
	
	/**
	 * Kudos to Konstantin Käfer (kkaefer)
	 */
	$.fn.innerWrap = function(u) {
		return this.each(function() {
			var w = $(u)[0], v = w;
			while (v.firstChild) v = v.firstChild;
			while (this.firstChild) v.appendChild(this.firstChild);
			this.appendChild(w);
		});
	};

	$.fn.uiBox = function(arg){
		return typeof arg == "string" ?
			this.pushStack($.map(this, function(elem){
				var middle = elem.firstChild.nextSibling;
				return	arg == "top" && elem.firstChild ||
					arg == "bottom" && elem.lastChild ||
					arg == "middle" && middle ||
					arg == "left" && middle.firstChild ||
					arg == "center" && middle.firstChild.nextSibling ||
					arg == "right" && middle.lastChild ||
					null;
			})) :
			this
				.addClass("uiBox")
				.innerWrap("<div class='center pane'></div>")
				.innerWrap("<div class='middle pane'></div>")
				.prepend("<div class='top pane'></div>")
				.append("<div class='bottom pane'></div>")
				.uiBox("middle")
					.prepend("<div class='left pane'></div>")
					.append("<div class='right pane'></div>")
				.end().each(function(i,elem){
					$.each( arg || {}, function(name, value){
						$(elem).uiBox(name)
							[$.isFunction(value) ? "each" : "append"](value);
					});
				});
	};
	
	$.fn.modal = function(o){
		return $(this).each(function() {
			$.ui.modal(this, o);
		});
	}

	$.ui.modal = function(el, o) {

		var options = {
			title: '', // Title
			buttons: 'right', // Location of the buttons
			open: function(e, ui) { // Open event

				// If it's an object, pass it to $().animate();
				if(typeof ui.options.animation == 'Object') {
					$(ui.modal).animate(ui.options.animation, ui.options.speed);
				} else {
					switch(ui.options.animation) {
						case 'none':	// No animation
							$(ui.modal).show(0);
							break;
						case 'fade':	// Fade
							$(ui.modal).fadeIn(ui.options.speed);
							break;
						case 'scale':	// Scale
							$(ui.modal).find('*').each(function(i, n) {
								$(n).css('overflow', $(n).attr('modalRestoreOverflow'));
							});
							$(ui.modal).show(ui.options.speed);
							break;
						case 'slide':	// Slide
							$(ui.modal).find('*').each(function(i, n) {
								$(n).css('overflow', $(n).attr('modalRestoreOverflow'));
							});
							$(ui.modal).slideDown(ui.options.speed);
							break;
						default:		// Custom animation
							$(ui.modal)[ui.options.animation](ui.options.speed);
					};
				}

			},
			close: function(e, ui) {

				// Optionally remove it when animation is done
				var f = ui.options.outRemove ? function() { $(this).remove(); } : function() {};
				
				// Refer to the open above for all these options
				if(typeof ui.options.animation == 'Object') {
					$(ui.modal).animate(ui.options.animation, ui.options.speed);
				} else {
					switch(ui.options.animation) {
						case 'none':
							$(ui.modal).remove();
							break;
						case 'fade':
							$(ui.modal).fadeOut(ui.options.speed, f);
							break;
						case 'scale':
							// We set the overflow to hidden on every element to prevent scrolling when scaling.
							// The overflow is restored when the window is opened
							$(ui.modal).find('*').each(function(i, n) {
								var c = $(n).css('overflow');
								$(n).attr('modalRestoreOverflow', c);
								$(n).css('overflow', 'hidden');
							});
							$(ui.modal).hide(ui.options.speed, f);
							break;
						case 'slide':
							// Ditto to above
							$(ui.modal).find('*').each(function(i, n) {
								var c = $(n).css('overflow');
								$(n).attr('modalRestoreOverflow', c);
								$(n).css('overflow', 'hidden');
							});
							$(ui.modal).slideUp(ui.options.speed, f);
							break;
						default:
							$(ui.modal)[ui.options.animation](ui.options.speed, f);
					};	
				}

			},
			resize: { // Options specific to $().resizable
				handles: {
					se: 'div.bottom.pane span.ui-modal-resize-se',
				},
				start: function(e, ui) {
					$(ui.helper).appendTo('body');
				}
			},
			drag: { // Options specific to $().draggable
				handle: 'div.top.pane',
				start: function(e, ui) {
					$(ui.helper).appendTo('body');
				}
			},
			
			overflow: true,	// Allow overflow/scrolling
			buttonMarkup: '<a class="ui-modal-button-close">X</a>', // Override button markup optionally
			width: 400,	// Width of the modal
			height: 350, // Height
			animation: 'none', // Animation.	Look at open above for possible values
			speed: 'fast', // Animation speed
			outRemove: false, // Remove when exiting
			createAgain: false // Whether to create again if this function is called twice on the same element
		};
		$.extend(options, o);
		var self = this;
		self.options = options; // Ensure the options carry through
		
		// Abort early if this is already a modal
		if ($(el).is('.ui-modal') && options.createAgain != true) {
		  return false;
		}
		
		// Buttons
		var bu = $("<span>").addClass('ui-modal-buttons').addClass('ui-modal-buttons-'+ options.buttons).html(options.buttonMarkup);
		
		// Title
		var ti = $('<span>').addClass('ui-modal-title').html(options.title);
		
		// Title bar
		var t = $('<div>').addClass('ui-modal-title-bar');
		if(options.buttons == 'left') {
			// Append the buttons and then the title,
			// because the buttons are on the left
			t.append(bu).append(ti);
		}
		else {
			// Other way around
			t.append(ti).append(bu);
		}
		
		// Attach close
		t.find('.ui-modal-buttons a.ui-modal-button-close').click(function(e) {
			// Trigger the close function
			$(el).triggerHandler("modalclose", [e, {options: self.options, modal: el}], self.options.close);
		});
		
		// Resize item
		var b = $('<span>').html('').addClass("ui-modal-resize-se");
		
		// Open the modal
		$(el).triggerHandler("modalopen", [null, {options: self.options, modal: el}], self.options.close);
		$.extend(options, {
			uiBox: {
				top: t,
				bottom: b,
				left: '&nbsp;'
			}
		});
		
		// Add a uibox
		$(el).uiBox(options.uiBox)
		.addClass('ui-modal')
		.css({ position: "absolute", width: options.width, height: options.height })
		.appendTo("body")
		.click(function() {
			$(this).appendTo('body');
		});
		
		if ($.fn.draggable != window.undefined) {
			$(el).draggable(options.drag);
			// You can't use resuzeables without draggables
			if ($.fn.resizable != window.undefined) {
				$(el).resizable(options.resize);
			}
		}
		if ($.fn.bgIframe != window.undefined) {
			$(el).bgIframe();
		}
		
		// What to add to the manager
		var uiobj = {};
		uiobj.options = this.options;
		uiobj.el = $(el);
		uiobj.close = function() {
			this.options.close({}, {options: this.options, modal: this.el });
		}
		uiobj.open = function() {
			this.options.open({}, {options: this.options, modal: this.el });
		}
		return uiobj;
	}

})(jQuery);
