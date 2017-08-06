all:
	$(MAKE) -C googletest/googletest/make
	$(MAKE) -C YarDB yar

clean:
	$(MAKE) -C googletest/googletest/make clean
	$(MAKE) -C YarDB clean
