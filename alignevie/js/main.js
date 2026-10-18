(function(){
var h=document.querySelector('header.site'),b=document.querySelector('.burger'),m=document.getElementById('menu');
function sc(){h.classList.toggle('scrolled',window.scrollY>30)}sc();addEventListener('scroll',sc,{passive:true});
b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
m.addEventListener('click',function(e){if(e.target.tagName==='A'){m.classList.remove('open');b.setAttribute('aria-expanded',false)}});
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15}):null;
document.querySelectorAll('.rv').forEach(function(el,i){el.style.transitionDelay=(i%4)*90+'ms';io?io.observe(el):el.classList.add('in')});
var cio='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);var el=e.target,t=+el.dataset.count,s=performance.now();(function f(n){var p=Math.min((n-s)/1600,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(s)})},{threshold:.6}):null;
document.querySelectorAll('[data-count]').forEach(function(el){cio?cio.observe(el):el.textContent=el.dataset.count});
var fb=document.querySelectorAll('.filters button');
fb.forEach(function(x){x.addEventListener('click',function(){fb.forEach(function(y){y.classList.remove('on')});x.classList.add('on');var f=x.dataset.f;document.querySelectorAll('.gal .ph').forEach(function(p){p.style.display=(f==='all'||p.dataset.c===f)?'':'none'})})});
})();
