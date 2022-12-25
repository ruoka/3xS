.DEFAULT_GOAL := all

OS := $(shell uname -s)
CXX := clang++

ifeq ($(OS),Linux)
CC :=  /usr/lib/llvm-15/bin/clang
CXX := /usr/lib/llvm-15/bin/clang++
CXXFLAGS := -pthread -I/usr/local/include
LDFLAGS := -L/usr/local/lib
endif

ifeq ($(OS),Darwin)
CC := /Library/Developer/CommandLineTools/usr/bin/clang
CXX := /Library/Developer/CommandLineTools/usr/bin/clang++
CXXFLAGS := -isysroot /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk
#LDFLAGS :=
endif

CXXFLAGS += -std=c++20 -stdlib=libc++ -MMD -Wall -Wextra -IYarDB/include
LDFLAGS += $(LIBRARIES)

SRCDIR = src
BINDIR = bin

TARGETS = $(addprefix $(BINDIR)/, u2a)
LIBRARIES = ./YarDB/lib/libyardb.a ./YarDB/lib/libnet4cpp.a

$(BINDIR)/%: $(SRCDIR)/%.cpp $(LIBRARIES)
	@mkdir -p $(@D)
	$(CXX) $(CXXFLAGS) $(LDFLAGS) $(@:$(BINDIR)/%=$(SRCDIR)/%.cpp) $(OBJECTS) -o $@

YarDB/lib/%.a:
	$(MAKE) -C YarDB lib bin

.PHONY: all
all: $(TARGETS)
	@cp YarDB/bin/yardb bin/yardb

.PHONY: modules
modules:
	$(MAKE) -C googletest/googletest/make all

.PHONY: clean
clean:
	$(MAKE) -C googletest/googletest/make clean
	$(MAKE) -C YarDB clean
	@rm -rf $(BINDIR)

-include $(DEPENDENCIES)
