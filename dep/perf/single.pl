#!/usr/bin/perl

my $cur = "", $num = 0;

open(M, "> perf-single/perf-single.manifest");

while (<>) {
	if ( /__start_report:(.*)/ ) {
		$cur = $1;
		$num = 0;
	}

	if ( !/^__/ ) {
		my @parts = split(/:/, $_);
	
		if ( $#parts > 0 ) {
			my $name = $parts[0], $n = $parts[1];
			my $file = `cat dep/run-head.html` . "var onlyName = '$name', onlyNum = $n;\n\n" .
				`cat tests/$cur\.js dep/run-tail.html`;
	
			open(F, "> perf-single/$cur\-$num\.html");
			print F $file;
			close(F);

			print M "% $cur\-$num\.html\n";
		}
	}

	$num++;
}

close(M);
