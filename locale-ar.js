document.getElementById('year').textContent=new Date().getFullYear().toLocaleString('ar-EG',{useGrouping:false});
const arabicMenu=document.querySelector('.menu');new MutationObserver(()=>arabicMenu.setAttribute('aria-label',arabicMenu.getAttribute('aria-expanded')==='true'?'أغلق القائمة':'افتح القائمة')).observe(arabicMenu,{attributes:true,attributeFilter:['aria-expanded']});
