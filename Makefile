all: frenchcv englishcv

frenchcv: RaphaelPinson_fr.pdf
englishcv: RaphaelPinson_en.pdf

%.pdf: %.tex
	pdflatex -interaction=batchmode $<
	pdflatex -interaction=batchmode $<

clean:
	rm -f *.aux *.log *.out
	rm -f *.pdf

