MODERNCV=moderncv

all: frenchcv englishcv

frenchcv: RaphaelPinson_fr.pdf
englishcv: RaphaelPinson_en.pdf

%.pdf: %.tex
	TEXINPUTS=$(MODERNCV): pdflatex $<

clean:
	rm -f *.aux *.log *.out
	rm -f *.pdf

