# -*- coding: utf-8 -*-
"""Rebuild the articulate-materials hub as a free sample + full library split."""
import io, os, re, html
from bs4 import BeautifulSoup

REPO = r"C:/Users/irieb/Documents/William-Projects/_fix-clones/articulate-materials"
STAGE = r"C:/Users/irieb/Documents/William-Projects/5-esl-materials/articulate-full-library"

src = io.open(os.path.join(REPO, "index.html"), encoding="utf-8").read()
STYLE = src[src.index("<style>"):src.index("</style>") + len("</style>")]
CSP = ('<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; '
       'script-src \'self\'; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; '
       'font-src \'self\' https://fonts.gstatic.com; img-src \'self\' data:; '
       'connect-src \'self\'; base-uri \'self\'; form-action \'self\'; frame-ancestors \'none\'">')


def head(title, desc):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
{CSP}
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#060a14">
<meta name="description" content="{html.escape(desc)}">
<title>{html.escape(title)}</title>
<link rel="icon" type="image/png" href="assets/logo/favicon-32.png">
<link rel="apple-touch-icon" href="assets/logo/favicon-64.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
{STYLE}
</head>
<body>
"""


def shell(title, desc, nav, body_html, foot_note):
    return (head(title, desc)
            + "\n<header class=\"header\">\n  <div class=\"header-inner\">\n"
            + '    <a class="brand" href="index.html">\n'
            + '      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M12 22V12"/><path d="m3 7 9 5 9-5"/></svg>\n'
            + "      Articulate <span>Materials</span>\n    </a>\n"
            + '    <nav class="nav" aria-label="Collections">\n'
            + "\n".join(f'      <a href="{h}">{t}</a>' for h, t in nav)
            + "\n    </nav>\n  </div>\n</header>\n\n<main>\n"
            + body_html
            + "\n" + foot_note +
            "\n</main>\n\n<footer class=\"footer\">\n  <div class=\"footer-inner\">\n    <div>\n"
            + '      <a href="https://articulate-english.github.io/articulate-english/">Articulate English</a>\n'
            + '      <a href="https://articulate-english.github.io/articulate-english/privacy.html">Privacy</a>\n'
            + '      <a href="https://articulate-english.github.io/articulate-english/terms.html">Terms</a>\n'
            + '      <a href="https://articulate-english.github.io/articulate-english/impressum.html">Impressum</a>\n'
            + "    </div>\n    <div>Free sample &middot; the full library is a download</div>\n  </div>\n</footer>\n\n</body>\n</html>\n")


FOOT = ('<section class="note">\n  <h2>Materials are free. Lessons are not.</h2>\n  <p>The sample '
        'above is free self-study. If you want a teacher to hear you, correct you and plan '
        'around your goals, that is the paid part &mdash; one-to-one lessons with a named '
        'teacher, not a call centre. <a href="https://articulate-english.github.io/articulate-english/">'
        'Go to Articulate English</a></p>\n</section>')

NAV = [("index.html", "Home"), ("b2-speaking/index.html", "B2 Speaking"),
       ("full-library.html", "Full Library")]

# ─────────────────────────── 1. home ───────────────────────────
home_body = """
  <section class="hero">
    <span class="eyebrow">Free sample</span>
    <h1>Practice English with <em>real materials</em>, not an app.</h1>
    <p>Slide decks and practice pages built by a working teacher. The B2 speaking
       decks below are free to use &mdash; no sign-up, no account. The rest of the
       library is a download.</p>
  </section>

  <section class="collections" aria-label="Free sample">

    <a class="card" href="b2-speaking/index.html">
      <div class="card-top">
        <div class="card-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/></svg>
        </div>
        <div>
          <h2>B2 Speaking Decks</h2>
          <div class="count">Free &middot; 12 decks</div>
        </div>
      </div>
      <p>Upper-intermediate speaking practice across health, work, travel, food,
         technology and more. Each deck is a self-contained slide lesson with
         model answers.</p>
      <span class="go">Open the decks <span aria-hidden="true">&rarr;</span></span>
    </a>

    <a class="card" href="full-library.html">
      <div class="card-top">
        <div class="card-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </div>
        <div>
          <h2>The Full Library</h2>
          <div class="count">Download &middot; 76 pages</div>
        </div>
      </div>
      <p>47 IELTS speaking mock exams, 24 learning-library pages and the curriculum
         reference set &mdash; the whole shelf behind the free decks.</p>
      <span class="go">See what is inside <span aria-hidden="true">&rarr;</span></span>
    </a>

  </section>
"""

# ─────────────────────── 2. full library page ───────────────────
lib_body = """
  <section class="hero">
    <span class="eyebrow">The full library</span>
    <h1>Every practice page, in <em>one download</em>.</h1>
    <p>76 pages built by a working teacher: IELTS mock exams, the learning library
       and the curriculum reference set. Yours to keep, print and use in class.</p>
  </section>

  <section class="collections" aria-label="Library contents">

    <div class="card">
      <div class="card-top">
        <div class="card-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div>
          <h2>IELTS Speaking Practice</h2>
          <div class="count">47 mock exams</div>
        </div>
      </div>
      <p>Topic-based mock exams, each with Part 1 interview questions, a Part 2
         cue-card task and Part 3 discussion questions &mdash; from holidays and
         health to business, influence and social problems.</p>
    </div>

    <div class="card">
      <div class="card-top">
        <div class="card-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </div>
        <div>
          <h2>Learning Library</h2>
          <div class="count">23 pages</div>
        </div>
      </div>
      <p>Grammar packs (linking words from B1 to C2), speaking lessons, business
         English, conversation question sets and accent work &mdash; the reference
         shelf behind the decks.</p>
    </div>

    <div class="card">
      <div class="card-top">
        <div class="card-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>
        </div>
        <div>
          <h2>Curriculum Reference</h2>
          <div class="count">6 pages</div>
        </div>
      </div>
      <p>The level framework and assessment criteria &mdash; how the levels map to
         CEFR, how speaking is scored, and how a conversation is assessed.</p>
    </div>

  </section>

  <section class="note">
    <h2>How to get it</h2>
    <p>The full library is prepared as a downloadable pack. To receive it,
       <a href="https://articulate-english.github.io/articulate-english/">enquire at
       Articulate English</a> and it will be sent to you. If you would rather a
       teacher work through it with you, that is the one-to-one side of the same
       school.</p>
  </section>
"""

# ─────────────────── 3. per-collection library pages ────────────
COLLECTIONS = [
    ("english-speaking", "IELTS Speaking Practice", "47 mock exams",
     "Topic-based mock exams with Part 1, Part 2 and Part 3 tasks.",
     "english-speaking/index.html"),
    ("learning-materials", "Learning Library", "23 pages",
     "Grammar packs, speaking lessons, business English and accent work.",
     "learning-materials/index.html"),
    ("curriculum", "Curriculum Reference", "6 pages",
     "The level framework, band criteria and assessment rubrics.",
     "curriculum/index.html"),
]


def collection_titles(path):
    soup = BeautifulSoup(io.open(os.path.join(STAGE, path), encoding="utf-8").read(), "html.parser")
    nav = {a.get_text(" ", strip=True) for a in soup.select("nav a")}
    out = []
    for a in soup.select("a[href$='.html']"):
        href = a.get("href", "")
        if href.endswith("index.html"):
            continue
        t = a.get_text(" ", strip=True)
        t = re.sub(r"(Part 1 · Part 2 · Part 3|•)", "", t).strip()
        if not t or t in nav or len(t) > 60:
            continue
        out.append(t)
    seen, uniq = set(), []
    for t in out:
        k = t.lower()
        if k not in seen:
            seen.add(k); uniq.append(t)
    return uniq


for slug, title, count, blurb, href in COLLECTIONS:
    titles = collection_titles(href)
    items = "\n".join(f'      <li>{html.escape(t)}</li>' for t in titles[:60])
    body = f"""
  <section class="hero">
    <span class="eyebrow">In the full library</span>
    <h1>{html.escape(title)}</h1>
    <p>{html.escape(blurb)} This collection is part of the full library download,
       together with the other two collections.</p>
  </section>

  <section class="note">
    <h2>{html.escape(count)} included</h2>
    <ul style="margin:0 0 1rem 1.25rem;color:var(--text-muted);line-height:1.9">
{items}
    </ul>
    <p><a href="../full-library.html">Get the full library</a></p>
  </section>
"""
    nav = [("../index.html", "Home"), ("../b2-speaking/index.html", "B2 Speaking"),
           ("../full-library.html", "Full Library")]
    page = shell(f"{title} — Articulate Materials",
                 f"{title} — part of the Articulate full library download.",
                 nav, body, FOOT)
    os.makedirs(os.path.join(REPO, slug), exist_ok=True)
    io.open(os.path.join(REPO, slug, "index.html"), "w", encoding="utf-8", newline="").write(page)
    print(f"wrote {slug}/index.html  ({len(titles)} titles listed)")

io.open(os.path.join(REPO, "index.html"), "w", encoding="utf-8", newline="").write(
    shell("Articulate English — Free Learning Materials",
          "Free sample B2 speaking decks from Articulate English, plus the full library download.",
          NAV, home_body, FOOT))
print("wrote index.html")

io.open(os.path.join(REPO, "full-library.html"), "w", encoding="utf-8", newline="").write(
    shell("The Full Library — Articulate Materials",
          "The Articulate full library: 84 pages of IELTS mock exams, learning library and curriculum reference.",
          NAV, lib_body, FOOT))
print("wrote full-library.html")
