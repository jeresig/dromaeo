startTest("core-eval");

// Try to force real results
var ret, tmp;

// The commands that we'll be evaling
var cmd = 'var str="";for(var i=0;i<1000;i++){str += "a";}ret = str;';

// TESTS: eval()

for ( var num = 1; num <= 8; num *= 2 ) (function(num){

	prep(function(){
		tmp = cmd;

		for ( var n = 0; n < num; n++ )
			tmp += tmp;
	});

	test( "Normal eval", num, function(){
		eval(tmp);
	});

	test( "new Function", num, function(){
		(new Function(tmp))();
	});

})(num);

endTest();
