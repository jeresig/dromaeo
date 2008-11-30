RUNNER = dep/run/runner.js
TESTS = tests/*.js
HTMLTESTS = tests/*.html
RESULTS = results
PERF = perf
WEB = web
PERFSINGLE = perf-single

all: spidermonkey rhino tamarin jscore

web: ${TESTS}
	@@ rm -rf ${WEB}
	@@ cp -fR dep/web ${WEB}
	@@ cp -fR tests/ ${WEB}/tests
	@@ for i in ${TESTS}; do \
		echo "Converting $${i} to web test..."; \
		cat dep/web/test-head.js "$${i}" dep/web/test-tail.js | \
			sed "s/startTest.\(.*\).;/startTest\(\1 `git log --abbrev-commit "$${i}" | head -1 | sed s/commit./,\'/ | sed s/[.][.][.]//``git log --abbrev-commit "dep/web/webrunner.js" | head -1 | sed s/commit./-/ | sed s/[.][.][.]/\'/`\);/" > ${WEB}"/$${i}"; \
	done
	@@ for i in ${HTMLTESTS}; do \
		echo "Converting $${i} to web test..."; \
		cat "$${i}" | \
			sed "s/startTest.\(.*\).;/startTest\(\1 `git log --abbrev-commit "$${i}" | head -1 | sed s/commit./,\'/ | sed s/[.][.][.]/\'/`\);/" > ${WEB}"/$${i}"; \
	done

perf: ${TESTS}
	@@ mkdir -p ${PERF}
	@@ cp -f ${RUNNER} ${PERF}/
	@@ for i in ${TESTS}; do \
		echo "Converting $${i} to perf test..."; \
		cat dep/perf/head.html "$${i}" dep/perf/tail.html > \
			${PERF}/`echo "$${i}"|sed s/.js//|sed s/tests.//`.html; \
	done

perf-single: ${TESTS}
	@@ mkdir -p ${PERFSINGLE}
	@@ cp -f ${RUNNER} ${PERFSINGLE}/
	@@ echo "Generating single perf tests..."
	@@ perl dep/perf/single.pl ${RESULTS}/spidermonkey.txt

results: ${TESTS}
	@@ mkdir -p ${RESULTS}
	@@ cp -f dep/results/* ${RESULTS}/
	@@ mkdir -p ${RESULTS}/spidermonkey
	@@ mkdir -p ${RESULTS}/spidermonkey-patch
	@@ mkdir -p ${RESULTS}/rhino
	@@ mkdir -p ${RESULTS}/tamarin
	@@ mkdir -p ${RESULTS}/jscore

spidermonkey: results ${TESTS}
	@@ echo "" > ${RESULTS}/spidermonkey.txt
	@@ for i in ${TESTS}; do \
		echo "Testing $${i} in Spidermonkey"; \
		cat ${RUNNER} "$${i}" | ./dep/run/js >> \
			${RESULTS}/spidermonkey.txt; \
	done

rhino: results ${TESTS}
	@@ echo "" > ${RESULTS}/rhino.txt
	@@ for i in ${TESTS}; do \
		echo "Testing $${i} in Rhino"; \
		cat ${RUNNER} "$${i}" > "$${i}.tmp"; \
		java -server -jar dep/run/js.jar -opt 9 "$${i}.tmp" >> \
			${RESULTS}/rhino.txt; \
		rm -f "$${i}.tmp"; \
	done

tamarin: results ${TESTS}
	@@ echo "" > ${RESULTS}/tamarin.txt
	@@ for i in ${TESTS}; do \
		echo "Testing $${i} in Tamarin"; \
		java -jar dep/run/asc.jar -import dep/run/builtin.abc -in ${RUNNER} "$${i}" &> /dev/null; \
		./dep/run/shell `echo "$${i}"|sed s/.js//`.abc >> \
			${RESULTS}/tamarin.txt; \
		rm `echo "$${i}"|sed s/.js//`.abc; \
	done

jscore: results ${TESTS}
	@@ echo "" > ${RESULTS}/jscore.txt
	@@ for i in ${TESTS}; do \
		echo "Testing $${i} in JavaScriptCore"; \
		cat ${RUNNER} "$${i}" > "$${i}.tmp"; \
		./dep/run/testkjs "$${i}.tmp" 2> /dev/null | sed s/--\>.//g >> \
			${RESULTS}/jscore.txt; \
		rm -f "$${i}.tmp"; \
	done

clean:
	@@ rm -rf ${PERF}
	@@ rm -rf ${PERFSINGLE}
	@@ rm -rf ${RESULTS}
	@@ rm -rf ${WEB}
