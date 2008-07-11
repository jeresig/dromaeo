(function($) { 
  //If the UI scope is not availalable, add it
  $.ui = $.ui || {};

  $.fn.form = function(o) {
    return this.each(function() {
      new $.ui.form(this,o);  
    });
  }
  $.ui.form = function(el, o) {
    //Check if form UI has already been applied
    if(!(' '+el.className+' ').indexOf(" ui-form ")) return false;
    var $span,$el = $(el);
    var wrap = function(c,e){
      var $e = (e)?$(e):$el;
      var $s = $('<span><span class="ui-form-inner"></span></span>')
               .addClass(el.className).addClass(c);
      return $e.wrap($s).parent().parent();
    }
    switch(el.nodeName.toLowerCase()) {
    case "button": case "input":
      //Wrap element
      var type = ((el.type)?el.type:el.nodeName).toLowerCase();
      $span=wrap("ui-form-"+type);
      //Apply common class to buttons
      if(/button|reset|submit/i.test(type)) $span.addClass("ui-form-buttons");
      //Apply class states to label also
      if($span && el.id) $span=$span.add($("label[@for='"+el.id+"']"));
      //Checkboxes and Radios have their element hidden
      if(/checkbox|radio/i.test(el.type)) {
        $el.addClass("ui-form-hide")
        .before('<span class="ui-form-content">&middot;</span>');
        var check = function(){ //Checkbox States
          if(el.checked) $span.addClass("selected");
          else $span.removeClass("selected");
        }
        var radio = function(){ //Radio States
          if(el.name) $(":radio[@name='"+el.name+"']")
                      .parent().parent().removeClass("selected");
          $span.addClass("selected");
        }
        if(/checkbox/i.test(el.type)) { //Bind checkbox events
          $span.mousedown(function(){ $el.click(); });
          $span.click(function(){ check(); });
          check();
        }
        if(/radio/i.test(el.type)) { //Bind radio events
          $span.mousedown(function(){ $el.click().focus();  });
          $span.click(function(){ radio() });
          radio();
        }
        $span
        .mouseover(function(){ $el.mouseover(); })
        .mouseout(function(){ $el.mouseout(); })
        .mousedown(function(){ $el.mousedown(); })
        .mouseup(function(){ $el.mouseup(); });
        $el
        .keydown(function(){ $span.addClass("active"); })
        .keyup(function(){ $span.removeClass("active"); })
      }
      //TODO: file
    break; case "select":
      //TODO: style select
    break; case "textarea":
      $span=wrap("ui-form-textarea");
      //The following could be replaced with dimensions outerWidth
      $span.width($el.width()+parseInt($el.css("padding-left"))+parseInt($el.css("padding-right")));
    break; case "fieldset":
      //TODO: collapsable fieldsets (need to wrap content not including legend)
      $span=wrap("ui-form-fieldset");
      $("legend",el).addClass("ui-form")
      .each(function(){ wrap("ui-form-legend",this) });
    default: 
      $el.find("input, select, textarea, fieldset, button").form(o);
    break;
    }
    $el.addClass("ui-form");
    //Apply class states to label also
    if($span && $span.length==1 && el.id)
      $span=$span.add($("label[@for='"+el.id+"']"));
    if($span) $el
      .mouseover(function(){ $span.addClass("hover"); })
      .mouseout(function(){ $span.removeClass("hover"); })
      .mousedown(function(){ $span.addClass("active"); })
      .mouseup(function(){ $span.removeClass("active"); })
      .focus(function(){ $span.addClass("focus"); })
      .blur(function(){ $span.removeClass("focus"); });
    return true;
  }

})($);


//Speed Test
var speed = function(time,a,b){
  var t = new Date(); for(var i=0; (new Date())-t<time; i++) a(); i--;
  var t = new Date(); for(var j=0; (new Date())-t<time; j++) b(); j--;
  console.log("Speed Test("+time+"ms): ",Math.round(((j-i)/j)*100)+'% ',[i,j]);
  return [i,j];
};

var speedtest = function(times){
  var f = $("form:first"); var l=[]; var c=0,d=0;
  var a = function(){ f.clone().form(false); };
  var b = function(){ f.clone().form(true); };
  for(var i=0; i<times.length; i++) l.push(speed(times[i],a,b));
  for(var i=l.length; i-->0;) { c+=l[i][0]; d+=l[i][1]; }
  console.log("Average: ",Math.round(((d-c)/d)*100)+'% ',[c,d]);
}

var time = function(){
  var f = $("form:first").clone();
  var a = new Date();
  f.form();
  var b = new Date();
  console.log("Time: "+(b-a)+"ms");
}

var repeat = function(v,x){ var l=[]; for(var i=x; i-->0;) l.push(v); return l; }
var test = function(){ speedtest([400,600,800]); }
var longtest = function(){ speedtest([4000,4000,4000]); }
//$(time);
