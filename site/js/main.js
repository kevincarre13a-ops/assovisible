// =========================================================
// Club Bisontin de Scrabble — script commun à toutes les pages
// =========================================================
(function () {
  "use strict";

  /* Valeurs officielles des lettres au Scrabble francophone (utilisées par le héros et le bonus jeu). */
  var LETTER_VALUES = {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
    K: 10, L: 1, M: 2, N: 1, O: 1, P: 3, Q: 8, R: 1, S: 1, T: 1,
    U: 1, V: 4, W: 10, X: 10, Y: 10, Z: 10
  };

  /* ---------- Calendrier : données (js/calendrier.js) et aides de dates ---------- */
  var CAL = Array.isArray(window.CALENDRIER) ? window.CALENDRIER.slice() : [];
  CAL.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  var JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  function parseDay(s) {
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function isPast(ev) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return parseDay(ev.dateFin || ev.date) < today;
  }
  function dayLabel(d) {
    return d.getDate() === 1 ? "1er" : String(d.getDate());
  }
  function longDate(ev) {
    var d = parseDay(ev.date);
    if (!ev.dateFin) {
      return JOURS[d.getDay()] + " " + dayLabel(d) + " " + MOIS[d.getMonth()] + " " + d.getFullYear();
    }
    var f = parseDay(ev.dateFin);
    if (d.getMonth() === f.getMonth() && d.getFullYear() === f.getFullYear()) {
      return "du " + dayLabel(d) + " au " + dayLabel(f) + " " + MOIS[f.getMonth()] + " " + f.getFullYear();
    }
    return "du " + dayLabel(d) + " " + MOIS[d.getMonth()] + " au " + dayLabel(f) + " " + MOIS[f.getMonth()] + " " + f.getFullYear();
  }
  function buildEvent(ev) {
    var d = parseDay(ev.date);
    var past = isPast(ev);

    var article = document.createElement("article");
    article.className = "event" + (past ? " is-past" : "");

    var date = document.createElement("div");
    date.className = "news-date";
    var dd = document.createElement("span");
    dd.className = "d";
    dd.textContent = String(d.getDate());
    var mm = document.createElement("span");
    mm.className = "m";
    mm.textContent = MOIS_COURTS[d.getMonth()] + " " + d.getFullYear();
    date.appendChild(dd);
    date.appendChild(mm);

    var body = document.createElement("div");
    var h = document.createElement("h3");
    h.textContent = ev.titre;
    var when = document.createElement("p");
    when.className = "when-long";
    when.textContent = longDate(ev);
    var where = document.createElement("p");
    where.textContent = "📍 " + ev.lieu;
    body.appendChild(h);
    body.appendChild(when);
    body.appendChild(where);
    if (past) {
      var badge = document.createElement("span");
      badge.className = "badge badge-outline";
      badge.textContent = "Terminé";
      body.appendChild(badge);
    }

    article.appendChild(date);
    article.appendChild(body);
    return article;
  }

  /* Compteur « rendez-vous à Besançon » alimenté par le calendrier */
  document.querySelectorAll('[data-count-from="ici"]').forEach(function (el) {
    el.setAttribute("data-count", String(CAL.filter(function (e) { return e.ici; }).length));
  });

  /* ---------- Menu burger (mobile) ---------- */
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".main-nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Apparitions au défilement ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Compteurs animés ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString("fr-FR");
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("fr-FR");
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var ioCount = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            ioCount.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { ioCount.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = (parseInt(el.getAttribute("data-count"), 10) || 0).toLocaleString("fr-FR");
    });
  }

  /* ---------- Générateur de tuiles pour le titre du héros ---------- */
  document.querySelectorAll(".tiles-title[data-text]").forEach(function (list) {
    var text = list.getAttribute("data-text") || "";
    var i = 0;
    text.split(" ").forEach(function (word) {
      var item = document.createElement("li");
      item.className = "word";
      word.split("").forEach(function (char) {
        var tile = document.createElement("span");
        tile.className = "tile";
        tile.style.setProperty("--rot", (Math.random() * 36 - 18).toFixed(1) + "deg");
        tile.style.setProperty("--delay", (i * 0.07) + "s");
        tile.innerHTML = char + '<span class="pt">' + (LETTER_VALUES[char] || "") + "</span>";
        item.appendChild(tile);
        i++;
      });
      list.appendChild(item);
    });
  });

  /* ---------- Formulaire : message de succès après soumission Netlify ---------- */
  if (location.search.indexOf("success") !== -1 || location.hash === "#merci") {
    var successBox = document.getElementById("form-success");
    if (successBox) {
      successBox.classList.add("show");
      successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  /* =========================================================
     BONUS — Mot du jour + tirage de lettres interactif
     Valeurs officielles des lettres au Scrabble francophone.
     ========================================================= */
  // Répartition (approximative) des 100 lettres du sac francophone, sans les 2 jokers.
  var BAG_DISTRIBUTION = "AAAAAAAAABBCCDDDEEEEEEEEEEEEEEEFFGGHHIIIIIIIIJKLLLLLMMMNNNNNNOOOOOOPPQRRRRRRSSSSSSTTTTTTUUUUUUVVWXYZ".split("");

  var MOTS_DU_JOUR = [
    { mot: "SCRABBLE", def: "Le jeu lui-même : assembler des lettres pour former des mots sur la grille." },
    { mot: "DUPLICATE", def: "Format où tous les joueurs cherchent le meilleur mot possible sur la même grille." },
    { mot: "JOKER", def: "Lettre blanche qui remplace n'importe quelle lettre, sans valeur en points." },
    { mot: "ANAGRAMME", def: "Mot obtenu en réarrangeant les lettres d'un autre mot." },
    { mot: "TUILE", def: "Petite pièce de bois portant une lettre et sa valeur en points." },
    { mot: "CHEVALET", def: "Support sur lequel chaque joueur pose ses lettres, à l'abri des regards." },
    { mot: "BINGO", def: "Terme utilisé quand un joueur place ses 7 lettres d'un coup (bonus de 50 points)." },
    { mot: "COMPTAGE", def: "Calcul du score obtenu après avoir posé un mot sur la grille." },
    { mot: "LEXIQUE", def: "Ensemble des mots valables, référencé dans l'ODS, le dictionnaire officiel du Scrabble." },
    { mot: "GRILLE", def: "Plateau de jeu quadrillé de 15 cases sur 15, avec ses cases à bonus." },
    { mot: "SIMULTANE", def: "Compétition où plusieurs clubs jouent la même partie, le même jour, à distance." },
    { mot: "TIRAGE", def: "Les 7 lettres piochées dans le sac au début de chaque coup." },
    { mot: "ARBITRE", def: "Personne qui valide les mots et veille au bon déroulement d'un tournoi." },
    { mot: "LICENCIE", def: "Joueur inscrit à la Fédération Française de Scrabble, affilié à un club." },
    { mot: "OUVERTURE", def: "Premier mot posé sur la grille, toujours au centre du plateau." }
  ];

  var motEl = document.getElementById("mot-du-jour");
  if (motEl) {
    var dayIndex = Math.floor(Date.now() / 86400000) % MOTS_DU_JOUR.length;
    var choice = MOTS_DU_JOUR[dayIndex];
    renderWordTiles(document.getElementById("mdj-tiles"), choice.mot);
    var scoreEl = document.getElementById("mdj-score");
    if (scoreEl) scoreEl.textContent = scoreWord(choice.mot) + " points";
    var defEl = document.getElementById("mdj-def");
    if (defEl) defEl.textContent = choice.def;
  }

  function scoreWord(word) {
    var total = 0;
    word.toUpperCase().split("").forEach(function (l) {
      total += LETTER_VALUES[l] || 0;
    });
    if (word.length >= 7) total += 50;
    return total;
  }

  function renderWordTiles(container, word) {
    if (!container) return;
    container.innerHTML = "";
    word.toUpperCase().split("").forEach(function (letter) {
      var tile = document.createElement("span");
      tile.className = "tile";
      tile.innerHTML = letter + '<span class="pt">' + (LETTER_VALUES[letter] || 0) + "</span>";
      container.appendChild(tile);
    });
  }

  /* ---------- Mini-jeu : "Votre tirage du jour" ---------- */
  var drawContainer = document.getElementById("draw-tiles");
  if (drawContainer) {
    var currentDraw = [];

    function newDraw() {
      currentDraw = [];
      var bag = BAG_DISTRIBUTION.slice();
      for (var i = 0; i < 7; i++) {
        var idx = Math.floor(Math.random() * bag.length);
        currentDraw.push(bag[idx]);
        bag.splice(idx, 1);
      }
      drawContainer.innerHTML = "";
      currentDraw.forEach(function (letter) {
        var tile = document.createElement("span");
        tile.className = "tile";
        tile.innerHTML = letter + '<span class="pt">' + (LETTER_VALUES[letter] || 0) + "</span>";
        drawContainer.appendChild(tile);
      });
      var feedback = document.getElementById("game-feedback");
      if (feedback) { feedback.textContent = ""; feedback.className = ""; }
      var input = document.getElementById("game-input");
      if (input) input.value = "";
    }

    function remainingLetters(word, draw) {
      var pool = draw.slice();
      var letters = word.toUpperCase().split("");
      for (var i = 0; i < letters.length; i++) {
        var pos = pool.indexOf(letters[i]);
        if (pos === -1) return false;
        pool.splice(pos, 1);
      }
      return true;
    }

    newDraw();
    var redrawBtn = document.getElementById("game-redraw");
    if (redrawBtn) redrawBtn.addEventListener("click", newDraw);

    var gameForm = document.getElementById("game-form");
    if (gameForm) {
      gameForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = document.getElementById("game-input");
        var feedback = document.getElementById("game-feedback");
        var word = (input.value || "").trim();
        if (!word) return;
        if (!/^[A-Za-zÀ-ÿ]+$/.test(word)) {
          feedback.textContent = "Utilisez uniquement des lettres.";
          feedback.className = "bad";
          return;
        }
        var normalized = word
          .toUpperCase()
          .replace(/[ÀÂ]/g, "A").replace(/[ÉÈÊË]/g, "E")
          .replace(/[ÎÏ]/g, "I").replace(/[ÔÖ]/g, "O").replace(/[ÙÛÜ]/g, "U").replace(/Ç/g, "C");
        if (!remainingLetters(normalized, currentDraw)) {
          feedback.textContent = "Ce mot utilise des lettres absentes de votre tirage. Réessayez !";
          feedback.className = "bad";
          return;
        }
        var points = scoreWord(normalized);
        feedback.textContent = "Bravo ! " + word.toUpperCase() + " vaut " + points + " points avec ce tirage.";
        feedback.className = "ok";
        var best = parseInt(localStorage.getItem("cbs_best_score") || "0", 10);
        if (points > best) {
          localStorage.setItem("cbs_best_score", String(points));
          best = points;
        }
        var bestEl = document.getElementById("game-best");
        if (bestEl) bestEl.textContent = "Votre meilleur score sur cet appareil : " + best + " points.";
      });
    }
    var bestEl2 = document.getElementById("game-best");
    if (bestEl2) {
      var best0 = parseInt(localStorage.getItem("cbs_best_score") || "0", 10);
      bestEl2.textContent = best0 > 0
        ? "Votre meilleur score sur cet appareil : " + best0 + " points."
        : "Tentez votre premier mot pour inscrire votre score !";
    }
  }

  /* ---------- Galerie : filtres ---------- */
  var filterBtns = document.querySelectorAll(".gallery-filters button");
  var photoCards = document.querySelectorAll("[data-category]");
  if (filterBtns.length && photoCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-filter");
        photoCards.forEach(function (card) {
          var show = cat === "tous" || card.getAttribute("data-category") === cat;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- Calendrier : accueil (prochains rendez-vous) ---------- */
  var upcomingHere = CAL.filter(function (e) { return e.ici && !isPast(e); });

  var heroNext = document.getElementById("hero-next");
  if (heroNext && upcomingHere.length) {
    var next = upcomingHere[0];
    var strong = document.createElement("strong");
    strong.textContent = next.titre + " — " + longDate(next);
    heroNext.textContent = "🗓️ Prochain rendez-vous : ";
    heroNext.appendChild(strong);
    heroNext.appendChild(document.createTextNode(", " + next.lieu));
  }

  var nextEvents = document.getElementById("next-events");
  if (nextEvents) {
    if (upcomingHere.length) {
      nextEvents.textContent = "";
      upcomingHere.slice(0, 3).forEach(function (ev) { nextEvents.appendChild(buildEvent(ev)); });
    }
  }

  /* ---------- Calendrier : page Tournois & résultats ---------- */
  var calIci = document.getElementById("cal-ici");
  var calRegion = document.getElementById("cal-region");
  var togglePast = document.getElementById("cal-toggle-past");

  function fillCalendar(container, list) {
    if (!container) return 0;
    container.textContent = "";

    var past = list.filter(isPast);
    var upcoming = list.filter(function (e) { return !isPast(e); });

    var pastWrap = document.createElement("div");
    pastWrap.className = "event-list past-events";
    pastWrap.hidden = true;
    past.forEach(function (ev) { pastWrap.appendChild(buildEvent(ev)); });
    container.appendChild(pastWrap);

    var upWrap = document.createElement("div");
    upWrap.className = "event-list";
    upcoming.forEach(function (ev) { upWrap.appendChild(buildEvent(ev)); });
    container.appendChild(upWrap);

    if (!upcoming.length) {
      var empty = document.createElement("p");
      empty.className = "notice";
      empty.textContent = "Aucun rendez-vous à venir pour le moment : le calendrier de la prochaine saison sera publié ici dès sa réception.";
      container.appendChild(empty);
    }
    return past.length;
  }

  if ((calIci || calRegion) && CAL.length) {
    var pastCount =
      fillCalendar(calIci, CAL.filter(function (e) { return e.ici; })) +
      fillCalendar(calRegion, CAL.filter(function (e) { return !e.ici; }));

    if (togglePast) {
      if (!pastCount) {
        togglePast.hidden = true;
      } else {
        togglePast.addEventListener("click", function () {
          var show = togglePast.getAttribute("aria-expanded") !== "true";
          document.querySelectorAll(".past-events").forEach(function (el) { el.hidden = !show; });
          togglePast.setAttribute("aria-expanded", show ? "true" : "false");
          togglePast.textContent = show ? "Masquer les rendez-vous déjà passés" : "Afficher les rendez-vous déjà passés";
        });
      }
    }
  }
})();
