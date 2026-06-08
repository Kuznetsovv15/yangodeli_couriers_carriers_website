#!/usr/bin/env python3
"""Sync Yango Deli brand creatives from public Yandex Disk folder."""

from __future__ import annotations

import json
import pathlib
import urllib.parse
import urllib.request

PUBLIC_KEY = "https://disk.yandex.com/d/13x6l2pIMjLRow"
API = "https://cloud-api.yandex.net/v1/disk/public/resources"
OUT = pathlib.Path(__file__).resolve().parents[1] / "public" / "brand"

FOLDERS = [
    "",
    "/Fonts",
    "/Yango Deli Logo",
    "/Illustration",
    "/first screen",
    "/3d bag",
    "/Yango_Deli_Photos",
    "/Avatars",
    "/Presentation",
]


def api(path: str) -> dict:
    url = f"{API}?public_key={urllib.parse.quote(PUBLIC_KEY)}&path={urllib.parse.quote(path)}&limit=200"
    with urllib.request.urlopen(url) as response:
        return json.load(response)


def download(path: str, dest: pathlib.Path) -> None:
    url = (
        "https://cloud-api.yandex.net/v1/disk/public/resources/download?"
        f"public_key={urllib.parse.quote(PUBLIC_KEY)}&path={urllib.parse.quote(path)}"
    )
    with urllib.request.urlopen(url) as response:
        href = json.load(response)["href"]
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        return
    urllib.request.urlretrieve(href, dest)
    print(f"downloaded: {dest.relative_to(OUT)}")


def walk(folder_path: str, rel: str) -> None:
    for item in api(folder_path).get("_embedded", {}).get("items", []):
        name = item["name"]
        subrel = f"{rel}/{name}" if rel else name
        if item["type"] == "dir":
            walk(item["path"], subrel)
        else:
            try:
                download(item["path"], OUT / subrel)
            except Exception as error:
                print(f"failed: {subrel} ({error})")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for folder in FOLDERS:
        if folder == "":
            for item in api("/").get("_embedded", {}).get("items", []):
                if item["type"] == "file":
                    download(item["path"], OUT / item["name"])
        else:
            walk(folder, folder.strip("/").replace(" ", "_"))
    print("done")


if __name__ == "__main__":
    main()
