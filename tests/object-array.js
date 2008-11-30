startTest("object-array");

var ret = [], tmp, num = 500;

for ( var i = 16384; i <= 131072; i *= 2 ) (function(i){

	i = 131072 / 128;

	// TESTS: Array Building

	test("Array Construction, []", i, function(){
		for ( var j = 0; j < i * 15; j++ ) {
			ret = [];
			ret.length = i;
		}
	});

	test("Array Construction, new Array()", i, function(){
		for ( var j = 0; j < i * 10; j++ )
			ret = new Array(i);
	});

	test("Array Construction, unshift", i, function(){
		ret = [];
		for ( var j = 0; j < i; j++ )
			ret.unshift(j);
	});

	test("Array Construction, splice", i, function(){
		ret = [];
		for ( var j = 0; j < i; j++ )
			ret.splice(0,0,j);
	});

	test("Array Deconstruction, shift", i, function(){
		var a = ret.slice();
		for ( var j = 0; j < i; j++ )
			tmp = a.shift();
	});

	test("Array Deconstruction, splice", i, function(){
		var a = ret.slice();
		for ( var j = 0; j < i; j++ )
			tmp = a.splice(0,1);
	});

	test("Array Construction, push", i, function(){
		ret = [];
		for ( var j = 0; j < i * 25; j++ )
			ret.push(j);
	});

	test("Array Deconstruction, pop", i, function(){
		var a = ret.slice();
		for ( var j = 0; j < i * 25; j++ )
			tmp = a.pop();
	});

})(i);

endTest();
