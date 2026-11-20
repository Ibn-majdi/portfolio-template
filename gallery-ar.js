/* Project gallery: native, dependency-free project viewer. */
(() => {
 const viewer=document.querySelector('.project-viewer');
 if(!viewer || !viewer.showModal)return;
 let projects,active,index=0,opener,version=0;
 const media=viewer.querySelector('.viewer-media'),stage=viewer.querySelector('.viewer-stage'),error=viewer.querySelector('.viewer-error');
 const prev=viewer.querySelector('.viewer-prev'),next=viewer.querySelector('.viewer-next');
 async function getProjects(){
  if(projects)return projects;
  const response=await fetch('projects-ar.json');
  if(!response.ok)throw new Error('Project index unavailable');
  projects=await response.json();return projects;
 }
 function pause(){media.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load()});}
 function render(){
  const current=++version,item=active.media[index];pause();media.replaceChildren();error.hidden=true;stage.setAttribute('aria-busy','true');
  const el=document.createElement(item.type==='video'?'video':'img');
  const ready=()=>{if(current===version)stage.setAttribute('aria-busy','false')};
  const failed=()=>{if(current!==version)return;ready();error.hidden=false;error.querySelector('a').href=item.src};
  if(item.type==='video'){
   el.controls=true;el.playsInline=true;el.preload='metadata';el.poster=item.poster||'';
   el.addEventListener('loadeddata',ready,{once:true});el.addEventListener('loadedmetadata',ready,{once:true});
  }else{el.alt=item.alt||active.title;el.addEventListener('load',ready,{once:true});}
  el.addEventListener('error',failed,{once:true});el.src=item.src;media.append(el);
  viewer.querySelector('.viewer-count').textContent=`${(index+1).toLocaleString('ar-EG')} من ${active.media.length.toLocaleString('ar-EG')}`;
  prev.disabled=index===0;next.disabled=index===active.media.length-1;
  // Native playback stays under the visitor's control, including sound.
 }
 document.querySelectorAll('[data-project]').forEach(card=>card.addEventListener('click',async e=>{
  e.preventDefault();card.setAttribute('aria-busy','true');
  try{
   const list=await getProjects();active=list.find(p=>p.id===card.dataset.project);if(!active)throw new Error('Missing project');
   opener=card;index=0;viewer.querySelector('#viewer-title').textContent=active.title;viewer.querySelector('#viewer-description').textContent=active.description;
   viewer.querySelector('#viewer-kind').textContent=card.querySelector('.bento-type').textContent;
   viewer.showModal();document.body.classList.add('viewer-open');render();viewer.scrollTop=0;
  }catch{location.href=card.href}finally{card.removeAttribute('aria-busy')}
 }));
 viewer.querySelector('.viewer-close').addEventListener('click',()=>viewer.close());
 viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close()}});
 viewer.addEventListener('close',()=>{++version;pause();media.replaceChildren();document.body.classList.remove('viewer-open');opener?.focus({preventScroll:true})});
 prev.addEventListener('click',()=>{if(index>0){index--;render()}});next.addEventListener('click',()=>{if(index<active.media.length-1){index++;render()}});
 viewer.addEventListener('keydown',e=>{if(e.target.tagName==='VIDEO')return;if(e.key==='ArrowLeft'&&!next.disabled){e.preventDefault();next.click()}if(e.key==='ArrowRight'&&!prev.disabled){e.preventDefault();prev.click()}});
})();
