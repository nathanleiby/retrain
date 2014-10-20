# usage:
# `make test` runs all the tests
# `make some_file` runs just the test `test/some_file.js`
.PHONY: test 
TESTS=$(shell cd test && ls *.js | sed s/\.js$$//)
LINT=$(shell ls *.js | sed s/\.js$$//)

test: $(TESTS) lint

$(TESTS): 
	DEBUG=* NODE_ENV=test node_modules/mocha/bin/mocha --timeout 60000 test/$@.js

lint: $(LINT)

$(LINT):
	./node_modules/lint/bin/node-lint $@.js
