# Talks archive

The archive is a static GitHub Pages page that brings recorded and slide-only talks together across two decades of public teaching.

`https://www.youtube.com/playlist?list=PLP1tb3WVc_wjlegrHszh0BdnBNn2NqNQe`

Talks are grouped by event and date, with local PDF decks, recording links, and slide cues where available. Alternate deck editions stay with their matching talk.

## Add a locally hosted deck

1. Put the PDF in `talks/decks/`, using a short lowercase filename based on the talk slug.
2. Render the PDF into local slide images with `python3 talks/render-deck.py talks/decks/<filename>.pdf`. This uses Poppler (`pdftoppm`) and writes optimized JPEG slides under `talks/decks/rendered/<filename-without-extension>/`.
   For PDFs whose landscape slides have oversized page margins, add `--crop-to-content` (requires `pdfcrop` and Pillow) to trim the margins and fit the slide into a 16:9 canvas.
3. Add a `deck` field and its PDF `pageCount` to the matching record in `talks.json`, for example `"deck": "decks/bridging-dev-and-ops.pdf", "pageCount": 42`. The player uses the images for display and the count for its previous/next controls. Add `date` as an ISO date, month (`YYYY-MM`), or year when only that is known, `dateDisplay` for a range or qualified date, and `programUrl` or `conferenceUrl` when available.
4. YouTube recordings use `id`. For another browser-playable video file, use `recordingUrl`, `recordingType`, and (when available) `recordingPageUrl`. Entries with no recording or deck still show their event details and program link without an empty media panel.
5. To enable video-to-slide sync, add timestamp/page cues in playback order, for example `"slideCues": [{"time": 0, "page": 1}, {"time": 48, "page": 2}]`. `time` is seconds from the start of the video; `page` is the PDF page number. Sync starts enabled when cue data exists; viewers can turn it off, and manual slide navigation pauses it.
6. Commit the PDF, rendered images, and JSON change. For talks with both video and a PDF, the modal shows the paired player with side-by-side, focus, and mobile tab layouts, plus an expand control. Talks with only one media type use a single-media layout.

Several recordings have approximate cue maps based on event chapter markers or the first spoken matches between YouTube captions and slide text. Refine these with the local editor and keep the cue note explicit about its accuracy.

The archive itself is static, so new recordings or decks are added by editing `talks.json` and committing the media file.

## Refine slide cues locally

Run the archive from the repository root with `python3 -m http.server 8000`, then open `http://localhost:8000/talks/cue-editor.html`. The editor keeps changes in browser local storage until you export a fresh `talks.json`.

The cue editor places the video beside the selected PDF page. Use **Cue current video time** to add an observed transition, or use **Find a slide transition** to narrow a time window by dichotomy: seek to its midpoint, inspect the video frame, and choose whether the new slide is visible. The YouTube embed is cross-origin, so the editor cannot inspect its pixels directly; the frame comparison remains manual. Export `talks.json` and replace the archive file after reviewing the cue notes.
