(function(){
  var d=document,root=d.documentElement;root.classList.remove('no-js');
  var burger=d.querySelector('.burger'),drawer=d.getElementById('drawer');
  if(burger){burger.addEventListener('click',function(){var o=burger.getAttribute('aria-expanded')==='true';burger.setAttribute('aria-expanded',String(!o));drawer.classList.toggle('open',!o);d.body.style.overflow=o?'':'hidden';});
    drawer.addEventListener('click',function(e){if(e.target.closest('a')){burger.click();}});}
  d.addEventListener('keydown',function(e){if(e.key==='Escape'){if(burger&&burger.getAttribute('aria-expanded')==='true'){burger.click();burger.focus();}closeDD();}});
  var dd=d.querySelector('.dd'),ddb=dd&&dd.querySelector('button');
  function closeDD(){if(dd){dd.classList.remove('open');ddb.setAttribute('aria-expanded','false');}}
  if(ddb){ddb.addEventListener('click',function(e){e.stopPropagation();var o=dd.classList.toggle('open');ddb.setAttribute('aria-expanded',String(o));});d.addEventListener('click',function(e){if(!dd.contains(e.target))closeDD();});}
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);if(en.target.hasAttribute('data-count'))count(en.target);}});},{threshold:.15}):null;
  d.querySelectorAll('.rv').forEach(function(el){io?io.observe(el):el.classList.add('in');});
  function count(el){var n=el.querySelector('[data-to]');if(!n)return;var to=+n.dataset.to,suf=n.dataset.suf||'';if(reduce){n.textContent=to+suf;return;}var t0=null;function step(t){t0=t0||t;var p=Math.min((t-t0)/1400,1),e=1-Math.pow(1-p,3);n.textContent=Math.round(to*e)+suf;if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);}
  d.querySelectorAll('[data-count]').forEach(function(el){if(!io)count(el);});
  var fb=d.querySelectorAll('.filters button');
  fb.forEach(function(b){b.addEventListener('click',function(){fb.forEach(function(x){x.setAttribute('aria-pressed','false');});b.setAttribute('aria-pressed','true');var c=b.dataset.cat;d.querySelectorAll('[data-cat-item]').forEach(function(it){it.hidden=!(c==='*'||it.dataset.catItem===c);});});});
  d.querySelectorAll('form[data-ajax]').forEach(function(f){f.addEventListener('submit',function(e){
    e.preventDefault();var m=f.querySelector('.msg'),btn=f.querySelector('button[type=submit]');btn.disabled=true;
    fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(f)).toString()})
    .then(function(r){if(!r.ok)throw 0;f.reset();m.className='msg ok';m.textContent='Merci ! Votre message a bien été envoyé. Nous vous répondrons rapidement.';m.focus();})
    .catch(function(){m.className='msg err';m.textContent='Envoi impossible pour le moment. Écrivez-nous à prepapharmasolidaires@hotmail.com ou appelez le 06 12 96 25 71.';})
    .finally(function(){btn.disabled=false;});});});
})();
