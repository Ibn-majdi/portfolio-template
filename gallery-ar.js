/* Project gallery: TiltedCard grid + card-deck viewer. Dependency-free. */
(() => {
 const viewer=document.querySelector('.project-viewer');
 if(!viewer || !viewer.showModal)return;
 const DECK_DIR=-1; /* RTL: swipe right = next */
 const TIP_TEXT='استكشف المشروع ↖';
 let projects,active,index=0,opener,version=0;
 const stage=viewer.querySelector('.deck-stage'),deck=viewer.querySelector('#deck'),error=viewer.querySelector('.viewer-error');
 const cardActive=deck.querySelector('.dcard.active'),cardBack1=deck.querySelector('.dcard.behind1'),cardBack2=deck.querySelector('.dcard.behind2');
 const prev=viewer.querySelector('.viewer-prev'),next=viewer.querySelector('.viewer-next');

 async function getProjects(){
  if(projects)return projects;
  const response=await fetch('projects-ar.json');
  if(!response.ok)throw new Error('Project index unavailable');
  projects=await response.json();return projects;
 }

 function stopVideos(root){root.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load()});}
 function mediaImage(item){return item.type==='video'?(item.poster||''):item.src}
 function fillBack(card,item){
  stopVideos(card);card.replaceChildren();
  if(!item){card.style.visibility='hidden';return}
  card.style.visibility='';
  const img=document.createElement('img');
  img.src=mediaImage(item);img.alt='';img.setAttribute('aria-hidden','true');
  card.append(img);
 }
 function fillActive(item){
  const current=++version;stopVideos(cardActive);cardActive.replaceChildren();error.hidden=true;stage.setAttribute('aria-busy','true');
  const ready=()=>{if(current===version)stage.setAttribute('aria-busy','false')};
  const failed=()=>{if(current!==version)return;ready();error.hidden=false;error.querySelector('a').href=item.src};
  if(item.type==='video'){
   const v=document.createElement('video');
   v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');
   v.preload='metadata';if(item.poster)v.poster=item.poster;
   v.src=item.src;v.load();
   /* portrait videos (reels) get a portrait-sized deck; landscape keeps the wide box */
   v.addEventListener('loadedmetadata',()=>{fitDeck(v.videoWidth,v.videoHeight)},{once:true});
   v.addEventListener('loadeddata',ready,{once:true});v.addEventListener('loadedmetadata',ready,{once:true});v.addEventListener('error',failed,{once:true});
   const badge=document.createElement('span');badge.className='play-badge';badge.innerHTML='<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
   /* tap-to-play: first tap starts native playback with controls + sound */
   badge.addEventListener('click',e=>{e.stopPropagation();badge.remove();v.controls=true;v.play()});
   v.addEventListener('click',()=>{if(!v.controls){badge.remove();v.controls=true;v.play()}});
   cardActive.append(v,badge);
  }else{
   const img=document.createElement('img');
   img.alt=item.alt||active.title;
   img.addEventListener('load',ready,{once:true});img.addEventListener('error',failed,{once:true});
   img.src=item.src;cardActive.append(img);
  }
 }
 function fitDeck(w,h){
  if(!w||!h)return;
  if(h>w){deck.classList.add('portrait');deck.style.width=Math.min(deck.clientHeight*w/h,stage.clientWidth)+'px'}
  else{deck.classList.remove('portrait');deck.style.width=''}
 }
 function render(){
  deck.classList.remove('portrait');deck.style.width='';
  fillActive(active.media[index]);
  fillBack(cardBack1,active.media[index+1]);
  fillBack(cardBack2,active.media[index+2]);
  viewer.querySelector('.viewer-count').textContent=`${(index+1).toLocaleString('ar-EG')} من ${active.media.length.toLocaleString('ar-EG')}`;
  prev.disabled=index===0;next.disabled=index===active.media.length-1;
 }
 function go(d){const n=index+d;if(n<0||n>=active.media.length)return;index=n;render()}

 /* Deck swipe */
 let dragX=null,moved=false;
 cardActive.addEventListener('pointerdown',e=>{
  if(e.target.closest('.play-badge')||e.target.tagName==='VIDEO')return; /* let tap-to-play and native controls work */
  dragX=e.clientX;moved=false;cardActive.classList.add('dragging');
  window.addEventListener('pointerup',endDrag,{once:true});
  window.addEventListener('pointercancel',endDrag,{once:true});
 });
 cardActive.addEventListener('pointermove',e=>{
  if(dragX===null)return;
  const dx=e.clientX-dragX;if(Math.abs(dx)>8)moved=true;
  cardActive.style.transform=`translateX(${dx}px) rotate(${dx/60}deg)`;
 });
 function endDrag(e){
  if(dragX===null)return;
  const dx=e.clientX-dragX;dragX=null;cardActive.classList.remove('dragging');
  cardActive.style.transform='';
  if(Math.abs(dx)>90){go(dx<0?DECK_DIR:-DECK_DIR)}
 }

 /* TiltedCard grid: 3D tilt + cursor tooltip, mouse pointers only (event-detected) */
 document.querySelectorAll('[data-project]').forEach(card=>{
  card.addEventListener('click',async e=>{
   e.preventDefault();card.setAttribute('aria-busy','true');
   try{
    const list=await getProjects();active=list.find(p=>p.id===card.dataset.project);if(!active)throw new Error('Missing project');
    opener=card;index=0;viewer.querySelector('#viewer-title').textContent=active.title;viewer.querySelector('#viewer-description').textContent=active.description;
    const roleEl=viewer.querySelector('#viewer-role'),caseEl=viewer.querySelector('#viewer-case');
    if(active.role){roleEl.hidden=false;viewer.querySelector('#viewer-role-text').textContent=active.role}else{roleEl.hidden=true}
    if(active.caseStudy){caseEl.hidden=false;viewer.querySelector('#case-title').textContent=active.caseStudy.title;for(const k of['idea','research','execution','tools']){const p=viewer.querySelector('#case-'+k),v=active.caseStudy[k]||'';p.textContent=v;p.closest('section').hidden=!v}}else{caseEl.hidden=true}
    viewer.querySelector('#viewer-kind').textContent=card.querySelector('.bento-type').textContent;
    viewer.showModal();document.body.classList.add('viewer-open');render();viewer.scrollTop=0;
   }catch{location.href=card.href}finally{card.removeAttribute('aria-busy')}
  });
  const tip=document.createElement('span');tip.className='bento-tip';tip.textContent=TIP_TEXT;card.append(tip);
  card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')card.classList.add('tilt-on')});
  card.addEventListener('pointermove',e=>{
   if(e.pointerType!=='mouse')return;
   const r=card.getBoundingClientRect();
   const ox=(e.clientX-r.left)/r.width-.5,oy=(e.clientY-r.top)/r.height-.5;
   card.style.transform=`rotateX(${oy*-20}deg) rotateY(${ox*20}deg) scale(1.03)`;
   const tw=tip.offsetWidth,th=tip.offsetHeight;
   const tx=Math.min(Math.max(e.clientX-r.left+14,8),r.width-tw-8),ty=Math.min(Math.max(e.clientY-r.top+16,8),r.height-th-8);
   tip.style.transform=`translate(${tx}px,${ty}px)`;
  });
  card.addEventListener('pointerleave',()=>{card.classList.remove('tilt-on');card.style.transform='';});
 });

 viewer.querySelector('.viewer-close').addEventListener('click',()=>viewer.close());
 viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close()}});
 viewer.addEventListener('close',()=>{++version;if(viewer.open)return;stopVideos(viewer);cardActive.replaceChildren();document.body.classList.remove('viewer-open');opener?.focus({preventScroll:true})});
 prev.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));
 viewer.addEventListener('keydown',e=>{if(e.target.tagName==='VIDEO')return;if(e.key==='ArrowLeft'&&!next.disabled){e.preventDefault();next.click()}if(e.key==='ArrowRight'&&!prev.disabled){e.preventDefault();prev.click()}});
})();
