/* Entry language choice. The English and Arabic editions are separate documents. */
/* PERSONALIZE: the name, city, and taglines inside choose() below — keep both languages in sync. */
(() => {
 const entry=document.querySelector('.entry-screen');
 if(!entry||!entry.showModal)return;
 const arabic=document.documentElement.lang==='ar';
 let language=arabic?'ar':'en';
 const button=entry.querySelector('.entry-button');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const choices=entry.querySelectorAll('[data-language]');
 let closing=false;
 document.body.classList.add('intro-ready');
 const seen=()=>{try{return sessionStorage.getItem('portfolio-entered')==='yes'}catch{return false}};
 function choose(lang){
  language=lang;const ar=lang==='ar';
  entry.dir=ar?'rtl':'ltr';entry.lang=lang;
  choices.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===lang)));
  entry.querySelector('.entry-name').innerHTML=ar?'<span>اسمك</span><span>هنا<span class="entry-dot">.</span></span>':'<span>YOUR</span><span>NAME<span class="entry-dot">.</span></span>';
  entry.querySelector('.entry-action>span:last-child').textContent=ar?'اكتشف الرؤية':'Explore Vision';
  button.setAttribute('aria-label',ar?'اكتشف الرؤية':'Explore Vision');
  entry.setAttribute('aria-label',ar?'اختر اللغة واستكشف أعمالك':'Choose a language and explore Your Name’s portfolio');
  entry.querySelector('.entry-top>span:first-child').textContent=ar?'اسمك':'YOUR NAME';
  entry.querySelector('.entry-top>span:last-child').textContent=ar?'المدينة، البلد':'CITY, COUNTRY';
  entry.querySelector('.entry-bottom>span:first-child').textContent=ar?'بحث / إبداع / تنظيم':'RESEARCH / CREATION / SYSTEMS';
  entry.querySelector('.entry-bottom>span:last-child').textContent=ar?'ابدأ من هنا':'CLICK TO EXPLORE';
  entry.querySelector('.entry-circle').textContent=ar?'↖':'↗';
 }
 function open(){closing=false;entry.classList.remove('entry-leaving');entry.showModal();document.body.classList.add('entry-open');choices[language==='ar'?1:0].focus({preventScroll:true})}
 function finish(){
  entry.close();entry.classList.remove('entry-leaving');document.body.classList.remove('entry-open');
  const hero=document.querySelector('.home-hero h1');hero.setAttribute('tabindex','-1');hero.focus({preventScroll:true});
 }
 function enter(){
  if(closing)return;closing=true;
  try{sessionStorage.setItem('portfolio-entered','yes')}catch{}
  if((language==='ar')!==arabic){location.href=(language==='ar'?'index-ar.html':'index.html')+'?entered=1';return}
  entry.classList.add('entry-leaving');if(reduced.matches)finish();else setTimeout(finish,650);
 }
 choices.forEach(b=>b.addEventListener('click',()=>choose(b.dataset.language)));
 button.addEventListener('click',enter);
 // Escape leaves in the selected language, matching the original entry behavior.
 entry.addEventListener('cancel',e=>{e.preventDefault();enter()});
 entry.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType==='touch')return;entry.style.setProperty('--entry-x',`${(e.clientX/innerWidth-.5)*12}px`);entry.style.setProperty('--entry-y',`${(e.clientY/innerHeight-.5)*12}px`)});
 entry.addEventListener('pointerleave',()=>{entry.style.setProperty('--entry-x','0px');entry.style.setProperty('--entry-y','0px')});
 document.querySelector('.replay-intro').addEventListener('click',open);
 const query=new URLSearchParams(location.search);choose(language);
 if(query.get('entered')==='1'){try{sessionStorage.setItem('portfolio-entered','yes')}catch{};history.replaceState(null,'',location.pathname+location.hash)}
 else if(!seen()||query.get('intro')==='1')open();
})();
