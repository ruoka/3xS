CXX = /usr/local/bin/clang

CXXFLAGS =  -nostdinc++ -I/usr/local/include/c++/v1 -IYarDB/include -std=c++1z

SRCDIR = src

BINDIR = bin

LDFLAGS = -nostdlib -L/usr/lib -L/usr/local/lib -lSystem -lc++ ./YarDB/lib/libyardb.a

TARGETS = $(addprefix $(BINDIR)/, u2a)

$(BINDIR)/%: $(SRCDIR)/%.cpp
	@mkdir -p $(@D)
	$(CXX) $(CXXFLAGS) $(LDFLAGS) $(@:$(BINDIR)/%=$(SRCDIR)/%.cpp) $(OBJECTS) -o $@

.PHONY: all
all: modules $(TARGETS)

.PHONY: modules
modules:
	$(MAKE) -C googletest/googletest/make all
	$(MAKE) -C YarDB bin lib

.PHONY: clean
clean:
	$(MAKE) -C googletest/googletest/make clean
	$(MAKE) -C YarDB clean
	@rm -rf $(BINDIR)

-include $(DEPENDENCIES)
