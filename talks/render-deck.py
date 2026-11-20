#!/usr/bin/env python3
"""Render a local talk PDF into optimized slide images for the archive viewer."""

import argparse
import re
import shutil
import subprocess
import tempfile
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--crop-to-content",
        action="store_true",
        help="trim page margins before rendering (requires pdfcrop)",
    )
    parser.add_argument("pdf", type=Path, help="PDF deck to render")
    args = parser.parse_args()
    pdf = args.pdf.resolve()
    if not pdf.is_file() or pdf.suffix.lower() != ".pdf":
        parser.error(f"not a PDF file: {pdf}")

    rendered_root = Path(__file__).parent / "decks" / "rendered"
    output = rendered_root / pdf.stem
    rendered_root.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="talk-slide-render-") as temporary:
        temporary_path = Path(temporary)
        pdf_to_render = pdf
        if args.crop_to_content:
            pdfcrop = shutil.which("pdfcrop")
            if not pdfcrop:
                parser.error("--crop-to-content requires pdfcrop")
            pdf_to_render = temporary_path / "cropped.pdf"
            subprocess.run(
                [pdfcrop, "--margins", "20", str(pdf), str(pdf_to_render)],
                check=True,
            )

        prefix = temporary_path / "slide"
        subprocess.run(
            [
                "pdftoppm",
                "-jpeg",
                "-jpegopt",
                "quality=82,optimize=y",
                "-scale-to",
                "1600",
                "-forcenum",
                str(pdf_to_render),
                str(prefix),
            ],
            check=True,
        )
        pages = sorted(
            Path(temporary).glob("slide-*.jpg"),
            key=lambda page: int(re.search(r"-(\d+)\.jpg$", page.name).group(1)),
        )
        if not pages:
            raise RuntimeError(f"Poppler produced no slides for {pdf}")

        output.mkdir(parents=True, exist_ok=True)
        for old_page in output.glob("slide-*.jpg"):
            old_page.unlink()
        for number, page in enumerate(pages, start=1):
            destination = output / f"slide-{number:03}.jpg"
            if args.crop_to_content:
                try:
                    from PIL import Image, ImageOps
                except ImportError:
                    parser.error("--crop-to-content requires Pillow")
                with Image.open(page) as rendered:
                    slide = ImageOps.contain(
                        rendered.convert("RGB"),
                        (1600, 900),
                        method=Image.Resampling.LANCZOS,
                    )
                    canvas = Image.new("RGB", (1600, 900), "white")
                    canvas.paste(
                        slide,
                        ((1600 - slide.width) // 2, (900 - slide.height) // 2),
                    )
                    canvas.save(destination, "JPEG", quality=82, optimize=True)
            else:
                shutil.copyfile(page, destination)

    print(f"Rendered {len(pages)} slides to {output}")


if __name__ == "__main__":
    main()
