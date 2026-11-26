/* NAUTA DOMA — interactions du site */
(function () {
  "use strict";

  /* --- En-tête collant --------------------------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Menu mobile ------------------------------------------------------- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* --- Apparition au défilement ------------------------------------------ */
  var revealables = document.querySelectorAll(".reveal");
  if (revealables.length) {
    if (!("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* --- Année courante dans le pied de page -------------------------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* --- Formulaire de contact ---------------------------------------------- */
  var form = document.querySelector("#contact-form");
  if (form) {
    var status = document.querySelector("#form-status");
    var submit = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (e) {
      var endpoint = form.getAttribute("action") || "";

      // Tant que l'endpoint Formspree n'est pas renseigné, on bascule sur un
      // envoi par le client mail du visiteur plutôt que d'échouer en silence.
      if (endpoint.indexOf("VOTRE_ID") !== -1 || endpoint === "") {
        e.preventDefault();
        var data = new FormData(form);
        var body =
          "Nom : " + (data.get("nom") || "") + "\n" +
          "Email : " + (data.get("email") || "") + "\n" +
          "Téléphone : " + (data.get("telephone") || "") + "\n" +
          "Sujet : " + (data.get("sujet") || "") + "\n\n" +
          (data.get("message") || "");
        window.location.href =
          "mailto:nautadoma@gmail.com" +
          "?subject=" + encodeURIComponent("Demande via nautadoma.com — " + (data.get("sujet") || "Contact")) +
          "&body=" + encodeURIComponent(body);
        return;
      }

      e.preventDefault();
      if (submit) { submit.disabled = true; submit.textContent = "Envoi en cours…"; }

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("http " + res.status);
          form.reset();
          if (status) {
            status.textContent =
              "Merci, votre message est parti. Je vous réponds sous 24 h ouvrées.";
            status.style.color = "var(--gold-bright)";
          }
        })
        .catch(function () {
          if (status) {
            status.textContent =
              "L'envoi a échoué. Écrivez-moi directement à nautadoma@gmail.com.";
            status.style.color = "#E58B7B";
          }
        })
        .finally(function () {
          if (submit) { submit.disabled = false; submit.textContent = "Envoyer ma demande"; }
        });
    });
  }
  /* --- Visionneuse de la galerie ----------------------------------------- */
  var shots = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (shots.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Visionneuse photo");
    box.innerHTML =
      '<button type="button" class="lightbox__close" aria-label="Fermer">&times;</button>' +
      '<button type="button" class="lightbox__prev" aria-label="Photo précédente">&#8249;</button>' +
      '<img alt="">' +
      '<div class="lightbox__cap"></div>' +
      '<button type="button" class="lightbox__next" aria-label="Photo suivante">&#8250;</button>';
    document.body.appendChild(box);
    var bImg = box.querySelector("img");
    var bCap = box.querySelector(".lightbox__cap");
    var current = 0, opener = null;

    var show = function (i) {
      current = (i + shots.length) % shots.length;
      var a = shots[current];
      var fig = a.closest("figure");
      var cap = fig ? fig.querySelector("figcaption") : null;
      bImg.src = a.getAttribute("href");
      bImg.alt = a.querySelector("img") ? a.querySelector("img").alt : "";
      bCap.innerHTML = cap ? cap.innerHTML : "";
    };
    var open = function (i) {
      opener = document.activeElement;
      show(i);
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
      box.querySelector(".lightbox__close").focus();
    };
    var close = function () {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
      if (opener) opener.focus();
    };

    shots.forEach(function (a, i) {
      a.addEventListener("click", function (e) { e.preventDefault(); open(i); });
    });
    box.querySelector(".lightbox__close").addEventListener("click", close);
    box.querySelector(".lightbox__prev").addEventListener("click", function () { show(current - 1); });
    box.querySelector(".lightbox__next").addEventListener("click", function () { show(current + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
    });
  }
})();
