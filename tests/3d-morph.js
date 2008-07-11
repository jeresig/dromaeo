// Test from here:
// http://webkit.org/misc/morph.html

startTest("3d-morph");

var loops = 15, nx, nz, a;

function morph(a,f) {
    var PI2nx = Math.PI * 8/nx;
    var sin = Math.sin;
    var f30 = -(50 * sin(f*Math.PI*2));
    
    for (var i = 0; i < nz; ++i) {
        for (var j = 0; j < nx; ++j) {
            a[3*(i*nx+j)+1]    = sin((j-1) * PI2nx ) * -f30
        }
    }
}

    
for ( var size = 30; size <= 240; size *= 2 ) (function(size){
	prep(function(){
		nz = nx = size;
	});

	test("Mesh Transform", size, function(){
		a = Array();
		for (var i=0; i < nx*nz*3; ++i)
			a[i] = 0;

		for (var i = 0; i < loops; ++i) {
    			morph(a, i/loops)
		}
	});
})(size);

endTest();
