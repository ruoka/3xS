all:
	$(MAKE) -C googletest/googletest/make all
	$(MAKE) -C YarDB bin lib

clean:
	$(MAKE) -C googletest/googletest/make clean
	$(MAKE) -C YarDB clean
