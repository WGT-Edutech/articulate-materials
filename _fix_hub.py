# -*- coding: utf-8 -*-
"""Apply the remaining audit fixes across the hub."""
import io, os, glob, re

REPO = r"C:/Users/irieb/Documents/William-Projects/_fix-clones/articulate-materials"

# ── 1. _headers: real CSP header + framing protection (meta cannot set frame-ancestors) ──
headers = """/*
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; media-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
"""
io.open(os.path.join(REPO, "_headers"), "w", encoding="utf-8", newline="\n").write(headers)
print("wrote _headers")

# ── 2. hub pages: add object-src 'none', fix favicon paths, pin img-src ──
HUB = ["index.html", "full-library.html",
       "english-speaking/index.html", "learning-materials/index.html", "curriculum/index.html"]
for rel in HUB:
    p = os.path.join(REPO, rel)
    s = io.open(p, encoding="utf-8").read()
    orig = s
    if "object-src" not in s:
        s = s.replace("frame-ancestors 'none'", "object-src 'none'; frame-ancestors 'none'")
    # sub-directory pages referenced assets/ instead of ../assets/
    depth = rel.count("/")
    if depth:
        s = s.replace('href="assets/logo/', 'href="../assets/logo/')
    io.open(p, "w", encoding="utf-8", newline="").write(s)
    print(f"{rel:32s} changed={s != orig}")

# ── 3. portal: heading semantics + drop the unused Pexels allowlist ──
p = os.path.join(REPO, "portal.html")
s = io.open(p, encoding="utf-8").read()
s = s.replace("https://images.unsplash.com https://images.pexels.com",
              "https://images.unsplash.com")
s = s.replace('<div class="particle-text" id="particleTitle" aria-label=',
              '<div class="particle-text" id="particleTitle" role="heading" aria-level="1" aria-label=')
io.open(p, "w", encoding="utf-8", newline="").write(s)
print("portal: heading + csp tightened")

# ── 4. b2 section index: pin img-src, add focus-visible + reduced-motion ──
p = os.path.join(REPO, "b2-speaking", "index.html")
s = io.open(p, encoding="utf-8").read()
s = s.replace("img-src 'self' data: https:;", "img-src 'self' data: https://images.unsplash.com;")
if ":focus-visible" not in s:
    s = s.replace("<style>", """<style>
:focus-visible{outline:2px solid var(--cs-accent);outline-offset:3px;border-radius:6px}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important;scroll-behavior:auto !important}
}""", 1)
io.open(p, "w", encoding="utf-8", newline="").write(s)
print("b2 index: csp + a11y")

# ── 5. orphan asset ──
orphan = os.path.join(REPO, "assets", "dotfield.js")
if os.path.exists(orphan):
    os.remove(orphan)
    print("removed orphan assets/dotfield.js")
