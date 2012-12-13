
SRC = $(wildcard local/*/*.js)
CSS = $(wildcard local/*/*.css)
HTML = $(wildcard local/*/*.html)
TEMPLATES = $(HTML:.html=.js)
COMPONENTS = $(wildcard local/*/component.json)

build: components $(SRC) $(CSS) $(TEMPLATES)
	@component build

components: component.json
	@component install

%.js: %.html
	@component convert $<

release: build
	uglifyjs build/build.js -cm -o build/build.min.js

clean:
	rm -fr build components $(TEMPLATES)


.PHONY: clean
