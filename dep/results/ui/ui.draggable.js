(function($) {

	$.fn.draggable = function(o) {
		return this.each(function() {
			new $.ui.draggable(this, o);
		});
	}
	
	$.fn.undraggable = function() {
		
	}
	
	$.ui.ddmanager = {
		current: null,
		droppables: [],
		prepareOffsets: function(t) {
			var dropTop = $.ui.ddmanager.dropTop = [];
			var dropLeft = $.ui.ddmanager.dropLeft;
			var m = $.ui.ddmanager.droppables;
			for (var i = 0; i < m.length; i++) {
				m[i].offset = $(m[i].item.element).offset({ border: false });
				if (t && m[i].item.options.accept(t.element)) //Activate the droppable if used directly from draggables
					m[i].item.activate.call(m[i].item);
			}
		},
		fire: function(oDrag) {
			
			var oDrops = $.ui.ddmanager.droppables;
			var oOvers = $.grep(oDrops, function(oDrop) {
				if ($.ui.intersect(oDrag, oDrop, oDrop.item.options.tolerance))
					oDrop.item.drop.call(oDrop.item);
			});
			$.each(oDrops, function(i, oDrop) {
				if (oDrop.item.options.accept(oDrag.element)) {
					oDrop.out = 1; oDrop.over = 0;
					oDrop.item.deactivate.call(oDrop.item);
				}
			});
		},
		update: function(oDrag) {
			
			if(oDrag.options.refreshPositions) $.ui.ddmanager.prepareOffsets();
			
			var oDrops = $.ui.ddmanager.droppables;
			var oOvers = $.grep(oDrops, function(oDrop) {
				var isOver = $.ui.intersect(oDrag, oDrop, oDrop.item.options.tolerance)
				if (!isOver && oDrop.over == 1) {
					oDrop.out = 1; oDrop.over = 0;
					oDrop.item.out.call(oDrop.item);
				}
				return isOver;
			});
			$.each(oOvers, function(i, oOver) {
				if (oOver.over == 0) {
					oOver.out = 0; oOver.over = 1;
					oOver.item.over.call(oOver.item);
				}
			});
		}
	};
	
	$.ui.draggable = function(el, o) {
		
		var options = {};
		$.extend(options, o);
		$.extend(options, {
			_start: function(h, p, c, t, e) {
				self.start.apply(t, [self, e]); // Trigger the start callback				
			},
			_beforeStop: function(h, p, c, t, e) {
				self.stop.apply(t, [self, e]); // Trigger the start callback
			},
			_drag: function(h, p, c, t, e) {
				self.drag.apply(t, [self, e]); // Trigger the start callback
			}			
		});
		var self = this;
		
		if (options.ghosting == true) options.helper = 'clone'; //legacy option check
		this.interaction = new $.ui.mouseInteraction(el, options);
		
	}
	
	$.extend($.ui.draggable.prototype, {
		plugins: {},
		currentTarget: null,
		lastTarget: null,
		prepareCallbackObj: function(self) {
			return {
				helper: self.helper,
				position: { left: self.pos[0], top: self.pos[1] },
				offset: self.options.cursorAt,
				draggable: self,
				options: self.options	
			}			
		},
		start: function(that, e) {
			
			var o = this.options;
			$.ui.ddmanager.current = this;
			
			$.ui.plugin.call(that, 'start', [e, that.prepareCallbackObj(this)]);
			$(this.element).triggerHandler("dragstart", [e, that.prepareCallbackObj(this)], o.start);
			
			if (this.slowMode && $.ui.droppable && !o.dropBehaviour)
				$.ui.ddmanager.prepareOffsets(this);
			
			return false;
						
		},
		stop: function(that, e) {			
			
			var o = this.options;
			
			$.ui.plugin.call(that, 'stop', [e, that.prepareCallbackObj(this)]);
			$(this.element).triggerHandler("dragstop", [e, that.prepareCallbackObj(this)], o.stop);

			if (this.slowMode && $.ui.droppable && !o.dropBehaviour) //If cursorAt is within the helper, we must use our drop manager
				$.ui.ddmanager.fire(this);

			$.ui.ddmanager.current = null;
			$.ui.ddmanager.last = this;

			return false;
			
		},
		drag: function(that, e) {

			var o = this.options;

			$.ui.ddmanager.update(this);

			this.pos = [this.pos[0]-o.cursorAt.left, this.pos[1]-o.cursorAt.top];

			$.ui.plugin.call(that, 'drag', [e, that.prepareCallbackObj(this)]);
			var nv = $(this.element).triggerHandler("drag", [e, that.prepareCallbackObj(this)], o.drag);

			var nl = (nv && nv.left) ? nv.left : this.pos[0];
			var nt = (nv && nv.top) ? nv.top : this.pos[1];
			
			$(this.helper).css('left', nl+'px').css('top', nt+'px'); // Stick the helper to the cursor
			return false;
			
		}
	});

})($);
