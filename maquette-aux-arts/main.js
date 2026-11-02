/* Aux Arts ! en Avignon — maquette · scripts communs (aucune dépendance) */
(function(){
  'use strict';
  var d=document, root=d.documentElement;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');
  function $(s,c){return (c||d).querySelector(s)}
  function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}
  function store(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}}

  /* En-tête + menu mobile */
  var header=$('.site-header'), burger=$('.burger'), drawer=$('.drawer');
  function onScroll(){header&&header.classList.toggle('scrolled',window.scrollY>8)}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  function setMenu(open){
    if(!burger)return;
    burger.setAttribute('aria-expanded',open);
    burger.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
    drawer.classList.toggle('open',open);
    d.body.style.overflow=open?'hidden':'';
  }
  if(burger){
    burger.addEventListener('click',function(){setMenu(burger.getAttribute('aria-expanded')!=='true')});
    d.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
    $$('a',drawer).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
    window.matchMedia('(min-width:1200px)').addEventListener('change',function(m){if(m.matches)setMenu(false)});
  }

  /* Rideau d'ouverture : une seule fois par session, jamais si mouvement réduit */
  var cur=$('.curtain');
  if(cur){
    if(reduce||store('aa-curtain')){cur.remove()}
    else{store('aa-curtain','1');requestAnimationFrame(function(){setTimeout(function(){cur.classList.add('open')},60)});setTimeout(function(){cur.remove()},2200)}
  }

  /* Apparitions douces */
  var rv=$$('.rv');
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    rv.forEach(function(el,i){el.style.setProperty('--d',((i%4)*.08)+'s');io.observe(el)});
  }else rv.forEach(function(el){el.classList.add('in')});

  /* Projecteur qui suit le pointeur (héro) */
  var hero=$('.hero');
  if(hero&&!reduce){
    hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();hero.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');hero.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')});
  }

  /* Compteurs animés */
  var nums=$$('[data-count]');
  function run(el){
    var to=+el.getAttribute('data-count'),t0=null,dur=1500;
    if(reduce){el.textContent=to;return}
    function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e);if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);io2.unobserve(e.target)}})},{threshold:.5});
    nums.forEach(function(n){io2.observe(n)});
  }else nums.forEach(run);

  /* Compte à rebours : prochain atelier "à ne pas manquer" (dates de l'agenda 2026) */
  var cd=$('#countdown');
  if(cd){
    var cands=[
      {t:'Atelier make-up avec Agnès Fogli',iso:'2026-11-18T17:30:00+01:00',when:'Mercredi 18 novembre 2026 · 17h30 – 20h',img:'img/affiches/couture-makeup.webp',href:'ateliers.html#makeup',cta:"S'inscrire à l'atelier"},
      {t:"P'tit Salon Littéraire Populaire",iso:'2026-11-25T18:30:00+01:00',when:'Mercredi 25 novembre 2026 · 18h30 – 20h',img:'img/affiches/causeries.webp',href:'ateliers.html#salon',cta:'Venir au salon'},
      {t:"P'tit Salon Littéraire Populaire",iso:'2026-12-16T18:30:00+01:00',when:'Mercredi 16 décembre 2026 · 18h30 – 20h',img:'img/affiches/causeries.webp',href:'ateliers.html#salon',cta:'Venir au salon'}
    ];
    var now=Date.now(),cur2=null;
    for(var i=0;i<cands.length;i++){if(new Date(cands[i].iso).getTime()>now){cur2=cands[i];break}}
    if(!cur2){$('#next-block').hidden=true}
    else{
      $('#next-title').textContent=cur2.t;$('#next-when').textContent=cur2.when;
      var im=$('#next-img');if(im)im.src=cur2.img;var a=$('#next-cta');a.href=cur2.href;a.textContent=cur2.cta;
      var tgt=new Date(cur2.iso).getTime();
      var nd=$('[data-u=d]',cd),nh=$('[data-u=h]',cd),nm=$('[data-u=m]',cd),ns=$('[data-u=s]',cd);
      var pad=function(n){return n<10?'0'+n:''+n};
      var tick=function(){
        var s=Math.max(0,Math.floor((tgt-Date.now())/1000));
        nd.textContent=Math.floor(s/86400);nh.textContent=pad(Math.floor(s%86400/3600));nm.textContent=pad(Math.floor(s%3600/60));ns.textContent=pad(s%60);
      };
      tick();setInterval(tick,1000);
    }
  }

  /* Carrousel d'affiches */
  $$('.car').forEach(function(car){
    var tr=$('.track',car);
    var step=function(dir){tr.scrollBy({left:dir*(tr.clientWidth*.7),behavior:reduce?'auto':'smooth'})};
    var p=$('[data-prev]',car),n=$('[data-next]',car);
    p&&p.addEventListener('click',function(){step(-1)});n&&n.addEventListener('click',function(){step(1)});
  });

  /* Cartes d'ateliers retournables (clic / clavier ; survol géré en CSS) */
  $$('.flip').forEach(function(card){
    var btns=$$('.flip-btn',card);
    btns.forEach(function(b){b.addEventListener('click',function(){
      var on=!card.classList.contains('is-flipped');
      card.classList.toggle('is-flipped',on);
      btns.forEach(function(x){x.setAttribute('aria-expanded',on)});
    })});
  });
  if(location.hash){
    var tgt2=$(location.hash);
    if(tgt2&&tgt2.classList.contains('flip')){setTimeout(function(){tgt2.classList.add('is-flipped');tgt2.scrollIntoView({block:'center'})},400)}
  }

  /* Filtres (agenda, ateliers, galerie) */
  $$('[data-filter-group]').forEach(function(g){
    var items=$$(g.getAttribute('data-filter-group'));
    $$('button',g).forEach(function(b){b.addEventListener('click',function(){
      $$('button',g).forEach(function(x){x.setAttribute('aria-pressed',x===b)});
      var f=b.getAttribute('data-f');
      items.forEach(function(it){var tags=(it.getAttribute('data-tags')||'').split(' ');it.classList.toggle('hide',f!=='all'&&tags.indexOf(f)<0)});
    })});
  });

  /* Visionneuse d'images */
  var lb=$('dialog.lb');
  if(lb){
    var li=$('img',lb),lc=$('p',lb);
    $$('[data-zoom]').forEach(function(b){b.addEventListener('click',function(){
      li.src=b.getAttribute('data-zoom');li.alt=b.getAttribute('data-alt')||'';lc.textContent=b.getAttribute('data-cap')||'';
      if(lb.showModal)lb.showModal();else lb.setAttribute('open','')
    })});
    lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('lb-in'))lb.close()});
    $('.lb-x',lb).addEventListener('click',function(){lb.close()});
  }

  /* Formulaires Netlify (envoi AJAX, repli sur la page /merci) */
  $$('form[data-netlify]').forEach(function(f){
    f.addEventListener('submit',function(e){
      if(!window.fetch)return;
      e.preventDefault();
      var msg=$('.form-msg',f),btn=$('button[type=submit]',f);
      btn.disabled=true;
      fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(f)).toString()})
        .then(function(r){if(!r.ok)throw new Error(r.status);msg.className='form-msg ok';msg.textContent='Merci ! Votre message est bien parti. Nous vous répondons rapidement.';f.reset();msg.focus&&msg.setAttribute('tabindex','-1');msg.focus&&msg.focus()})
        .catch(function(){msg.className='form-msg err';msg.textContent="L'envoi n'a pas abouti. Écrivez-nous directement à contact@auxartsavignon.fr ou appelez le 06 83 20 26 60."})
        .finally(function(){btn.disabled=false});
    });
  });
  /* Pré-sélection de l'atelier via ?atelier= */
  var q=new URLSearchParams(location.search).get('atelier'),sel=$('#f-atelier');
  if(q&&sel){for(var k=0;k<sel.options.length;k++){if(sel.options[k].value===q){sel.selectedIndex=k;break}}}
})();
