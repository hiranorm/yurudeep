---
title: chigusa — Plant your ideas in seconds.
description: A notes app that never asks where to save. No titles, no folders, no tags — just write and bury it, then dig it up later with full-text search. Available on Android.
---

# chigusa

> Plant your ideas in seconds.

A notes app for throwing down whatever just occurred to you, without deciding where it goes.
No titles, no folders, no tags, no destination to pick. Open it, write, tap **植える** (plant).

Available on Android via Google Play.

## Why I built it — the thought breaks the moment you pick a folder

Open most notes apps and the first thing they ask is "which folder does this belong in?"
By the time you have chosen a folder, written a title, and added tags, half of what you meant to write has lost its shape.

chigusa is not trying to solve typing speed. It is trying to solve **the thought breaking the moment you start deciding how to store it**.
So filing was cut away from saving entirely. Sort it out when you dig it up.

What you bury doesn't have to be an idea, either. Complaints, small discomforts, observations, a line of dialogue, a fragment of a story, a UI sketch, anger. This is a place to keep the things that don't have names yet, without giving them names.

## What it does

- **Plant** — write, tap the button, done. The field clears instantly and keeps focus, so you can pour in one thought after another
- **Dig up** — full-text search on SQLite + FTS5, a reverse-chronological timeline, and a random shuffle. Seeds can be edited later
- **Beds** — gather the seeds you want to grow into loose groups. Each bed exports to its own Markdown file
- **Observe** — a heatmap of the last 12 weeks, a monthly trend, a scatter map of where seeds were planted, and quiet lifetime totals
- **Nudges** — a random-time prompt asking what has been bothering you lately, and a separate nudge that digs up exactly one sleeping seed
- **Optional location** — only when you turn it on, each seed can keep the latitude and longitude of where it was born

English and Japanese, light and dark.

## Sending seeds onward

chigusa is not the end of the line. Seeds that have grown get moved somewhere else.

- Copy one seed, or several at once, to the clipboard
- Export selected seeds as a Markdown file, or append them to an existing .md
- Exported seeds are archived automatically and drop out of the active pile

## No streaks, no completion rates

The Observe tab is there to be looked at, nothing more. There are no streaks, no consecutive-day counts, no goal percentages, no red badges.
Ignore a nudge and nothing happens. The moment an app makes you feel you *have to* produce a seed, it has inverted the whole point.

## Ads and Premium

chigusa is free. A small banner sits at the top of the Plant and Dig screens.
Watch a rewarded video and ads disappear until 5 AM the next morning. Premium (¥150/month) removes them entirely.

There are no ads inside the writing flow itself, and no interstitials anywhere.

## Privacy

Seed text lives only in an on-device SQLite database and is never transmitted by the app. It leaves the device only when you send it out yourself, through the share sheet or the clipboard.
Location is fully opt-in and off by default; it is read once at save time, and only when both the in-app setting and the OS permission are granted.
See the [privacy policy](https://policies.hira-euclid-norm-root2.workers.dev/chigusa/) for details.

Bugs and requests: hiranorm.support@gmail.com
