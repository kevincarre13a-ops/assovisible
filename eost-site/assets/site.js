(function(){
var h=document.querySelector('.site-header');
function sc(){h.classList.toggle('solid',window.scrollY>40)}sc();addEventListener('scroll',sc,{passive:true});
var b=document.querySelector('.burger'),n=document.getElementById('menu');
b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
n.addEventListener('click',function(e){if(e.target.tagName==='A'){n.classList.remove('open');b.setAttribute('aria-expanded',false)}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){n.classList.remove('open');b.setAttribute('aria-expanded',false)}});
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12}):null;
document.querySelectorAll('.rv').forEach(function(el){io?io.observe(el):el.classList.add('in')});
var co='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);var t=+e.target.dataset.count,s=performance.now();(function f(now){var p=Math.min((now-s)/1600,1);e.target.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(s)})},{threshold:.5}):null;
document.querySelectorAll('[data-count]').forEach(function(el){co?co.observe(el):el.textContent=el.dataset.count});
var chips=document.querySelectorAll('.chips button');
chips.forEach(function(c){c.addEventListener('click',function(){chips.forEach(function(x){x.classList.remove('on')});c.classList.add('on');var k=c.dataset.f;document.querySelectorAll('.gal figure').forEach(function(f){f.hidden=!(k==='all'||f.dataset.c===k)})})});
})();
