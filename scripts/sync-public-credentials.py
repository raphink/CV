#!/usr/bin/env python3
"""Refresh the public credential feed from the public Credly badge wallet."""

from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.request
from io import BytesIO
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "certifications" / "credentials.json"
PROFILE = "https://www.credly.com/users/raphink/badges.json"
BADGE_ARTWORK = {
    "organizer-2024-cloud-native-community-group": "https://images.credly.com/images/ea61e2b7-e182-4fee-88d7-acfd1c5a1259/blob",
    "lfc102-inclusive-open-source-community-orientation": "https://images.credly.com/images/4c923ac7-3490-4198-8ee6-fa9d3eb99b0d/blob",
    "speaker-kcd-munich-2024": "https://images.credly.com/images/a8555fcf-f3f2-4eef-a31f-4d20bd73d4e6/image.png",
    "fundamentals-for-envoy-by-solo-io": "https://images.credly.com/images/735f0832-b12e-4692-b41f-54c8c3729eda/image.png",
    "cks-certified-kubernetes-security-specialist": "https://images.credly.com/images/9945dfcb-1cca-4529-85e6-db1be3782210/kubernetes-security-specialist-logo2.png",
}
BADGE_DIR = ROOT / "certifications" / "badges"


def image_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.casefold()).strip("-")


def fetch_page(url: str) -> dict[str, Any]:
    request = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "raphink.info credentials sync"})
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.load(response)
    if not isinstance(payload, dict) or not isinstance(payload.get("data"), list):
        raise ValueError("The public badge feed did not contain a data array")
    return payload


def page_url(page: int) -> str:
    separator = "&" if "?" in PROFILE else "?"
    return f"{PROFILE}{separator}api=api&page={page}"


def issuer_details(record: dict[str, Any]) -> tuple[str, str]:
    issuer = record.get("issuer") or {}
    entities = issuer.get("entities") if isinstance(issuer, dict) else None
    if isinstance(entities, list):
        for item in entities:
            entity = item.get("entity") if isinstance(item, dict) else None
            if isinstance(entity, dict) and entity.get("name"):
                return str(entity["name"]), str(issuer.get("summary", ""))
    summary = issuer.get("summary", "") if isinstance(issuer, dict) else str(issuer)
    name = str(summary).removeprefix("issued by ").split(" and authorized by ", 1)[0]
    return name or "Credential", str(summary)


def normalized(record: dict[str, Any]) -> dict[str, str]:
    template = record.get("badge_template") or {}
    issuer_name, issuer_summary = issuer_details(record)
    name = template.get("name") or record.get("name") or "Credential"
    badge_id = record.get("id")
    if not badge_id:
        raise ValueError(f"Credential {name!r} has no public badge ID")

    issued = record.get("issued_at_date") or record.get("issued_at")
    expires = record.get("expires_at_date") or record.get("expires_at")
    if isinstance(issued, str):
        issued = issued[:10]
    if isinstance(expires, str):
        expires = expires[:10]
    status = "Expired" if expires and date.fromisoformat(expires) < date.today() else "Current"

    template_image = template.get("image") or {}
    image = record.get("image_url") or (template_image.get("url") if isinstance(template_image, dict) else None)
    image = image or BADGE_ARTWORK.get(image_key(str(name)))
    result = {
        "name": str(name),
        "issuer": issuer_name,
        "status": status,
        "url": f"https://www.credly.com/badges/{badge_id}/public_url",
    }
    if issued:
        result["issued"] = str(issued)
    if expires:
        result["expires"] = str(expires)
    if image and str(image).startswith("https://images.credly.com/"):
        result["image"] = str(image)
    return result


def download_badge_artwork(image_url: str, badge_url: str) -> str | None:
    """Store a small local copy of Credly artwork for reliable, fast page loads."""
    if not image_url.startswith("https://images.credly.com/"):
        return None
    match = re.search(r"/badges/([0-9a-f-]+)/public_url", badge_url)
    if not match:
        return None
    badge_id = match.group(1)
    destination = BADGE_DIR / f"{badge_id}.webp"
    if destination.is_file():
        return "/certifications/badges/" + destination.name
    try:
        request = urllib.request.Request(image_url, headers={"User-Agent": "raphink.info credential artwork sync"})
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = response.read(8 * 1024 * 1024 + 1)
        if len(payload) > 8 * 1024 * 1024:
            raise ValueError("badge image exceeds 8 MB")
        from PIL import Image
        with Image.open(BytesIO(payload)) as image:
            image.thumbnail((128, 128), Image.Resampling.LANCZOS)
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
            BADGE_DIR.mkdir(parents=True, exist_ok=True)
            image.save(destination, "WEBP", quality=90, method=6)
        return "/certifications/badges/" + destination.name
    except (urllib.error.URLError, TimeoutError, OSError, ValueError, ImportError) as error:
        print(f"Badge artwork unavailable for {badge_id}: {error}", file=sys.stderr)
        return None


def main() -> int:
    try:
        first = fetch_page(page_url(1))
        metadata = first.get("metadata") or {}
        total_pages = int(metadata.get("total_pages", 1))
        records = list(first["data"])
        for page in range(2, total_pages + 1):
            payload = fetch_page(page_url(page))
            records.extend(payload["data"])
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, ValueError) as error:
        print(f"Public credential sync failed: {error}", file=sys.stderr)
        return 1

    # Exclude self-issued company credentials and keep one copy of repeated badges.
    filtered: dict[tuple[str, str], tuple[str, dict[str, str]]] = {}
    for record in records:
        issuer_name, issuer_summary = issuer_details(record)
        if "isovalent" in f"{issuer_name} {issuer_summary}".casefold():
            continue
        item = normalized(record)
        key = (item["issuer"].casefold(), item["name"].casefold())
        issued = item.get("issued", "")
        existing = filtered.get(key)
        if existing is None or issued > existing[0]:
            filtered[key] = (issued, item)

    credentials = [item for _, item in filtered.values()]
    for item in credentials:
        if "Puppet Enterprise Professional" in item["name"] and item.get("issued", "") < "2022-01-01":
            item["issuer"] = "Puppet"
        image = item.get("image")
        if image:
            item["image"] = download_badge_artwork(image, item["url"]) or image
    credentials.sort(key=lambda item: (item.get("issued", ""), item["name"].casefold()), reverse=True)
    if not credentials:
        print("No eligible public credentials were returned; keeping the existing feed.", file=sys.stderr)
        return 1

    try:
        existing = json.loads(OUTPUT.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        existing = {}
    if existing.get("credentials") == credentials:
        print(f"The public feed is unchanged ({len(credentials)} credentials).")
        return 0

    feed = {
        "updatedAt": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "source": PROFILE,
        "credentials": credentials,
    }
    OUTPUT.write_text(json.dumps(feed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated the feed with {len(credentials)} public, non-Isovalent credentials from {len(records)} badge records.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
