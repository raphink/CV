# What is this

This is a repository that contains my up-to-date CV in LaTeX.

You can find the live versions of the CV on http://cv.raphink.info

# How to build

## Simple usage

To build all the versions (PDF and HTML), type `make`.


## PDF version

In order to build the PDF versions of this CV, you will need:

   * A LaTeX distribution (TeXLive 2012 recommended);
   * LuaTeX;
   * MinionPro, MyriadPro and Octicons fonts (you can find them under the fonts folder.  Just copy them to /usr/local/share/fonts).

To build the PDF CVs, type `make pdf`.


## HTML version

The HTML version of this CV is generated from the PDF version, using [pdf2htmlex](https://github.com/coolwanglu/pdf2htmlEX). Once you have `pdf2htmlex` in your `PATH`, type `make html` to build the files.


# About the `gh-pages` branch

This project has a `gh-pages` branch hosting the http://cv.raphink.info.

The `gh-pages` branch contains a simple static HTML page and the HTML CV files generated from `pdf2htmlex`.

The `index.html` page also allows to download the PDF CV files stored in the `master` branch.

