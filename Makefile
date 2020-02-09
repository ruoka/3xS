CXX = clang

CXXFLAGS = -IYarDB/include -std=c++17

SRCDIR = src

BINDIR = bin

LDFLAGS = -lSystem -lc++ ./YarDB/lib/libyardb.a

TARGETS = $(addprefix $(BINDIR)/, u2a)

$(BINDIR)/%: $(SRCDIR)/%.cpp
	@mkdir -p $(@D)
	$(CXX) $(CXXFLAGS) $(LDFLAGS) $(@:$(BINDIR)/%=$(SRCDIR)/%.cpp) $(OBJECTS) -o $@

.PHONY: all
all: modules $(TARGETS)
	@cp YarDB/bin/yardb bin/yardb

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
