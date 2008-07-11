// View Source
// Next/Prev Test

jQuery.noConflict()(function($){

	var mainWidth = $("#main").width();
	var data = {};
	var engines = ["rhino","spidermonkey","tamarin","jscore"];
	var done = [];
	var colors = PlotKit.Base.baseDarkPrimaryColors();

	jQuery('#main > ul').tabs();
	jQuery('.sidebar')
		.find(".ui-resizable-handle")
		.bind("click", function(){
			var sidebar = $(this).parent().toggleClass("hide");
			var width = mainWidth - parseInt(sidebar.css("width")) - 25;
			
			var canvas = sidebar.parent()
				.find("div.wrap").width( width - 15 )
					.find("div.javascript").width( width - 80 ).end()
				.end()
				.find("canvas").siblings().remove().end()[0];
			
			canvas.width = width;
						
			canvas.layout.evaluate();
			var plotter = new PlotKit.SweetCanvasRenderer(canvas, canvas.layout, {colorScheme: colors});
			plotter.options.backgroundColor =
				new MochiKit.Color.Color(217/255,246/255,214/255);
			plotter.render();
		});
	
	jQuery.each(engines, function(i,engine){
		$("<li><span></span> " + engine + "</li>")
			.find("span").css("background", colors[i].toHexString()).end()
			.appendTo("ul.engines");

		function allDone(){
			done.push( engine );
			if ( done.length == engines.length )
				process();
		}
	
		jQuery.ajax({
			url: engine + ".txt",
			success: function(txt){
				var lines = txt.split(/\r?\n/), m, curTest;
				
				for ( var i = 0; i < lines.length; i++ ) {
					if ( !lines[i].match(/^__/) && lines[i] ) {
						var parts = lines[i].split(/:/);
						var name = "test-" + parts[0], iter = parseInt( parts[1] ),
							avg = parseFloat( parts[3] );
						
						if ( data[name] == null )
							data[name] = { test: curTest };
						
						if ( data[name][engine] == null )
							data[name][engine] = [];
							
						data[name][engine].push( [iter, isNaN(avg) ? -1 : avg] );
					} else if ( m = lines[i].match(/^__start_report:(.*)$/) )
						curTest = m[1];
				}

				allDone();
			},
			error: allDone
		});
	});
	
	function process(){
		var lastTest, row;

		jQuery.each( data, function(name,eng){
			var testName = data[name].test;
			var cleanName = name.replace("test-","");
			var catre = /^(.*?)-/;
			var place = "#" + testName.match(catre)[1];

			if ( testName != lastTest ) {
				row = $('<li><div class="ui-accordion-left"></div><a href="" class="ui-accordion-link"> <span>' + 
						testName.replace(/^[^-]+-/, "") + 
						'</span> <div class="ui-accordion-right"></div> </a><div><ul></ul></div></li>')
					.appendTo(place + " ul.ui-accordion-container");
				lastTest = testName;
			}
			
			var item = $("<li><a href=''>" + cleanName + "</a></li>").click(function(){
			
				this.blur();
				
				var view = $("<a href=''>&raquo; View Source</a>").click(function(){
					
					this.blur();
					
					var chart = $("div.wrap > div:first", place);
					
					if ( chart.is(":visible") ) {
					
						$(this).html("&laquo; Results");
					
						// Fade out bar chart
						chart.slideUp(500).next().hide();
						
						$.ajax({
							url: "tests/" + testName + ".js",
							success: function(js){
								$("div.javascript", place).html(js).chili()
									.slideDown(500, function(){
										var item = $("span").filter(function(){
											return this.innerHTML.indexOf(cleanName.replace("test-","").replace(/ /g, "&nbsp;")) >= 0;
										});
										
										this.scrollTop = 0;
										$(this).animate({scrollTop: item[0].offsetTop - 100}, 1000, function(){
											$(item).css("backgroundColor", "#FFFFFF")
												.animate({backgroundColor: "#282828"}, 1000);
										});
									});
							}
						});
						
					} else {
					
							$(this).html("&raquo; View Source");
					
							$("div.javascript", place).slideUp(500,function(){
								chart.slideDown(500,function(){
									$(this).next().show();
								});
							});
						
					}
					
					return false;
				});
				
				$(place)
					.find("canvas")
						.siblings().andSelf()
							.remove().end().end().end()
					.find("h2").html(cleanName).append(view).end()
					.find("div.wrap > div").show().end()
					.find("div.javascript").hide().end()
					.find("li.active").removeClass("active");
					
				$(this).addClass("active");
			
				var chart = $("<canvas width='575' height='360'></canvas>")
					.appendTo(place + " div.wrap > div:first");
				
				var layout = new PlotKit.Layout("bar");
				jQuery.each(engines, function(i,engine){
					if ( data[name][engine] )
						layout.addDataset(engine, data[name][engine]);
				});
				layout.evaluate();
				
				var canvas = chart[0];
				canvas.layout = layout;
				
				var plotter = new PlotKit.SweetCanvasRenderer(canvas, layout, {colorScheme: colors});
				plotter.options.backgroundColor =
					new MochiKit.Color.Color(217/255,246/255,214/255);
				plotter.render();
				
				return false;
			});
			
			if ( !$("canvas", place).length )
				item.click();
			
			row.find("ul").append(item);
		});
		
		jQuery("ul.ui-accordion-container").each(function(){
			jQuery(this).accordion({ fillSpace: true, minHeight: 200 });
			
			//if ( this.scrollHeight <= 427 )
			//	this.style.overflow = "hidden";
		});
	}
});
