var THEME_ORDER=['classic','forest','violet','gold','rose','ocean','indigo'];
var THEMES={
  classic:{accent:'#fbbf24',bg:'#191207',text:'#f2f0f8',card:'#191207',border:'#4a3a1e'},
  forest:{accent:'#34d399',bg:'#081710',text:'#f2f0f8',card:'#081710',border:'#1f4a3a'},
  violet:{accent:'#a78bfa',bg:'#120e22',text:'#f2f0f8',card:'#120e22',border:'#3b3563'},
  gold:{accent:'#f59e0b',bg:'#1a1206',text:'#f2f0f8',card:'#1a1206',border:'#4a3a1e'},
  rose:{accent:'#fb7185',bg:'#1e0d13',text:'#f2f0f8',card:'#1e0d13',border:'#5a2a38'},
  ocean:{accent:'#22d3ee',bg:'#061620',text:'#f2f0f8',card:'#061620',border:'#1f4a5a'},
  indigo:{accent:'#818cf8',bg:'#0a0a24',text:'#eef0ff',card:'#0a0a24',border:'#2e2e5e'}
};
var themeIcons={
  1:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  2:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  3:'<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>',
  4:'<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  5:'<path d="M12 18.176a3 3 0 1 1 -4.953 -2.449l-.025 .023a4.502 4.502 0 0 1 1.483 -8.75c1.414 0 2.675 .652 3.5 1.671a4.5 4.5 0 1 1 4.983 7.079a3 3 0 1 1 -4.983 2.25l-.005 .176"/><path d="M12 19v-10"/><path d="M9 3l3 2l3 -2"/>',
  6:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  7:'<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/><path d="M18 5h4"/><path d="M20 3v4"/>'
};
function applyTheme(name){
  var t=THEMES[name]; if(!t) return;
  var r=document.documentElement;
  r.style.setProperty('--cs-accent',t.accent);
  r.style.setProperty('--cs-bg',t.bg);
  r.style.setProperty('--cs-text',t.text);
  r.style.setProperty('--cs-bg-card',t.card);
  r.style.setProperty('--cs-border',t.border);
  r.style.setProperty('--cs-text-muted',t.text+'99');
  r.style.setProperty('--cs-accent-glow',t.accent+'38');
  r.style.setProperty('--cs-accent-dim',t.accent+'1a');
  var icon=document.getElementById('themeIcon');
  var ti=THEME_ORDER.indexOf(name)+1;
  if(icon && themeIcons[ti]) icon.innerHTML=themeIcons[ti];
  try{localStorage.setItem('fce-theme',name);}catch(e){}
}
var themeBtn=document.getElementById('themeCycleBtn');
if(themeBtn){
  themeBtn.addEventListener('click',function(){
    var saved=localStorage.getItem('fce-theme')||'classic';
    var idx=THEME_ORDER.indexOf(saved);
    if(idx<0) idx=0;
    applyTheme(THEME_ORDER[(idx+1)%THEME_ORDER.length]);
  });
}
applyTheme(localStorage.getItem('fce-theme')||'classic');

var current=0, slides=Array.from(document.querySelectorAll('.slide'));
function goTo(n){
  if(n<0||n>=slides.length) return;
  slides[current].classList.remove('active');
  current=n;
  slides[current].classList.add('active');
  document.getElementById('modelAnswersBtn').classList.toggle('show',n===1);
  document.getElementById('slideCounter').textContent=(current+1)+' / '+slides.length;
  document.getElementById('progressFill').style.width=((current+1)/slides.length*100)+'%';
  document.getElementById('prevBtn').disabled=current===0;
  document.getElementById('nextBtn').disabled=current===slides.length-1;
  try{
    var progress=JSON.parse(localStorage.getItem('fce-progress')||'{}');
    progress[DECK_SLUG]=current;
    localStorage.setItem('fce-progress',JSON.stringify(progress));
  }catch(e){}
}
function next(){goTo(current+1);}
function prev(){goTo(current-1);}
document.getElementById('modelAnswersBtn').addEventListener('click',function(){
  var slide=slides[current]; if(!slide) return;
  var ans=slide.querySelectorAll('.hidden-answer');
  var allOpen=true;
  for(var i=0;i<ans.length;i++){ if(!ans[i].classList.contains('open')){ allOpen=false; break; } }
  for(var i=0;i<ans.length;i++){ ans[i].classList.toggle('open',!allOpen); }
  this.textContent=allOpen?'Reveal model answers':'Hide model answers';
});
document.addEventListener('click',function(e){
  var btn=e.target.closest('.reveal-btn');
  if(btn){
    var ans=btn.parentElement.querySelector('.hidden-answer');
    if(ans){ ans.classList.toggle('open'); btn.textContent=ans.classList.contains('open')?'Hide answer':'Show answer'; }
  }
});
document.addEventListener('keydown',function(e){
  if(e.key==='ArrowRight'||e.key===' '){ e.preventDefault(); next(); }
  if(e.key==='ArrowLeft'){ e.preventDefault(); prev(); }
});
(function(){
  try{
    var progress=JSON.parse(localStorage.getItem('fce-progress')||'{}');
    var saved=progress[DECK_SLUG];
    if(typeof saved==='number' && saved>=0) goTo(saved);
  }catch(e){}
})();
(function(){
  var style=(document.getElementById('bgLayer').getAttribute('style')||'');
  var m=style.match(/background-image:\s*url\(([^)]+)\)/);
  if(!m){ document.getElementById('loadingScreen').classList.add('hidden'); document.getElementById('slides').classList.remove('hidden'); return; }
  var img=new Image();
  img.onload=img.onerror=function(){
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('slides').classList.remove('hidden');
  };
  img.src=m[1].replace(/["']/g,'');
})();

var DECK_SLUG=(document.body.getAttribute('data-deck')||'deck');

/* delegated actions (replaces inline onclick) */
document.addEventListener('click', function (e) {
  var b = e.target.closest ? e.target.closest('[data-action]') : null;
  if (!b) return;
  var a = b.getAttribute('data-action');
  if (a === 'start') { if (typeof goTo === 'function') goTo(1); }
  else if (a === 'prev') { if (typeof prev === 'function') prev(); }
  else if (a === 'next') { if (typeof next === 'function') next(); }
});
