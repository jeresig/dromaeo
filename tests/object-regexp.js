startTest("object-regexp");

// Try to force real results
var str = [], tmp, ret, re;

for ( var i = 0; i < 16384; i++ )
	str.push( String.fromCharCode( (25 * Math.random()) + 97 ) );

str = str.join("");

for ( var i = 16384; i <= 131072; i *= 2 ) (function(i){

	// TESTS: split

	prep(function(){
		re = //;
		tmp = str;
	});

	test( "Compiled Object Empty Split", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = tmp.split( re );
	});

	prep(function(){
		re = /a/;
		tmp = str;
	});

	test( "Compiled Object Char Split", i, function(){
		for ( var i = 0; i < 30; i++ )
			ret = tmp.split( re );
	});

	prep(function(){
		re = /.*/;
		tmp = str;
	});

	test( "Compiled Object Variable Split", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = tmp.split( re );
	});
    
	// TESTS: Compiled RegExps

	prep(function(){ 
		re = /aaaaaaaaaa/g;
		tmp = str;
	});
    
	test( "Compiled Match", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = tmp.match( re );
	});
	
	prep(function(){
		tmp = str;
	});
    
	test( "Compiled Test", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = re.test( tmp );
	});
    
	prep(function(){
		tmp = str;
	});
    
	test( "Compiled Empty Replace", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, "" );
	});
	
	prep(function(){
		tmp = str;
	});
	
	test( "Compiled 12 Char Replace", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, "asdfasdfasdf" );
	});
	
	prep(function(){
		re = new RegExp("aaaaaaaaaa", "g");
		tmp = str;
	});
    
	test( "Compiled Object Match", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = tmp.match( re );
	});
	
	prep(function(){
		tmp = str;
	});
    
	test( "Compiled Object Test", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = re.test( tmp );
	});
    
	prep(function(){
		tmp = str;
	});
    
	test( "Compiled Object Empty Replace", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, "" );
	});
	
	prep(function(){
		tmp = str;
	});
	
	test( "Compiled Object 12 Char Replace", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, "asdfasdfasdf" );
	});
	
	prep(function(){
		tmp = str;
	});
	
	test( "Compiled Object 12 Char Replace Function", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, function(all){
			return "asdfasdfasdf";
		});
	});
	
	// TESTS: Variable Length
	
	prep(function(){
		re = /a.*a/;
		tmp = str;
	});
    
	test( "Compiled Variable Match", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = tmp.match( re );
	});
	
	prep(function(){
		tmp = str;
	});
    
	test( "Compiled Variable Test", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = re.test( tmp );
	});
    
	prep(function(){
		tmp = str;
	});
    
	test( "Compiled Variable Empty Replace", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, "" );
	});
	
	prep(function(){
		tmp = str;
	});
	
	test( "Compiled Variable 12 Char Replace", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, "asdfasdfasdf" );
	});
	
	prep(function(){
		re = new RegExp("aaaaaaaaaa", "g");
		tmp = str;
	});
    
	test( "Compiled Variable Object Match", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = tmp.match( re );
	});
	
	prep(function(){
		tmp = str;
	});
    
	test( "Compiled Variable Object Test", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = re.test( tmp );
	});
    
	prep(function(){
		tmp = str;
	});
    
	test( "Compiled Variable Object Empty Replace", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, "" );
	});
	
	prep(function(){
		tmp = str;
	});
	
	test( "Compiled Variable Object 12 Char Replace", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, "asdfasdfasdf" );
	});
	
	prep(function(){
		tmp = str;
	});
	
	test( "Compiled Variable Object 12 Char Replace Function", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, function(all){
			return "asdfasdfasdf";
		});
	});
	
	// TESTS: Capturing
	
	prep(function(){
		re = /aa(b)aa/g;
		tmp = str;
	});
	
	test( "Compiled Capture Match", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = tmp.match( re );
	});
	
	prep(function(){
		tmp = str;
	});
	
	test( "Compiled Capture Replace", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, "asdfasdfasdf" );
	});
	
	prep(function(){
		tmp = str;
	});
	
	test( "Compiled Capture Replace with Capture", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, "asdf\\1asdfasdf" );
	});
	
	prep(function(){
		tmp = str;
	});
	
	test( "Compiled Capture Replace with Capture Function", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, function(all,capture){
			return "asdf" + capture + "asdfasdf";
		});
	});
	
	prep(function(){
		tmp = str;
	});
	
	test( "Compiled Capture Replace with Upperase Capture Function", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( re, function(all,capture){
			return capture.toUpperCase();
		});
	});
	
	// TESTS: Uncompiled RegExps
	
	prep(function(){
		tmp = str;
	});
    
	test( "Uncompiled Match", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = tmp.match( /aaaaaaaaaa/g );
	});
	
	prep(function(){
		tmp = str;
	});
    
	test( "Uncompiled Test", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = (/aaaaaaaaaa/g).test( tmp );
	});
    
	prep(function(){
		tmp = str;
	});
    
	test( "Uncompiled Empty Replace", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( /aaaaaaaaaa/g, "" );
	});
	
	prep(function(){
		tmp = str;
	});
	
	test( "Uncompiled 12 Char Replace", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( /aaaaaaaaaa/g, "asdfasdfasdf" );
	});
	
	prep(function(){
		tmp = str;
	});
    
	test( "Uncompiled Object Match", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = tmp.match( new RegExp("aaaaaaaaaa", "g") );
	});
	
	prep(function(){
		tmp = str;
	});
    
	test( "Uncompiled Object Test", i, function(){
		for ( var i = 0; i < 100; i++ )
			ret = (new RegExp("aaaaaaaaaa", "g")).test( tmp );
	});
    
	prep(function(){
		tmp = str;
	});
    
	test( "Uncompiled Object Empty Replace", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( new RegExp("aaaaaaaaaa", "g"), "" );
	});
	
	prep(function(){
		tmp = str;
	});
	
	test( "Uncompiled Object 12 Char Replace", i, function(){
		for ( var i = 0; i < 50; i++ )
			ret = tmp.replace( new RegExp("aaaaaaaaaa", "g"), "asdfasdfasdf" );
	});
	
	// Double the length of the string
	prep(function(){
		str += str;
	});
})(i);

endTest();
