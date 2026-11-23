# -*- coding: utf-8 -*-
"""Fix CRITICAL #1 and CRITICAL #2 on the three free decks:
   - move the inline <script> to assets/deck.js
   - replace onclick= with data-action + a delegated listener
   - pin img-src to the real host, drop 'unsafe-inline' from script-src
"""
import io, os, re

REPO = r"C:/Users/irieb/Documents/William-Projects/_fix-clones/articulate-materials"
DECKS = ["01-health-fitness.html", "06-work-future.html", "12-internet-ai.html"]
OUT_JS = os.path.join(REPO, "assets", "deck.js")

OLD_CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; media-src 'self' blob:; object-src 'none'; frame-ancestors 'none'"
NEW_CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; media-src 'self' blob:; object-src 'none'; frame-ancestors 'none'"

FOCUS = """<style>
:focus-visible{outline:2px solid var(--cs-accent);outline-offset:3px;border-radius:6px}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important;scroll-behavior:auto !important}
}
"""

js_block = None
for name in DECKS:
    p = os.path.join(REPO, "b2-speaking", "decks", name)
    s = io.open(p, encoding="utf-8").read()

    m = re.search(r"<script>\n(.*?)\n</script>", s, re.S)
    if not m:
        print("NO SCRIPT", name); continue
    body = m.group(1)
    if js_block is None:
        js_block = body
    elif body != js_block:
        print("WARN script differs:", name)

    s = s.replace(m.group(0), '<script src="../assets/deck.js" defer></script>')

    s = s.replace('<button class="reveal-btn" onclick="goTo(1)">', '<button class="reveal-btn" data-action="start">')
    s = s.replace('<button onclick="prev()" id="prevBtn">', '<button data-action="prev" id="prevBtn">')
    s = s.replace('<button onclick="next()" id="nextBtn">', '<button data-action="next" id="nextBtn">')

    s = s.replace(OLD_CSP, NEW_CSP)

    if ":focus-visible" not in s:
        s = s.replace("<style>", FOCUS, 1)

    io.open(p, "w", encoding="utf-8", newline="").write(s)
    print("patched", name, "| onclick left:", s.count("onclick="))

extra = """
/* delegated actions (replaces inline onclick) */
document.addEventListener('click', function (e) {
  var b = e.target.closest ? e.target.closest('[data-action]') : null;
  if (!b) return;
  var a = b.getAttribute('data-action');
  if (a === 'start') { if (typeof goTo === 'function') goTo(1); }
  else if (a === 'prev') { if (typeof prev === 'function') prev(); }
  else if (a === 'next') { if (typeof next === 'function') next(); }
});
"""
io.open(OUT_JS, "w", encoding="utf-8", newline="").write(js_block + "\n" + extra)
print("wrote", OUT_JS)
