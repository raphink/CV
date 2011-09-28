FTP_DIR=cv

all: frenchcv englishcv

frenchcv: RaphaelPinson_fr.pdf
englishcv: RaphaelPinson_en.pdf

%.pdf: %.tex
	pdflatex -interaction=batchmode $<
	pdflatex -interaction=batchmode $<

upload:
	-ncftpput -f ~/.ncftp/cc.cfg $(FTP_DIR)/ *.pdf

clean:
	rm -f *.aux *.log *.out
	rm -f *.pdf

