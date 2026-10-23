(function(){
  // burger
  var b=document.querySelector('.burger'),n=document.querySelector('.nav');
  if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o);});
    n.addEventListener('click',function(e){if(e.target.tagName==='A'){n.classList.remove('open');b.setAttribute('aria-expanded',false);}});}
  // reveal
  var els=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});els.forEach(function(e){io.observe(e);});}
  else els.forEach(function(e){e.classList.add('in');});
  // counters
  var cs=document.querySelectorAll('[data-count]');
  function run(el){var t=+el.dataset.count,s=performance.now(),d=1600;(function f(now){var p=Math.min((now-s)/d,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f);})(s);}
  if('IntersectionObserver' in window){var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);io2.unobserve(e.target);}});},{threshold:.5});cs.forEach(function(c){io2.observe(c);});}
  else cs.forEach(function(c){c.textContent=c.dataset.count;});
  // countdown: prochain vendredi 20h (heure de Paris)
  var cd=document.getElementById('cd');
  if(cd){
    var fmt=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',hour12:false,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',weekday:'short'});
    function parisParts(d){var o={};fmt.formatToParts(d).forEach(function(p){o[p.type]=p.value;});return o;}
    function parisToUtc(y,m,d,h){var guess=Date.UTC(y,m-1,d,h,0,0),p=parisParts(new Date(guess)),as=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour%24,+p.minute,+p.second);return new Date(guess-(as-guess));}
    function nextFriday(){var now=new Date();for(var i=0;i<9;i++){var t=new Date(now.getTime()+i*864e5),p=parisParts(t);if(p.weekday==='Fri'){var u=parisToUtc(+p.year,+p.month,+p.day,20);if(u>now)return u;}}return now;}
    var target=nextFriday();
    function tick(){var diff=target-new Date();if(diff<=0){target=nextFriday();diff=target-new Date();}
      var s=Math.floor(diff/1000),v=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];
      cd.querySelectorAll('b').forEach(function(el,i){el.textContent=String(v[i]).padStart(2,'0');});}
    tick();setInterval(tick,1000);
  }
  // gallery filters + lightbox
  var fb=document.querySelectorAll('.filters button');
  fb.forEach(function(btn){btn.addEventListener('click',function(){fb.forEach(function(x){x.classList.remove('on');});btn.classList.add('on');
    document.querySelectorAll('.gallery [data-cat]').forEach(function(s){s.style.display=(btn.dataset.f==='all'||s.dataset.cat===btn.dataset.f)?'':'none';});});});
  var lb=document.querySelector('.lightbox');
  if(lb){var li=lb.querySelector('img'),lp=lb.querySelector('p');
    document.querySelectorAll('.shot[data-full]').forEach(function(s){s.addEventListener('click',function(){li.src=s.dataset.full;li.alt=s.dataset.cap||'';lp.textContent=s.dataset.cap||'';lb.classList.add('open');});});
    lb.addEventListener('click',function(e){if(e.target===lb||e.target.tagName==='BUTTON')lb.classList.remove('open');});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('open');});}
})();
